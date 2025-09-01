"use server";

import crypto from "crypto";
import { Paginated, Res, Result } from "@/app/tmdb/lib";
import { cookies } from "next/headers";
import { hasMagicBook } from "@/app/utils/server";
import { Requests } from "@/app/utils/utils";
import { db, Entry, Wizard } from "./db";

export type WizardInfo = {
  id: number;
  name: string;
};

export type MediaEntry = {
  id: number;
  imdbId: string | null;
  name: string;
} & ({ type: "movie" } | { type: "tv"; season: number; episode: number });
export type ListType = "watchlist" | "played" | "finished";

function getEntry(wizard: Wizard, list: ListType, entry: MediaEntry) {
  const wizardList = wizard[list];
  const entryIndex = wizardList.findIndex((e) => e.id === entry.id);
  const listEntry = wizardList[entryIndex];
  if (!listEntry) return null;

  if (entry.type === "movie" && listEntry.type === "movie")
    return { wizardList, entryIndex };

  if (entry.type !== "tv" || listEntry.type !== "tv")
    throw new Error("Mismatched entry types");

  const seasons = listEntry.seasons;
  const seasonIndex = seasons.findIndex((s) => s.season === entry.season);
  const season = seasons[seasonIndex];
  if (!season) return null;

  const episodes = season.episodes;
  const episodeIndex = episodes.findIndex((e) => e.episode === entry.episode);
  if (episodeIndex === -1) return null;

  return {
    wizardList,
    entryIndex,
    seasonIndex,
    season,
    episodeIndex,
  };
}

export async function removeListEntry(
  list: ListType,
  entry: MediaEntry,
): Promise<Result<boolean>> {
  const wizardRes = await getWizard();
  if (Res.isError(wizardRes)) return wizardRes;

  const removed = removeEntry(wizardRes.ok, list, entry);
  if (removed) await db.write();
  return Res.ok(removed);
}

function removeEntry(wizard: Wizard, list: ListType, entry: MediaEntry) {
  const wizardEntry = getEntry(wizard, list, entry);
  if (!wizardEntry) return false;

  const { wizardList, entryIndex, seasonIndex, season, episodeIndex } =
    wizardEntry;

  // Remove movie
  if (entry.type === "movie") {
    wizardList.splice(entryIndex, 1);
    return true;
  }
  if (!season) throw new Error("Season should exist"); // Should never happen

  // Remove episode
  season.episodes.splice(episodeIndex, 1);

  // Remove season if no episodes left
  if (!season.episodes.length) {
    const listEntry = wizardList[entryIndex];
    if (listEntry.type === "movie") throw new Error("Entry should be TV"); // Should never happen
    listEntry.seasons.splice(seasonIndex, 1);

    // Remove entry if no seasons left
    if (!listEntry.seasons.length) wizardList.splice(entryIndex, 1);
  }

  return true;
}

function validateEntry(entry: MediaEntry) {
  if (typeof entry !== "object" || entry === null) {
    throw new Error("Invalid entry");
  }

  const entries = Object.entries(entry);

  if (
    typeof entry.type !== "string" ||
    typeof entry.id !== "number" ||
    (entry.imdbId !== null && typeof entry.imdbId !== "string") ||
    typeof entry.name !== "string"
  ) {
    throw new Error("Invalid entry");
  }

  if (entry.type === "movie") {
    if (entries.length !== 4) throw new Error("Invalid movie entry");
  } else if (entry.type === "tv") {
    if (
      entries.length !== 6 ||
      typeof entry.season !== "number" ||
      typeof entry.episode !== "number"
    ) {
      throw new Error("Invalid TV entry");
    }

    if (entry.season < 1 || entry.episode < 1) {
      throw new Error("Invalid TV entry");
    }
  } else {
    throw new Error("Invalid entry type");
  }
}

export async function addListEntry(
  list: ListType,
  entry: MediaEntry,
): Promise<Result<boolean>> {
  validateEntry(entry);

  const wizardRes = await getWizard();
  if (Res.isError(wizardRes)) return wizardRes;
  const wizard = wizardRes.ok;
  if (!!getEntry(wizard, list, entry)) return Res.ok(false);

  // Prevent adding to played if already in finished
  if (list === "played" && !!getEntry(wizard, "finished", entry)) {
    return Res.ok(false);
  }

  // Remove from played if adding to finished
  if (list === "finished") {
    const removed = removeEntry(wizard, "played", entry);
    if (removed) await db.write();
  }

  const date = new Date().getTime();

  // Add new movie entry
  if (entry.type === "movie") {
    wizard[list].unshift({
      id: entry.id,
      imdbId: entry.imdbId,
      name: entry.name,
      date,
      type: "movie",
    });
    await db.write();
    return Res.ok(true);
  }

  const existingEntry = wizard[list].find((e) => e.id === entry.id);

  // Add new TV entry
  if (!existingEntry) {
    wizard[list].unshift({
      id: entry.id,
      imdbId: entry.imdbId,
      name: entry.name,
      date,
      type: "tv",
      seasons: [
        { season: entry.season, episodes: [{ episode: entry.episode, date }] },
      ],
    });
    await db.write();
    return Res.ok(true);
  }

  if (existingEntry.type === "movie") throw new Error("Mismatched entry types");

  // Update date to most recent
  existingEntry.date = date;

  // Add to existing TV entry
  const season = existingEntry.seasons.find((s) => s.season === entry.season);
  if (season) {
    if (!!season.episodes.find((e) => e.episode === entry.episode)) {
      throw new Error("Episode already exists"); // Should not happen
    }
    // Add episode to existing season
    season.episodes.push({ episode: entry.episode, date });
    season.episodes.sort((a, b) => a.episode - b.episode);
  } else {
    // Add new season
    existingEntry.seasons.push({
      season: entry.season,
      episodes: [{ episode: entry.episode, date }],
    });
    existingEntry.seasons.sort((a, b) => a.season - b.season);
  }

  await db.write();
  return Res.ok(true);
}

const requests = new Requests(10, 1000 * 60 * 10); // 10 requests every 10 minutes

export async function bindWizardSigil(
  sigil: string,
): Promise<Result<WizardInfo>> {
  if (!requests.canRequest() || !(await hasMagicBook())) {
    return Res.error("Stop right there, criminal scum!");
  }

  const cookieStore = await cookies();
  await db.read();
  const wizard = db.data.find((wizard) => wizard.sigil === sigil);
  if (!wizard) {
    cookieStore.delete("wizard-bond");
    return Res.error("No wizard bears this sigil.");
  }

  wizard.bond = crypto.randomBytes(32).toString("hex");
  await db.write();

  cookieStore.set("wizard-bond", wizard.bond, {
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    httpOnly: true,
  });

  return Res.ok({ id: wizard.id, name: wizard.name });
}

export async function getWizardList(
  list: ListType,
  type: "movie" | "tv" | "all",
  page: number,
): Promise<Result<Paginated<Entry>>> {
  const wizard = await getWizard(true);
  if (Res.isError(wizard)) return wizard;

  const wizardList =
    type === "all"
      ? wizard.ok[list]
      : wizard.ok[list].filter((entry) => entry.type === type);

  const PAGE_SIZE = 20;
  const pagedList = wizardList.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const length = wizardList.length;

  return Res.ok({
    page,
    results: pagedList,
    total_pages: Math.ceil(length / PAGE_SIZE),
    total_results: length,
  });
}

export async function hasWizardBond() {
  const wizard = await getWizard(true);
  return Res.isOk(wizard);
}

export async function getWizardInfo(): Promise<Result<WizardInfo>> {
  const wizard = await getWizard();
  if (Res.isOk(wizard)) {
    return Res.ok({ id: wizard.ok.id, name: wizard.ok.name });
  }
  return wizard;
}

async function getWizard(server = false) {
  const magicBook = await hasMagicBook(server);
  if (!magicBook) return Res.error("You are not a wizard, Harry.");

  const cookieStore = await cookies();
  const bond = cookieStore.get("wizard-bond");
  if (!bond) return Res.error("You have no wizard bond. Present your sigil.");

  await db.read();
  const wizard = db.data.find((user) => user.bond === bond.value);
  if (!wizard) {
    if (!server) cookieStore.delete("wizard-bond");
    return Res.error("Your wizard bond has been severed.");
  }
  return Res.ok(wizard);
}

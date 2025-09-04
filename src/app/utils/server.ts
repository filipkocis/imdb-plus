"use server";

import { cookies } from "next/headers";
import { Requests } from "@/app/utils/utils";
import { TMDB } from "../tmdb/lib";

function Server(name: string, url: string, moviePath: string, tvPath: string) {
  return { name, url, moviePath, tvPath };
}

const SERVERS: ReturnType<typeof Server>[] = [
  // You won't be able to access these servers unless you're a wizard, so stop lurking around :P
];

export async function getServerList() {
  return (await hasMagicBook()) ? SERVERS : [];
}

const requests = new Requests(5, 1000 * 60 * 5); // 5 requests every 5 minutes

export async function verifyWizardness(magicSpell: string) {
  if (!requests.canRequest()) return false;

  const cookieStore = await cookies();
  const isWizard = magicSpell === process.env.MAGIC_SPELL;
  if (!isWizard) {
    cookieStore.delete("magic-book");
    return false;
  }

  const MAGIC_BOOK = process.env.MAGIC_BOOK;
  if (!MAGIC_BOOK) return false;

  cookieStore.set("magic-book", MAGIC_BOOK, {
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    httpOnly: true,
  });

  return SERVERS;
}

export async function hasMagicBook(server = false) {
  const cookieStore = await cookies();
  const magicBook = cookieStore.get("magic-book");

  if (!magicBook) return false;
  const hasMagicBook = magicBook.value === process.env.MAGIC_BOOK;
  if (!hasMagicBook && !server) cookieStore.delete("magic-book");
  return hasMagicBook;
}

export async function getExternalIDs(id: number, type: "movie" | "tv") {
  return await TMDB.externalIDs(id, type);
}

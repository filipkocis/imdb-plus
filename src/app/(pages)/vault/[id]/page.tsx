import ErrorDiv from "@/app/components/ErrorDiv";
import ResultsTopBar from "@/app/components/result/ResultsTopBar";
import { PageWrapper } from "@/app/components/wrapper/PageWrapper";
import { Res, TMDB, TvDetails } from "@/app/tmdb/lib";
import { getPossibleLists, getWizardEntry, ListType } from "@/app/db/lib";
import EpisodeBlock from "../../components/EpisodeBlock";
import React from "react";
import { EntrySeason } from "@/app/db/db";
import { FaRegCirclePlay } from "react-icons/fa6";
import Link from "next/link";
import { notFound } from "next/navigation";

function getList(list?: string | string[]) {
  if (list === "watchlist" || list === "played" || list === "finished")
    return list;
  else return "played";
}

const BUTTONS = (lists: string[]) =>
  lists.map((list) => ({
    label: list.charAt(0).toUpperCase() + list.slice(1),
    setParam: ["l", list] as [string, string],
  }));

export default async function VaultDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: undefined | string | string[] }>;
}) {
  const { l: list } = await searchParams;
  const { id } = await params;

  const pList = getList(list);
  const mediaId = parseInt(id) || 0;

  const lists = await getPossibleLists(mediaId);
  if (Res.isError(lists)) return notFound();

  const entry = await getWizardEntry(pList, "tv", mediaId);
  if (Res.isError(entry)) return <ErrorDiv message={entry.error} />;

  const details = await TMDB.getTvDetails(mediaId);
  if (Res.isError(details)) return <ErrorDiv message={details.error} />;

  const externalIds = await TMDB.externalIDs(mediaId, "tv");
  if (Res.isError(externalIds)) return <ErrorDiv message={externalIds.error} />;

  const seasons = [];
  for (const season of entry.ok.seasons) {
    seasons.push([
      details.ok.seasons.find((ds) => ds.season_number === season.season),
      season,
    ] as const);
  }

  return (
    <PageWrapper>
      <ResultsTopBar title={details.ok.name} buttons={BUTTONS(lists.ok)} />
      {seasons.map(([season, entry]) =>
        season === undefined ? (
          <ErrorDiv
            key={entry.season}
            message={`Season ${entry.season} not found`}
          />
        ) : (
          <SeasonBlock
            list={pList}
            key={season.id}
            season={season}
            showName={details.ok.name}
            imdbId={externalIds.ok.imdb_id || null}
            mediaId={mediaId}
            entry={entry}
          />
        ),
      )}
    </PageWrapper>
  );
}

async function SeasonBlock({
  list,
  season,
  mediaId,
  imdbId,
  showName,
  entry,
}: {
  list: ListType;
  season: TvDetails["seasons"][0];
  mediaId: number;
  imdbId: string | null;
  showName: string;
  entry: EntrySeason;
}) {
  const details = await TMDB.getSeasonDetails(mediaId, season.season_number);
  if (Res.isError(details)) return <ErrorDiv message={details.error} />;

  const sortedEpisodes = entry.episodes.sort((a, b) => a.date - b.date);

  const episodes = [];
  for (const entryEpisode of sortedEpisodes) {
    const episode = details.ok.episodes.find(
      (de) => de.episode_number === entryEpisode.episode,
    );
    if (episode) episode.air_date = new Date(entryEpisode.date).toUTCString();

    episodes.push([episode, entryEpisode] as const);
  }

  const totalCount = season.episode_count;
  const listCount = entry.episodes.length;
  const verb = list === "watchlist" ? "added" : list;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-4">
        <Link
          className="flex items-center gap-2 group self-start"
          href={`/tv/${mediaId}?s=${season.season_number}`}
        >
          <h2 className="text-xl font-semibold">{season.name || "N/A"}</h2>
          <FaRegCirclePlay className="w-4 h-4 text-contrast group-hover:scale-125 transition-all" />
        </Link>
        <span className="font-semibold text-white/70 self-center text-sm">
          (
          {totalCount === listCount
            ? `All episodes ${verb}`
            : `${listCount}/${totalCount} episodes ${verb}`}
          )
        </span>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {episodes.map(([episode, entry], i) =>
          episode === undefined ? (
            <ErrorDiv key={i} message={`Episode ${entry.episode} not found`} />
          ) : (
            <EpisodeBlock
              key={episode.id}
              episode={episode}
              episodeCount={season.episode_count}
              currentSeason={season.season_number}
              showId={mediaId}
              imdbId={imdbId}
              showName={showName}
            />
          ),
        )}
      </div>
    </div>
  );
}

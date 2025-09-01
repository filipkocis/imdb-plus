import ErrorDiv from "@/app/components/ErrorDiv";
import ResultsTopBar from "@/app/components/result/ResultsTopBar";
import BlocksWrapper from "@/app/components/wrapper/BlocksWrapper";
import { PageWrapper } from "@/app/components/wrapper/PageWrapper";
import { getWizardList } from "@/app/db/lib";
import {
  Movie,
  MovieDetails,
  Res,
  Result,
  TMDB,
  TvDetails,
  TvShow,
} from "@/app/tmdb/lib";
import PageSelect from "../components/PageSelect";
import ResultBlock from "@/app/components/result/ResultBlock";
import { notFound } from "next/navigation";

function getType(type?: string | string[]) {
  if (type === "tv") return "tv";
  if (type === "movie") return "movie";
  else return "all";
}

function getList(list?: string | string[]) {
  if (list === "watchlist" || list === "played" || list === "finished")
    return list;
  else return "played";
}

const BUTTONS = (type: string, list: string) => [
  <PageSelect
    key={0}
    label="Type"
    searchParam="t"
    defaultValue={type}
    values={[
      { name: "All", value: "all" },
      { name: "Movies", value: "movie" },
      { name: "TV Shows", value: "tv" },
    ]}
  />,
  <PageSelect
    key={1}
    label="List"
    searchParam="l"
    defaultValue={list}
    values={[
      { name: "Watchlist", value: "watchlist" },
      { name: "Played", value: "played" },
      { name: "Finished", value: "finished" },
    ]}
  />,
];

function mediaFromDetails(
  type: "movie" | "tv",
  detailsRes: Result<MovieDetails | TvDetails>,
): Result<Movie | TvShow> {
  if (Res.isError(detailsRes)) return detailsRes;
  const details = detailsRes.ok;

  if (type === "movie") {
    const movieDetails = details as MovieDetails;
    const movie: Movie = {
      media_type: "movie",
      genre_ids: movieDetails.genres.map((g) => g.id),
      ...movieDetails,
    };
    return Res.ok(movie);
  } else {
    const tvDetails = details as TvDetails;
    const tvShow: TvShow = {
      media_type: "tv",
      genre_ids: tvDetails.genres.map((g) => g.id),
      ...tvDetails,
    };
    return Res.ok(tvShow);
  }
}

export default async function VaultPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: undefined | string | string[] }>;
}) {
  const { p: page, t: type, l: list } = await searchParams;

  const pType = getType(type);
  const pList = getList(list);
  const pPage = parseInt(page + "") || 1;

  const entries = await getWizardList(pList, pType, pPage);
  if (Res.isError(entries)) return notFound();

  const medias: Result<Movie | TvShow>[] = [];
  for (const entry of entries.ok.results) {
    const details =
      entry.type === "movie"
        ? await TMDB.getMovieDetails(entry.id)
        : await TMDB.getTvDetails(entry.id);

    const media = mediaFromDetails(entry.type, details);
    medias.push(media);
  }

  return (
    <PageWrapper>
      <ResultsTopBar
        totalPages={entries.ok.total_pages}
        title="Vault"
        buttons={BUTTONS(pType, pList)}
      />
      <BlocksWrapper>
        {medias.map((media, i) =>
          Res.isError(media) ? (
            <ErrorDiv key={i} message={media.error} />
          ) : (
            <ResultBlock key={details.ok.id} item={details.ok} />
          ),
        )}
      </BlocksWrapper>
    </PageWrapper>
  );
}

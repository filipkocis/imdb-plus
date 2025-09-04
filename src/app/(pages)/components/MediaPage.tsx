import ErrorDiv from "@/app/components/ErrorDiv"
import { parseDate } from "@/app/components/result/ResultBlock"
import WatchButton from "@/app/components/WatchButton"
import SuggestedSmallResults from "@/app/components/wrapper/SuggestedSmallResults"
import { Cast, MovieDetails, Res, TMDB, TvDetails } from "@/app/tmdb/lib"
import { LucideCalendar, LucideClock, LucideGlobe } from "lucide-react"
import Unavailable from "@/assets/unavailable.png"
import Image from "next/image"
import Link from "next/link"
import { CiStar } from "react-icons/ci"
import { Rating } from "./Rating"
import { ImdbRating } from "./ImdbRating"
import SeasonsBlock from "./SeasonsBlock"
import { Button } from "@/components/ui/button"
import { FaArrowUpRightFromSquare } from "react-icons/fa6"

type MediaPageProps = {
  type: "movie"
  id: number
} | {
  type: "tv"
  id: number
  currentSeason: number
}

export default async function MediaPage(props: MediaPageProps) {
  const type = props.type
  const id = props.id

  const detailsResult = type === "movie" ? await TMDB.getMovieDetails(id) : await TMDB.getTvDetails(id)
  const trailer = await TMDB.getTrailer(id, type)
  const creditsResult = await TMDB.getCredits(id, type)

  const recommendationsResult = await TMDB.getRecommendations(id, type)
  const similarResult = await TMDB.getSimilar(id, type)

  if (detailsResult.error !== undefined) return <ErrorDiv message={detailsResult.error} />
  if (creditsResult.error !== undefined) return <ErrorDiv message={creditsResult.error} />
  let details = detailsResult.ok
  const plural = type === "movie" ? "Movies" : "TV Shows"

  let title, runtime, release_date, imdb_id, episode_count = 0;
  if (type === "movie") {
    details = details as MovieDetails
    title = details.title
    runtime = details.runtime
    release_date = details.release_date
    imdb_id = details.imdb_id
  } else {
    details = details as TvDetails
    title = details.name
    runtime = details.episode_run_time.reduce((a, b) => a + b, 0) / details.episode_run_time.length
    release_date = details.first_air_date
    const externalIds = await TMDB.externalIDs(id, "tv")
    imdb_id = externalIds.ok?.imdb_id || null
    episode_count =
      details.seasons.find((s) => s.season_number == props.currentSeason)
        ?.episode_count || 0;
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="grid lg:grid-cols-[2fr_1fr] gap-4">
        <div className="relative flex flex-col lg:flex-row max-lg:items-center items-start gap-6 p-6 rounded-2xl overflow-hidden bg-neutral-800/80  from-transparent to-neutral-800/80">
          <Rating size={18} strokeWidth={2} value={details.vote_average} className="top-4" Icon={CiStar} />
          {imdb_id !== null && <ImdbRating type={type} size={26} strokeWidth={0} className="top-[84px] [&>p]:-mt-1 fade-in" id={imdb_id} />}

          <Image 
            src={details.poster_path ? TMDB.poster(details.poster_path, "/gradient.png", "w500") : Unavailable} 
            alt={title} 
            className="aspect-[2/3] w-[250px] h-[375px] rounded-2xl" 
            width={250}
            height={375}
          />

          <div className="h-full flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center gap-x-4 flex-center flex-wrap">
                <h1 className="text-2xl md:text-4xl font-bold">{title}</h1> 
                <p className="rounded-full bg-yellow-400 text-black px-3 text-sm py-1">{details.status}</p>
              </div>
              <p className="text-neutral-400 text-sm">{details.tagline}</p>
            </div>

            <div className="flex gap-4 max-md:text-sm flex-wrap [&>*]:flex [&>*]:items-center [&>*]:gap-2">
              {type === "movie" && (
                <p>
                  <LucideClock size={32} /> 
                  <span>{parseMinutes(runtime)}</span>
                </p>
              )}
              <p>
                <LucideCalendar size={32} /> 
                <span>{parseDate(release_date)}</span>
              </p>
              <p>
                <LucideGlobe size={32} /> 
                <span className="uppercase">{details.original_language} - {details.origin_country.at(0) || "Unknown"}</span>
              </p>
            </div>

            <div className="flex flex-col gap-2 max-md:text-sm">
              <p className="text-neutral-400">{details.overview || (
                  <span className="italic">No overview available</span>
              )}</p>
              <div className="flex gap-1 flex-wrap">
                {details.genres.map(genre => (
                  <p key={genre.id} className="bg-secondary px-3 py-1 rounded-full text-sm">{genre.name}</p>
                ))}
              </div>
            </div>

            <div className="flex gap-4 flex-wrap">
              <Button variant="default" className="font-bold" asChild>
                <Link href={`https://www.imdb.com/title/${imdb_id}/`} referrerPolicy="no-referrer" target="_blank" rel="noopener noreferrer">
                  <FaArrowUpRightFromSquare style={{ width: 10 }} />
                  IMDB
                </Link>
              </Button>

              {Res.isOk(trailer) && (
                <WatchButton
                  name={trailer.ok.name || "Trailer"}
                  type="youtube"
                  id={trailer.ok.link || "#"}
                />
              )}
              {!(type === "tv" && episode_count === 0) && (
                <WatchButton
                  name={title}
                  imdbId={imdb_id}
                  id={id}
                  {...(type === "tv"
                    ? {
                        type: "tv",
                        season: props.currentSeason,
                        episode: 1,
                        episodeCount: episode_count,
                      }
                    : { type: "movie" })}
                />
              )}
            </div>
          </div>
        </div>

        <div className="h-min flex flex-col rounded-2xl overflow-hidden bg-neutral-800/80 from-transparent to-neutral-800/80">
          <p className="bg-secondary font-semibold px-4 py-2">Actors</p> 
          <div className="max-h-96 overflow-x-auto flex flex-col">
            {creditsResult.ok.cast.map(cast => (
              <CastBlock key={cast.id} cast={cast} />
            ))}
            {creditsResult.ok.cast.length === 0 && (
              <p className="text-sm text-neutral-400 p-4">No actors data available</p>
            )}
          </div>
        </div>
      </div>

      {type === "tv" && (
        <SeasonsBlock 
          current={props.currentSeason} 
          seasons={(details as TvDetails).seasons} 
          showId={id} 
          imdbId={imdb_id} 
          showName={title}
        />
      )}

      <SuggestedSmallResults result={recommendationsResult} href={`/recommended/${type}/${id}`} title={`Recommended ${plural}`} />
      <SuggestedSmallResults result={similarResult} href={`/similar/${type}/${id}`} title={`Similar ${plural}`} />
    </div>
  )
}

function parseMinutes(mins: number) {
  const hours = Math.floor(mins / 60)
  const minutes = Math.floor(mins % 60)
  return `${hours}h ${minutes}m`
}

function CastBlock({ cast }: { cast: Cast }) {
  return (
    <Link className="hover:bg-secondary px-4 py-2 transition-colors flex items-center gap-4" href={`https://www.imdb.com/name/nm${cast.cast_id}/?ref_=tt_cst_t_1`}>
      <img 
        src={TMDB.poster(cast.profile_path, "/gradient.png", "w92")} 
        alt={cast.name} 
        className="relative min-w-16 w-16 h-16 rounded-full object-center object-cover overflow-hidden"
        width={64}
        height={64}
      /> 
      <div className="flex flex-col">
        <p className="font-semibold">{cast.name}</p>
        <p className="text-sm text-neutral-400">{cast.character}</p>
      </div>
    </Link>
  )
}

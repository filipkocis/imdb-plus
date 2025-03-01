import ErrorDiv from "@/app/components/ErrorDiv"
import { parseDate } from "@/app/components/result/ResultBlock"
import WatchButton from "@/app/components/WatchButton"
import SuggestedSmallResults from "@/app/components/wrapper/SuggestedSmallResults"
import { Cast, MovieDetails, TMDB, TvDetails } from "@/app/tmdb/lib"
import { LucideCalendar, LucideClock, LucideGlobe } from "lucide-react"
import Unavailable from "@/assets/unavailable.png"
import Image from "next/image"
import Link from "next/link"
import { CiStar } from "react-icons/ci"
import { Rating } from "./Rating"
import { ImdbRating } from "./ImdbRating"

export default async function MediaPage({ type, id }: { type: "movie" | "tv", id: number }) {
  const detailsResult = type === "movie" ? await TMDB.getMovieDetails(id) : await TMDB.getTvDetails(id)
  const trailer = await TMDB.getTrailer(id, type)
  const creditsResult = await TMDB.getCredits(id, type)

  const recommendationsResult = await TMDB.getRecommendations(id, type)
  const similarResult = await TMDB.getSimilar(id, type)

  if (detailsResult.error !== undefined) return <ErrorDiv message={detailsResult.error} />
  if (creditsResult.error !== undefined) return <ErrorDiv message={creditsResult.error} />
  let details = detailsResult.ok
  const plural = type === "movie" ? "Movies" : "TV Shows"

  let title, runtime, release_date, imdb_id;
  if (type === "movie") {
    details = details as MovieDetails
    title = details.title
    runtime = details.runtime
    release_date = details.release_date
    imdb_id = details.imdb_id
    // console.log(details)
  } else {
    details = details as TvDetails
    title = details.name
    runtime = details.episode_run_time.reduce((a, b) => a + b, 0) / details.episode_run_time.length
    release_date = details.first_air_date
    imdb_id = details.id + ''
    // console.log(details)
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="grid lg:grid-cols-[2fr_1fr] gap-4">
        <div className="relative flex flex-col lg:flex-row max-lg:items-center items-start gap-6 p-6 rounded-2xl overflow-hidden bg-neutral-800/80  from-transparent to-neutral-800/80">
          <Rating size={18} strokeWidth={2} value={details.vote_average} className="top-4" Icon={CiStar} />
          <ImdbRating type={type} size={26} strokeWidth={0} className="top-[84px] [&>p]:-mt-1 fade-in" id={imdb_id} />

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
                <h1 className="text-4xl font-bold">{title}</h1> 
                <p className="rounded-full bg-yellow-400 text-black px-3 text-sm py-1">{details.status}</p>
              </div>
              <p className="text-neutral-400 text-sm">{details.tagline}</p>
            </div>

            <div className="flex gap-4 flex-wrap [&>*]:flex [&>*]:items-center [&>*]:gap-2">
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

            <div className="flex flex-col gap-2">
              <p className="text-neutral-400">{details.overview}</p>
              <div className="flex gap-1 flex-wrap">
                {details.genres.map(genre => (
                  <p key={genre.id} className="bg-secondary px-3 py-1 rounded-full text-sm">{genre.name}</p>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <WatchButton name={trailer.ok?.name || "Trailer"} type="youtube" id={trailer.ok ? trailer.ok.link : "#"} />
              <WatchButton name={title} type={type} id={`${id}`} />
            </div>
          </div>
        </div>

        <div className="h-min flex flex-col rounded-2xl overflow-hidden bg-neutral-800/80 from-transparent to-neutral-800/80">
          <p className="bg-secondary font-semibold px-4 py-2">Actors</p> 
          <div className="max-h-96 overflow-x-auto flex flex-col">
            {creditsResult.ok.cast.map(cast => (
              <CastBlock key={cast.id} cast={cast} />
            ))}
          </div>
        </div>
      </div>

      {type === "tv" && (
        <SeasonsBlock 
          current={props.currentSeason} 
          seasons={(details as TvDetails).seasons} 
          showId={id} 
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
        className="relative w-16 h-16 rounded-full object-center object-cover overflow-hidden"
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

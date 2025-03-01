import ErrorDiv from "@/app/components/ErrorDiv";
import { Res, TMDB, TvDetails } from "@/app/tmdb/lib";
import { CiStar } from "react-icons/ci";
import { parseDate } from "@/app/components/result/ResultBlock";
import SelectSeason from "./SelectSeason";
import WatchEpisodeButton from "./WatchEpisodeButton";
import { FaRegCirclePlay } from "react-icons/fa6";

type Seasons = TvDetails["seasons"]

export default async function SeasonsBlock({ seasons, current, showId, showName }: { seasons: Seasons, current: number, showId: number, showName: string }) {
  const sortedSeasons = seasons.map(season => season).sort((a, b) => a.season_number - b.season_number)
  const seasonDetails = await TMDB.getSeasonDetails(showId, current)

  if (Res.isError(seasonDetails)) return <ErrorDiv message={seasonDetails.error} />

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className="flex gap-6 flex-wrap items-center">
          <SelectSeason defaultValue={current.toString()} seasons={sortedSeasons} />
          <div className="flex gap-3 item-center">
            <h2 className="text-xl font-semibold">{seasonDetails.ok.name}</h2>
            <div className="text-contrast flex gap-2 items-center">
              <CiStar className="text-contrast" size={14} color="currentColor" strokeWidth={2} />
              <p className="text-sm">{seasonDetails.ok.vote_average.toFixed(1)}</p>
            </div>
          </div>
        </div>
        <p className="text-white/70">{seasonDetails.ok.overview}</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {seasonDetails.ok.episodes.map(episode => (
          <WatchEpisodeButton
            key={episode.id}
            episode={episode.episode_number}
            episodeCount={seasonDetails.ok.episodes.length}
            season={current}
            id={showId.toString()} 
            name={showName}
            className="text-left group"
          >
            <div className="grid h-full grid-cols-[1fr,auto] gap-4 p-4 rounded-lg bg-neutral-800/80 group-hover:bg-secondary">
              <div className="flex flex-col gap-2">
                <h3><span className="">{episode.episode_number}.</span> {episode.name}</h3>
                <p className="text-xs text-white/80 line-clamp-3">{episode.overview || (
                  <span className="text-white/50 italic">No overview available</span>
                )}</p>
              </div>

              <div className="relative">
                <div className="flex inset-0 z-10 absolute items-center justify-center scale-[150%] opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300">
                  <FaRegCirclePlay size={42} className="text-contrast" />
                </div>

                <div className="flex justify-center items-center flex-col gap-1 group-hover:opacity-0 transition-all duration-300">
                  <div className="text-contrast flex gap-2 items-center">
                    <CiStar className="text-contrast" size={14} color="currentColor" strokeWidth={2} />
                    <p className="">{episode.vote_average.toFixed(1)}</p>
                    <p className="text-white text-sm">({episode.vote_count})</p>
                  </div>
                  <p className="text-sm text-white/70">{episode.runtime}min</p>
                  <p className="text-sm text-white/70">{parseDate(episode.air_date)}</p>
                </div>
              </div>
            </div>
          </WatchEpisodeButton>
        ))} 
      </div>
    </div>
  )
}

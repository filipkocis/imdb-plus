import { Movie, TMDB } from "@/app/tmdb/lib"
import { Dot } from "lucide-react"
import { CiStar } from "react-icons/ci"
import { parseDate } from "../result/ResultBlock"
import Link from "next/link"

export const revalidate = 86_400 // 24 hours 

export default async function RevenueList() {
  const now = new Date()
  const start = new Date()
  start.setFullYear(now.getFullYear() - 1)
  const formattedDate = start.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const timeStart = start.toISOString().split("T")[0]
  const timeEnd = now.toISOString().split("T")[0]

  const result = await TMDB.discover(
    "movie", "revenue.desc", 
    [timeStart, timeEnd], 
    null, 1
  )

  return (
    <div className="rounded-xl bg-neutral-800 flex flex-col py-4 gap-6 aspect-[3/3.4] overflow-hidden">
      <div className="px-6">
        <h2 className="font-bold">Top #10 Box Office Movies</h2>
        <p className="text-xs text-white/60">Since {formattedDate}</p>
      </div>
      <div className="flex flex-col gap-2 overflow-y-auto overflow-x-hidden px-6">
        {(result.ok?.results as Movie[]).slice(0, 10).map((movie, i) => (
          <Link key={i} href={`/movie/${movie.id}`}> 
            <div className="relative flex gap-4 transition-colors hover:bg-black/30 bg-black/20 p-1 rounded-lg items-center">
              <p className="w-7 h-7 flex items-center justify-center text-sm p-1 font-bold absolute -left-3 bg-neutral-900/70 backdrop-blur-3xl rounded-full">{i + 1}</p>
              <img 
                src={TMDB.poster(movie.poster_path, "/gradient.png", "w92")} 
                alt={movie.title} 
                className="w-14 aspect-[2/3] rounded-lg" 
              />
              <div className="flex flex-col gap-1">
                <h3 className="text-[0.91rem] font-semibold line-clamp-1">{movie.title}</h3>
                <div className="flex text-white/60 items-center flex-wrap">
                  <div className="flex gap-1 items-center bg-neutral-800 rounded-full py-1 px-2.5">
                    <CiStar size={14} />
                    <p className="text-xs">{movie.vote_average.toFixed(1)}</p>
                  </div>
                  <Dot />
                  <p className="text-xs">{parseDate(movie.release_date)}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

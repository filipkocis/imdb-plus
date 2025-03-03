import { Genre, Movie, TMDB } from "@/app/tmdb/lib";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { CiStar } from "react-icons/ci";
import { parseDate } from "../result/ResultBlock";
import { Dot } from "lucide-react";

export default function MovieBackdrop({ movie, genres, className, style }: { movie: Movie, genres: Genre[], className?: string, style?: React.CSSProperties }) {
  return (
    <Link style={style} href={`/movie/${movie.id}`} className={cn("p-0 m-0 w-full h-full transition-transform duration-1000", className)}>
      <div className={cn("relative w-full h-full")}>
        <Image 
          src={TMDB.poster(movie.backdrop_path, "/gradient.png", "original")} 
          alt={movie.title} 
          className="object-cover gradient-mask aspect-video" 
          loading="eager"
          sizes="80vw"
          fill={true}
        />
        <div className="absolute top-0 right-0 p-2 sm:p-4 md:p-8">
          <div className="flex gap-1 items-center bg-contrast rounded-full px-4 py-1.5 text-black text-[0.9rem] font-semibold leading-none">
            <CiStar strokeWidth={2} />
            <span>{movie.vote_average.toFixed(1)}</span>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 flex flex-col gap-2">
          <h2 className="text-2xl lg:text-4xl font-extrabold line-clamp-1">{movie.title}</h2> 
          <div className="flex text-sm gap-1 text-neutral-400 uppercase">
            <span>{parseDate(movie.release_date)}</span>
            <Dot />
            <span>{movie.original_language}</span>
          </div>
          <p className="text-contrast uppercase text-xs font-semibold hidden md:block">
            {movie.genre_ids.map((id) => genres.find(g => g.id === id)?.name).map(genreNameMap).filter(Boolean).join(", ")}
          </p>
          <p className="text-sm line-clamp-1 md:line-clamp-2 max-w-[80%]">{movie.overview}</p>
        </div>
      </div>
    </Link>
  )
}

function genreNameMap(name: string | undefined) {
  if (!name) return name;

  return name.toLowerCase() === "science fiction" ? "Sci-Fi" : name
}

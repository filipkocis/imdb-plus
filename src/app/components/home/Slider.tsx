"use client"

import { Genre, Movie, TMDB } from "@/app/tmdb/lib"
import { cn } from "@/lib/utils"
import { Dot } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { HiOutlineArrowLeft, HiOutlineArrowRight } from "react-icons/hi"
import { parseDate } from "../result/ResultBlock"
import Link from "next/link"
import { CiStar } from "react-icons/ci"

export default function Slider({ className, movies, genres }: { className?: string, movies: Movie[], genres: Genre[] }) {
  const [movieIndex, setMovieIndex] = useState(0)

  const setIndex = (direction: number) => () => {
    setMovieIndex((prev) => {
      const next = prev + direction;
      if (next >= movies.length) return 0;
      if (next < 0) return movies.length - 1;
      return next;
    });
  };

  useEffect(() => {
    const interval = setInterval(setIndex(1), 7_500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={cn("relative", className)}>
      <div className="h-full relative rounded-xl overflow-hidden flex gap-8">
        {movies.map((movie, i) => (
          <MovieBackdrop 
            key={movie.id}
            movie={movie} 
            genres={genres} 
            className="absolute h-full rounded-xl overflow-hidden" 
            style={{ transform: `translateX(calc(${100 * (i - movieIndex)}% + ${32 * (i - movieIndex)}px))` }}
          /> 
        ))}
      </div>

      <div className="flex gap-4 absolute text-neutral-400 -bottom-[56px] right-2">
        <button className="rounded-full p-2 hover:bg-secondary" onClick={setIndex(-1)}>
          <HiOutlineArrowLeft size={24} />
        </button>
        <button className="rounded-full p-2 hover:bg-secondary" onClick={setIndex(1)}>
          <HiOutlineArrowRight size={24} />
        </button>
      </div>
    </div>
  )
}

function MovieBackdrop({ movie, genres, className, style }: { movie: Movie, genres: Genre[], className?: string, style?: React.CSSProperties }) {
  return (
    <Link style={style} href={`/movie/${movie.id}`} className={cn("p-0 m-0 w-full h-full transition-transform duration-1000", className)}>
      <div className={cn("relative w-full h-full")}>
        <Image 
          src={TMDB.poster(movie.backdrop_path, "/gradient.png", "original")} 
          alt={movie.title} 
          className="object-cover gradient-mask aspect-video" 
          loading="eager"
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

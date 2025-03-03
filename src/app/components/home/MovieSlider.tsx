"use client"

import { Genre, Movie } from "@/app/tmdb/lib"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { HiOutlineArrowLeft, HiOutlineArrowRight } from "react-icons/hi"
import MovieBackdrop from "./MovieBackdrop"

export default function MovieSlider({ className, movies, genres }: { className?: string, movies: Movie[], genres: Genre[] }) {
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

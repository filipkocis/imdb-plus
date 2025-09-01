import { SearchResult, TMDB } from "@/app/tmdb/lib";
import Link from "next/link";
import Image from "next/image";
import { Fragment } from "react";
import UnavailablePoster from "@/assets/unavailable.png"
import { CiStar } from "react-icons/ci";
import { FaRegCirclePlay } from "react-icons/fa6";
import { cn } from "@/lib/utils";

export default function ResultBlock({ item, className, hrefOverride }: { item: SearchResult, className?: string, hrefOverride?: string }) {
  const href = hrefOverride ?? `/${item.media_type}/${item.id}`;
  const isMovieOrTv = item.media_type === "movie" || item.media_type === "tv";

  let name, posterPath, imageAlt, description;

  if (item.media_type === "person") {
    name = item.name;
    posterPath = item.profile_path;
    imageAlt = item.name || "No name"; 
    description = "Actor";
  } else if (item.media_type === "movie") {
    name = item.title;
    posterPath = item.poster_path;
    imageAlt = item.title || "No title";
    description = parseDate(item.release_date)
  } else if (item.media_type === "collection") {
    name = item.title;
    posterPath = item.poster_path;
    imageAlt = item.title || "No title";
    description = "Collection";
  } else {
    name = item.name;
    posterPath = item.poster_path;
    imageAlt = item.name || "No title";
    description = parseDate(item.first_air_date)
  }

  return (
    <Link href={href} className={cn("group relative flex flex-col gap-2 overflow-hidden rounded-2xl", className)}> 
      {isMovieOrTv && (
        <div className="flex inset-0 z-10 absolute items-center justify-center scale-[150%] opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300">
          <FaRegCirclePlay size={48} className="text-contrast" />
        </div>
      )}

      <div className="flex group relative contain-layout bg-secondary gradient-mask">
        <Image 
          className="-z-10 group-hover:opacity-85 w-full h-full grow aspect-[2/3] overflow-hidden rounded-2xl" 
          src={posterPath ? TMDB.poster(posterPath, "", "w500") : UnavailablePoster} 
          alt={imageAlt}
          width={200} 
          height={300} 
        />
      </div>

      <p className="backdrop-blur-3xl text-[0.65rem] font-extrabold uppercase absolute top-4 right-2 px-3 py-1 bg-black/20 rounded-full">{item.media_type}</p>

      {isMovieOrTv && (
        <div className="text-black items-center text-sm absolute top-4 bg-contrast flex gap-1 rounded-full px-2.5 py-0.5 pl-5 -left-2.5">
          <CiStar size={12} stroke="black" strokeWidth={1} />
          <p className="font-semibold">{item.vote_average.toFixed(1)}</p>
        </div>
      )}

      <div className="max-w-full font-semibold text-sm absolute bottom-0 overflow-hidden p-4 flex flex-col gap-2">
        <h2 className="text-nowrap whitespace-normal text-ellipsis overflow-hidden">{name}</h2>
        <p className="text-white/40">{description}</p>
      </div>
    </Link>
  )
}

export function parseDate(date: string) {
  if (!date) return "Unknown date"

  const parts = new Date(date)
      .toLocaleDateString()
      .split("/");

  return parts.map((s, i) => i === parts.length - 1 ? s : (<Fragment key={i}>
    {s}<span className="px-1">/</span>
  </Fragment>))
}

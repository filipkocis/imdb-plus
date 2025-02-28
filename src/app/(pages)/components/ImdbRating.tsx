"use client"

import { getImdbRating } from "@/thief/imdb"
import { Rating, RatingProps } from "./Rating"
import { LiaImdb } from "react-icons/lia"
import { useEffect, useState } from "react";
import { getExternalTvShowIDs } from "../actions/externalIds";

export function ImdbRating({ id, type, ...props }: { type: "movie" | "tv", id: string } & Omit<RatingProps, "Icon" | "value">) {
  const [rating, setRating] = useState<number | null>(null)
  
  useEffect(() => {
    let mounted = true;

    async function load() {
      let finalId = id

      if (type === "tv") {
        const ids = await getExternalTvShowIDs(id)
        if (ids.error !== undefined) return;
        if (!ids.ok.imdb_id) return;
        finalId = ids.ok.imdb_id
      }

      const rating = await getImdbRating(finalId)
      if (!mounted || rating === null) return;
      setRating(rating)
    }
    load()

    return () => {
      mounted = false;
    }
  }, [id, type])

  if (rating === null) return null;
  return <Rating value={rating} Icon={LiaImdb} {...props} />
}

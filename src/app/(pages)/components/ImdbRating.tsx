"use client"

import { getImdbRating } from "@/thief/imdb"
import { Rating, RatingProps } from "./Rating"
import { LiaImdb } from "react-icons/lia"
import { useEffect, useState } from "react";

export function ImdbRating({ id, type, ...props }: { type: "movie" | "tv", id: string } & Omit<RatingProps, "Icon" | "value">) {
  const [rating, setRating] = useState<number | null>(null)
  
  useEffect(() => {
    let mounted = true;

    async function load() {
      const rating = await getImdbRating(id)
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

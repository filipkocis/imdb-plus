"use client"

import { Button } from "@/components/ui/button"
import { usePlayer } from "../context/PlayerContext"
import { FaPlay } from "react-icons/fa"
import { cn } from "../utils/merge"

export default function WatchButton({ type, id, name }: { type: "movie" | "tv" | "youtube", id: string, name: string }) {
  const { setPlayer } = usePlayer()
  const trailer = type === "youtube"

  const handleClick = () => {
    if (type === "tv") setPlayer({ type, id, name, episode: 1, season: 1 });
    else setPlayer({ type, id, name });
  }

  return (
    <Button
      onClick={handleClick} 
      variant={trailer ? "default" : "primary"}
      className={cn("font-bold", trailer ? "" : "uppercase")}
    >
      <FaPlay style={{ width: 10 }} />
      {trailer ? "Trailer" : "Watch"}
    </Button>
  )
}

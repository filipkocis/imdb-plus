"use client"

import { Button } from "@/components/ui/button"
import { usePlayer } from "../context/PlayerContext"
import { FaPlay } from "react-icons/fa"
import { cn } from "../utils/merge"

type WatchButtonProps = {
  type: "movie" | "youtube"
  id: string
  name: string
} | {
  type: "tv"
  id: string
  name: string
  season: number
  episode: number
  episodeCount: number
}

export default function WatchButton(props: WatchButtonProps) {
  const { setPlayer } = usePlayer()
  const trailer = props.type === "youtube"

  const handleClick = () => {
    setPlayer(props)
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

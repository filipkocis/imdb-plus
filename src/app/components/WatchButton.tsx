"use client"

import { Button } from "@/components/ui/button"
import { PlayerOptions, usePlayer } from "../context/PlayerContext"
import { FaPlay } from "react-icons/fa"
import { cn } from "../utils/merge"

export default function WatchButton(options: PlayerOptions) {
  const { setPlayer } = usePlayer()
  const trailer = options.type === "youtube"

  const handleClick = () => {
      setPlayer(options)
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

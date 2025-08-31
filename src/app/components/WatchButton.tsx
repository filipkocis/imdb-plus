"use client"

import { Button } from "@/components/ui/button"
import { PlayerOptions, usePlayer } from "@/app/context/PlayerContext"
import { FaPlay } from "react-icons/fa"
import { cn } from "@/app/utils/merge"

export default function WatchButton(props: PlayerOptions) {
  const { setPlayer } = usePlayer()
  const trailer = props.type === "youtube"

  const handleClick = () => {
    setPlayer(props);
  };

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

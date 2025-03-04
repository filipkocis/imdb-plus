"use client"

import { usePlayer } from "../../context/PlayerContext"

type WatchButtonProps = {
  id: string
  name: string
  season: number
  episode: number
  episodeCount: number
  children: React.ReactNode
  className?: string
}

export default function WatchEpisodeButton(props: WatchButtonProps) {
  const { setPlayer } = usePlayer()

  const handleClick = () => {
    setPlayer({ type: "tv", ...props })
  }

  return (
    <button onClick={handleClick} className={props.className}>
      {props.children}
    </button>
  )
}

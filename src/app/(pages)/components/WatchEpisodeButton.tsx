"use client"

import { PlayerOptions, usePlayer } from "@/app/context/PlayerContext"

type WatchEpisodeButtonProps = Omit<
  Extract<PlayerOptions, { type: "tv" }>,
  "type"
> & {
  children: React.ReactNode;
  className?: string;
};

export default function WatchEpisodeButton({ className, children, ...props }: WatchEpisodeButtonProps) {
  const { setPlayer } = usePlayer()

  const handleClick = () => {
    setPlayer({ type: "tv", ...props });
  }

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  )
}

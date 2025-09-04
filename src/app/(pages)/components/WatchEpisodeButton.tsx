"use client"

import ListMenu from "@/app/components/ListMenu";
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
    <div className="relative grid">
      <button onClick={handleClick} className={className}>
        {children}
      </button>
      <div className="z-50 flex items-center absolute top-0 bottom-0 right-0 translate-x-1/3" >
        <ListMenu className="bg-secondary" item={{ type: "tv", ...props }} />
      </div>
    </div>
  )
}

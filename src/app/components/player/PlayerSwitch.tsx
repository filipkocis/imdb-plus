"use client"

import { PlayerOptions } from "@/app/context/PlayerContext";
import { cn } from "@/app/utils/merge";
import { Dispatch, SetStateAction } from "react";
import { SERVERS } from "./EmbeddedPlayer";

export default function PlayerSwitch(
  { player, setPlayer, server, setServer, className }: 
  { 
    player: PlayerOptions, 
    setPlayer?: Dispatch<SetStateAction<PlayerOptions | null>>, 
    server: number, 
    setServer?: Dispatch<SetStateAction<number>>, 
    className?: string 
  }
) {
  const isTvPlayer = player.type === 'tv';

  const handleClick = () => {
    setServer?.(server => (server + 1) % SERVERS.length);
  }

  const handleEpisodeClick = () => {
    if (player.type !== 'tv') return;

    setPlayer?.(_ => {
      return {
        ...player,
        episode: player.episode + 1
      }
    });
  }

  return (
    <div className={cn(
      "absolute left-0 right-0 top-4 rounded-xl border border-secondary bg-black/10 backdrop-blur-3xl p-4 justify-self-center grid gap-4", 
      isTvPlayer ? "grid-cols-2" : "",
      className
    )}>
      <p className={cn("text-center text-sm font-semibold", isTvPlayer && "col-start-1 col-end-3")}>{player.name}</p>
      {isTvPlayer && (
        <button onClick={handleEpisodeClick} className="px-6 py-2 rounded-lg bg-secondary flex flex-col">
          <p className="text-[0.7rem] text-contrast uppercase">Episode</p>
          <p className="text-sm font-semibold uppercase">Episode {player.episode}</p>
        </button>
      )}
      <button onClick={handleClick} className="px-6 py-2 rounded-lg bg-secondary flex flex-col">
        <p className="text-[0.7rem] text-contrast uppercase">Player</p>
        <p className="text-sm font-semibold uppercase">Server {server + 1}</p>
      </button>
    </div>
  )
}

"use client"

import { createContext, useContext, useState } from "react";
import { Res } from "@/app/tmdb/lib";
import { addListEntry, MediaEntry } from "@/app/db/lib";
import { toast } from "sonner";

export type PlayerOptions = {
  type: 'youtube'
  id: string
  name: string
} | {
  type: 'movie'
  id: number
  imdbId: string | null
  name: string
} | {
  type: 'tv'
  id: number
  imdbId: string | null
  name: string
  season: number
  episode: number
  episodeCount: number
}

type PlayerProviderValue = {
  player: PlayerOptions | null
  setPlayer: (player: PlayerOptions | null) => void
}

export const PlayerContext = createContext<PlayerProviderValue>({
  player: null,
  setPlayer: () => {}
})

function entryFromPlayer(player: PlayerOptions | null): MediaEntry | null {
  if (!player || player.type === "youtube") return null;
  if (player.type === "tv") {
    if (
      player.episodeCount < 1 ||
      player.season < 1 ||
      player.episode > player.episodeCount
    )
      return null;
  }

  return {
    id: player.id,
    imdbId: player.imdbId || null,
    name: player.name,
    ...(player.type === "movie"
      ? { type: "movie" }
      : { type: "tv", season: player.season, episode: player.episode }),
  };
}

export default function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [player, setPlayerState] = useState<PlayerOptions | null>(null)

  function setPlayer(player: PlayerOptions | null) {
    const entry = entryFromPlayer(player);
    if (entry) {
      addListEntry("played", entry).then((res) => {
        if (Res.isError(res)) toast.error(res.error);
      });
    }
    setPlayerState(player);
  }

  return (
    <PlayerContext.Provider value={{ player, setPlayer }}>
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayer() {
  return useContext(PlayerContext)
}

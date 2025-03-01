"use client"

import { createContext, Dispatch, SetStateAction, useContext, useState } from "react";

export type PlayerOptions = {
  id: string
  type: 'youtube'
  name: string
} | {
  id: string
  type: 'movie'
  name: string
} | {
  id: string
  type: 'tv'
  name: string
  season: number
  episode: number
  episodeCount: number
}

type PlayerProviderValue = {
  player: PlayerOptions | null
  setPlayer: Dispatch<SetStateAction<PlayerOptions | null>>
}

export const PlayerContext = createContext<PlayerProviderValue>({
  player: null,
  setPlayer: () => {}
})

export default function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [player, setPlayer] = useState<PlayerOptions | null>(null)

  return (
    <PlayerContext.Provider value={{ player, setPlayer }}>
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayer() {
  return useContext(PlayerContext)
}

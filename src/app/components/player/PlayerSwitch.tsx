"use client"

import { PlayerOptions } from "@/app/context/PlayerContext";
import { cn } from "@/app/utils/merge";
import { Dispatch, SetStateAction } from "react";
import { SERVERS } from "./EmbeddedPlayer";

const SERVER_OPTIONS = SERVERS.map((_, i) => ({ value: i.toString(), name: `Server ${i + 1}` }))

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

  const handleServerChange = (value: number) => {
    setServer?.(value);
  }

  const handleEpisodeChange = (value: number) => {
    if (player.type !== 'tv') return;
    setPlayer?.({ ...player, episode: value });
  }

  return (
    <div className={cn(
      "absolute left-0 right-0 top-4 rounded-xl border border-secondary bg-black/10 backdrop-blur-3xl p-4 justify-self-center grid gap-4", 
      isTvPlayer ? "grid-cols-2" : "",
      className
    )}>
      <p className={cn("text-center text-sm font-semibold", isTvPlayer && "col-start-1 col-end-3")}>{player.name}</p>
      {isTvPlayer &&
        <Switch 
          selected={player.episode} 
          setSelected={handleEpisodeChange} 
          options={Array.from({ length: player.episodeCount }).map((_, i) => ({ value: (i + 1).toString(), name: `Episode ${i + 1}` }))} 
          label={`Season ${player.season}`} 
          offset={-1}
        />
      }
      <Switch selected={server} setSelected={handleServerChange} options={SERVER_OPTIONS} label="Player" />
    </div>
  )
}

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"

function Switch(
  { selected, setSelected, options, label, offset = 0 }: 
  { selected: number, setSelected: (value: number) => void, options: { value: string, name: string }[], label: string, offset?: number }
) {
  return (
    <Select
      value={selected.toString()}
      onValueChange={(value) => {
        const num = Number(value);
        setSelected(isNaN(num) ? 0 : num);
      }}
    >
      <SelectTrigger className="w-auto uppercase h-auto px-4 py-1.5 gap-3 rounded-lg bg-secondary">
        <div className="flex flex-col text-left"> 
          <p className="text-[0.7rem] text-contrast -mb-1">{label}</p>
          <p className="text-sm font-semibold">{options[selected + offset].name}</p>
        </div>
      </SelectTrigger>
      <SelectContent className="z-[200] border-none bg-secondary">
        <SelectGroup>
          {options.map(option => (
            <SelectItem 
              key={option.value} 
              value={option.value}
            >{option.name}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

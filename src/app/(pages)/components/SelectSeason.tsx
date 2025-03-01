"use client"

import { SeasonBase } from "@/app/tmdb/lib";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function SelectSeason({ defaultValue, seasons }: { defaultValue: string, seasons: SeasonBase[] }) {
  const [selectedOption, setSelectedOption] = useState<string>(defaultValue)
  const hasChanged = useRef(false)
  const router = useRouter()

  useEffect(() => {
    if (!hasChanged.current) return;
    router.push(`?s=${selectedOption}`, { scroll: false })
  }, [selectedOption])

  return (
    <Select
      value={selectedOption}
      onValueChange={(value) => {
        hasChanged.current = true
        setSelectedOption(value);
      }}
    >
      <SelectTrigger className="w-[150px]">
        <p className="grow uppercase">Select</p>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {seasons.map(season => (
            <SelectItem 
              key={season.id} 
              value={season.season_number.toString()}
            >{season.name}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

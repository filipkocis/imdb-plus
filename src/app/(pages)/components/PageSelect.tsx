"use client"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Value = {
  id: number
  name: string
  value: string
}

export default function PageSelect({ searchParam, defaultValue, values, label }: { searchParam: string, defaultValue: string, values: Value[], label: string }) {
  const [selectedOption, setSelectedOption] = useState<string>(defaultValue)
  const hasChanged = useRef(false)
  const router = useRouter()
  const params = useSearchParams()

  useEffect(() => {
    if (!hasChanged.current) return;

    if (params.get(searchParam) !== selectedOption) {
      const url = new URLSearchParams(params)
      url.delete('p')
      url.set(searchParam, selectedOption)
      router.push(`?${url.toString()}`, { scroll: false });
    }
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
        <p className="grow uppercase">{hasChanged.current ? selectedOption : label}</p>
      </SelectTrigger>
      <SelectContent className="border-none">
        <SelectGroup>
          {values.map(value => (
            <SelectItem 
              key={value.id} 
              value={value.value}
            >{value.name}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

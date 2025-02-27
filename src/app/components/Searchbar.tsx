"use client"

import { useRouter } from "next/navigation"
import { useRef } from "react"

export function Searchbar() {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSearch = () => {
    if (!inputRef.current) return;
    const query = inputRef.current.value

    if (query) {
      router.push(`/search/${query}`)
    }
  }

  return  (
    <div className="flex gap-4 rounded-full overflow-hidden w-full max-w-[690px] bg-white/5 focus-within:bg-white/10">
      <input
        onKeyDown={e => e.key === "Enter" && handleSearch()}
        ref={inputRef}
        type="text" 
        className="px-6 py-3 font-semibold text-[0.95rem] w-full bg-transparent"
        style={{ letterSpacing: "0.05em" }}
        placeholder={`Search...`}
      />
    </div>
  )
}

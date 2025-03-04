"use client"

import { useRouter } from "next/navigation"
import { useRef } from "react"
import { IoSearch } from "react-icons/io5"

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
    <div className="relative flex items-center gap-4 rounded-full overflow-hidden w-full max-w-[690px] bg-white/5 focus-within:bg-white/10">
      <IoSearch className="absolute left-4 text-neutral-400" />
      <input
        name="search"
        onKeyDown={e => e.key === "Enter" && handleSearch()}
        ref={inputRef}
        type="text" 
        className="pl-10 px-6 py-3 placeholder:font-semibold text-[0.95rem] w-full bg-transparent"
        style={{ letterSpacing: "0.05em" }}
        placeholder={`Search...`}
      />
    </div>
  )
}

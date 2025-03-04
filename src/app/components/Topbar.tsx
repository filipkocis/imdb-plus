"use client"

import { useState } from "react";
import { Searchbar } from "./Searchbar";
import UnlockOverlay from "./unlock/UnlockOverlay";
import { bamboozleServer, useServerList } from "../context/ServersContext";

export default function Topbar() {
  const { serverList } = useServerList()
  const noServers = serverList.length === 0 || serverList[0].name === bamboozleServer.name

  const [magic, setMagic] = useState(false)

  const handleClick = () => {
    setMagic(magic => !magic)
  }

  return (
    <header className="flex items-center justify-between gap-4 px-3 sm:px-4">
      <Searchbar />
      {noServers && (<>
        <button 
          onClick={handleClick} 
          className="rounded-lg border-contrast border-2 hover:bg-contrast hover:text-black transition-colors px-3 py-1 text-contrast font-semibold uppercase"
        >Magic</button>
        {magic && <UnlockOverlay setOpen={setMagic} />}
      </>)}
    </header>
  )
}

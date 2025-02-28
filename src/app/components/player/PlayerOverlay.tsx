"use client"

import { usePlayer } from "@/app/context/PlayerContext";
import { cn } from "@/app/utils/merge";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import EmbeddedPlayer from "./EmbeddedPlayer";
import PlayerSwitch from "./PlayerSwitch";

export default function PlayerOverlay() {
  const [server, setServer] = useState(0);
  const { player, setPlayer } = usePlayer();
  const handleClose = () => setPlayer(null);

  return (
    <div className={cn(
      "grid inset-0 absolute z-[100] bg-background transition-all duration-500", 
      !!player ? "opacity-100" : "opacity-0 pointer-events-none",
    )}>
      {!!player && (<>
        <PlayerSwitch 
          player={player} 
          setPlayer={setPlayer} 
          server={server} 
          setServer={setServer} 
          className="z-[200]"
        />
        <button 
          onClick={handleClose} 
          className="z-200 transition-colors opacity-70 hover:opacity-100 absolute top-3 right-3 text-black bg-contrast p-1 rounded-full"
        >
          <IoClose size={18} />
        </button>
        <EmbeddedPlayer serverOption={server} player={player} />
      </>)}
    </div>
  )
}

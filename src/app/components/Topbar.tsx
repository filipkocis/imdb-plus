"use client";

import { useState } from "react";
import { Searchbar } from "./Searchbar";
import MagicOverlay from "./unlock/MagicOverlay";
import WizardOverlay from "./unlock/WizardOverlay";
import { bamboozleServer, useServerList } from "../context/ServersContext";
import { useWizard } from "../context/WizardContext";
import { cn } from "@/app/utils/merge";

export default function Topbar({ className }: { className?: string }) {
  const { serverList } = useServerList();
  const { wizard } = useWizard();

  const noServers =
    serverList.length === 0 || serverList[0].name === bamboozleServer.name;

  return (
    <header className={cn("w-full bg-background flex items-center justify-between gap-4 p-3 sm:p-4", className)}>
      <Searchbar />
      {noServers && <MagicButton type="server" />}
      {!noServers && !wizard && <MagicButton type="wizard" />}
    </header>
  );
}

function MagicButton({ type }: { type: "server" | "wizard" }) {
  const [magic, setMagic] = useState(false);

  const handleClick = () => {
    setMagic((magic) => !magic);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="rounded-lg border-contrast border-2 hover:bg-contrast hover:text-black transition-colors px-3 py-1 text-contrast font-semibold uppercase"
      >
        {type === "server" ? "Magic" : "Sigil"}
      </button>
      {magic &&
        (type === "server" ? (
          <MagicOverlay setOpen={setMagic} />
        ) : (
          <WizardOverlay setOpen={setMagic} />
        ))}
    </>
  );
}

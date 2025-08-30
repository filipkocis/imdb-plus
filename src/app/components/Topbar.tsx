"use client";

import { useState } from "react";
import { Searchbar } from "./Searchbar";
import MagicOverlay from "./unlock/MagicOverlay";
import { bamboozleServer, useServerList } from "../context/ServersContext";
import WizardOverlay from "./unlock/WizardOverlay";
import { useWizard } from "../context/WizardContext";

export default function Topbar() {
  const { serverList } = useServerList();
  const { wizard } = useWizard();

  const noServers =
    serverList.length === 0 || serverList[0].name === bamboozleServer.name;

  return (
    <header className="flex items-center justify-between gap-4 px-3 sm:px-4">
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
        {type === "server" ? "Magic" : "Wizard?"}
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

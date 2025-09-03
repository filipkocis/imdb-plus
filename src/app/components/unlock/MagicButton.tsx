"use client";

import {
  bamboozleServer,
  parseServer,
  useServerList,
} from "@/app/context/ServersContext";

import { useState } from "react";
import UnlockOverlay from "./UnlockOverlay";
import { bindWizardSigil } from "@/app/db/lib";
import { verifyWizardness } from "@/app/utils/server";
import { Res } from "@/app/tmdb/lib";
import { toast } from "sonner";
import { useWizard } from "@/app/context/WizardContext";

export default function MagicButton() {
  const { serverList, setServerList } = useServerList();
  const { wizard, setWizard } = useWizard();
  const [magic, setMagic] = useState(false);

  const noServers =
    serverList.length === 0 || serverList[0].name === bamboozleServer.name;

  const type = noServers ? "server" : !wizard ? "wizard" : null;
  if (!type) return null;

  const handleClick = () => setMagic((magic) => !magic);

  const onMagicSubmit = async (value: string) => {
    const wizardness = await verifyWizardness(value);
    if (!wizardness) throw new Error("I sense a muggle");
    setServerList(wizardness.map(parseServer));
    toast.success("Welcome back, wizard!");
  };

  const onWizardSubmit = async (value: string) => {
    const wizard = await bindWizardSigil(value);
    if (Res.isError(wizard)) throw new Error(wizard.error);
    setWizard(wizard.ok);
    toast.success("Welcome back, wizard!");
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="rounded-lg border-contrast border-2 hover:bg-contrast hover:text-black transition-colors px-3 py-1 text-contrast font-semibold uppercase"
      >
        {type === "server" ? "Magic" : "Sigil"}
      </button>
      {type === "server" ? (
        <UnlockOverlay
          parts={[3, 3]}
          inputMode="numeric"
          open={magic}
          setOpen={setMagic}
          onSubmit={onMagicSubmit}
        />
      ) : (
        <UnlockOverlay
          parts={[4, 4]}
          inputMode="text"
          open={magic}
          setOpen={setMagic}
          onSubmit={onWizardSubmit}
        />
      )}
    </>
  );
}

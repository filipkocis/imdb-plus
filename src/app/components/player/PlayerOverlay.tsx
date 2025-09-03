"use client";

import { usePlayer } from "@/app/context/PlayerContext";
import { useState } from "react";
import EmbeddedPlayer from "./EmbeddedPlayer";
import PlayerSwitch from "./PlayerSwitch";
import OverlayWrapper from "../OverlayWrapper";

export default function PlayerOverlay() {
  const [server, setServer] = useState(0);
  const { player, setPlayer } = usePlayer();

  if (!player) return null;

  return (
    <OverlayWrapper
      onClose={() => setPlayer(null)}
      className="grid bg-background"
      enabled={!!player}
      closeAfter={300}
    >
      {!!player && (
        <>
          <PlayerSwitch
            player={player}
            setPlayer={setPlayer}
            server={server}
            setServer={setServer}
            className="z-10"
          />
          <EmbeddedPlayer serverOption={server} player={player} />
        </>
      )}
    </OverlayWrapper>
  );
}

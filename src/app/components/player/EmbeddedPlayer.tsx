"use client";

import { PlayerOptions } from "@/app/context/PlayerContext";
import { useServerList } from "@/app/context/ServersContext";

export default function EmbeddedPlayer({
  serverOption,
  player,
}: {
  serverOption: number;
  player: PlayerOptions;
}) {
  const { serverList } = useServerList();

  if (player.type === "youtube")
    return (
      <div className="">
        <iframe
          src={`https://www.youtube.com/embed/${player.id}?autoplay=1`}
          id="ytplayer"
          width="100%"
          height="100%"
          allowFullScreen
          allow="autoplay; encrypted-media"
        ></iframe>
      </div>
    );

  const server = serverList[serverOption];
  const src =
    player.type === "tv"
      ? server.getTv(player.id, player.season, player.episode)
      : server.getMovie(player.id);

  return (
    <div className="">
      <iframe
        src={src}
        width="100%"
        height="100%"
        allowFullScreen
        allow="autoplay; encrypted-media"
      ></iframe>
    </div>
  );
}

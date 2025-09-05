import { Movie } from "@/app/utils/download";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DownloadIcon } from "lucide-react";
import { BsFillMagnetFill } from "react-icons/bs";

type Rec = Record<string, string | undefined>;

const torrentType: Rec = {
  bluray: "BluRay",
  web: "WEB",
  dvd: "DVD",
};

const videoCodec: Rec = {
  x264: "AVC",
  x265: "HEVC",
};

export default function TorrentList({ movie }: { movie: Movie }) {
  return (
    <div className="bg-secondary rounded-lg p-6 flex flex-col gap-6 max-h-[80vh] overflow-y-auto">
      {movie.torrents.map((torrent) => (
        <div
          key={torrent.hash}
          className="flex flex-col gap-2 sm:grid grid-cols-[1fr,1fr,1fr,1fr] sm:gap-8"
        >
          <div className="flex sm:flex-col justify-between">
            <p className="text-lg leading-5 flex gap-4">
              <span
                className={cn(
                  "font-semibold",
                  torrent.quality === "2160p" && "text-contrast",
                )}
              >
                {torrent.quality}
              </span>
              <span className="font-semibold capitalize">
                {torrentType[torrent.type] || torrent.type}
              </span>
            </p>
            <p className="text-neutral-300/80">{torrent.size}</p>
          </div>

          <div className="flex flex-wrap sm:grid grid-cols-[auto,1fr] gap-x-2 gap-y-1 leading-none items-center text-[0.85rem] [&>span]:uppercase [&>span]:text-neutral-300/80">
            <span>depth</span>
            <p
              className={cn(
                parseInt(torrent.bit_depth) >= 10 && "text-contrast",
              )}
            >
              {torrent.bit_depth}bit
            </p>
            <span>video</span>
            <p
              className={cn(torrent.video_codec === "x265" && "text-contrast")}
            >
              {videoCodec[torrent.video_codec] || torrent.video_codec}
            </p>
            <span>audio</span>
            <p
              className={cn(
                parseFloat(torrent.audio_channels) >= 5.1 && "text-contrast",
              )}
            >
              {torrent.audio_channels}
            </p>
          </div>

          <div className="flex sm:grid grid-cols-[auto,1fr] gap-x-2 gap-y-1 leading-none items-center text-[0.85rem] sm:self-center [&>span]:uppercase [&>span]:text-neutral-300/80">
            <span>seeds</span>
            <p
              className={cn(
                torrent.seeds > torrent.peers && "text-green-400",
                !torrent.seeds && "text-red-400",
              )}
            >
              {torrent.seeds}
            </p>
            <span>peers</span>
            <p className={cn(torrent.peers > torrent.seeds && "text-red-400")}>
              {torrent.peers}
            </p>
          </div>
          <div className="flex gap-2 self-end sm:self-center">
            <Button asChild variant="primary">
              <a
                href={torrent.magnet}
                target="_blank"
                rel="noopener noreferrer"
              >
                <BsFillMagnetFill />
              </a>
            </Button>
            <Button asChild>
              <a
                href={torrent.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-background"
              >
                <DownloadIcon />
              </a>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

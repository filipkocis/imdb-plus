"use client";

import { Button } from "@/components/ui/button";
import OverlayWrapper from "../OverlayWrapper";
import { useState } from "react";
import { getMovie, Movie } from "@/app/utils/download";
import { Res } from "@/app/tmdb/lib";
import { toast } from "sonner";
import { DownloadIcon } from "lucide-react";
import TorrentList from "./TorrentList";

export default function DownloadButton({ id }: { id: string | null }) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [open, setOpen] = useState(false);

  if (!id) return null;

  function handleClick() {
    setOpen((v) => !v);
    if (movie) return;

    async function fetchMovie() {
      if (!id) return;
      const movie = await getMovie(id);
      if (Res.isError(movie)) {
        setOpen(false);
        return toast.error(movie.error);
      }
      setMovie(movie.ok);
    }
    fetchMovie();
  }

  return (
    <>
      <Button
        onClick={handleClick}
        variant="default"
        className="uppercase font-bold"
      >
        <DownloadIcon className="!size-5" />
      </Button>
      {movie && (
        <OverlayWrapper
          onClose={() => setOpen(false)}
          enabled={open}
          closeAfter={300}
          className="grid bg-black/50"
        >
          <div
            onClick={(e) => e.target === e.currentTarget && setOpen(false)}
            className="overflow-hidden flex items-center justify-center"
          >
            <TorrentList movie={movie} />
          </div>
        </OverlayWrapper>
      )}
    </>
  );
}

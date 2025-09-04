"use client";

import { HiDotsVertical } from "react-icons/hi";
import { cn } from "@/app/utils/merge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
} from "@/components/ui/select";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Check, Loader2 } from "lucide-react";
import {
  addListEntry,
  getPossibleLists,
  ListType,
  MediaEntry,
  removeListEntry,
} from "@/app/db/lib";
import { Res } from "@/app/tmdb/lib";
import { useWizard } from "@/app/context/WizardContext";
import { getExternalIDs } from "@/app/utils/server";

const LISTS = ["watchlist", "played", "finished"] as ListType[];
type Bools = [boolean, boolean, boolean];

type Item = {
  id: number;
  imdbId: string | null | false;
  name: string;
} & ({ type: "movie" } | { type: "tv"; season?: number; episode?: number });

export default function ListMenu({
  item,
  className,
}: {
  item: Item;
  className?: string;
}) {
  const { wizard } = useWizard();

  const [open, _setOpen] = useState(false);
  const [loadLists, setLoadLists] = useState(false);
  const [selected, setSelected] = useState<Bools>([false, false, false]);
  const [loading, setLoading] = useState<Bools | null>(null);
  const imdbId = useRef<string | null | false>(item.imdbId);

  useEffect(() => {
    if (!open || !wizard || !loadLists) return;
    if (loading && loading.every((l) => l === false)) return;

    async function updateLists() {
      const args = item.type === "tv" ? [item.season, item.episode] : [];
      const possibleLists = await getPossibleLists(item.id, ...args);
      if (Res.isError(possibleLists)) return toast.error(possibleLists.error);

      setSelected(LISTS.map((l) => possibleLists.ok.includes(l)) as Bools);
      setLoading([false, false, false]);

      setLoadLists(false);
    }
    updateLists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, wizard, loadLists, loading]);

  useEffect(() => {
    if (!wizard || loading === null) return;
    setLoading([true, true, true]);
    setLoadLists(true);
    // @ts-expect-error - season and episode can be undefined
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wizard, item.id, item.type, item.season, item.episode]);

  if (!wizard) return null;

  function setOpen(value: boolean) {
    if (value) setLoadLists(true);
    _setOpen(value);
  }

  async function handleClick(value: ListType) {
    if (imdbId.current === false) {
      const ids = await getExternalIDs(item.id, item.type);
      if (Res.isError(ids)) return toast.error(ids.error);
      imdbId.current = ids.ok.imdb_id || null;
    }

    let media: MediaEntry;
    if (item.type === "movie") {
      media = {
        type: "movie",
        id: item.id,
        name: item.name,
        imdbId: imdbId.current,
      };
    } else {
      if (isDisabled(value))
        return toast.error("Only watchlist adding is suppoprted for TV shows");

      media = {
        type: "tv",
        id: item.id,
        name: item.name,
        imdbId: imdbId.current,
        season: item.season ?? 1,
        episode: item.episode ?? 1,
      };
    }

    const index = LISTS.indexOf(value as ListType);
    if (index === -1) return toast.error("Unknown list");

    setLoading((loading) => {
      if (!loading) return [true, true, true];
      const newArr = [...loading] as Bools;
      newArr[index] = true;
      return newArr;
    });

    const result = selected[index]
      ? await removeListEntry(LISTS[index], media)
      : await addListEntry(LISTS[index], media);

    if (Res.isError(result)) return toast.error(result.error);

    if (result.ok) {
      const extra =
        media.type === "tv" ? ` S${media.season}E${media.episode}` : "";
      const verb = selected[index] ? "removed from" : "added to";
      toast.success(`${media.name}${extra} ${verb} ${LISTS[index]}`);
    } else {
      toast.error("No changes made");
    }
    setLoadLists(true);
    setOpen(false);
  }

  const isDisabled = (list: string) => {
    if (item.type === "movie") return false;
    if (item.episode && item.season) return false;
    if (!item.episode && !item.season) return true;

    return list !== "watchlist" || selected[LISTS.indexOf("watchlist")];
  };

  return (
    <Select open={open} onOpenChange={setOpen}>
      <SelectTrigger
        onClick={() => setOpen(!open)}
        className={cn(
          "w-auto h-auto p-1 bg-neutral-800/60 text-white/60 hover:text-white rounded-full transition-colors [&>:nth-child(2)]:hidden",
          className,
        )}
      >
        <HiDotsVertical size={20} />
      </SelectTrigger>
      <SelectContent
        dir="rtl"
        align="start"
        side="top"
        className="borders-none"
      >
        <SelectGroup className="flex flex-col items-center gap-1">
          {LISTS.map((list, i) =>
            (loading?.[i] ?? true) ? (
              <div
                className={cn(
                  "transition-all relative flex w-full items-center rounded-sm py-1.5 pr-2 pl-8 text-sm uppercase cursor-not-allowed opacity-50 outline-none select-none",
                )}
                key={i}
              >
                <Loader2 className="h-4 w-4 absolute left-2 animate-spin" />
                {list}
              </div>
            ) : (
              <div
                onClick={() => !isDisabled(list) && handleClick(list)}
                className={cn(
                  "transition-all relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pr-2 pl-8 text-sm outline-none hover:bg-neutral-700 uppercase",
                  isDisabled(list) && "opacity-50 cursor-not-allowed",
                )}
                key={i}
              >
                {selected[i] && <Check className="h-4 w-4 absolute left-2" />}
                {list}
              </div>
            ),
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

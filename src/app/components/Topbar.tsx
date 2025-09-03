"use client";

import { Searchbar } from "./Searchbar";
import { cn } from "@/app/utils/merge";
import MagicButton from "./unlock/MagicButton";

export default function Topbar({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        "w-full bg-background flex items-center justify-between gap-4 p-3 sm:p-4",
        className,
      )}
    >
      <Searchbar />
      <MagicButton />
    </header>
  );
}

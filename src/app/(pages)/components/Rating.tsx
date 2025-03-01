import { cn } from "@/lib/utils";
import { IconType } from "react-icons";

export type RatingProps = { value: number, className?: string, Icon: IconType, size: number, strokeWidth?: number };

export function Rating({ value, className, Icon, size, strokeWidth }: RatingProps) {
  return (
    <div className={cn("font-semibold text-contrast absolute right-4 z-10 w-[52px] h-[52px] flex flex-col items-center justify-center rounded-full bg-yellow-500/30", className)}>
      <Icon size={size} stroke="currentColor" strokeWidth={strokeWidth} />
      <p>{value.toFixed(1)}</p>
    </div>
  )
}

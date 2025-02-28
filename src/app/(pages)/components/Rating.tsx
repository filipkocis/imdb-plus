import { cn } from "@/lib/utils";
import { IconType } from "react-icons";

export type RatingProps = { value: number, className?: string, Icon: IconType, size: number, strokeWidth?: number };

export function Rating({ value, className, Icon, size, strokeWidth }: RatingProps) {
  return (
    <div className={cn("absolute right-4 z-10 w-[52px] h-[52px] flex flex-col items-center justify-center rounded-full bg-yellow-500/30", className)}>
      <Icon size={size} className="text-contrast" stroke="currentColor" strokeWidth={strokeWidth} />
      <p className="text-contrast font-semibold">{value.toFixed(1)}</p>
    </div>
  )
}

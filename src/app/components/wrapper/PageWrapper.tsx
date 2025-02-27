import { cn } from "../../utils/merge"

export function PageWrapper({ className, children }: { className?: string, children: React.ReactNode }) {
  return (
    <div className={cn("grid grid-rows-[auto_1fr] gap-6", className)}>
      {children}
    </div>
  )
}

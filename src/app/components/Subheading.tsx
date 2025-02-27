import { cn } from "../utils/merge"

export default function Subheading({ className, children }: { className?: string, children: React.ReactNode }) {
  return (
    <h2 className={cn("uppercase flex items-center font-semibold border-l-2 border-contrast px-4", className)}>
      {children}
    </h2>
  )
}

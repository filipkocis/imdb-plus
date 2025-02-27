import { cn } from "../../utils/merge"

export default function BlocksWrapper({ small, className, children }: { small?: boolean, className?: string, children: React.ReactNode }) {
  return (
    <div 
      className={cn(
        "gap-2",
        small ? 
          "flex w-max" :
          "grid gap-y-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6", 
        className
      )}
    >
      {children} 
    </div>
  )
}

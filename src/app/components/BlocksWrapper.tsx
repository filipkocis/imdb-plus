import { cn } from "../utils/merge"

export default function BlocksWrapper({ small, className, children }: { small?: boolean, className?: string, children: React.ReactNode }) {
  if (small) return (
    <div className={cn("overflow-x-auto", className)}>
      <div className="flex gap-2 w-max [&>*]:w-1/2">
        {children} 
      </div>
    </div>
  )

  return (
    <div className={cn("grid gap-2 gap-y-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6", className)}>
      {children} 
    </div>
  )
}

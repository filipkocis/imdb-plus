"use client"

import { Button } from "@/components/ui/button"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"

export default function ResultTopBarButton({ label, isActive, onClick, setParam }: { label: string, isActive?: boolean, onClick?: () => void, setParam?: [string, string] }) {
  const router = useRouter()
  const params = useSearchParams()
  const active = isActive ? isActive : (setParam && params.get(setParam[0]) === setParam[1])

  const handleClick = () => {
    onClick?.()

    if (setParam) {
      const [key, value] = setParam
      if (params.get(key) !== value) {
        // const url = new URLSearchParams(params)
        const url = new URLSearchParams() // forget the page number
        url.set(key, value)
        router.push(`?${url.toString()}`);
      }
    }
  }

  return (
    <Button
      aria-label={label}
      onClick={handleClick} 
      size="default"
      variant={active ? "selected" : "default"}
      className="text-xs font-semibold rounded-md"
    >
      {label}
    </Button>
  )
}

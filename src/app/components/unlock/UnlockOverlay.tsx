import { parseServer, useServerList } from "@/app/context/ServersContext"
import { verifyWizardness } from "@/app/utils/server"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { cn } from "@/lib/utils"
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"
import { LucideX } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export default function UnlockOverlay({ setOpen }: { setOpen: (open: boolean) => void }) {
  const { setServerList } = useServerList()
  const [visible, setVisible] = useState(true)
  const [value, setValue] = useState("")

  const closeOverlay = () => {
    setValue("")
    setVisible(false)
    setTimeout(() => setOpen(false), 300)
  }

  const handleSubmit = async (value: string) => {
    try {
      const wizardness = await verifyWizardness(value)
      if (!wizardness) throw new Error("I sense a muggle");
      setServerList(wizardness.map(parseServer))
      toast.success("Welcome back, wizard!")
    } catch (error) {
      toast.error((error as Error)?.message || "Uh oh!")
    } finally {
      closeOverlay()
    }
  }

  return (
    <div className={cn("fade-in transition-all absolute inset-0 z-[999] flex items-center justify-center bg-neutral-900/90 backdrop-blur-3xl", visible ? "opacity-100" : "opacity-0")}>
      <button onClick={closeOverlay} className="rounded-full bg-contrast text-black p-2 absolute top-4 right-4">
        <LucideX size={24} />
      </button>

      <InputOTP 
        maxLength={6} 
        pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
        inputMode="numeric"
        value={value}
        onChange={setValue}
        onComplete={handleSubmit}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
    </div>
  )
}

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { LucideX } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

export default function UnlockOverlay({
  parts,
  inputMode,
  setOpen,
  onSubmit,
}: {
  parts: number[];
  inputMode: "text" | "numeric";
  setOpen: (open: boolean) => void;
  onSubmit: (value: string) => Promise<void>;
}) {
  const [visible, setVisible] = useState(true);
  const [value, setValue] = useState("");

  const closeOverlay = () => {
    setValue("");
    setVisible(false);
    setTimeout(() => setOpen(false), 300);
  };

  const handleSubmit = async (value: string) => {
    try {
      await onSubmit(value);
    } catch (error) {
      toast.error((error as Error)?.message || "Uh oh!");
    } finally {
      closeOverlay();
    }
  };

  let index = 0;
  return (
    <div
      className={cn(
        "fade-in transition-all absolute inset-0 z-[999] flex items-center justify-center bg-neutral-900/90 backdrop-blur-3xl",
        visible ? "opacity-100" : "opacity-0",
      )}
    >
      <button
        onClick={closeOverlay}
        className="rounded-full bg-contrast text-black p-2 absolute top-4 right-4"
      >
        <LucideX size={24} />
      </button>

      <InputOTP
        maxLength={parts.reduce((a, b) => a + b, 0)}
        pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
        inputMode={inputMode}
        value={value}
        onChange={setValue}
        onComplete={handleSubmit}
      >
        {parts.map((part, i) => (
          <React.Fragment key={i}>
            <InputOTPGroup>
              {new Array(part).fill(null).map(() => (
                <InputOTPSlot key={index} index={index++} />
              ))}
            </InputOTPGroup>
            {i < parts.length - 1 && <InputOTPSeparator />}
          </React.Fragment>
        ))}
      </InputOTP>
    </div>
  );
}

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import React, { useState } from "react";
import { toast } from "sonner";
import OverlayWrapper from "../OverlayWrapper";

export default function UnlockOverlay({
  parts,
  inputMode,
  open,
  setOpen,
  onSubmit,
}: {
  parts: number[];
  inputMode: "text" | "numeric";
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (value: string) => Promise<void>;
}) {
  const [value, setValue] = useState("");

  const handleSubmit = async (value: string) => {
    setOpen(false);
    setValue("");
    try {
      await onSubmit(value);
    } catch (error) {
      toast.error((error as Error)?.message || "Uh oh!");
    }
  };

  let index = 0;
  return (
    <OverlayWrapper
      onClose={() => setValue("")}
      closeAfter={300}
      className={cn(
        "fade-in flex items-center justify-center bg-neutral-900/90 backdrop-blur-3xl",
      )}
      enabled={open}
      setEnabled={setOpen}
    >
      <InputOTP
        maxLength={parts.reduce((a, b) => a + b, 0)}
        pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
        inputMode={inputMode}
        value={value}
        disabled={!open}
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
    </OverlayWrapper>
  );
}

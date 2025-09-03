import { cn } from "@/app/utils/merge";
import { LucideX } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function OverlayWrapper({
  className,
  children,
  onClose,
  closeAfter,
  enabled,
  setEnabled,
}: {
  className?: string;
  children: React.ReactNode;
  onClose?: () => void;
  closeAfter?: number;
  enabled: boolean;
  setEnabled?: (open: boolean) => void;
}) {
  const [open, setOpenState] = useState(enabled);
  const [visible, setVisible] = useState(open);

  const setOpen = (v: boolean) => {
    setOpenState(v);
    setEnabled?.(v);
  };

  useEffect(() => {
    setOpenState(enabled);
  }, [enabled]);

  useEffect(() => {
    if (open) setVisible(true);
    else setTimeout(() => setVisible(false), closeAfter || 0);
  }, [open, closeAfter]);

  useEffect(() => {
    setOpen?.(visible);
    document.body.style.overflow = visible ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  const handleClose = () => {
    setOpen?.(false);

    if (!onClose) return;
    if (closeAfter) {
      setTimeout(() => onClose(), closeAfter);
    } else {
      onClose();
    }
  };

  if (!visible) return null;

  return createPortal(
    <div
      className={cn(
        "fade-in inset-0 fixed z-[200] transition-opacity",
        open ? "opacity-100" : "opacity-0 pointer-events-none",
        className,
      )}
      style={{
        transitionDuration: `${closeAfter || 0}ms`,
        animationDuration: `${closeAfter || 0}ms`,
      }}
    >
      <button
        onClick={handleClose}
        className="z-50 transition-colors opacity-70 hover:opacity-100 rounded-full bg-contrast text-black p-2 absolute top-4 right-4"
      >
        <LucideX size={24} />
      </button>

      {children}
    </div>,
    document.body,
  );
}

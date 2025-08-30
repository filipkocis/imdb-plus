import { useWizard } from "@/app/context/WizardContext";
import { bindWizardSigil } from "@/app/db/lib";
import { toast } from "sonner";
import UnlockOverlay from "./UnlockOverlay";

export default function WizardOverlay({
  setOpen,
}: {
  setOpen: (open: boolean) => void;
}) {
  const { setWizard } = useWizard();

  const onSubmit = async (value: string) => {
    const wizard = await bindWizardSigil(value);
    if (!wizard) throw new Error("Stop right there, criminal scum!");
    setWizard(wizard);
    toast.success("Welcome back, wizard!");
  };

  return (
    <UnlockOverlay
      parts={[4, 4]}
      inputMode="text"
      setOpen={setOpen}
      onSubmit={onSubmit}
    />
  );
}

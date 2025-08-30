import { parseServer, useServerList } from "@/app/context/ServersContext";
import { verifyWizardness } from "@/app/utils/server";
import { toast } from "sonner";
import UnlockOverlay from "./UnlockOverlay";

export default function MagicOverlay({
  setOpen,
}: {
  setOpen: (open: boolean) => void;
}) {
  const { setServerList } = useServerList();

  const onSubmit = async (value: string) => {
    const wizardness = await verifyWizardness(value);
    if (!wizardness) throw new Error("I sense a muggle");
    setServerList(wizardness.map(parseServer));
    toast.success("Welcome back, wizard!");
  };

  return (
    <UnlockOverlay
      parts={[3, 3]}
      inputMode="numeric"
      setOpen={setOpen}
      onSubmit={onSubmit}
    />
  );
}

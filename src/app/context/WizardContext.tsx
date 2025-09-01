"use client";

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { getWizardInfo, WizardInfo } from "@/app/db/lib";
import { toast } from "sonner";
import { Res } from "@/app/tmdb/lib";

type WizardProviderValue = {
  wizard: WizardInfo | null;
  setWizard: Dispatch<SetStateAction<WizardInfo | null>>;
};

export const WizardContext = createContext<WizardProviderValue>({
  wizard: null,
  setWizard: () => {},
});

export default function WizardProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [wizard, setWizard] = useState<WizardInfo | null>(null);

  useEffect(() => {
    const fetchWizard = async () => {
      try {
        const info = await getWizardInfo();
        if (Res.isError(info)) {
          if (info.error.endsWith("Harry.")) return;
          else throw new Error(info.error);
        } else setWizard(info.ok);
      } catch (error) {
        toast.error((error as Error)?.message || "Uh oh!");
      }
    };
    fetchWizard();
  }, []);

  return (
    <WizardContext.Provider value={{ wizard, setWizard }}>
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  return useContext(WizardContext);
}

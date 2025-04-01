import Chron from "@/modules/chron/domain/Chron.ts";
import { create } from "zustand/react";
import { createDirectus, customEndpoint, rest } from "@directus/sdk";
import dateToChron from "@/modules/chron/domain/dateToChron.ts";
import { toast } from "sonner";

type ChronStore = {
  synced: boolean;
  sync: () => Promise<void>;
  tick: () => Promise<void>;
  date: Date;
  chron: () => Chron;
  accumulatedSeconds: number;
};

const useChron = create<ChronStore>((set, get) => {
  const sync = async () => {
    const client = createDirectus(
      import.meta.env.VITE_DIRECTUS_API_URL as string,
    ).with(rest({ credentials: "include" }));

    try {
      const chron = await client.request(
        customEndpoint<Chron>({
          path: "/chron",
          method: "GET",
        }),
      );
      set((prev) => ({
        ...prev,
        date: new Date(chron.original),
        accumulatedSeconds: 0,
        synced: true,
      }));
    } catch {
      toast.error("No se pudo sincronizar la hora.");
    }
  };

  const tick = async () =>
    set((prev) => ({
      ...prev,
      date: new Date(prev.date.getTime() + 1000),
      accumulatedSeconds: prev.accumulatedSeconds + 1,
      synced: prev.accumulatedSeconds <= 20,
    }));

  return {
    synced: false,
    sync,
    tick,
    accumulatedSeconds: 0,
    date: new Date(),
    chron: () => dateToChron(get().date),
  };
});

export default useChron;

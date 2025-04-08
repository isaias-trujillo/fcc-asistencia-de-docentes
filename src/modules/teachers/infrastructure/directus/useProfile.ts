import { create } from "zustand/react";
import { persist } from "zustand/middleware";
import { createDirectus, realtime } from "@directus/sdk";
import TeacherScheme from "@/modules/teachers/application/TeacherScheme.ts";

type ProfileStore = {
  search: (documentNumber: string) => Promise<void>;
  profile?: string;
  id?: string;
  authenticated: boolean;
  disconnect: () => void;
  connected: boolean;
  connect: () => Promise<void>;
};

const useProfile = create(
  persist<ProfileStore>(
    (setState, getState) => {
      const client = createDirectus(
          import.meta.env.VITE_DIRECTUS_WS_URL as string,
      ).with(
          realtime({
            authMode: "handshake",
          }),
      );

      return {
        profile: undefined,
        authenticated: false,
        disconnect: () => {
          if (!getState().connected) return;
          client.disconnect();
          setState(prev => ({...prev, connected: false, raw: {}}));
        },
        connected: false,
        connect: async () => {
          if (getState().connected) {
            return;
          }
          await client.connect()
              .then(() => setState({connected: true}))
              .catch(() => setState({connected: false}));
        },
        search: async (documentNumber: string) => {
          try {
            client.sendMessage({
              type: "subscribe",
              collection: "docentes",
              query: {
                filter: {
                  identificacion: {
                    _eq: documentNumber,
                  },
                },
              },
            });

            client.onWebSocket("message", (callback) => {
              if (callback.type == "auth" && callback.status == "error") {
                setState((prev) => ({ ...prev, authenticated: false }));
                return;
              }
              if (!getState()?.authenticated) {
                setState((prev) => ({ ...prev, authenticated: true }));
              }
              if (callback.type !== "subscription") {
                return;
              }

              const data = (callback?.data ?? []) as TeacherScheme[];

              if (
                callback.event === "init" ||
                callback.event === "create" ||
                callback.event === "update"
              ) {
                if (!data.length) {
                  return;
                }
                const { apellido_paterno, apellido_materno, nombres, id } =
                  data[0];
                setState(() => ({
                  id,
                  profile: `${apellido_paterno} ${apellido_materno} ${nombres}`
                    .split(" ")
                    .map((n) => {
                      if (!n.length) {
                        return n;
                      }
                      return n[0].toUpperCase() + n.slice(1).toLowerCase();
                    })
                    .join(" "),
                }));
                return;
              }
            });
          } catch (error) {
            console.log({ context: "use profile", error });
          }
        },
      };
    },
    {
      name: "profile",
    },
  ),
);

export default useProfile;

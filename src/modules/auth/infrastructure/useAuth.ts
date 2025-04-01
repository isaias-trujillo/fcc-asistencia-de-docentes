import { authentication, createDirectus } from "@directus/sdk";
import { create } from "zustand/react";
import { persist } from "zustand/middleware";

type Store = {
  login: (documentNumber: string) => Promise<void>;
  loggedIn: boolean;
  error?: string;
  documentNumber?: string;
  logout: () => Promise<void>;
};

const useAuth = create(
  persist<Store>(
    (setState) => {
      const client = createDirectus(
        import.meta.env.VITE_DIRECTUS_API_URL as string,
      ).with(
        authentication("session", {
          autoRefresh: true,
          credentials: "include",
        }),
      );

      const login = async (documentNumber: string) =>
        client
          .login(`${documentNumber}@conta.web.com`, documentNumber)
          .then(() =>
            setState((prevState) => ({
              ...prevState,
              error: undefined,
              loggedIn: true,
              documentNumber,
            })),
          );
      const logout = async () =>
        await client.logout().finally(() =>
          setState((prevState) => ({
            ...prevState,
            error: undefined,
            loggedIn: false,
            documentNumber: undefined,
          })),
        );

      return {
        loggedIn: false,
        login,
        logout,
      };
    },
    {
      name: "useAuth",
    },
  ),
);

export default useAuth;

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { Vanta } from "@vanta-dev/web";

const apiKey = process.env.NEXT_PUBLIC_VANTA_API_KEY;

if (!apiKey) {
  throw new Error("NEXT_PUBLIC_VANTA_API_KEY is not configured");
}

const client = new Vanta({
  apiKey,
  apiUrl: "/api/collect",
  flushInterval: 15000,
  flushSize: 10,
});

const VantaContext = createContext<Vanta>(client);

export function useVanta() {
  return useContext(VantaContext);
}

export function VantaProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const trackedPathname = useRef<string | null>(null);

  useEffect(() => {
    if (trackedPathname.current === pathname) return;

    trackedPathname.current = pathname;
    client.page().catch((err) => {
      console.log("Failed to track page view", err);
      client.track({
        event: "error",
        data: {
          message: "Failed to track page view",
          error: err instanceof Error ? err.message : String(err),
          pathname,
        },
      });
    });
  }, [pathname]);

  return (
    <VantaContext.Provider value={client}>{children}</VantaContext.Provider>
  );
}
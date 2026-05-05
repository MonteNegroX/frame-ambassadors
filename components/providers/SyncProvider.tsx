"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useRef } from "react";

export function SyncProvider({ children }: { children: React.ReactNode }) {
  const { authenticated, ready, user } = usePrivy();
  const syncAttempted = useRef(false);

  useEffect(() => {
    if (ready && authenticated && user && !syncAttempted.current) {
      syncAttempted.current = true;
      
      // Call our sync API
      fetch("/api/auth/sync", {
        method: "POST",
      }).catch((err) => {
        console.error("❌ [SyncProvider Error]: Failed to sync user", err);
      });
    }
    
    // Reset attempt when user logs out
    if (ready && !authenticated) {
      syncAttempted.current = false;
    }
  }, [ready, authenticated, user]);

  return <>{children}</>;
}

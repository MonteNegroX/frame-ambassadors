"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getGlobalStatsAction } from "@/lib/actions/user";

interface SystemContextType {
  globalStats: any;
  loadingStats: boolean;
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

export function SystemProvider({ children }: { children: React.ReactNode }) {
  const [globalStats, setGlobalStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const cached = localStorage.getItem("frame-os-stats");
    if (cached) {
      try { setGlobalStats(JSON.parse(cached)); } catch {}
    }
    async function fetchStats() {
      const stats = await getGlobalStatsAction();
      if (stats.success) {
        setGlobalStats(stats.stats);
        localStorage.setItem("frame-os-stats", JSON.stringify(stats.stats));
      }
      setLoadingStats(false);
    }
    fetchStats();
  }, []);

  return (
    <SystemContext.Provider
      value={{
        globalStats,
        loadingStats,
      }}
    >
      {children}
    </SystemContext.Provider>
  );
}

export function useSystem() {
  const context = useContext(SystemContext);
  if (context === undefined) {
    throw new Error("useSystem must be used within a SystemProvider");
  }
  return context;
}

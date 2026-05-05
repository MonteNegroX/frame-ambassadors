"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { BentoDashboard } from "@/components/BentoDashboard";
import { syncUserAction, completeSocialTaskAction } from "@/lib/actions/user";
import { useSystem } from "@/components/providers/SystemProvider";

export default function DashboardPage() {
  const { authenticated, ready, login } = usePrivy();
  const { globalStats } = useSystem();
  const router = useRouter();

  const [dbUser, setDbUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copying, setCopying] = useState(false);

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/");
    }
  }, [ready, authenticated, router]);

  useEffect(() => {
    async function sync() {
      if (authenticated) {
        const result = await syncUserAction();
        if (result.success) {
          setDbUser(result.user);
        }
        setLoading(false);
      }
    }
    sync();
  }, [authenticated]);

  const copyReferral = () => {
    if (!dbUser?.referralCode) return;
    const url = `${window.location.origin}?ref=${dbUser.referralCode}`;
    navigator.clipboard.writeText(url);
    setCopying(true);
    setTimeout(() => setCopying(false), 2000);
  };

  const handleTask = async (task: "follow" | "post") => {
    const result = await completeSocialTaskAction(task);
    if (result.success) {
      const syncResult = await syncUserAction();
      if (syncResult.success) setDbUser(syncResult.user);
    }
  };

  if (!ready || (authenticated && loading)) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!authenticated) return null;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-6xl space-y-12"
      >
        <BentoDashboard
          dbUser={dbUser}
          stats={globalStats}
          onCopy={copyReferral}
          copying={copying}
          onTask={handleTask}
        />

        {/* Footer Stats Info */}
        {/*<div className="text-center pt-8">
          <p className="text-xs font-bold uppercase tracking-widest text-neutral-500 opacity-50">
            Network status: Synchronized • Rank updates every 10m
          </p>
        </div>*/}
      </motion.div>
    </div>
  );
}

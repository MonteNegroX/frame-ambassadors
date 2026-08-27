"use client";

import { Terminal } from "@/components/ui/terminal";
import { motion } from "framer-motion";

export function WaitlistLoader({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
      transition={{ duration: 0.8, ease: "circOut" }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black p-4"
    >
      <div className="relative w-full max-w-2xl">
        <Terminal
          commands={[
            "pnpm init ambassador-engine",
            "verifying twitter-oauth v2.0 protocol...",
            "syncing referral-engine nodes...",
            "establishing p2p content verification...",
            "connecting to global waitlist database...",
            "Done. System ready.",
          ]}
          outputs={{
            0: [
              "✔ Configuration initialized.",
              "✔ Dependencies installed.",
            ],
            1: ["✔ OAuth handshake successful.", "✔ Token scope verified."],
            2: ["✔ Merkle tree built.", "✔ Referral state synced."],
            3: ["✔ X API connection stable.", "✔ Pre-scoring engine online."],
            4: ["✔ Connection established.", "✔ Indexing users..."],
          }}
          typingSpeed={30}
          delayBetweenCommands={533}
          onComplete={onComplete}
          username="frame-os"
        />

      </div>

      <div className="absolute bottom-8 left-8 flex items-center gap-2">
        <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
        <span className="text-[10px] uppercase tracking-widest text-neutral-600">

        </span>
      </div>
    </motion.div>
  );
}

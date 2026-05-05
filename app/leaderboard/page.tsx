"use client";

import { motion } from "framer-motion";
import { PublicLeaderboard } from "@/components/PublicLeaderboard";
import { useSystem } from "@/components/providers/SystemProvider";
import { LiquidGlassCard } from "@/components/ui/liquid-glass";
import { Trophy } from "lucide-react";
import { CountUp } from "@/components/unlumen-ui/components/effects/count-up";

export default function LeaderboardPage() {
  const { globalStats } = useSystem();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-4xl space-y-8"
      >
        {/* Page Header */}
        <div className="flex flex-col items-center text-center space-y-4 pt-4">
          <div className="h-16 w-16 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(234,179,8,0.1)]">
            <Trophy className="h-8 w-8 text-yellow-500" />
          </div>
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl uppercase">
            Global <span className="text-yellow-500">Leaderboard</span>
          </h1>
          <p className="text-sm text-white/50 max-w-lg uppercase tracking-widest font-mono">
            Verified Ambassadors & High-Value Content Creators
          </p>
        </div>

        {/* Global Stats Preview */}
        {globalStats && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pb-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
              <div className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Total Users</div>
              <div className="text-lg font-bold tabular-nums">
                <CountUp to={globalStats.totalUsers} separator="," digitEffect="slide" />
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
              <div className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Total XP</div>
              <div className="text-lg font-bold tabular-nums">
                <CountUp to={globalStats.totalPoints} separator="," digitEffect="slide" />
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
              <div className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Total Referrals</div>
              <div className="text-lg font-bold tabular-nums">
                <CountUp to={globalStats.totalReferrals} separator="," digitEffect="slide" />
              </div>
            </div>

          </div>
        )}

        {/* The Main Bento Leaderboard */}
        <LiquidGlassCard
          blurIntensity="lg"
          borderRadius="24px"
          shadowIntensity="sm"
          glowIntensity="none"
          className="bg-black/40 border-white/5 p-2 shadow-2xl"
        >
          <div className="max-w-4xl mx-auto">
            <PublicLeaderboard limit={100} />
          </div>
        </LiquidGlassCard>

        {/* Footer Info */}
        {/*<div className="text-center pt-8 opacity-30">
          <p className="text-[10px] font-bold uppercase tracking-widest font-mono">
            Data Source: Supabase Real-time Cluster • Verified via X API v2
          </p>
        </div>*/}
      </motion.div>
    </div>
  );
}

"use client";

import { LiquidGlassCard } from "@/components/ui/liquid-glass";
import {
  Copy,
  CheckCircle2,
  X,
  Zap,
  ShieldCheck,
  Eye,
  Users,
  Sparkles,
  Lock,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { CountUp } from "@/components/unlumen-ui/components/effects/count-up";
import { ShareImageModal } from "./ShareImageModal";

interface BentoDashboardProps {
  dbUser: any;
  stats: any;
  onCopy: () => void;
  copying: boolean;
  onTask: (task: "follow" | "post") => void;
}

export function BentoDashboard({ dbUser, stats, onCopy, copying, onTask }: BentoDashboardProps) {
  const [followClicked, setFollowClicked] = useState(false);
  const [postClicked, setPostClicked] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [verifying, setVerifying] = useState<"follow" | "post" | null>(null);

  const handleFollow = () => {
    window.open("https://x.com/frameonx", "_blank");
    setFollowClicked(true);
  };

  const handleFollowCheck = () => {
    setVerifying("follow");
    setTimeout(() => {
      onTask("follow");
      setVerifying(null);
    }, 2000);
  };

  const handlePost = () => {
    setIsShareModalOpen(true);
    setPostClicked(true);
  };

  const handlePostCheck = () => {
    setVerifying("post");
    setTimeout(() => {
      onTask("post");
      setVerifying(null);
    }, 2000);
  };

  const handlePreview = () => {
    if (dbUser?.twitterHandle) {
      window.open(`/api/og?ref=${dbUser.twitterHandle}`, "_blank");
    }
  };

  return (
    <div className="grid w-full max-w-6xl grid-cols-1 md:grid-cols-4 gap-4 mx-auto py-6">
      {/* System Rank - Identity Card Style */}
      <LiquidGlassCard
        draggable
        shadowIntensity="xs"
        glowIntensity="none"
        borderRadius="12px"
        blurIntensity="sm"
        className="col-span-1 p-0 text-white bg-black/40 border border-white/5 group overflow-hidden relative"
      >
        <div className="absolute top-3 left-3 w-2 h-2 border-t border-l border-yellow-500/40 z-40" />
        <div className="absolute top-3 right-3 w-2 h-2 border-t border-r border-yellow-500/40 z-40" />
        <div className="absolute bottom-3 left-3 w-2 h-2 border-b border-l border-yellow-500/40 z-40" />
        <div className="absolute bottom-3 right-3 w-2 h-2 border-b border-r border-yellow-500/40 z-40" />

        <div className="relative z-30 flex flex-col items-center justify-center h-full w-full py-6">
          <div className="relative mb-2 flex flex-col items-center">
            <span className="text-7xl font-bold text-yellow-500 tracking-tighter leading-none tabular-nums drop-shadow-[0_0_15px_rgba(255,213,7,0.3)]">
              #<CountUp
                to={dbUser?.waitlistRank || 0}
                digitEffect="slide"
                className="tabular-nums leading-none"
              />
            </span>
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "200%" }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 1.5 }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg] pointer-events-none"
            />
          </div>

          <div className="bg-[#FFD507] text-black px-4 py-1 rounded-sm text-[10px] font-bold uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(255,213,7,0.2)]">
            System Rank
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none text-6xl font-black">
            ID
          </div>
        </div>
      </LiquidGlassCard>

      {/* Frame Score - Identity Card Style */}
      <LiquidGlassCard
        draggable
        shadowIntensity="xs"
        glowIntensity="none"
        borderRadius="12px"
        blurIntensity="sm"
        className="col-span-1 p-0 text-white bg-black/40 border border-white/5 group overflow-hidden relative"
      >
        <div className="absolute top-3 left-3 w-2 h-2 border-t border-l border-yellow-500/40 z-40" />
        <div className="absolute top-3 right-3 w-2 h-2 border-t border-r border-yellow-500/40 z-40" />
        <div className="absolute bottom-3 left-3 w-2 h-2 border-b border-l border-yellow-500/40 z-40" />
        <div className="absolute bottom-3 right-3 w-2 h-2 border-b border-r border-yellow-500/40 z-40" />

        <div className="relative z-30 flex flex-col items-center justify-center h-full w-full py-6">
          {!dbUser?.frameScore || dbUser?.frameScore === 0 ? (
            <div className="flex flex-col items-center gap-4">
              <div className="relative h-16 w-16 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border border-dashed border-yellow-500/20 rounded-full"
                />
                <Zap className="h-6 w-6 text-yellow-500/40 animate-pulse" />
              </div>
              <div className="text-[10px] font-mono tracking-[0.3em] uppercase opacity-40 animate-pulse">Initializing...</div>
            </div>
          ) : (
            <>
              <div className="relative mb-2">
                <CountUp
                  to={Math.floor(dbUser.frameScore)}
                  separator=","
                  className="text-7xl font-bold text-yellow-400 tracking-tighter tabular-nums drop-shadow-[0_0_15px_rgba(255,213,7,0.3)]"
                />
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "200%" }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 1 }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg] pointer-events-none"
                />
              </div>

              <div className="bg-[#FFD507] text-black px-4 py-1 rounded-sm text-[10px] font-bold uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(255,213,7,0.2)]">
                Frame Score
              </div>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
                <ShieldCheck className="w-32 h-32 text-white" />
              </div>
            </>
          )}
        </div>
      </LiquidGlassCard>

      {/* Social Task - Square */}
      <LiquidGlassCard
        draggable
        shadowIntensity="xs"
        glowIntensity="none"
        borderRadius="12px"
        blurIntensity="sm"
        className="p-5 text-white bg-black/40 border border-white/5 group"
      >
        <div className="relative z-30 flex flex-col items-start justify-between h-full w-full gap-4">
          <div className="flex justify-between items-center w-full">
            <div className="text-2xl font-semibold tracking-tighter text-white uppercase">Points farming</div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-yellow-500/10 border border-yellow-500/20">
              <Zap className="h-3 w-3 text-yellow-500" />
              <span className="text-[11px] font-bold text-yellow-500 tabular-nums">
                <CountUp to={dbUser?.points || 0} separator="," />
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest px-1">
                <span className="opacity-40">Follow @frameonx</span>
                <span className="text-yellow-500">+50 XP</span>
              </div>
              {dbUser?.followedTwitter ? (
                <div className="w-full flex items-center justify-center gap-2 rounded-lg bg-white/5 border border-white/10 py-2.5 text-[9px] font-bold text-white/40 uppercase tracking-[0.2em]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-500/50" />
                  DATA VERIFIED
                </div>
              ) : followClicked ? (
                <button
                  disabled={verifying === "follow"}
                  onClick={handleFollowCheck}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-yellow-500 text-black py-2.5 text-[10px] font-bold uppercase tracking-[0.1em] hover:bg-yellow-400 transition-all shadow-[0_0_15px_rgba(234,179,8,0.2)] animate-pulse disabled:opacity-70 disabled:animate-none"
                >
                  {verifying === "follow" ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin" />
                      VERIFYING DATA...
                    </>
                  ) : (
                    "RESCAN STATUS"
                  )}
                </button>
              ) : (
                <button
                  onClick={handleFollow}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-white/5 border border-white/10 py-2.5 text-[10px] font-bold uppercase tracking-[0.15em] hover:bg-white/10 transition-all text-white/90"
                >
                  <Zap className="h-3 w-3 text-yellow-500" />
                  INITIATE FOLLOW
                </button>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest px-1">
                <div className="flex items-center gap-2">
                  <span className="opacity-40">Post Identity</span>
                  {/* <button
                    onClick={handlePreview}
                    className="flex items-center gap-1 text-yellow-500/60 hover:text-yellow-500 transition-colors"
                  >
                    <Eye className="h-3 w-3" />
                    <span>PREVIEW</span>
                  </button> */}
                </div>
                <span className="text-yellow-500">+100 XP</span>
              </div>
              {(!dbUser?.frameScore || dbUser?.frameScore === 0) ? (
                <button
                  disabled
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-black/40 border border-white/5 py-2.5 text-[10px] font-bold uppercase tracking-[0.15em] text-white/30 cursor-not-allowed"
                >
                  <Lock className="h-3 w-3" />
                  REQUIRES FRAME SCORE
                </button>
              ) : dbUser?.postedTweet ? (
                <div className="w-full flex items-center justify-center gap-2 rounded-lg bg-white/5 border border-white/10 py-2.5 text-[9px] font-bold text-white/40 uppercase tracking-[0.2em]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-500/50" />
                  TWEET VERIFIED
                </div>
              ) : postClicked ? (
                <button
                  disabled={verifying === "post"}
                  onClick={handlePostCheck}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-yellow-500 text-black py-2.5 text-[10px] font-bold uppercase tracking-[0.1em] hover:bg-yellow-400 transition-all shadow-[0_0_15px_rgba(234,179,8,0.2)] animate-pulse disabled:opacity-70 disabled:animate-none"
                >
                  {verifying === "post" ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin" />
                      VERIFYING DATA...
                    </>
                  ) : (
                    "CONFIRM TWEET"
                  )}
                </button>
              ) : (
                <button
                  onClick={handlePost}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-white/5 border border-white/10 py-2.5 text-[10px] font-bold uppercase tracking-[0.15em] hover:bg-white/10 transition-all text-white/90"
                >
                  <Sparkles className="h-3.5 w-3.5 text-yellow-500" />
                  SHARE YOUR SCORE
                </button>
              )}
            </div>
          </div>
        </div>
      </LiquidGlassCard>

      {/* Invite Link - Square */}
      <LiquidGlassCard
        draggable
        shadowIntensity="xs"
        glowIntensity="none"
        borderRadius="12px"
        blurIntensity="sm"
        className="p-5 text-white bg-black/40 border border-white/5"
      >
        <div className="relative z-30 flex flex-col items-start justify-between h-full w-full gap-4">
          <div className="flex justify-between items-center w-full">
            <div className="text-2xl font-semibold tracking-tighter text-white uppercase">Referrals</div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/5 border border-white/10">
              <Users className="h-3 w-3 text-white/40" />
              <span className="text-[11px] font-bold text-white/60 tabular-nums">
                <CountUp to={dbUser?._count?.referrals || 0} />
              </span>
            </div>
          </div>

          <div className="mt-3 space-y-3 w-full">
            {(!dbUser?.referrals || dbUser.referrals.length === 0) ? (
              <div className="text-[10px] opacity-30 italic py-2">No recruits found in registry...</div>
            ) : (
              <div className="flex flex-col gap-2">
                {dbUser.referrals.slice(0, 3).map((ref: any, i: number) => (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={i}
                    className="flex items-center gap-2 group/ref"
                  >
                    <div className="h-6 w-6 rounded-full bg-white/10 border border-white/5 overflow-hidden flex-shrink-0">
                      {ref.ethosAvatarUrl ? (
                        <img src={ref.ethosAvatarUrl} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-[8px] font-bold opacity-40 text-yellow-500">
                          {ref.twitterHandle?.[0].toUpperCase()}
                        </div>
                      )}
                    </div>
                    <span className="text-[11px] font-medium opacity-60 group-hover/ref:opacity-100 transition-opacity truncate">
                      @{ref.twitterHandle}
                    </span>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={onCopy}
            className="w-full inline-flex items-center justify-between gap-2 rounded-lg bg-white/5 border border-white/10 p-3 text-[11px] font-mono hover:bg-white/10 transition-all text-yellow-500"
          >
            <span className="truncate opacity-60 uppercase">{dbUser?.referralCode || "---"}</span>
            {copying ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4 opacity-40" />}
          </button>
        </div>
      </LiquidGlassCard>

      <ShareImageModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        user={dbUser}
      />
    </div>
  );
}

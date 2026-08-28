"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Zap, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { InfluencerData } from "./types";

export type { InfluencerData };

interface InfluencerCardProps {
  influencer: InfluencerData;
  index?: number;
  onSendOffer: (influencer: InfluencerData) => void;
}

function formatFollowers(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

function formatPrice(v: number): string {
  // TEMPORARILY OVERRIDDEN FOR VIDEO RECORDING:
  return "$$$";
  // return `$${v.toFixed(2)}`;
}

function MoniSmartBadge({ tier }: { tier: number }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium border",
        tier === 1 && "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
        tier === 2 && "bg-purple-500/10 text-purple-400 border-purple-500/30",
        tier >= 3 && "bg-blue-500/10 text-blue-400 border-blue-500/30"
      )}
    >
      <Zap className="w-2.5 h-2.5" />
      Moni Tier {tier}
    </span>
  );
}

function SorsaIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 34"
      className={cn("w-3.5 h-3.5 inline-block shrink-0", className)}
    >
      <defs>
        <linearGradient id="logo_svg__a" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="50%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
      </defs>
      <path
        fill="url(#logo_svg__a)"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M44.114 27.607c-6.224.424-11.386-4.492-11.386-10.595S37.494 6.386 43.353 6.386s11.021 5.16 10.595 11.384c-.365 5.221-4.584 9.472-9.837 9.834zm-27.051 0c-6.406.396-11.69-4.888-11.294-11.291.334-5.28 4.615-9.593 9.899-9.927a10.66 10.66 0 0 1 11.324 11.322c-.334 5.28-4.646 9.562-9.926 9.896zM44.235.682C38.892.41 34.064 2.686 30.905 6.42c-.547.637-1.55.637-2.063 0-3.065-3.613-7.65-5.859-12.75-5.766C7.225.805.03 8.12 0 16.984c0 2.824.699 5.494 1.974 7.801a2.25 2.25 0 0 1-.365 2.673l-.351.35a3.226 3.226 0 0 0 0 4.585 3.226 3.226 0 0 0 4.584 0l.444-.44c.699-.7 1.729-.851 2.61-.396a16.2 16.2 0 0 0 7.44 1.79c4.98 0 9.44-2.245 12.447-5.766.548-.637 1.55-.637 2.064 0 3.006 3.52 7.467 5.767 12.447 5.767 9.261 0 16.698-7.681 16.333-16.998C59.383 7.971 52.614 1.11 44.235.684z"
      />
    </svg>
  );
}

export function InfluencerCard({ influencer, index = 0, onSendOffer }: InfluencerCardProps) {
  const [imgError, setImgError] = useState(false);
  const {
    twitterHandle,
    displayName,
    avatarUrl,
    csScore,
    frameScore,
    waitlistRank,
    followerCount,
    isPremium,
    moniSmartTier,
    prices,
  } = influencer;

  const handle = twitterHandle ? `@${twitterHandle}` : "@unknown";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: (index % 12) * 0.04 }}
      className={cn(
        "group relative flex flex-col gap-0 rounded-2xl overflow-hidden",
        "bg-black/60 border border-white/[0.08] backdrop-blur-md",
        "hover:border-[#FFD507]/30 hover:bg-black/80 transition-all duration-300",
        "shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
      )}
    >
      {/* Corner decorators — waitlist identity style */}
      <div className="absolute top-3 left-3 w-2 h-2 border-t border-l border-yellow-500/30 z-10 pointer-events-none" />
      <div className="absolute top-3 right-3 w-2 h-2 border-t border-r border-yellow-500/30 z-10 pointer-events-none" />
      <div className="absolute bottom-3 left-3 w-2 h-2 border-b border-l border-yellow-500/30 z-10 pointer-events-none" />
      <div className="absolute bottom-3 right-3 w-2 h-2 border-b border-r border-yellow-500/30 z-10 pointer-events-none" />

      {/* Card body */}
      <div className="flex flex-col gap-3 p-4 flex-1">
        {/* Header: Avatar + Handle + Rank Badge */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className={cn(
              "w-11 h-11 rounded-full border overflow-hidden flex-shrink-0 flex items-center justify-center bg-neutral-900",
              "border-white/10 group-hover:border-yellow-500/40 transition-colors"
            )}>
              {avatarUrl && !imgError ? (
                <img
                  src={avatarUrl}
                  alt={handle}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                />
              ) : (
                <User className="w-5 h-5 text-white/30" />
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <a
                href={`https://x.com/${twitterHandle ?? ""}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-bold tracking-tight text-white truncate hover:text-yellow-400 transition-colors"
              >
                {displayName || handle}
              </a>
              {displayName && (
                <span className="text-[10px] text-white/30 truncate font-mono">
                  {handle}
                </span>
              )}
            </div>
          </div>

          {/* Header Top Right: Sorsa Score Link Button */}
          {twitterHandle ? (
            <a
              href={`https://app.sorsa.io/profile/${twitterHandle.replace(/^@/, "")}?utm_source=frameonx.xyz&utm_medium=marketplace&utm_campaign=influencers`}
              target="_blank"
              rel="noopener noreferrer"
              title="View profile on Sorsa.io"
              className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 hover:border-yellow-500/40 hover:bg-white/[0.08] transition-all group/sorsa shadow-sm"
            >
              <SorsaIcon className="w-3.5 h-3.5 transition-transform group-hover/sorsa:scale-110" />
              <span className="text-xs font-bold font-mono text-white group-hover/sorsa:text-yellow-400 transition-colors tabular-nums">
                {csScore.toLocaleString()}
              </span>
            </a>
          ) : (
            <div className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 shadow-sm">
              <SorsaIcon className="w-3.5 h-3.5" />
              <span className="text-xs font-bold font-mono text-white tabular-nums">
                {csScore.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* Metrics Row: Frame Score + Followers */}
        <div className="grid grid-cols-2 divide-x divide-white/5 rounded-xl bg-white/[0.03] border border-white/5 overflow-hidden">
          {/* Frame Score — Primary metric with OG Card aesthetics */}
          <div className="relative flex flex-col items-center justify-between py-2.5 px-2 h-[66px] bg-yellow-500/[0.06] border-r border-yellow-500/25 shadow-[inset_0_0_12px_rgba(255,213,7,0.06)]">
            {/* Tech Corner accents */}
            <div className="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l border-yellow-500/70 pointer-events-none" />
            <div className="absolute top-1 right-1 w-1.5 h-1.5 border-t border-r border-yellow-500/70 pointer-events-none" />
            <div className="absolute bottom-1 left-1 w-1.5 h-1.5 border-b border-l border-yellow-500/70 pointer-events-none" />
            <div className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r border-yellow-500/70 pointer-events-none" />

            <div className="my-auto">
              <span className="text-xl font-extrabold tabular-nums text-yellow-400 leading-none drop-shadow-[0_0_8px_rgba(255,213,7,0.4)]">
                {frameScore.toLocaleString()}
              </span>
            </div>
            <div className="px-1.5 py-[2px] bg-yellow-500 rounded-[2px] shadow-[0_2px_6px_rgba(0,0,0,0.5)]">
              <span className="text-[7.5px] uppercase tracking-[0.12em] text-black font-black font-mono block leading-none whitespace-nowrap">
                FRAME SCORE
              </span>
            </div>
          </div>

          {/* Followers */}
          <div className="flex flex-col items-center justify-between py-2.5 px-2 h-[66px]">
            <div className="my-auto">
              <span className="text-xl font-bold tabular-nums text-white leading-none">
                {formatFollowers(followerCount)}
              </span>
            </div>
            <span className="text-[8.5px] uppercase tracking-[0.12em] text-white/30 font-mono">
              Followers
            </span>
          </div>
        </div>

        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-1.5 min-h-[18px]">
          {/* TEMPORARILY HIDDEN: Moni Smart Tier Badge
          {isPremium && moniSmartTier !== null && (
            <MoniSmartBadge tier={moniSmartTier} />
          )} */}
          {/* TEMPORARILY HIDDEN FOR VIDEO RECORDING: ~estimated badge
          {prices.isEstimated && (
            <span className="px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/5 text-[9px] text-white/30 font-mono italic">
              ~estimated
            </span>
          )} */}
        </div>

        {/* Price grid 2×2 */}
        <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono">
          {[
            { label: "L+RT", val: prices.likeRt },
            { label: "Follow", val: prices.follow },
            { label: "Comment", val: prices.comment },
            { label: "Promo", val: prices.promoTweet },
          ].map((p) => (
            <div
              key={p.label}
              className="flex items-center justify-between rounded-lg bg-white/[0.03] border border-white/5 px-2.5 py-1.5 hover:border-yellow-500/20 hover:bg-white/[0.05] transition-colors"
            >
              <span className="text-white/40 text-[10px]">{p.label}</span>
              <span className="font-bold text-yellow-400">{formatPrice(p.val)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Button */}
      <button
        onClick={() => onSendOffer(influencer)}
        className={cn(
          "relative w-full flex items-center justify-center gap-2 py-3 px-4 overflow-hidden",
          "bg-gradient-to-r from-[#FFD507] via-[#FFB800] to-[#FF8C00]",
          "text-black text-[11px] font-bold uppercase tracking-[0.18em]",
          "transition-all duration-200 hover:brightness-110",
          "hover:shadow-[0_0_24px_rgba(255,213,7,0.4)] active:scale-[0.98]",
          // shimmer on hover
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/15 before:to-transparent",
          "before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-500"
        )}
      >
        <Zap className="w-3.5 h-3.5" />
        Send Offer
        <ChevronRight className="w-3.5 h-3.5 opacity-60" />
      </button>
    </motion.div>
  );
}

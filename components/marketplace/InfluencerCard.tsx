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
  return `$${v.toFixed(2)}`;
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
                {handle}
              </a>
              {displayName && (
                <span className="text-[10px] text-white/30 truncate font-mono">{displayName}</span>
              )}
            </div>
          </div>

          {/* System Rank Badge */}
          {waitlistRank && (
            <span className="flex-shrink-0 px-2 py-0.5 rounded bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 font-mono font-bold text-[10px] tabular-nums">
              #{waitlistRank}
            </span>
          )}
        </div>

        {/* Metrics Row: CS + Frame Score + Followers */}
        <div className="grid grid-cols-3 divide-x divide-white/5 rounded-xl bg-white/[0.03] border border-white/5 overflow-hidden">
          <div className="flex flex-col items-center py-2.5 px-1">
            <span className="text-lg font-bold tabular-nums text-yellow-400">
              {csScore.toLocaleString()}
            </span>
            <span className="text-[8px] uppercase tracking-[0.15em] text-white/30 mt-0.5 font-mono">
              CS
            </span>
          </div>
          <div className="flex flex-col items-center py-2.5 px-1">
            <span className="text-lg font-bold tabular-nums text-white">
              {frameScore.toLocaleString()}
            </span>
            <span className="text-[8px] uppercase tracking-[0.15em] text-white/30 mt-0.5 font-mono">
              FS ⚡
            </span>
          </div>
          <div className="flex flex-col items-center py-2.5 px-1">
            <span className="text-lg font-bold tabular-nums text-white">
              {formatFollowers(followerCount)}
            </span>
            <span className="text-[8px] uppercase tracking-[0.15em] text-white/30 mt-0.5 font-mono">
              Followers
            </span>
          </div>
        </div>

        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-1.5 min-h-[18px]">
          {isPremium && moniSmartTier !== null && (
            <MoniSmartBadge tier={moniSmartTier} />
          )}
          {prices.isEstimated && (
            <span className="text-[9px] text-white/20 font-mono italic">~estimated</span>
          )}
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
              className="flex items-center justify-between rounded-lg bg-white/[0.03] border border-white/5 px-2.5 py-1.5"
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

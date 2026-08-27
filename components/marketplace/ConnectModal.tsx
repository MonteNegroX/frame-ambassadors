"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePrivy } from "@privy-io/react-auth";
import type { InfluencerData } from "./types";

interface ConnectModalProps {
  influencer: InfluencerData | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ConnectModal({ influencer, isOpen, onClose }: ConnectModalProps) {
  const { login, authenticated } = usePrivy();

  if (!influencer) return null;

  const handle = influencer.twitterHandle ? `@${influencer.twitterHandle}` : "@unknown";

  const handleConnect = () => {
    login();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={cn(
              "fixed z-[201] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
              "w-full max-w-sm mx-4",
              "rounded-2xl bg-black/90 border border-white/10 backdrop-blur-2xl",
              "shadow-[0_0_80px_rgba(255,213,7,0.08)]"
            )}
          >
            {/* Corner decorators */}
            <div className="absolute top-3 left-3 w-2 h-2 border-t border-l border-yellow-500/30 pointer-events-none" />
            <div className="absolute top-3 right-3 w-2 h-2 border-t border-r border-yellow-500/30 pointer-events-none" />
            <div className="absolute bottom-3 left-3 w-2 h-2 border-b border-l border-yellow-500/30 pointer-events-none" />
            <div className="absolute bottom-3 right-3 w-2 h-2 border-b border-r border-yellow-500/30 pointer-events-none" />

            <div className="p-6 space-y-5">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/20 hover:text-white/60 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header */}
              <div className="space-y-1">
                <div className="text-[9px] uppercase tracking-[0.3em] font-mono text-white/30">
                  Send Offer to
                </div>
                <div className="text-lg font-bold tracking-tight text-yellow-400">{handle}</div>
                <div className="flex gap-2 flex-wrap">
                  <span className="text-[10px] font-mono text-white/30">
                    CS {influencer.csScore.toLocaleString()}
                  </span>
                  <span className="text-white/10">·</span>
                  <span className="text-[10px] font-mono text-white/30">
                    {(influencer.followerCount / 1000).toFixed(0)}K followers
                  </span>
                </div>
              </div>

              {/* Price preview */}
              <div className="rounded-xl bg-white/3 border border-white/5 p-3 grid grid-cols-2 gap-2">
                {[
                  { label: "Promo Tweet", val: influencer.prices.promoTweet },
                  { label: "L+RT", val: influencer.prices.likeRt },
                  { label: "Follow", val: influencer.prices.follow },
                  { label: "Comment", val: influencer.prices.comment },
                ].map((p) => (
                  <div key={p.label} className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-white/30">{p.label}</span>
                    <span className="text-yellow-400 font-bold">${p.val.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {!authenticated ? (
                <>
                  {/* Need to authenticate */}
                  <p className="text-[11px] text-white/40 leading-relaxed font-mono">
                    Connect your X account to send offers and invite creators to your campaigns.
                  </p>

                  <div className="space-y-2">
                    <button
                      onClick={handleConnect}
                      className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-[#FFD507] text-black py-3 text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-yellow-400 transition-all shadow-[0_0_20px_rgba(255,213,7,0.2)] active:scale-[0.98]"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                      Connect with X to Send Offer
                    </button>

                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-px bg-white/5" />
                      <span className="text-[9px] text-white/20 font-mono uppercase tracking-widest">or contact directly</span>
                      <div className="flex-1 h-px bg-white/5" />
                    </div>

                    <a
                      href={`https://x.com/${influencer.twitterHandle || ""}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 text-white/60 py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
                    >
                      <Twitter className="w-3.5 h-3.5" />
                      DM on X (Twitter)
                    </a>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-[11px] text-white/40 leading-relaxed font-mono">
                    You're connected. Campaign-based offers (escrow + on-chain payouts) are coming soon.
                    <br />
                    For now — DM the creator directly.
                  </p>

                  <div className="space-y-2">
                    <a
                      href={`https://x.com/${influencer.twitterHandle || ""}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#FFD507] text-black py-3 text-[11px] font-bold uppercase tracking-[0.12em] hover:bg-yellow-400 transition-all shadow-[0_0_20px_rgba(255,213,7,0.15)] active:scale-[0.98]"
                    >
                      <Send className="w-3.5 h-3.5" />
                      DM {handle} on X
                    </a>

                    <button
                      onClick={onClose}
                      className="w-full flex items-center justify-center rounded-xl bg-white/5 border border-white/8 text-white/30 py-2.5 text-[10px] font-mono hover:bg-white/10 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

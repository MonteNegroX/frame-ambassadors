"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, LogOut, ExternalLink, ShieldCheck } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";
import { LiquidGlassCard } from "./ui/liquid-glass";
import { useState } from "react";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user, logout } = usePrivy();
  const [copied, setCopied] = useState(false);

  const walletAddress = user?.wallet?.address;
  const twitterUsername = user?.twitter?.username;

  const handleCopyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLogout = async () => {
    onClose();
    await logout();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200000] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md pointer-events-auto"
          >
            <LiquidGlassCard
              blurIntensity="xl"
              borderRadius="24px"
              className="bg-black/40 border border-white/10 p-8"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <X className="h-4 w-4 text-white/60" />
              </button>

              {/* Header */}
              <div className="flex flex-col items-center text-center mb-8">
                <div className="h-20 w-20 rounded-full bg-[#FFD507]/20 border-2 border-[#FFD507] p-1 mb-4 relative">
                  <div className="h-full w-full rounded-full overflow-hidden bg-black flex items-center justify-center">
                    {user?.twitter?.profilePictureUrl ? (
                      <img src={user.twitter.profilePictureUrl} alt="Avatar" className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-2xl font-bold text-[#FFD507]">
                        {twitterUsername?.[0]?.toUpperCase() || "A"}
                      </span>
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-black border border-white/10 rounded-full p-1.5 ring-2 ring-black">
                    <ShieldCheck className="h-3 w-3 text-[#FFD507]" />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">@{twitterUsername || "Ambassador"}</h2>
                <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-mono mt-1">Ambassador Profile</p>
              </div>

              {/* Stats/Info Grid */}
              <div className="grid grid-cols-1 gap-4 mb-8">
                {/* Wallet Info */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Embedded Wallet</span>
                    {copied && <span className="text-[10px] text-[#FFD507] uppercase font-bold">Copied!</span>}
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <code className="text-[11px] text-white/80 font-mono truncate">
                      {walletAddress ? `${walletAddress.slice(0, 12)}...${walletAddress.slice(-10)}` : "Not Initialized"}
                    </code>
                    <button
                      onClick={handleCopyAddress}
                      className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-[#FFD507] hover:text-black transition-all"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Linked Accounts */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono block mb-3">Linked Accounts</span>
                  <div className="flex items-center gap-3 text-sm text-white/90">
                    <div className="h-8 w-8 rounded-lg bg-black flex items-center justify-center border border-white/10">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[12px] font-bold">Twitter / X</p>
                      <p className="text-[10px] text-white/40">Connected</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-3 bg-[#FFD507] text-black rounded-xl py-4 text-[12px] font-bold uppercase tracking-widest hover:bg-[#FFD507]/90 transition-all active:scale-[0.98] shadow-[0_0_30px_rgba(255,213,7,0.15)]"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </LiquidGlassCard>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

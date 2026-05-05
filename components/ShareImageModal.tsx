"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Share2, Check, Loader2 } from "lucide-react";
import { LiquidGlassCard } from "./ui/liquid-glass";
import { useState } from "react";

interface ShareImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

export function ShareImageModal({ isOpen, onClose, user }: ShareImageModalProps) {
  const [copied, setCopied] = useState(false);
  const [copying, setCopying] = useState(false);

  const twitterHandle = user?.twitterHandle || user?.twitter?.username;
  const imageUrl = `/api/og?ref=${twitterHandle}`;

  const handleCopyImage = async () => {
    try {
      setCopying(true);
      
      // Creating a ClipboardItem with a promise is the most compatible way 
      // for modern browsers to handle async fetching before copying
      const data = [
        new ClipboardItem({
          "image/png": fetch(imageUrl).then(response => {
            if (!response.ok) throw new Error("Failed to fetch image");
            return response.blob();
          })
        })
      ];

      await navigator.clipboard.write(data);
      
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Detailed copy error:", err);
      alert("Browser blocked clipboard access. Try right-clicking the image to copy/save.");
    } finally {
      setCopying(false);
    }
  };

  const handleTweet = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const refLink = `${origin}/?ref=${user?.referralCode || twitterHandle}`;
    const targetTweetUrl = "https://x.com/frameonx/status/2046266152662315460";
    
    // Custom text: Target tweet URL at the end often triggers a cleaner "Quote" UI on mobile/web
    const text = `just claimed my FRAME Score on @frameonx\nneural-verified influence, no bullshit metrics\n\nthink yours is higher? prove it: ${refLink}\n\n${targetTweetUrl}`;
    const intentUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(intentUrl, "_blank");
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
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl pointer-events-auto"
          >
            <LiquidGlassCard
              blurIntensity="xl"
              borderRadius="24px"
              className="bg-black/40 border border-white/10 p-6 sm:p-8"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors z-50"
              >
                <X className="h-4 w-4 text-white/60" />
              </button>

              {/* Header */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white tracking-tight">Your Identity Card</h2>
                <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-mono mt-1">Preview & Share transmission</p>
              </div>

              {/* Image Preview Container */}
              <div className="relative group mb-8 rounded-xl overflow-hidden border border-white/10 bg-black/40 aspect-[1.91/1] flex items-center justify-center shadow-2xl">
                <img 
                  src={imageUrl} 
                  alt="Identity Card" 
                  className="w-full h-full object-contain"
                />
                
                {/* Overlay Hint */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span className="text-[10px] text-white/60 uppercase tracking-widest font-mono">Verified Frame Data</span>
                </div>
              </div>

              {/* Actions Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={handleCopyImage}
                  disabled={copying}
                  className="flex items-center justify-center gap-3 bg-white/5 text-white border border-white/10 rounded-xl py-4 text-[12px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {copying ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  {copied ? "Image Copied!" : "Copy Image"}
                </button>

                <button
                  onClick={handleTweet}
                  className="flex items-center justify-center gap-3 bg-[#FFD507] text-black rounded-xl py-4 text-[12px] font-bold uppercase tracking-widest hover:bg-[#FFD507]/90 transition-all active:scale-[0.98] shadow-[0_0_30px_rgba(255,213,7,0.2)]"
                >
                  <Share2 className="h-4 w-4" />
                  Broadcast on X
                </button>
              </div>

              <p className="text-[9px] text-white/20 text-center uppercase tracking-widest mt-6 font-mono">
                Copy the image then paste it in your tweet for maximum impact
              </p>
            </LiquidGlassCard>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

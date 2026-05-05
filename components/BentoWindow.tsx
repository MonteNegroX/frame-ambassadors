"use client";

import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import { Noise } from "@/components/ui/noise";

interface BentoWindowProps {
  id: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

import { LiquidGlassCard } from "@/components/ui/liquid-glass";

const springTransition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

export function BentoWindow({
  id,
  title,
  isOpen,
  onClose,
  children,
}: BentoWindowProps) {
  const constraintsRef = useRef(null);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 md:p-12 pointer-events-none">
          {/* Backdrop blur/dim */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/20 backdrop-blur-md pointer-events-auto"
          />

          <LiquidGlassCard
            layoutId={id}
            transition={springTransition}
            draggable={true}
            className={cn(
              "relative w-full h-full max-h-[85vh] overflow-hidden pointer-events-auto flex flex-col",
              "max-w-4xl",
              "max-h-[100dvh] sm:max-h-[85vh]",
              "rounded-2xl sm:rounded-3xl md:rounded-[40px] bg-black/40 border-white/5",
              "will-change-transform"
            )}
            blurIntensity="xl"
            shadowIntensity="lg"
            glowIntensity="none"
            borderRadius="40px"
          >
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
              <Noise />
            </div>

            {/* Window Header / Drag Handle */}
            <div
              className="relative z-40 flex items-center justify-between px-3 py-3 sm:px-4 sm:py-4 md:px-6 md:py-4 border-b border-white/5 cursor-grab active:cursor-grabbing"
            >
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0">
                <div className="flex gap-1.5 sm:gap-2 shrink-0">
                  <button
                    onClick={onClose}
                    className="h-3.5 w-3.5 sm:h-4 sm:w-4 rounded-full bg-red-500/90 hover:bg-red-500 transition-colors flex items-center justify-center group"
                  >
                    <X className="h-2 w-2 sm:h-2.5 sm:2.5 text-white/90 opacity-70 group-hover:opacity-100 transition-opacity" />
                  </button>
                  <div className="h-3.5 w-3.5 sm:h-4 sm:w-4 rounded-full bg-amber-500/90" />
                  <div className="h-3.5 w-3.5 sm:h-4 sm:w-4 rounded-full bg-emerald-500/90" />
                </div>
                <span className="text-xs sm:text-sm font-semibold tracking-tight uppercase opacity-50 truncate">
                  {title}
                </span>
              </div>

              {/* Empty placeholder to balance the header if needed, but removing for now */}
            </div>

            {/* Window Content Container with permanent padding */}
            <div className="relative z-30 flex-1 p-4 sm:p-6 md:p-8 flex flex-col min-h-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {children}
                </motion.div>
              </div>
            </div>
          </LiquidGlassCard>
        </div>
      )}
    </AnimatePresence>
  );
}

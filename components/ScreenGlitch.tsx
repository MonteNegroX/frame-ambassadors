"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function ScreenGlitch({ isReady = false }: { isReady?: boolean }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isReady) {
      setShow(true);
      const timer = setTimeout(() => setShow(false), 800);
      return () => clearTimeout(timer);
    }
  }, [isReady]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: [0, 1, 0.8, 1, 0.5, 0],
          x: [0, -10, 10, -5, 5, 0],
          filter: [
            "hue-rotate(0deg) blur(0px)",
            "hue-rotate(90deg) blur(2px)",
            "hue-rotate(-90deg) blur(1px)",
            "hue-rotate(0deg) blur(0px)"
          ]
        }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="absolute inset-0 bg-yellow-500/10 mix-blend-overlay"
      />
      
      <motion.div
        initial={{ y: "-100%" }}
        animate={{ y: "100%" }}
        transition={{ duration: 0.4, repeat: 1 }}
        className="absolute inset-x-0 h-2 bg-white/20 shadow-[0_0_20px_rgba(255,255,255,0.5)]"
      />

    </div>
  );
}

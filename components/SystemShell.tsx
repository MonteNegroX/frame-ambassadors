"use client";

import { useSystem } from "@/components/providers/SystemProvider";
import { Nav } from "@/components/Nav";
import { WaitlistDock } from "@/components/WaitlistDock";
import { MobileNav } from "@/components/navigation/MobileNav";
import { BentoWindow } from "@/components/BentoWindow";
import { PublicLeaderboard } from "@/components/PublicLeaderboard";
import AnimatedGradient from "@/components/animated-gradient";
import { RecentSignups } from "@/components/RecentSignups";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export function SystemShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col relative overflow-x-hidden">
      {/* Persistent OS UI elements */}
      
      <WaitlistDock />
      <MobileNav />

      {/* Ultra-premium Animated Background */}
      <div className="fixed inset-0 z-0 overflow-hidden bg-black pointer-events-none">
        <AnimatedGradient
          config={{
            preset: "custom",
            color1: "#000000",
            color2: "#FFD507",
            color3: "#111111",
            rotation: -50,
            proportion: 1,
            scale: 0.2,
            speed: 10,
            swirl: 40,
            swirlIterations: 16,
            softness: 60,
            shape: "Checks",
            shapeSize: 45,
          }}
          noise={{
            opacity: 0.04,
            scale: 0.5
          }}
          className="opacity-60"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      </div>

      <main className="flex-1 relative z-10 pt-32 pb-24">
        {children}
        <footer className="mt-20 py-8 border-t border-white/5 text-center">
          <div className="flex justify-center gap-6 text-[10px] uppercase tracking-widest text-white/30 font-mono">
            <Link href="/terms" className="hover:text-yellow-500 transition-colors">Terms of Use</Link>
            <Link href="/privacy" className="hover:text-yellow-500 transition-colors">Privacy Policy</Link>
          </div>
        </footer>
      </main>

      <RecentSignups />

      {/* OS UI rendered last for highest layering priority */}
      <Nav />
    </div>
  );
}

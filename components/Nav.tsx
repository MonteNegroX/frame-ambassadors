"use client";

import { LiquidGlassCard } from "@/components/ui/liquid-glass";
import { Rocket, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { ProfileModal } from "./ProfileModal";

export function Nav() {
  const [time, setTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);
  const { login, authenticated, user } = usePrivy();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleAuth = () => {
    if (!authenticated) {
      login();
    } else {
      setIsProfileOpen(true);
    }
  };

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-full max-w-7xl px-4 sm:px-8 flex justify-center pointer-events-none">
        <LiquidGlassCard
          blurIntensity="lg"
          borderRadius="16px"
          shadowIntensity="sm"
          glowIntensity="none"
          className="w-fit flex items-center gap-3 sm:gap-6 py-2 px-3 sm:px-5 bg-black/60 border border-white/10 pointer-events-auto"
        >
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 group transition-all">
            <div className="h-8 w-8 rounded-lg overflow-hidden bg-white/10 flex items-center justify-center border border-white/10 group-hover:border-yellow-500/50 transition-colors">
              <img
                src="https://pbs.twimg.com/profile_images/2013212275671224320/t8HXPK64_400x400.jpg"
                alt="FRAME OS Logo"
                className="h-full w-full object-cover"
              />
            </div>
            <span className="text-base font-bold tracking-[0.25em] text-white uppercase">
              FRAME<span className="text-yellow-500">OS</span>
            </span>
          </Link>

          {/* Auth Action mimic UserPill */}
          <div className="flex items-center gap-3">
            <div className="h-6 w-[1px] bg-white/15" />
            <button
              onClick={handleAuth}
              className={`flex items-center gap-3 rounded-full px-3 py-2 transition-all active:scale-95 group border ${!authenticated
                  ? "bg-[#FFD507] border-[#FFD507] text-black shadow-[0_0_20px_rgba(255,213,7,0.2)] hover:bg-[#FFD507]/90"
                  : "bg-black/40 border-white/10 text-white hover:bg-white/5"
                }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`p-1 rounded-md transition-colors ${!authenticated ? "bg-black/10" : "bg-white/5"
                  }`}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </div>
                <span className="text-[12px] font-bold font-mono tracking-tight">
                  {!authenticated ? "Log in" : `@${user?.twitter?.username || "Account"}`}
                </span>
              </div>
            </button>
          </div>
        </LiquidGlassCard>
      </nav>

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </>
  );
}

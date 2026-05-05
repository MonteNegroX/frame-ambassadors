"use client";

import { useState, Suspense } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { WaitlistLoader } from "@/components/WaitlistLoader";
import { BentoLanding } from "@/components/BentoLanding";
import { useSystem } from "@/components/providers/SystemProvider";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

// Referral Capture Component
function ReferralTracker() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");

  useEffect(() => {
    if (ref) {
      // Set referral cookie for 7 days
      const expires = new Date();
      expires.setTime(expires.getTime() + (7 * 24 * 60 * 60 * 1000));
      document.cookie = `ref=${ref};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
    }
  }, [ref]);

  return null;
}

export function LandingContent() {
  const { globalStats } = useSystem();
  const [isBooting, setIsBooting] = useState(true);

  useEffect(() => {
    if (localStorage.getItem("frame-os-booted")) {
      setIsBooting(false);
    }
  }, []);

  return (
    <LayoutGroup>
      <Suspense fallback={null}>
        <ReferralTracker />
      </Suspense>

      <AnimatePresence>
        {isBooting && (
          <WaitlistLoader onComplete={() => {
            localStorage.setItem("frame-os-booted", "1");
            setIsBooting(false);
          }} />
        )}
      </AnimatePresence>

      <motion.div
        className="space-y-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isBooting ? 0 : 1, y: isBooting ? 20 : 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div id="landing-bento" className="w-full">
          <BentoLanding
            stats={globalStats}
          />
        </div>
      </motion.div>
    </LayoutGroup>
  );
}

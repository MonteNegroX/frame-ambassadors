"use client";

import { useEffect, useState } from "react";
import { getRecentUsersAction } from "@/lib/actions/user";
import { motion, AnimatePresence } from "framer-motion";
import { User, Bell, Radio, X } from "lucide-react";
import { LiquidGlassCard } from "./ui/liquid-glass";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase"; // Direct Supabase Client for Realtime

interface NotificationUser {
  id: string;
  twitterHandle: string | null;
  ethosAvatarUrl: string | null;
  createdAt: Date;
}

export function RecentSignups() {
  const [users, setUsers] = useState<NotificationUser[]>([]);

  const handleDismiss = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  useEffect(() => {
    // 1. Initial Fetch of last 3 users with a DELAY
    // This ensures they don't pop up immediately during the terminal boot
    const timer = setTimeout(() => {
      async function initialFetch() {
        const result = await getRecentUsersAction();
        if (result.success && result.users) {
          const formattedUsers = result.users.map((u: any) => ({
            ...u,
            createdAt: new Date(u.createdAt),
            ethosAvatarUrl: u.ethosAvatarUrl
          }));
          setUsers(formattedUsers);
        }
      }
      initialFetch();

      // 2. Realtime Subscription for NEW users starts ONLY after the delay
      const channel = supabase
        .channel('schema-db-changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'users'
          },
          (payload) => {
            const newUser = payload.new as any;
            const notificationUser: NotificationUser = {
              id: newUser.id,
              twitterHandle: newUser.twitter_handle || newUser.twitterHandle,
              ethosAvatarUrl: newUser.ethos_avatar_url || newUser.ethosAvatarUrl,
              createdAt: new Date(newUser.created_at || newUser.createdAt)
            };

            setUsers(prev => {
              const updated = [notificationUser, ...prev];
              return updated.slice(0, 3);
            });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }, 8000); // 8 second delay to match terminal progress

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {users.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, x: 50, scale: 0.9, y: 20 }}
            animate={{
              opacity: 1,
              x: 0,
              scale: 1 - (index * 0.04),
              y: -index * 10,
              zIndex: 100 - index
            }}
            exit={{ opacity: 0, scale: 0.8, x: 30, transition: { duration: 0.2 } }}
            layout
            className="pointer-events-auto origin-bottom-right group relative"
          >
            <LiquidGlassCard
              onClick={() => handleDismiss(user.id)}
              blurIntensity="md"
              borderRadius="12px"
              shadowIntensity="sm"
              glowIntensity="sm"
              className={cn(
                "w-[280px] p-3 flex items-center gap-3 bg-black/60 border border-white/10 shadow-2xl transition-all cursor-pointer hover:bg-white/5 active:scale-95",
                index === 0 ? "border-white/20" : "opacity-90"
              )}
            >
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-neutral-900 border border-white/5 flex items-center justify-center overflow-hidden shrink-0">
                  {user.ethosAvatarUrl ? (
                    <img
                      src={user.ethosAvatarUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-5 w-5 text-white/20" />
                  )}
                </div>
                <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-black animate-pulse" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-yellow-500/80">Joined</span>
                </div>
                <h4 className="text-sm font-bold text-white truncate">
                  @{user.twitterHandle || "anonymous"}
                </h4>
              </div>

              <div className="h-8 w-8 rounded-lg bg-red-500/5 group-hover:bg-red-500/10 flex items-center justify-center border border-red-500/10 transition-colors">
                <X className="h-3.5 w-3.5 text-red-500/70 group-hover:text-red-500" />
              </div>
            </LiquidGlassCard>
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        className="mr-2 flex flex-col items-end gap-0"
      >
        <div className="text-[8px] leading-[1.4] text-white/30 font-mono text-right uppercase tracking-[0.15em]">
          X and the X logo are trademarks of X Corp.<br />
          FRAME is not affiliated with X Corp.
        </div>
      </motion.div>
    </div>
  );
}

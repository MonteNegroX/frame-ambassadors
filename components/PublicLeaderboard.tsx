"use client";

import { useEffect, useState } from "react";
import { getLeaderboardAction } from "@/lib/actions/user";
import { Trophy, Medal, User, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

interface TopUser {
  id: string;
  twitterHandle: string | null;
  points: number;
  ethosAvatarUrl?: string | null;
  tweetId?: string | null;
  moniSmartTier?: number | null;
}

interface PublicLeaderboardProps {
  limit?: number;
}

export function PublicLeaderboard({ limit = 10 }: PublicLeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<TopUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = localStorage.getItem("frame-os-leaderboard");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.length > 0) {
          setLeaderboard(parsed);
          setLoading(false);
        }
      } catch {}
    }
    async function fetchLeaderboard() {
      const result = await getLeaderboardAction(limit);
      if (result.success && result.topUsers) {
        setLeaderboard(result.topUsers as TopUser[]);
        localStorage.setItem("frame-os-leaderboard", JSON.stringify(result.topUsers));
      } else {
        setLeaderboard([]);
        localStorage.removeItem("frame-os-leaderboard");
      }
      setLoading(false);
    }
    fetchLeaderboard();
  }, [limit]);

  if (loading) {
    return (
      <div className="w-full space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center py-4 px-6 animate-pulse border-b border-white/5">
            <div className="h-6 w-8 bg-white/5 rounded mr-4" />
            <div className="h-12 w-12 rounded-full bg-white/5 mr-4" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 bg-white/5 rounded" />
              <div className="h-4 w-20 bg-white/5 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden">
      {/* Header removed from here to match the example's 'clean list' feel inside the Bento container */}
      <ul className="divide-y divide-white/5">
        {leaderboard.length > 0 ? (
          leaderboard.map((user, index) => (
            <li
              key={user.id}
              className="flex items-center py-4 px-6 transition-all hover:bg-white/5 group"
            >
              {/* Rank */}
              <span className={cn(
                "text-lg font-bold mr-6 w-6 text-center tabular-nums",
                index === 0 ? "text-yellow-500" :
                  index === 1 ? "text-white/60" :
                    index === 2 ? "text-amber-700/80" :
                      "text-white/20"
              )}>
                {index + 1}.
              </span>

              {/* Avatar & Content Wrapper */}
              <a
                href={user.tweetId
                  ? `https://x.com/${user.twitterHandle || ""}/status/${user.tweetId}`
                  : `https://x.com/${user.twitterHandle || ""}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center flex-1 cursor-pointer group/link"
              >
                {/* Avatar */}
                <div className="relative mr-4">
                  <div className={cn(
                    "w-12 h-12 rounded-full border flex items-center justify-center overflow-hidden transition-all group-hover/link:border-yellow-500/80 bg-neutral-900 flex-shrink-0",
                    index === 0 ? "border-yellow-500/40 shadow-[0_0_15px_rgba(250,204,21,0.1)]" : "border-white/10"
                  )}>
                    {user.ethosAvatarUrl ? (
                      <img
                        src={user.ethosAvatarUrl}
                        alt={user.twitterHandle || "User"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-white/40 group-hover/link:text-yellow-500 transition-colors" />
                    )}
                  </div>
                  {index === 0 && (
                    <div className="absolute -top-2 -right-1 bg-yellow-500 rounded-full p-1 shadow-xl">
                      <Crown className="w-3 h-3 text-black" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className={cn(
                    "text-lg font-bold tracking-tight mb-0.5 transition-colors group-hover/link:text-yellow-500 truncate flex items-center gap-2",
                    index === 0 ? "text-yellow-400" : "text-white"
                  )}>
                    <span>@{user.twitterHandle || "Anonymous"}</span>
                    {user.moniSmartTier && user.moniSmartTier > 0 && user.moniSmartTier <= 3 && (
                      <span className="text-sm" title={`Moni Smart Tier ${user.moniSmartTier}`}>
                        {"🧠".repeat(4 - user.moniSmartTier)}
                      </span>
                    )}
                  </h3>
                  <p className="text-white/40 text-sm font-mono uppercase tracking-widest">
                    {user.points.toLocaleString()} <span className="opacity-50">XP</span>
                  </p>
                </div>
              </a>

              {/* Indicator */}
              <div className="hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="h-1.5 w-1.5 rounded-full bg-yellow-500/50 animate-pulse" />
              </div>
            </li>
          ))
        ) : (
          <li className="py-12 text-center text-white/40 font-mono text-sm uppercase tracking-widest bg-white/[0.02]">
            Registry Empty. Be the first to join.
          </li>
        )}
      </ul>
    </div>
  );
}

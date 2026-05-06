"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Trophy, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSolanaMobile } from "@/hooks/use-solana-mobile";

const navItems = [
  { name: "Home", href: "/", icon: LayoutDashboard },
  { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { name: "Share", href: "/dashboard", icon: Share2 },
];

export function MobileNav() {
  const pathname = usePathname();
  const { isMobile } = useSolanaMobile();

  if (!isMobile) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t border-border px-6 py-3 flex justify-between items-center sm:hidden">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 transition-colors",
              isActive ? "text-[#FFD507]" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}

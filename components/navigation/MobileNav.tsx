"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutDashboard, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Главная", href: "/", icon: Home },
  { name: "Дашборд", href: "/dashboard", icon: LayoutDashboard },
  { name: "Рейтинг", href: "/leaderboard", icon: Trophy },
  {
    name: "X",
    href: "https://x.com/frameonx",
    icon: () => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    external: true,
  },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-lg border-t border-white/10 px-2 py-3 flex justify-around items-center sm:hidden">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = !item.external && pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            target={item.external ? "_blank" : undefined}
            rel={item.external ? "noopener noreferrer" : undefined}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-colors min-w-[56px]",
              isActive
                ? "text-[#FFD507]"
                : "text-white/50 hover:text-white"
            )}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-wide">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}

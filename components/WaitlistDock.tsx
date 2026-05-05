"use client";

import React from "react";
import {
  IconHome,
  IconLayoutDashboard,
  IconTrophy,
  IconBrandX,
  IconLogout,
  IconUserPlus
} from "@tabler/icons-react";
import { usePrivy } from "@privy-io/react-auth";
import { usePathname } from "next/navigation";
import { FloatingDock } from "@/components/ui/floating-dock";
import { cn } from "@/lib/utils";

export function WaitlistDock() {
  const { login, logout, authenticated } = usePrivy();
  const pathname = usePathname();

  const links = [
    {
      title: "Home",
      icon: (
        <IconHome className={cn(
          "h-full w-full transition-colors",
          pathname === "/" ? "text-yellow-500" : "text-white"
        )} />
      ),
      href: "/",
    },
    {
      title: "Dashboard",
      icon: (
        <IconLayoutDashboard className={cn(
          "h-full w-full transition-colors",
          pathname === "/dashboard" ? "text-yellow-500" : "text-white"
        )} />
      ),
      href: authenticated ? "/dashboard" : undefined,
      onClick: !authenticated ? login : undefined,
    },
    {
      title: "Leaderboard",
      icon: (
        <IconTrophy className={cn(
          "h-full w-full transition-colors",
          pathname === "/leaderboard" ? "text-yellow-500" : "text-white"
        )} />
      ),
      href: "/leaderboard",
    },
    {
      title: "X (Twitter)",
      icon: (
        <IconBrandX className="h-full w-full text-white" />
      ),
      href: "https://x.com/frameonx",
    },
    {
      title: authenticated ? "Sign Out" : "Log In",
      icon: authenticated ? (
        <IconLogout className="h-full w-full text-white/50" />
      ) : (
        <IconUserPlus className="h-full w-full text-yellow-500" />
      ),
      onClick: authenticated ? logout : login,
    },
  ];

  return (
    <div className="fixed bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-[100] flex items-center justify-center w-full pointer-events-none">
      <div className="pointer-events-auto">
        <FloatingDock
          items={links}
        />
      </div>
    </div>
  );
}

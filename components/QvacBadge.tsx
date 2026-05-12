"use client";

export function QvacBadge() {
  return (
    <div className="flex items-center gap-1.5 text-[9px] text-white/20 font-mono tracking-wider">
      <span className="w-1.5 h-1.5 rounded-full bg-green-500/50 animate-pulse flex-shrink-0" />
      Verified locally by QVAC
    </div>
  );
}

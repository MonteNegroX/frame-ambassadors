"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, X, RotateCcw, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterState {
  search: string;
  minCs: string;
  maxCs: string;
  minFollowers: string;
  maxFollowers: string;
  sortBy: "sorsaScore" | "followers" | "points" | "createdAt";
  isPremium: boolean;
}

interface MarketplaceFiltersProps {
  filters: FilterState;
  total: number;
  onFilterChange: (filters: FilterState) => void;
  onApply: () => void;
  onReset: () => void;
  loading?: boolean;
}

const SORT_OPTIONS = [
  { value: "sorsaScore", label: "CS Score" },
  { value: "followers", label: "Followers" },
  { value: "points", label: "XP Points" },
  { value: "createdAt", label: "Newest" },
] as const;

export function MarketplaceFilters({
  filters,
  total,
  onFilterChange,
  onApply,
  onReset,
  loading,
}: MarketplaceFiltersProps) {
  const [expanded, setExpanded] = useState(false);

  const update = (key: keyof FilterState, value: any) =>
    onFilterChange({ ...filters, [key]: value });

  const inputCls =
    "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white/80 placeholder:text-white/20 focus:outline-none focus:border-yellow-500/40 transition-colors";

  return (
    <div className="w-full space-y-3">
      {/* Search + toggle row */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
          <input
            type="text"
            placeholder="Search @handle..."
            value={filters.search}
            onChange={(e) => update("search", e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onApply()}
            className={cn(inputCls, "pl-9")}
          />
          {filters.search && (
            <button
              onClick={() => update("search", "")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/60 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort select */}
        <div className="relative">
          <select
            value={filters.sortBy}
            onChange={(e) => update("sortBy", e.target.value)}
            className={cn(
              inputCls,
              "w-auto appearance-none pr-7 cursor-pointer min-w-[120px]"
            )}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} className="bg-zinc-950">
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-white/30 pointer-events-none" />
        </div>

        {/* Expand filters */}
        <button
          onClick={() => setExpanded(!expanded)}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-widest transition-all border",
            expanded
              ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-400"
              : "bg-white/5 border-white/10 text-white/50 hover:text-white/80"
          )}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Filters</span>
        </button>
      </div>

      {/* Expanded panel */}
      {expanded && (
        <div className="rounded-xl bg-black/40 border border-white/8 p-4 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* CS Range */}
            <div className="space-y-1.5">
              <label className="text-[9px] uppercase tracking-[0.2em] text-white/30 font-mono">CS Score</label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minCs}
                  onChange={(e) => update("minCs", e.target.value)}
                  className={inputCls}
                  min={0}
                />
                <span className="text-white/20 text-xs">—</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxCs}
                  onChange={(e) => update("maxCs", e.target.value)}
                  className={inputCls}
                  min={0}
                />
              </div>
            </div>

            {/* Followers Range */}
            <div className="space-y-1.5">
              <label className="text-[9px] uppercase tracking-[0.2em] text-white/30 font-mono">Followers</label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minFollowers}
                  onChange={(e) => update("minFollowers", e.target.value)}
                  className={inputCls}
                  min={0}
                />
                <span className="text-white/20 text-xs">—</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxFollowers}
                  onChange={(e) => update("maxFollowers", e.target.value)}
                  className={inputCls}
                  min={0}
                />
              </div>
            </div>

            {/* Moni Smart toggle */}
            <div className="space-y-1.5 flex flex-col justify-between">
              <label className="text-[9px] uppercase tracking-[0.2em] text-white/30 font-mono">Smart Only</label>
              <button
                onClick={() => update("isPremium", !filters.isPremium)}
                className={cn(
                  "w-full rounded-lg py-2 px-3 text-[10px] font-bold uppercase tracking-widest border transition-all",
                  filters.isPremium
                    ? "bg-purple-500/15 border-purple-500/30 text-purple-300"
                    : "bg-white/5 border-white/10 text-white/40 hover:text-white/70"
                )}
              >
                🧠 Moni Smart
              </button>
            </div>
          </div>

          {/* Action row */}
          <div className="flex items-center gap-2 pt-2 border-t border-white/5">
            <button
              onClick={onApply}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-yellow-500 text-black px-5 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-yellow-400 transition-all shadow-[0_0_15px_rgba(255,213,7,0.2)] disabled:opacity-50"
            >
              Apply
            </button>
            <button
              onClick={onReset}
              className="flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 text-white/50 px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:text-white/80 transition-all"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
            <span className="ml-auto text-[10px] font-mono text-white/20">
              {total.toLocaleString()} found
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

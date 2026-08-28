"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Users, ChevronLeft, ChevronRight } from "lucide-react";
import { MarketplaceFilters, FilterState } from "@/components/marketplace/MarketplaceFilters";
import { InfluencerCard } from "@/components/marketplace/InfluencerCard";
import { ConnectModal } from "@/components/marketplace/ConnectModal";
import type { InfluencerData } from "@/components/marketplace/types";
import { cn } from "@/lib/utils";

const DEFAULT_FILTERS: FilterState = {
  search: "",
  minCs: "",
  maxCs: "",
  minFollowers: "",
  maxFollowers: "",
  sortBy: "frameScore",
  isPremium: false,
};

function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-black/40 border border-white/5 overflow-hidden animate-pulse">
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-white/5" />
          <div className="space-y-1.5 flex-1">
            <div className="h-3.5 w-24 bg-white/5 rounded" />
            <div className="h-2.5 w-16 bg-white/5 rounded" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="h-12 rounded-xl bg-white/5" />
          <div className="h-12 rounded-xl bg-white/5" />
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-8 rounded-lg bg-white/5" />
          ))}
        </div>
      </div>
      <div className="h-11 bg-white/5" />
    </div>
  );
}

export default function InfluencersPage() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [influencers, setInfluencers] = useState<InfluencerData[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedInfluencer, setSelectedInfluencer] = useState<InfluencerData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  const LIMIT = 24;

  const buildQuery = useCallback(
    (f: FilterState, p: number) => {
      const params = new URLSearchParams();
      if (f.search) params.set("search", f.search);
      if (f.minCs) params.set("minCs", f.minCs);
      if (f.maxCs) params.set("maxCs", f.maxCs);
      if (f.minFollowers) params.set("minFollowers", f.minFollowers);
      if (f.maxFollowers) params.set("maxFollowers", f.maxFollowers);
      if (f.isPremium) params.set("isPremium", "true");
      params.set("sortBy", f.sortBy);
      params.set("page", String(p));
      params.set("limit", String(LIMIT));
      return `/api/influencers?${params.toString()}`;
    },
    []
  );

  const fetchInfluencers = useCallback(
    async (f: FilterState, p: number) => {
      setLoading(true);
      try {
        const res = await fetch(buildQuery(f, p));
        const data = await res.json();
        if (data.success) {
          setInfluencers(data.influencers);
          setTotal(data.pagination.total);
          setTotalPages(data.pagination.totalPages);
        }
      } catch (e) {
        console.error("Failed to fetch influencers", e);
      } finally {
        setLoading(false);
      }
    },
    [buildQuery]
  );

  // Initial load
  useEffect(() => {
    fetchInfluencers(DEFAULT_FILTERS, 1);
  }, [fetchInfluencers]);

  const handleApply = () => {
    setAppliedFilters(filters);
    setPage(1);
    fetchInfluencers(filters, 1);
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
    setPage(1);
    fetchInfluencers(DEFAULT_FILTERS, 1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchInfluencers(appliedFilters, newPage);
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendOffer = (influencer: InfluencerData) => {
    setSelectedInfluencer(influencer);
    setIsModalOpen(true);
  };

  return (
    <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pb-24" ref={topRef}>
      {/* Ambient Gold Glow Background */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-yellow-500/10 blur-[130px] rounded-full z-0" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-7xl mx-auto space-y-6 pt-4"
      >
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(234,179,8,0.1)]">
                <Users className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tighter uppercase">
                  Influencer{" "}
                  <span className="text-yellow-500">Market</span>
                </h1>
                <p className="text-[11px] text-white/30 font-mono uppercase tracking-[0.2em]">
                  Find creators for promotion
                  {!loading && (
                    <>
                      {" "}
                      <span className="text-yellow-500/60">{total.toLocaleString()}</span> available
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Live indicator */}
          <div className="flex items-center gap-2 text-[10px] font-mono text-white/20 uppercase tracking-widest">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Live
          </div>
        </div>

        {/* Filters */}
        <MarketplaceFilters
          filters={filters}
          total={total}
          onFilterChange={setFilters}
          onApply={handleApply}
          onReset={handleReset}
          loading={loading}
        />

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(12)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : influencers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {influencers.map((inf, i) => (
              <InfluencerCard
                key={inf.id}
                influencer={inf}
                index={i}
                onSendOffer={handleSendOffer}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
            <div className="text-4xl">🔍</div>
            <div className="text-sm font-mono text-white/30 uppercase tracking-widest">
              No influencers found
            </div>
            <button
              onClick={handleReset}
              className="text-[11px] font-bold text-yellow-500/60 hover:text-yellow-500 transition-colors uppercase tracking-widest font-mono"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && !loading && (
          <div className="flex items-center justify-center gap-3 pt-4">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className={cn(
                "flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-mono border transition-all",
                page === 1
                  ? "border-white/5 text-white/10 cursor-not-allowed"
                  : "border-white/10 text-white/50 hover:border-yellow-500/30 hover:text-yellow-400"
              )}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Prev
            </button>

            <div className="flex items-center gap-1">
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const pageNum =
                  totalPages <= 5
                    ? i + 1
                    : page <= 3
                    ? i + 1
                    : page >= totalPages - 2
                    ? totalPages - 4 + i
                    : page - 2 + i;

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={cn(
                      "w-8 h-8 rounded-lg text-xs font-mono transition-all",
                      pageNum === page
                        ? "bg-yellow-500 text-black font-bold"
                        : "text-white/30 hover:text-white/60 border border-white/8"
                    )}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className={cn(
                "flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-mono border transition-all",
                page === totalPages
                  ? "border-white/5 text-white/10 cursor-not-allowed"
                  : "border-white/10 text-white/50 hover:border-yellow-500/30 hover:text-yellow-400"
              )}
            >
              Next
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <span className="text-[10px] font-mono text-white/20 ml-2">
              {page} / {totalPages}
            </span>
          </div>
        )}
      </motion.div>

      {/* Modal */}
      <ConnectModal
        influencer={selectedInfluencer}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface MarkerHighlightProps {
  before?: string;
  highlight: string;
  after?: string;
  markerColor?: string;
  baseColor?: string;
  highlightedTextColor?: string;
  fontSize?: string | number;
  fontWeight?: string | number;
  speed?: number;
  className?: string;
}

export function MarkerHighlight({
  before = "",
  highlight,
  after = "",
  markerColor = "#facc15",
  baseColor = "#ffffff",
  highlightedTextColor = "#000000",
  fontSize,
  fontWeight,
  speed = 1,
  className,
}: MarkerHighlightProps) {
  return (
    <span
      className={cn(
        "relative inline-flex items-center whitespace-nowrap",
        className
      )}
      style={{
        fontSize,
        fontWeight,
        color: baseColor,
      }}
    >
      {before && <span>{before}</span>}
      <span className="relative inline-block px-1 ml-[-0.1em] mr-[-0.1em]">
        <motion.span
          aria-hidden
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.6 / speed,
            delay: 0.4,
            ease: [0.16, 1, 0.3, 1] as const,
          }}
          style={{
            position: "absolute",
            inset: "4px -0.2em",
            background: markerColor,
            transformOrigin: "left center",
            zIndex: 0,
            borderRadius: "2px",
          }}
        />
        <motion.span
          initial={{ color: baseColor }}
          whileInView={{ color: highlightedTextColor }}
          viewport={{ once: true }}
          transition={{
            duration: 0.2,
            delay: 0.6 / speed,
          }}
          style={{ position: "relative", zIndex: 1 }}
        >
          {highlight}
        </motion.span>
      </span>
      {after && <span>{after}</span>}
    </span>
  );
}

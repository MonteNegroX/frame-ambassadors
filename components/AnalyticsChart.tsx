"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function AnalyticsChart({ 
  height = 100, 
  dataPoints = 20, 
  color = "#facc15" 
}: { 
  height?: number, 
  dataPoints?: number, 
  color?: string 
}) {
  const [points, setPoints] = useState<number[]>([]);

  useEffect(() => {
    // Generate some random points for the alpha look
    const newPoints = Array.from({ length: dataPoints }, () => Math.random() * 100);
    setPoints(newPoints);
  }, [dataPoints]);

  if (points.length === 0) return null;

  const width = 100 / (dataPoints - 1);
  const pathData = points.reduce((acc, p, i) => {
    const x = i * width;
    const y = 100 - p;
    return acc + `${i === 0 ? "M" : "L"}${x},${y}`;
  }, "");

  const areaData = pathData + `L100,100L0,100Z`;

  return (
    <div className="relative w-full overflow-hidden" style={{ height }}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="h-full w-full"
      >
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        <motion.path
          d={areaData}
          fill="url(#gradient)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />

        <motion.path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />

        {/* Scanning Line Animation */}
        <motion.rect
          x="0"
          y="0"
          width="1"
          height="100"
          fill={color}
          initial={{ x: "-10%" }}
          animate={{ x: "110%" }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="opacity-50 blur-[2px]"
        />
      </svg>
      
      {/* Glitch Overlay */}
      <div className="absolute inset-0 bg-neutral-900/5 mix-blend-overlay pointer-events-none" />
    </div>
  );
}

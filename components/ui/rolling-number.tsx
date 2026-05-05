"use client";

import { useEffect, useRef } from "react";
import { useMotionValue, useSpring, useTransform, motion } from "framer-motion";

interface RollingNumberProps {
  value: number;
  precision?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export function RollingNumber({
  value,
  precision = 0,
  suffix = "",
  prefix = "",
  className = "",
}: RollingNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 100,
  });

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${latest.toFixed(precision)}${suffix}`;
      }
    });
  }, [springValue, precision, prefix, suffix]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toFixed(precision)}
      {suffix}
    </span>
  );
}

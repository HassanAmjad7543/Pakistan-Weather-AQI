"use client";

import { useEffect, useRef } from "react";
import { animate, useReducedMotion } from "framer-motion";

interface CountUpProps {
  value: number;
  decimals?: number;
  className?: string;
}

/** Counts from 0 to `value` in 300ms. Server HTML already contains the final value. */
export function CountUp({ value, decimals = 0, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const format = (v: number) => {
    const s = v.toFixed(decimals);
    return s === "-0" ? "0" : s;
  };

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (reduce) {
      node.textContent = format(value);
      return;
    }
    const controls = animate(0, value, {
      duration: 0.3,
      ease: "easeOut",
      onUpdate: (v) => {
        node.textContent = format(v);
      },
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, decimals, reduce]);

  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  );
}

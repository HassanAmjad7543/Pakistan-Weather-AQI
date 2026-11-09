"use client";

import { useEffect, useRef } from "react";
import { animate, useReducedMotion } from "framer-motion";

interface CountUpProps {
  value: number;
  decimals?: number;
  className?: string;
}

/**
 * Counts up to `value` in 300ms: from 0 on first render, then from the previous
 * value when live data arrives. Server HTML already contains the final value.
 */
export function CountUp({ value, decimals = 0, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const from = useRef(0);
  const format = (v: number) => {
    const s = v.toFixed(decimals);
    return s === "-0" ? "0" : s;
  };

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const start = from.current;
    from.current = value;
    if (reduce || start === value) {
      node.textContent = format(value);
      return;
    }
    const controls = animate(start, value, {
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

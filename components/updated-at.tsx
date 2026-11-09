"use client";

import { useEffect, useState } from "react";
import { formatPkt, relativeTime } from "@/lib/time";
import { cn } from "@/lib/utils";

const MINUTE = 60 * 1000;

/**
 * Freshness tiers. The cache refreshes every 15 minutes, so data is normally
 * 0–15 minutes old; red means at least one scheduled refresh was missed.
 */
const TIERS = [
  { maxAge: 10 * MINUTE, dot: "bg-green-500", pulse: true, note: null },
  { maxAge: 20 * MINUTE, dot: "bg-yellow-500", pulse: false, note: null },
  { maxAge: Infinity, dot: "bg-red-500", pulse: false, note: "refresh overdue" },
] as const;

export function UpdatedAt({ iso, className }: { iso: string; className?: string }) {
  // Server render shows the absolute time; the client swaps in a live relative time.
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 15_000);
    return () => clearInterval(id);
  }, []);

  // Before hydration the age is unknown, so the dot stays neutral.
  const tier = now === null ? null : TIERS.find((t) => now - new Date(iso).getTime() <= t.maxAge)!;

  return (
    <p className={cn("flex items-center gap-2 text-sm text-muted-foreground", className)}>
      <span className="relative flex size-2" aria-hidden>
        {tier?.pulse && <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-500 opacity-60" />}
        <span className={cn("relative inline-flex size-2 rounded-full transition-colors", tier?.dot ?? "bg-muted-foreground/40")} />
      </span>
      <span>
        Last updated{" "}
        <time dateTime={iso} title={formatPkt(iso)} className="font-mono text-foreground/80">
          {now === null ? formatPkt(iso) : relativeTime(iso, now)}
        </time>
        {tier?.note && <span className="text-red-600 dark:text-red-400"> · {tier.note}</span>}
      </span>
    </p>
  );
}

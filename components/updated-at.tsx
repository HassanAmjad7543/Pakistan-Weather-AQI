"use client";

import { useEffect, useState } from "react";
import { formatPkt, relativeTime } from "@/lib/time";
import { cn } from "@/lib/utils";

/** Data older than this means the cron has stopped firing. */
const STALE_AFTER_MS = 90 * 60 * 1000;

export function UpdatedAt({ iso, className }: { iso: string; className?: string }) {
  // Server render shows the absolute time; the client swaps in a live relative time.
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  const stale = now !== null && now - new Date(iso).getTime() > STALE_AFTER_MS;

  return (
    <p className={cn("flex items-center gap-2 text-sm text-muted-foreground", className)}>
      <span className="relative flex size-2">
        {!stale && <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-500 opacity-60" />}
        <span className={cn("relative inline-flex size-2 rounded-full", stale ? "bg-yellow-500" : "bg-green-500")} />
      </span>
      <span>
        Last updated{" "}
        <time dateTime={iso} title={formatPkt(iso)} className="font-mono text-foreground/80">
          {now === null ? formatPkt(iso) : relativeTime(iso, now)}
        </time>
        {stale && <span className="text-yellow-600 dark:text-yellow-400"> · data may be stale</span>}
      </span>
    </p>
  );
}

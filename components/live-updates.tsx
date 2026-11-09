"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { REFRESH_CHANNEL, REFRESH_EVENT } from "@/lib/realtime-config";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** If the tab comes back and the data is older than this, pull a fresh copy. */
const STALE_ON_RETURN_MS = 16 * 60 * 1000;
/** A refetch can race the cache rebuild; retry a few times until the new snapshot shows up. */
const RETRY_DELAYS_MS = [4000, 8000, 15000];

/**
 * Keeps the page in sync with the cache without a reload. The refresh route
 * broadcasts on a Supabase Realtime channel once new data is live; this
 * component then re-renders the server components in place (router.refresh),
 * so scroll position, search text and theme are all kept.
 */
export function LiveUpdates({ updatedAt }: { updatedAt: string }) {
  const router = useRouter();
  const [notice, setNotice] = useState(false);

  // Read the latest props from inside long-lived callbacks.
  const current = useRef(normalise(updatedAt));
  const target = useRef<string | null>(null);
  const retries = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearRetries = () => {
    retries.current.forEach(clearTimeout);
    retries.current = [];
  };

  // Called whenever the server sends a new snapshot down.
  useEffect(() => {
    const iso = normalise(updatedAt);
    const changed = current.current !== iso;
    current.current = iso;
    if (!changed) return;
    if (target.current && iso >= target.current) {
      target.current = null;
      clearRetries();
    }
    setNotice(true);
    const id = setTimeout(() => setNotice(false), 4000);
    return () => clearTimeout(id);
  }, [updatedAt]);

  useEffect(() => {
    const pull = (newer: string) => {
      if (newer <= current.current) return;
      target.current = newer;
      clearRetries();
      router.refresh();
      retries.current = RETRY_DELAYS_MS.map((delay) =>
        setTimeout(() => {
          if (target.current && current.current < target.current) router.refresh();
        }, delay),
      );
    };

    const onVisible = () => {
      if (document.visibilityState !== "visible") return;
      if (Date.now() - new Date(current.current).getTime() > STALE_ON_RETURN_MS) router.refresh();
    };
    document.addEventListener("visibilitychange", onVisible);

    // Load the Supabase client after the page is interactive; it isn't needed for first paint.
    let cancelled = false;
    let unsubscribe: (() => void) | undefined;
    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      import("@supabase/supabase-js").then(({ createClient }) => {
        if (cancelled) return;
        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
          auth: { persistSession: false, autoRefreshToken: false },
        });
        const channel = supabase
          .channel(REFRESH_CHANNEL)
          .on("broadcast", { event: REFRESH_EVENT }, ({ payload }) => {
            const newer = (payload as { updated_at?: unknown } | undefined)?.updated_at;
            if (typeof newer === "string") pull(normalise(newer));
          })
          .subscribe();
        unsubscribe = () => void supabase.removeChannel(channel);
      });
    }

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisible);
      clearRetries();
      unsubscribe?.();
    };
  }, [router]);

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <AnimatePresence>
        {notice && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2 rounded-full border border-border bg-card/95 px-4 py-2 text-sm shadow-lg backdrop-blur"
          >
            <span className="size-2 rounded-full bg-green-500" aria-hidden />
            Live data updated
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Compare timestamps as UTC ISO strings, whatever format Postgres or JS produced them in. */
function normalise(iso: string): string {
  const t = new Date(iso).getTime();
  return Number.isNaN(t) ? iso : new Date(t).toISOString();
}

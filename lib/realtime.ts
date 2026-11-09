import "server-only";
import { REFRESH_CHANNEL, REFRESH_EVENT } from "@/lib/realtime-config";

/**
 * Tells every open browser that fresh data is live, via Realtime's REST
 * broadcast endpoint. Called after the pages are revalidated, so a client that
 * refetches straight away gets the new snapshot. Never throws: live updates
 * are a nice-to-have and must not fail the cron run.
 */
export async function broadcastRefresh(updatedAt: string): Promise<boolean> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return false;

  try {
    const res = await fetch(`${url}/realtime/v1/api/broadcast`, {
      method: "POST",
      headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ topic: REFRESH_CHANNEL, event: REFRESH_EVENT, payload: { updated_at: updatedAt }, private: false }],
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) console.error("[refresh] broadcast failed:", res.status, await res.text());
    return res.ok;
  } catch (error) {
    console.error("[refresh] broadcast failed:", error instanceof Error ? error.message : error);
    return false;
  }
}

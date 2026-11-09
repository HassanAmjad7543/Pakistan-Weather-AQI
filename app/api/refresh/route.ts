import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { saveCityData } from "@/lib/data";
import { fetchAllCityData } from "@/lib/fetchers";
import { broadcastRefresh } from "@/lib/realtime";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

/**
 * Cron endpoint. Fetches every city from Open-Meteo and upserts into the cache.
 * Requires `Authorization: Bearer ${CRON_SECRET}` (Vercel Cron sends this
 * automatically; configure it as a header on cron-job.org).
 */
async function handler(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ ok: false, error: "CRON_SECRET is not set" }, { status: 500 });
  }
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const started = Date.now();
  try {
    const rows = await fetchAllCityData();
    await saveCityData(rows);

    // Rebuild cached pages now instead of waiting for the 5-minute ISR window.
    revalidatePath("/");
    for (const row of rows) revalidatePath(`/city/${row.slug}`);

    // Then tell open browsers to pull the new snapshot (no reload needed).
    const updatedAt = rows[0]?.updated_at;
    const broadcast = updatedAt ? await broadcastRefresh(updatedAt) : false;

    return NextResponse.json({
      ok: true,
      cities: rows.length,
      updated_at: updatedAt,
      broadcast,
      duration_ms: Date.now() - started,
    });
  } catch (error) {
    // Nothing was written, so the site keeps serving the last good data.
    const message = error instanceof Error ? error.message : String(error);
    console.error("[refresh] failed:", message);
    return NextResponse.json({ ok: false, error: message }, { status: 502 });
  }
}

export { handler as GET, handler as POST };

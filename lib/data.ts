import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { CITIES, type CitySlug } from "@/lib/cities";
import { getReadClient, getWriteClient, isSupabaseConfigured } from "@/lib/supabase";
import type { CityDataRow } from "@/types";

/**
 * Cache access. In production this is the Supabase `city_data` table.
 *
 * For local development without a Supabase project, rows are kept in
 * `.data/city_data.json` instead, so `pnpm dev` + one call to /api/refresh
 * gives a fully working dashboard. Either way, pages only ever read the cache.
 */

const LOCAL_FILE = path.join(process.cwd(), ".data", "city_data.json");
const COLUMNS = "slug, city_name, weather, air_quality, forecast, updated_at";

function sortByCityOrder(rows: CityDataRow[]): CityDataRow[] {
  const order = new Map<string, number>(CITIES.map((c, i) => [c.slug, i]));
  return rows
    .filter((r) => order.has(r.slug))
    .sort((a, b) => order.get(a.slug)! - order.get(b.slug)!);
}

async function readLocal(): Promise<CityDataRow[]> {
  try {
    return JSON.parse(await fs.readFile(LOCAL_FILE, "utf8")) as CityDataRow[];
  } catch {
    return [];
  }
}

export async function getAllCityData(): Promise<CityDataRow[]> {
  if (!isSupabaseConfigured()) return sortByCityOrder(await readLocal());

  const { data, error } = await getReadClient().from("city_data").select(COLUMNS);
  if (error) {
    console.error("[data] failed to read city_data:", error.message);
    return [];
  }
  return sortByCityOrder((data ?? []) as CityDataRow[]);
}

export async function getCityData(slug: CitySlug): Promise<CityDataRow | null> {
  if (!isSupabaseConfigured()) return (await readLocal()).find((r) => r.slug === slug) ?? null;

  const { data, error } = await getReadClient()
    .from("city_data")
    .select(COLUMNS)
    .eq("slug", slug)
    .maybeSingle();
  if (error) {
    console.error(`[data] failed to read ${slug}:`, error.message);
    return null;
  }
  return (data as CityDataRow | null) ?? null;
}

export async function saveCityData(rows: CityDataRow[]): Promise<void> {
  if (!isSupabaseConfigured()) {
    if (process.env.VERCEL) {
      throw new Error("Supabase env vars are missing — the local file cache does not work on Vercel");
    }
    await fs.mkdir(path.dirname(LOCAL_FILE), { recursive: true });
    await fs.writeFile(LOCAL_FILE, JSON.stringify(rows));
    return;
  }

  const { error } = await getWriteClient().from("city_data").upsert(rows, { onConflict: "slug" });
  if (error) throw new Error(`Supabase upsert failed: ${error.message}`);
}

/** Most recent refresh across all rows. */
export function latestUpdate(rows: CityDataRow[]): string | null {
  return rows.reduce<string | null>((max, r) => (!max || r.updated_at > max ? r.updated_at : max), null);
}

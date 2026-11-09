import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function isSupabaseConfigured(): boolean {
  return Boolean(url && anonKey && serviceRoleKey);
}

const options = {
  auth: { persistSession: false, autoRefreshToken: false },
  // Page freshness is handled by ISR (revalidate) — never let Next's fetch cache pin a stale row.
  global: { fetch: (input: RequestInfo | URL, init?: RequestInit) => fetch(input, { ...init, cache: "no-store" }) },
} as const;

let readClient: SupabaseClient | undefined;
let writeClient: SupabaseClient | undefined;

/** Read-only client (anon key; RLS allows SELECT on city_data). */
export function getReadClient(): SupabaseClient {
  if (!url || !anonKey) throw new Error("Supabase is not configured");
  readClient ??= createClient(url, anonKey, options);
  return readClient;
}

/** Privileged client (service role key). Server-only — used by /api/refresh to upsert. */
export function getWriteClient(): SupabaseClient {
  if (!url || !serviceRoleKey) throw new Error("Supabase is not configured");
  writeClient ??= createClient(url, serviceRoleKey, options);
  return writeClient;
}

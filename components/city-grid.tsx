"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CityCard } from "@/components/city-card";
import { SearchBar } from "@/components/search-bar";
import { CITIES } from "@/lib/cities";
import type { CityDataRow } from "@/types";

export function CityGrid({ rows }: { rows: CityDataRow[] }) {
  const [query, setQuery] = useState("");
  const bySlug = useMemo(() => new Map(rows.map((r) => [r.slug, r])), [rows]);

  const q = query.trim().toLowerCase();
  const cities = q
    ? CITIES.filter((c) => c.name.toLowerCase().includes(q) || c.province.toLowerCase().includes(q))
    : CITIES;

  return (
    <div className="flex flex-col gap-6">
      <SearchBar value={query} onChange={setQuery} />

      {cities.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">
          No city matches “{query}”. Eleven cities are tracked — try Lahore, Karachi or Peshawar.
        </p>
      ) : (
        <motion.ul layout className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          <AnimatePresence initial={false} mode="popLayout">
            {cities.map((city) => (
              <motion.li
                key={city.slug}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.15 }}
              >
                <CityCard city={city} data={bySlug.get(city.slug)} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </div>
  );
}

import { AqiLegend } from "@/components/aqi-legend";
import { CityGrid } from "@/components/city-grid";
import { EmptyState } from "@/components/empty-state";
import { SiteHeader } from "@/components/site-header";
import { UpdatedAt } from "@/components/updated-at";
import { getAllCityData, latestUpdate } from "@/lib/data";

export const revalidate = 300;

export default async function HomePage() {
  const rows = await getAllCityData();
  const updatedAt = latestUpdate(rows);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-12 px-4 pb-16 pt-12 sm:px-6 sm:pt-20">
        <div className="flex flex-col gap-4">
          <h1 className="max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
            Real-time weather and air quality across Pakistan&apos;s major cities.
          </h1>
          {updatedAt && <UpdatedAt iso={updatedAt} />}
        </div>

        {rows.length === 0 ? (
          <EmptyState title="No data yet">
            The cache is empty. Call <code className="font-mono text-foreground">/api/refresh</code> with your{" "}
            <code className="font-mono text-foreground">CRON_SECRET</code> to load the first snapshot.
          </EmptyState>
        ) : (
          <CityGrid rows={rows} />
        )}

        <AqiLegend />
      </main>
    </>
  );
}

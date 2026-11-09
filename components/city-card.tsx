import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AqiBadge } from "@/components/aqi-badge";
import { CountUp } from "@/components/count-up";
import { getAqiCategory } from "@/lib/aqi";
import type { City } from "@/lib/cities";
import { getConditions } from "@/lib/weather";
import type { CityDataRow } from "@/types";

interface CityCardProps {
  city: City;
  data: CityDataRow | undefined;
}

export function CityCard({ city, data }: CityCardProps) {
  const aqi = data?.air_quality.current.us_aqi ?? null;
  const glow = aqi != null ? getAqiCategory(aqi).hex : "#3b82f6";
  const conditions = data
    ? getConditions(data.weather.weather_code, data.weather.is_day === 1, data.air_quality.current.pm2_5)
    : null;
  const Icon = conditions?.icon;

  return (
    <Link
      href={`/city/${city.slug}`}
      style={{ "--glow": `${glow}66` } as React.CSSProperties}
      className="group relative flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-150 ease-out hover:-translate-y-0.5 hover:scale-[1.02] hover:border-[var(--glow)] hover:shadow-[0_12px_40px_-16px_var(--glow)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:p-6 dark:shadow-none"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold tracking-tight">{city.name}</h2>
          <p className="text-sm text-foreground/75">{city.province}</p>
        </div>
        {Icon && (
          <div className="flex flex-col items-end gap-1 text-muted-foreground">
            <Icon className="size-10 text-foreground/85" strokeWidth={1.4} aria-hidden />
            <span className="text-xs">{conditions.label}</span>
          </div>
        )}
      </div>

      <div className="font-mono text-5xl font-medium tracking-tighter">
        {data ? (
          <>
            <CountUp value={Math.round(data.weather.temperature_2m)} />
            <span className="ml-0.5 font-sans font-normal text-muted-foreground">°C</span>
          </>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </div>

      <div className="flex items-center justify-between gap-3">
        <AqiBadge aqi={aqi} compact />
        <span className="flex items-center gap-1 text-xs text-muted-foreground opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-100">
          View details
          <ArrowUpRight className="size-3.5" />
        </span>
      </div>
    </Link>
  );
}

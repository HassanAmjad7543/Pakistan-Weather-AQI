import { AlertTriangle } from "lucide-react";
import { CountUp } from "@/components/count-up";
import { Section } from "@/components/section";
import { getAqiCategory, POLLUTANTS } from "@/lib/aqi";
import { cn } from "@/lib/utils";
import type { AirQualityCurrent } from "@/types";

/** WHO 2021 air quality guideline: 24-hour mean PM2.5. */
const WHO_PM25_24H = 15;

export function AqiBreakdown({ current }: { current: AirQualityCurrent }) {
  const aqi = current.us_aqi;
  const cat = aqi != null ? getAqiCategory(aqi) : null;
  const whoMultiple = current.pm2_5 != null ? current.pm2_5 / WHO_PM25_24H : null;

  return (
    <Section title="Air quality" aside="US AQI · µg/m³">
      <div
        className={cn("relative overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-8", cat && "aqi-panel")}
        style={cat ? ({ "--aqi": cat.hex } as React.CSSProperties) : undefined}
      >
        {cat && <div aria-hidden className="absolute inset-y-0 left-0 w-1 bg-[var(--aqi)]" />}
        <div className="relative flex flex-col gap-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-6">
            <p className={cn("font-mono text-7xl font-medium leading-none tracking-tighter", cat?.text)}>
              {aqi != null ? <CountUp value={Math.round(aqi)} /> : "—"}
            </p>
            {cat && (
              <div className="flex flex-col gap-1 pb-1">
                <p className="flex items-center gap-2 text-lg font-semibold uppercase tracking-wide">
                  {aqi! > 100 && <AlertTriangle className={cn("size-5", cat.text)} aria-hidden />}
                  {cat.label}
                </p>
                <p className="text-sm text-muted-foreground">{cat.description}</p>
              </div>
            )}
          </div>

          {whoMultiple != null && whoMultiple >= 1.5 && (
            <p className="text-sm text-muted-foreground">
              PM2.5 is{" "}
              <span className="font-mono font-medium text-foreground">{whoMultiple.toFixed(1)}×</span> the WHO
              24-hour guideline ({WHO_PM25_24H} µg/m³).
            </p>
          )}

          <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-6">
            {POLLUTANTS.map((p) => {
              const value = current[p.key];
              return (
                <div key={p.key} className="flex flex-col gap-1 bg-card p-3 sm:p-4" title={p.name}>
                  <dt className="text-xs font-medium text-muted-foreground">{p.label}</dt>
                  <dd className="font-mono text-lg sm:text-xl">{value != null ? Math.round(value) : "—"}</dd>
                </div>
              );
            })}
          </dl>
        </div>
      </div>
    </Section>
  );
}

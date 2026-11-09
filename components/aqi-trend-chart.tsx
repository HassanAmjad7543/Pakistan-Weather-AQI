"use client";

import { Area, AreaChart, CartesianGrid, ReferenceArea, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartTooltip } from "@/components/chart-tooltip";
import { Section } from "@/components/section";
import { AQI_SCALE, getAqiCategory } from "@/lib/aqi";
import { formatHour, karachiHourKey } from "@/lib/time";
import type { AirQualityHourly } from "@/types";

const HOURS = 24;

export function AqiTrendChart({ hourly, now }: { hourly: AirQualityHourly; now: string }) {
  const nowKey = karachiHourKey(new Date(now));
  let end = hourly.time.findIndex((t) => t > nowKey);
  if (end < 0) end = hourly.time.length;
  const start = Math.max(0, end - HOURS);

  const data = hourly.time
    .slice(start, end)
    .map((time, j) => ({ time, label: formatHour(time), aqi: hourly.us_aqi[start + j] }))
    .filter((d): d is { time: string; label: string; aqi: number } => d.aqi != null);

  if (data.length < 2) {
    return (
      <Section title="24-hour AQI trend">
        <p className="rounded-2xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">
          Not enough hourly readings yet.
        </p>
      </Section>
    );
  }

  const peak = data.reduce((a, b) => (b.aqi > a.aqi ? b : a));
  const low = data.reduce((a, b) => (b.aqi < a.aqi ? b : a));
  const yMax = Math.max(100, Math.ceil((peak.aqi + 25) / 50) * 50);
  const line = "var(--foreground)";

  return (
    <Section
      title="24-hour AQI trend"
      aside={
        <span className="font-mono">
          peak {peak.aqi} · {peak.label} &nbsp; low {low.aqi} · {low.label}
        </span>
      }
    >
      <div className="rounded-2xl border border-border bg-card px-2 pb-2 pt-4 sm:px-4">
        <div className="h-[220px] w-full" aria-hidden>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
              <defs>
                <linearGradient id="aqi-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={line} stopOpacity={0.14} />
                  <stop offset="100%" stopColor={line} stopOpacity={0} />
                </linearGradient>
              </defs>
              {/* Faint category bands so the line reads against the AQI scale. */}
              {AQI_SCALE.map((c, i) => {
                const from = i === 0 ? 0 : AQI_SCALE[i - 1].max;
                if (from >= yMax) return null;
                return (
                  <ReferenceArea
                    key={c.label}
                    y1={from}
                    y2={Math.min(c.max, yMax)}
                    fill={c.hex}
                    fillOpacity={0.1}
                    stroke="none"
                    ifOverflow="hidden"
                  />
                );
              })}
              <CartesianGrid vertical={false} stroke="var(--chart-grid)" strokeOpacity={0.6} />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                minTickGap={28}
                tickMargin={10}
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              />
              <YAxis
                domain={[0, yMax]}
                axisLine={false}
                tickLine={false}
                width={44}
                ticks={[0, 50, 100, 150, 200, 300, 400, 500].filter((t) => t <= yMax)}
                tick={{ fill: "var(--muted-foreground)", fontSize: 11, fontFamily: "var(--font-geist-mono)" }}
              />
              <Tooltip
                cursor={{ stroke: "var(--muted-foreground)", strokeWidth: 1, strokeDasharray: "3 3" }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload as (typeof data)[number];
                  const cat = getAqiCategory(d.aqi);
                  return <ChartTooltip title={d.label} rows={[{ label: cat.label, value: String(d.aqi), color: cat.hex }]} />;
                }}
              />
              <Area
                dataKey="aqi"
                type="monotone"
                stroke={line}
                strokeWidth={2}
                fill="url(#aqi-fill)"
                dot={false}
                activeDot={{ r: 4, fill: line, stroke: "var(--background)", strokeWidth: 2 }}
                animationDuration={300}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="sr-only">
          <table>
          <caption>US AQI, last 24 hours</caption>
          <thead>
            <tr>
              <th>Hour</th>
              <th>US AQI</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.time}>
                <td>{d.label}</td>
                <td>{d.aqi}</td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </div>
    </Section>
  );
}

"use client";

import { CartesianGrid, LabelList, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartTooltip } from "@/components/chart-tooltip";
import { Section } from "@/components/section";
import { formatShortDate, formatWeekday } from "@/lib/time";
import type { DailyWeather } from "@/types";

const HIGH = "var(--chart-high)";
const LOW = "var(--chart-low)";

export function ForecastChart({ daily }: { daily: DailyWeather }) {
  const data = daily.time.map((date, i) => ({
    date,
    day: i === 0 ? "Today" : formatWeekday(date),
    high: Math.round(daily.temperature_2m_max[i]),
    low: Math.round(daily.temperature_2m_min[i]),
  }));
  const min = Math.min(...data.map((d) => d.low));
  const max = Math.max(...data.map((d) => d.high));

  return (
    <Section
      title="7-day forecast"
      aside={
        <span className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="h-0.5 w-3 rounded-full" style={{ background: HIGH }} />
            High
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-0.5 w-3 rounded-full" style={{ background: LOW }} />
            Low
          </span>
        </span>
      }
    >
      <div className="rounded-2xl border border-border bg-card px-2 pb-2 pt-6 sm:px-4">
        <div className="h-[240px] w-full" aria-hidden>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 16, right: 20, bottom: 0, left: 20 }}>
              <CartesianGrid vertical={false} stroke="var(--chart-grid)" strokeDasharray="0" />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                interval={0}
                tickMargin={12}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              />
              <YAxis hide domain={[min - 4, max + 4]} />
              <Tooltip
                cursor={{ stroke: "var(--muted-foreground)", strokeWidth: 1, strokeDasharray: "3 3" }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload as (typeof data)[number];
                  return (
                    <ChartTooltip
                      title={`${d.day === "Today" ? "Today" : formatWeekday(d.date)}, ${formatShortDate(d.date)}`}
                      rows={[
                        { label: "High", value: `${d.high}°C`, color: HIGH },
                        { label: "Low", value: `${d.low}°C`, color: LOW },
                      ]}
                    />
                  );
                }}
              />
              {(["high", "low"] as const).map((key) => {
                const color = key === "high" ? HIGH : LOW;
                return (
                  <Line
                    key={key}
                    dataKey={key}
                    type="monotone"
                    stroke={color}
                    strokeWidth={2}
                    dot={{ r: 4, fill: color, stroke: "var(--background)", strokeWidth: 2 }}
                    activeDot={{ r: 5, fill: color, stroke: "var(--background)", strokeWidth: 2 }}
                    animationDuration={300}
                  >
                    <LabelList
                      dataKey={key}
                      position={key === "high" ? "top" : "bottom"}
                      offset={10}
                      formatter={(v) => `${v}°`}
                      style={{ fill: "var(--foreground)", fontSize: 12, fontFamily: "var(--font-geist-mono)" }}
                    />
                  </Line>
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="sr-only">
          <table>
          <caption>Seven-day temperature forecast</caption>
          <thead>
            <tr>
              <th>Day</th>
              <th>High (°C)</th>
              <th>Low (°C)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.date}>
                <td>{d.day}</td>
                <td>{d.high}</td>
                <td>{d.low}</td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </div>
    </Section>
  );
}

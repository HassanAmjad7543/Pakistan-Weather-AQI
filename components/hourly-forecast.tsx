import { Droplet } from "lucide-react";
import { Section } from "@/components/section";
import { formatHour, karachiHourKey } from "@/lib/time";
import { cn } from "@/lib/utils";
import { getWeatherInfo } from "@/lib/weather";
import type { CurrentWeather, HourlyWeather } from "@/types";

const HOURS = 24;

interface HourlyForecastProps {
  hourly: HourlyWeather;
  /** Replaces the first slot so "Now" matches the hero exactly. */
  current: CurrentWeather;
  now: string;
}

export function HourlyForecast({ hourly, current, now }: HourlyForecastProps) {
  const nowKey = karachiHourKey(new Date(now));
  let start = hourly.time.findIndex((t) => t >= nowKey);
  if (start < 0) start = Math.max(0, hourly.time.length - HOURS);
  const hours = hourly.time.slice(start, start + HOURS).map((time, j) => {
    const i = start + j;
    return {
      time,
      temp: hourly.temperature_2m[i],
      code: hourly.weather_code[i],
      isDay: hourly.is_day[i] === 1,
      rain: hourly.precipitation_probability[i],
    };
  });
  if (hours[0]) {
    hours[0] = { ...hours[0], temp: current.temperature_2m, code: current.weather_code, isDay: current.is_day === 1 };
  }

  return (
    <Section title="Hourly forecast" aside="Next 24 hours">
      <div className="-mx-4 overflow-x-auto scrollbar-none px-4 sm:mx-0 sm:px-0">
        <ol className="flex w-max gap-2">
          {hours.map((h, idx) => {
            const { icon: Icon, label } = getWeatherInfo(h.code, h.isDay);
            const isNow = idx === 0;
            return (
              <li
                key={h.time}
                className={cn(
                  "flex w-[72px] flex-col items-center gap-3 rounded-2xl border px-2 py-4",
                  isNow ? "border-primary/60 bg-primary/10" : "border-border bg-card",
                )}
              >
                <span className={cn("text-xs", isNow ? "font-medium text-foreground" : "text-muted-foreground")}>
                  {isNow ? "Now" : formatHour(h.time)}
                </span>
                <Icon className="size-5 text-foreground/80" strokeWidth={1.5} aria-label={label} />
                <span className="font-mono text-base">{Math.round(h.temp)}°</span>
                <span
                  className={cn(
                    "flex items-center gap-0.5 font-mono text-[11px] text-muted-foreground",
                    !h.rain && "invisible",
                  )}
                >
                  <Droplet className="size-2.5" aria-hidden />
                  {h.rain ?? 0}%
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}

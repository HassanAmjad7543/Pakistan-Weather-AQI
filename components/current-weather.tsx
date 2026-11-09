import { Droplets, Gauge, Navigation2, Sun, Sunrise, Sunset, Wind } from "lucide-react";
import { CountUp } from "@/components/count-up";
import { UpdatedAt } from "@/components/updated-at";
import { formatClock } from "@/lib/time";
import { getConditions, uvLabel, windDirection } from "@/lib/weather";
import type { CityDataRow } from "@/types";

export function CurrentWeather({ data }: { data: CityDataRow }) {
  const w = data.weather;
  const today = data.forecast.daily;
  const conditions = getConditions(w.weather_code, w.is_day === 1, data.air_quality.current.pm2_5);
  const Icon = conditions.icon;
  const uv = today.uv_index_max[0];
  const dir = windDirection(w.wind_direction_10m);

  const stats = [
    { icon: Droplets, label: "Humidity", value: `${Math.round(w.relative_humidity_2m)}%` },
    {
      icon: Wind,
      label: "Wind",
      value: (
        <span className="inline-flex items-center gap-1.5">
          {Math.round(w.wind_speed_10m)} km/h {dir}
          {/* Arrow points where the wind is blowing to. */}
          <Navigation2
            className="size-3.5 fill-current text-muted-foreground"
            style={{ transform: `rotate(${w.wind_direction_10m + 180}deg)` }}
            aria-label={`from ${dir}`}
          />
        </span>
      ),
    },
    { icon: Sun, label: "UV index", value: uv != null ? `${Math.round(uv)} · ${uvLabel(uv)}` : "—" },
    { icon: Sunrise, label: "Sunrise", value: formatClock(today.sunrise[0]) },
    { icon: Sunset, label: "Sunset", value: formatClock(today.sunset[0]) },
    { icon: Gauge, label: "Pressure", value: `${Math.round(w.pressure_msl)} hPa` },
  ];

  return (
    <section aria-label="Current conditions" className="flex flex-col gap-10 md:items-center md:text-center">
      <div className="flex flex-col gap-3 md:items-center">
        <div className="flex items-center gap-3 text-muted-foreground md:justify-center">
          <Icon className="size-6 text-foreground/80" strokeWidth={1.5} aria-hidden />
          <span className="text-base">{conditions.label}</span>
        </div>
        <p className="font-mono text-8xl font-medium leading-none tracking-tighter sm:text-9xl">
          <CountUp value={Math.round(w.temperature_2m)} />
          <span className="font-sans font-light text-muted-foreground">°</span>
        </p>
        <p className="text-muted-foreground">
          Feels like <span className="font-mono text-foreground">{Math.round(w.apparent_temperature)}°</span>
          <span className="mx-2" aria-hidden>
            ·
          </span>
          H <span className="font-mono text-foreground">{Math.round(today.temperature_2m_max[0])}°</span>{" "}
          L <span className="font-mono text-foreground">{Math.round(today.temperature_2m_min[0])}°</span>
        </p>
        <UpdatedAt iso={data.updated_at} className="md:justify-center" />
      </div>

      <dl className="grid w-full grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
        {stats.map(({ icon: StatIcon, label, value }) => (
          <div key={label} className="flex flex-col gap-1.5 bg-background p-4 text-left sm:p-5">
            <dt className="flex items-center gap-2 text-xs text-muted-foreground">
              <StatIcon className="size-3.5" aria-hidden />
              {label}
            </dt>
            <dd className="font-mono text-sm sm:text-base">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

import { AQI_SCALE } from "@/lib/aqi";
import { cn } from "@/lib/utils";

export function AqiLegend() {
  return (
    <section aria-labelledby="aqi-scale" className="flex flex-col gap-4">
      <h2 id="aqi-scale" className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
        US AQI scale
      </h2>
      <div className="flex h-1.5 overflow-hidden rounded-full">
        {AQI_SCALE.map((c) => (
          <div key={c.label} className={cn("flex-1", c.bg)} />
        ))}
      </div>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3 lg:grid-cols-6">
        {AQI_SCALE.map((c) => (
          <div key={c.label} className="flex flex-col gap-0.5">
            <dt className="flex items-center gap-2">
              <span className={cn("size-2 rounded-full", c.bg)} />
              <span className="font-mono text-xs text-muted-foreground">{c.range}</span>
            </dt>
            <dd className="font-medium leading-snug">{c.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

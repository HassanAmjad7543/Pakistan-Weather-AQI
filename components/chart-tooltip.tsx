export interface TooltipRow {
  label: string;
  value: string;
  color: string;
}

/** Values lead, series names follow, keyed by a short stroke of the series color. */
export function ChartTooltip({ title, rows }: { title: string; rows: TooltipRow[] }) {
  return (
    <div className="min-w-32 rounded-lg border border-border bg-background/95 px-3 py-2 text-xs shadow-lg backdrop-blur">
      <p className="mb-1.5 text-muted-foreground">{title}</p>
      <ul className="flex flex-col gap-1">
        {rows.map((r) => (
          <li key={r.label} className="flex items-center gap-2">
            <span className="h-0.5 w-3 rounded-full" style={{ background: r.color }} aria-hidden />
            <span className="font-mono text-sm font-medium text-foreground">{r.value}</span>
            <span className="text-muted-foreground">{r.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

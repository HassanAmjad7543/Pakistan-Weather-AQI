import { Badge } from "@/components/ui/badge";
import { getAqiCategory } from "@/lib/aqi";
import { cn } from "@/lib/utils";

interface AqiBadgeProps {
  aqi: number | null;
  /** Show the short category name ("Sensitive") instead of the full one. */
  compact?: boolean;
  className?: string;
}

export function AqiBadge({ aqi, compact, className }: AqiBadgeProps) {
  if (aqi == null) {
    return <Badge className={cn("bg-muted text-muted-foreground", className)}>AQI —</Badge>;
  }
  const cat = getAqiCategory(aqi);
  return (
    <Badge className={cn(cat.bg, cat.fg, className)} title={cat.label}>
      <span className="font-mono font-semibold">AQI {Math.round(aqi)}</span>
      <span className="opacity-60" aria-hidden>
        ·
      </span>
      <span>{compact ? cat.short : cat.label}</span>
    </Badge>
  );
}

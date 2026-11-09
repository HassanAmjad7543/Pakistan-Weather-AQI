import { SITE } from "@/lib/site";

const link =
  "underline-offset-4 transition-colors hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-2 gap-y-1 px-4 py-8 text-sm text-muted-foreground sm:px-6">
        <span>Built by {SITE.author}</span>
        <span aria-hidden>·</span>
        <span>
          Data:{" "}
          <a className={link} href="https://open-meteo.com" target="_blank" rel="noreferrer">
            Open-Meteo
          </a>
        </span>
        <span aria-hidden>·</span>
        <a className={link} href={SITE.github} target="_blank" rel="noreferrer">
          GitHub
        </a>
      </div>
    </footer>
  );
}

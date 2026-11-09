import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { SITE } from "@/lib/site";

interface SiteHeaderProps {
  /** Detail pages show a back link and the city title instead of the brand. */
  city?: { name: string; province: string };
}

export function SiteHeader({ city }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/75 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:px-6">
        {city ? (
          <>
            <Link
              href="/"
              className="-ml-2 inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ArrowLeft className="size-4" />
              <span className="hidden sm:inline">All cities</span>
            </Link>
            <div className="mr-auto min-w-0 truncate text-sm font-medium sm:mx-auto">
              {city.name}
              <span className="text-muted-foreground">, {city.province}</span>
            </div>
          </>
        ) : (
          <Link
            href="/"
            className="mr-auto flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Logo className="size-7" />
            <span className="text-sm font-semibold tracking-tight">
              <span className="sm:hidden">{SITE.shortName}</span>
              <span className="hidden sm:inline">{SITE.name}</span>
            </span>
          </Link>
        )}
        <ThemeToggle />
      </div>
    </header>
  );
}

import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-start gap-6 px-4 py-24 sm:px-6">
        <p className="font-mono text-sm text-muted-foreground">404</p>
        <h1 className="text-3xl font-semibold tracking-tight">That city isn&apos;t tracked.</h1>
        <p className="max-w-md text-muted-foreground">
          The dashboard covers Pakistan&apos;s eleven largest cities. Pick one from the overview.
        </p>
        <Button asChild>
          <Link href="/">See all cities</Link>
        </Button>
      </main>
    </>
  );
}

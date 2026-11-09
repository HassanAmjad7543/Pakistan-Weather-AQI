import { NextResponse, type NextRequest } from "next/server";
import { isCitySlug } from "@/lib/cities";

/**
 * City pages have a loading.tsx, so their response starts streaming (HTTP 200)
 * before the page could call notFound(). Reject unknown slugs here instead so
 * they get a real 404 status.
 */
export function middleware(request: NextRequest) {
  const slug = request.nextUrl.pathname.split("/")[2];
  if (!slug || isCitySlug(slug)) return NextResponse.next();

  // /city/Lahore -> /city/lahore
  const lower = decodeURIComponent(slug).toLowerCase();
  if (isCitySlug(lower)) return NextResponse.redirect(new URL(`/city/${lower}`, request.url), 308);

  return NextResponse.rewrite(new URL("/_unknown-city", request.url));
}

export const config = { matcher: "/city/:slug*" };

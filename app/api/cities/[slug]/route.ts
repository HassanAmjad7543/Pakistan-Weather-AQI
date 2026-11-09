import { NextResponse } from "next/server";
import { isCitySlug } from "@/lib/cities";
import { getCityData } from "@/lib/data";

export const revalidate = 300;

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isCitySlug(slug)) {
    return NextResponse.json({ error: "Unknown city" }, { status: 404 });
  }
  const row = await getCityData(slug);
  if (!row) {
    return NextResponse.json({ error: "No data yet" }, { status: 503 });
  }
  return NextResponse.json(row);
}

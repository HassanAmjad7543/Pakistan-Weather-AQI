import { CITIES, getCity, isCitySlug } from "@/lib/cities";
import { OG_SIZE, renderOgCard } from "@/lib/og";

export const alt = "Live weather and air quality";
export const size = OG_SIZE;
export const contentType = "image/png";
export const revalidate = 1800;

export function generateStaticParams() {
  return CITIES.map((c) => ({ slug: c.slug }));
}

/** Per-city social card, so a shared city link previews that city's live numbers. */
export default async function CityOpenGraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const city = getCity(isCitySlug(slug) ? slug : "lahore");
  return renderOgCard({
    city,
    eyebrow: `Live · ${city.province}`,
    title: `${city.name} weather & air quality`,
    tagline: "Current conditions, hourly and 7-day forecast, and the 24-hour US AQI trend.",
  });
}

import { getCity } from "@/lib/cities";
import { OG_SIZE, renderOgCard } from "@/lib/og";
import { SITE } from "@/lib/site";

export const alt = SITE.name;
export const size = OG_SIZE;
export const contentType = "image/png";
export const revalidate = 1800;

/** Site-wide social card, featuring live Lahore conditions. */
export default function OpenGraphImage() {
  return renderOgCard({
    city: getCity("lahore"),
    eyebrow: "Live · 11 cities",
    title: "Pakistan Weather & Air Quality",
    tagline: "Real-time weather, forecasts and US AQI for Pakistan's largest cities.",
  });
}

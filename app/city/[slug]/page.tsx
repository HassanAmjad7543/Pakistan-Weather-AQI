import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AqiBreakdown } from "@/components/aqi-breakdown";
import { AqiTrendChart } from "@/components/aqi-trend-chart";
import { CurrentWeather } from "@/components/current-weather";
import { EmptyState } from "@/components/empty-state";
import { ForecastChart } from "@/components/forecast-chart";
import { HourlyForecast } from "@/components/hourly-forecast";
import { LiveUpdates } from "@/components/live-updates";
import { SiteHeader } from "@/components/site-header";
import { getAqiCategory } from "@/lib/aqi";
import { CITIES, getCity, isCitySlug, type CitySlug } from "@/lib/cities";
import { getCityData } from "@/lib/data";
import { SITE } from "@/lib/site";

export const revalidate = 300;
// Unknown slugs are rejected by isCitySlug() below. (Not `dynamicParams = false`:
// in Next 15 that makes revalidated city pages 404 with NoFallbackError.)

export function generateStaticParams(): { slug: CitySlug }[] {
  return CITIES.map((c) => ({ slug: c.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!isCitySlug(slug)) return {};
  const city = getCity(slug);
  const data = await getCityData(slug);
  const aqi = data?.air_quality.current.us_aqi;
  const summary =
    data && aqi != null
      ? `${Math.round(data.weather.temperature_2m)}°C and US AQI ${Math.round(aqi)} (${getAqiCategory(aqi).label}) in ${city.name} right now.`
      : `Live weather and air quality for ${city.name}, ${city.province}.`;
  const title = `${city.name} weather & AQI`;
  const description = `${summary} Hourly and 7-day forecast, pollutant breakdown and 24-hour AQI trend.`;
  return {
    title,
    description,
    alternates: { canonical: `/city/${slug}` },
    openGraph: { type: "website", siteName: SITE.name, locale: "en_PK", url: `/city/${slug}`, title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function CityPage({ params }: Props) {
  const { slug } = await params;
  if (!isCitySlug(slug)) notFound();

  const city = getCity(slug);
  const data = await getCityData(slug);
  const now = new Date().toISOString();

  return (
    <>
      <SiteHeader city={city} />
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-12 px-4 pb-16 pt-10 sm:gap-14 sm:px-6 sm:pt-16">
        {data ? (
          <>
            <CurrentWeather data={data} />
            <AqiBreakdown current={data.air_quality.current} />
            <HourlyForecast hourly={data.forecast.hourly} current={data.weather} now={now} />
            <ForecastChart daily={data.forecast.daily} />
            <AqiTrendChart hourly={data.air_quality.hourly} now={now} />
          </>
        ) : (
          <EmptyState title={`No data for ${city.name} yet`}>
            The next scheduled refresh will fill this in. Check back in a few minutes.
          </EmptyState>
        )}
      </main>
      {data && <LiveUpdates updatedAt={data.updated_at} />}
    </>
  );
}

export const SITE = {
  name: "Pakistan Weather & Air Quality",
  shortName: "PK Weather & AQI",
  description:
    "Live weather and air quality (US AQI) for Pakistan's eleven largest cities — current conditions, hourly and 7-day forecasts, pollutant breakdown and 24-hour AQI trend.",
  author: "Hassan Amjad",
  // TODO: point these at your real profiles before launch.
  github: "https://github.com/your-username/pak-weather-dashboard",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),
};

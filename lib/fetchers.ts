import "server-only";
import { CITIES, type City } from "@/lib/cities";
import type {
  CityDataRow,
  OpenMeteoAirQualityResponse,
  OpenMeteoWeatherResponse,
} from "@/types";

/**
 * Open-Meteo calls. Server-side only — the /api/refresh route is the only
 * caller. Open-Meteo accepts comma-separated coordinates, so all cities are
 * fetched in one weather request and one air-quality request (2 calls per
 * refresh instead of 22) and come back as an array in the same order.
 */

const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";
const AIR_QUALITY_URL = "https://air-quality-api.open-meteo.com/v1/air-quality";

const WEATHER_PARAMS = {
  current:
    "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m,wind_direction_10m,pressure_msl",
  hourly: "temperature_2m,weather_code,precipitation_probability,is_day",
  daily:
    "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,uv_index_max",
  timezone: "Asia/Karachi",
  forecast_days: "7",
};

const AIR_QUALITY_PARAMS = {
  current:
    "pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,us_aqi,european_aqi",
  hourly: "pm2_5,pm10,us_aqi",
  timezone: "Asia/Karachi",
  // past_days=1 so the "last 24 hours" AQI trend has data before midnight.
  past_days: "1",
  forecast_days: "3",
};

function buildUrl(base: string, cities: readonly City[], params: Record<string, string>) {
  const search = new URLSearchParams({
    latitude: cities.map((c) => c.lat).join(","),
    longitude: cities.map((c) => c.lon).join(","),
    ...params,
  });
  return `${base}?${search}`;
}

async function getJson<T>(url: string, attempts = 2): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(15_000) });
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(`Open-Meteo ${res.status}: ${body.slice(0, 200)}`);
      }
      return (await res.json()) as T;
    } catch (error) {
      lastError = error;
      if (i < attempts - 1) await new Promise((r) => setTimeout(r, 1000));
    }
  }
  throw lastError;
}

/** Single-location requests return an object; multi-location return an array. */
function asArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

export async function fetchWeather(cities: readonly City[] = CITIES) {
  const data = await getJson<OpenMeteoWeatherResponse | OpenMeteoWeatherResponse[]>(
    buildUrl(WEATHER_URL, cities, WEATHER_PARAMS),
  );
  return asArray(data);
}

export async function fetchAirQuality(cities: readonly City[] = CITIES) {
  const data = await getJson<OpenMeteoAirQualityResponse | OpenMeteoAirQualityResponse[]>(
    buildUrl(AIR_QUALITY_URL, cities, AIR_QUALITY_PARAMS),
  );
  return asArray(data);
}

/** Fetch every city and shape the results as `city_data` rows. */
export async function fetchAllCityData(cities: readonly City[] = CITIES): Promise<CityDataRow[]> {
  const [weather, air] = await Promise.all([fetchWeather(cities), fetchAirQuality(cities)]);

  if (weather.length !== cities.length || air.length !== cities.length) {
    throw new Error(
      `Open-Meteo returned ${weather.length} weather / ${air.length} AQI results for ${cities.length} cities`,
    );
  }

  const updatedAt = new Date().toISOString();

  return cities.map((city, i) => {
    const w = weather[i];
    const a = air[i];
    if (!w?.current || !w.hourly || !w.daily || !a?.current || !a.hourly) {
      throw new Error(`Incomplete Open-Meteo data for ${city.name}`);
    }
    return {
      slug: city.slug,
      city_name: city.name,
      weather: w.current,
      air_quality: { current: a.current, hourly: a.hourly },
      forecast: { hourly: w.hourly, daily: w.daily },
      updated_at: updatedAt,
    };
  });
}

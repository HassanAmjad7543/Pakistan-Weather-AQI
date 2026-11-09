import type { CitySlug } from "@/lib/cities";

/** Open-Meteo returns local (Asia/Karachi) timestamps without an offset, e.g. "2026-11-09T13:00". */
export type LocalDateTime = string;
/** e.g. "2026-11-09" */
export type LocalDate = string;

export interface CurrentWeather {
  time: LocalDateTime;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  is_day: number;
  weather_code: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  pressure_msl: number;
}

export interface HourlyWeather {
  time: LocalDateTime[];
  temperature_2m: number[];
  weather_code: number[];
  precipitation_probability: (number | null)[];
  is_day: number[];
}

export interface DailyWeather {
  time: LocalDate[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  sunrise: LocalDateTime[];
  sunset: LocalDateTime[];
  precipitation_sum: number[];
  uv_index_max: (number | null)[];
}

export interface AirQualityCurrent {
  time: LocalDateTime;
  pm10: number | null;
  pm2_5: number | null;
  carbon_monoxide: number | null;
  nitrogen_dioxide: number | null;
  sulphur_dioxide: number | null;
  ozone: number | null;
  us_aqi: number | null;
  european_aqi: number | null;
}

export interface AirQualityHourly {
  time: LocalDateTime[];
  pm2_5: (number | null)[];
  pm10: (number | null)[];
  us_aqi: (number | null)[];
}

/** Raw Open-Meteo response shapes (only the fields we request). */
export interface OpenMeteoWeatherResponse {
  latitude: number;
  longitude: number;
  current: CurrentWeather;
  hourly: HourlyWeather;
  daily: DailyWeather;
}

export interface OpenMeteoAirQualityResponse {
  latitude: number;
  longitude: number;
  current: AirQualityCurrent;
  hourly: AirQualityHourly;
}

/** JSONB column payloads. */
export type WeatherPayload = CurrentWeather;
export interface AirQualityPayload {
  current: AirQualityCurrent;
  hourly: AirQualityHourly;
}
export interface ForecastPayload {
  hourly: HourlyWeather;
  daily: DailyWeather;
}

/** One row of the `city_data` table. */
export interface CityDataRow {
  slug: CitySlug;
  city_name: string;
  weather: WeatherPayload;
  air_quality: AirQualityPayload;
  forecast: ForecastPayload;
  updated_at: string;
}

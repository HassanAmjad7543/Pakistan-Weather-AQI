import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudHail,
  CloudLightning,
  CloudMoon,
  CloudMoonRain,
  CloudRain,
  CloudSnow,
  CloudSun,
  CloudSunRain,
  Haze,
  Moon,
  Snowflake,
  Sun,
  type LucideIcon,
} from "lucide-react";

export interface WeatherInfo {
  label: string;
  icon: LucideIcon;
}

/** Map a WMO weather code (as returned by Open-Meteo) to a label and icon. */
export function getWeatherInfo(code: number, isDay = true): WeatherInfo {
  switch (code) {
    case 0:
      return { label: "Clear", icon: isDay ? Sun : Moon };
    case 1:
      return { label: "Mainly clear", icon: isDay ? Sun : Moon };
    case 2:
      return { label: "Partly cloudy", icon: isDay ? CloudSun : CloudMoon };
    case 3:
      return { label: "Overcast", icon: Cloud };
    case 45:
    case 48:
      return { label: "Foggy", icon: CloudFog };
    case 51:
    case 53:
    case 55:
      return { label: "Drizzle", icon: CloudDrizzle };
    case 56:
    case 57:
      return { label: "Freezing drizzle", icon: CloudDrizzle };
    case 61:
      return { label: "Light rain", icon: CloudRain };
    case 63:
      return { label: "Rain", icon: CloudRain };
    case 65:
      return { label: "Heavy rain", icon: CloudRain };
    case 66:
    case 67:
      return { label: "Freezing rain", icon: CloudHail };
    case 71:
    case 73:
    case 75:
      return { label: "Snow", icon: CloudSnow };
    case 77:
      return { label: "Snow grains", icon: Snowflake };
    case 80:
    case 81:
    case 82:
      return { label: "Rain showers", icon: isDay ? CloudSunRain : CloudMoonRain };
    case 85:
    case 86:
      return { label: "Snow showers", icon: CloudSnow };
    case 95:
      return { label: "Thunderstorm", icon: CloudLightning };
    case 96:
    case 99:
      return { label: "Thunderstorm, hail", icon: CloudLightning };
    default:
      return { label: "Unknown", icon: Cloud };
  }
}

/**
 * Open-Meteo has no "haze" code, but heavy particulate pollution visibly turns
 * a clear sky into smog. When PM2.5 is high and the sky is otherwise
 * clear-to-cloudy, describe it as hazy — that's what people actually see.
 */
export function getConditions(code: number, isDay: boolean, pm25?: number | null): WeatherInfo {
  if (pm25 != null && pm25 >= 75 && code <= 3) return { label: "Hazy", icon: Haze };
  return getWeatherInfo(code, isDay);
}

const COMPASS = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];

/** Meteorological degrees (direction the wind comes from) -> "NW" */
export function windDirection(deg: number): string {
  return COMPASS[Math.round((((deg % 360) + 360) % 360) / 22.5) % 16];
}

export function uvLabel(uv: number): string {
  if (uv < 3) return "Low";
  if (uv < 6) return "Moderate";
  if (uv < 8) return "High";
  if (uv < 11) return "Very high";
  return "Extreme";
}

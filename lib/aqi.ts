export interface AqiCategory {
  label: string;
  short: string;
  /** Badge background */
  bg: string;
  /** Text on top of `bg` */
  fg: string;
  /** Category-colored text, readable on both themes */
  text: string;
  /** Hex for charts / glows */
  hex: string;
  description: string;
}

/** US EPA AQI scale. Class names are literal so Tailwind can see them. */
export function getAqiCategory(aqi: number): AqiCategory {
  if (aqi <= 50)
    return { label: "Good", short: "Good", bg: "bg-green-500", fg: "text-green-950", text: "text-green-600 dark:text-green-400", hex: "#22c55e", description: "Air quality is satisfactory." };
  if (aqi <= 100)
    return { label: "Moderate", short: "Moderate", bg: "bg-yellow-500", fg: "text-yellow-950", text: "text-yellow-600 dark:text-yellow-400", hex: "#eab308", description: "Acceptable for most people." };
  if (aqi <= 150)
    return { label: "Unhealthy for Sensitive Groups", short: "USG", bg: "bg-orange-500", fg: "text-orange-950", text: "text-orange-600 dark:text-orange-400", hex: "#f97316", description: "Sensitive groups may experience effects." };
  if (aqi <= 200)
    return { label: "Unhealthy", short: "Unhealthy", bg: "bg-red-500", fg: "text-white", text: "text-red-600 dark:text-red-400", hex: "#ef4444", description: "Everyone may begin to experience effects." };
  if (aqi <= 300)
    return { label: "Very Unhealthy", short: "Very Unhealthy", bg: "bg-purple-600", fg: "text-white", text: "text-purple-600 dark:text-purple-400", hex: "#9333ea", description: "Health alert: serious effects for everyone." };
  return { label: "Hazardous", short: "Hazardous", bg: "bg-rose-900", fg: "text-rose-50", text: "text-rose-800 dark:text-rose-400", hex: "#9f1239", description: "Emergency conditions. Avoid outdoor activity." };
}

export const AQI_SCALE = [
  { max: 50, ...getAqiCategory(0), range: "0–50" },
  { max: 100, ...getAqiCategory(51), range: "51–100" },
  { max: 150, ...getAqiCategory(101), range: "101–150" },
  { max: 200, ...getAqiCategory(151), range: "151–200" },
  { max: 300, ...getAqiCategory(201), range: "201–300" },
  { max: 500, ...getAqiCategory(301), range: "301+" },
];

export const POLLUTANTS = [
  { key: "pm2_5", label: "PM2.5", name: "Fine particles" },
  { key: "pm10", label: "PM10", name: "Coarse particles" },
  { key: "nitrogen_dioxide", label: "NO₂", name: "Nitrogen dioxide" },
  { key: "sulphur_dioxide", label: "SO₂", name: "Sulphur dioxide" },
  { key: "ozone", label: "O₃", name: "Ozone" },
  { key: "carbon_monoxide", label: "CO", name: "Carbon monoxide" },
] as const;

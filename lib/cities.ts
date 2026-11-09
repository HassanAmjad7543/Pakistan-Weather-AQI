export const CITIES = [
  { slug: "karachi", name: "Karachi", lat: 24.8607, lon: 67.0011, province: "Sindh" },
  { slug: "lahore", name: "Lahore", lat: 31.5204, lon: 74.3587, province: "Punjab" },
  { slug: "islamabad", name: "Islamabad", lat: 33.6844, lon: 73.0479, province: "Capital" },
  { slug: "rawalpindi", name: "Rawalpindi", lat: 33.5651, lon: 73.0169, province: "Punjab" },
  { slug: "faisalabad", name: "Faisalabad", lat: 31.4504, lon: 73.135, province: "Punjab" },
  { slug: "multan", name: "Multan", lat: 30.1575, lon: 71.5249, province: "Punjab" },
  { slug: "peshawar", name: "Peshawar", lat: 34.0151, lon: 71.5249, province: "KP" },
  { slug: "quetta", name: "Quetta", lat: 30.1798, lon: 66.975, province: "Balochistan" },
  { slug: "hyderabad", name: "Hyderabad", lat: 25.396, lon: 68.3578, province: "Sindh" },
  { slug: "gujranwala", name: "Gujranwala", lat: 32.1877, lon: 74.1945, province: "Punjab" },
  { slug: "gujrat", name: "Gujrat", lat: 32.5742, lon: 74.0789, province: "Punjab" },
] as const;

export type City = (typeof CITIES)[number];
export type CitySlug = City["slug"];

export function isCitySlug(value: string): value is CitySlug {
  return CITIES.some((c) => c.slug === value);
}

export function getCity(slug: CitySlug): City {
  return CITIES.find((c) => c.slug === slug)!;
}

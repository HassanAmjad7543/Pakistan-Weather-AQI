import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { getAqiCategory } from "@/lib/aqi";
import { getCityData } from "@/lib/data";
import { SITE } from "@/lib/site";

export const alt = SITE.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 1800;

const font = (file: string) => readFile(path.join(process.cwd(), "assets/fonts", file));

/** 1200×630 social card: title, tagline and a live Lahore card. */
export default async function OpenGraphImage() {
  const [regular, semibold, mono, lahore] = await Promise.all([
    font("Geist-Regular.ttf"),
    font("Geist-SemiBold.ttf"),
    font("GeistMono-Medium.ttf"),
    getCityData("lahore").catch(() => null),
  ]);

  const aqi = lahore?.air_quality.current.us_aqi ?? null;
  const cat = aqi != null ? getAqiCategory(aqi) : null;
  const temp = lahore ? Math.round(lahore.weather.temperature_2m) : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#09090b",
          backgroundImage: `radial-gradient(circle at 85% 30%, ${cat?.hex ?? "#3b82f6"}33, transparent 55%)`,
          color: "#fafafa",
          fontFamily: "Geist",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 28, maxWidth: 600 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, color: "#a1a1aa", fontSize: 24 }}>
            <div style={{ width: 14, height: 14, borderRadius: 999, background: "#3b82f6" }} />
            Live · 11 cities
          </div>
          <div style={{ fontSize: 68, fontWeight: 600, lineHeight: 1.05, letterSpacing: -2 }}>
            Pakistan Weather & Air Quality
          </div>
          <div style={{ fontSize: 28, color: "#a1a1aa", lineHeight: 1.4 }}>
            Real-time weather, forecasts and US AQI for Pakistan&apos;s largest cities.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 28,
            width: 360,
            padding: 36,
            borderRadius: 28,
            border: "1px solid #27272a",
            background: "rgba(24,24,27,0.75)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ fontSize: 34, fontWeight: 600 }}>Lahore</div>
            <div style={{ fontSize: 22, color: "#a1a1aa" }}>Punjab</div>
          </div>
          <div style={{ display: "flex", fontFamily: "Geist Mono", fontSize: 96, letterSpacing: -4, lineHeight: 1 }}>
            {temp != null ? `${temp}` : "—"}
            <span style={{ color: "#71717a" }}>°C</span>
          </div>
          {cat && aqi != null ? (
            <div
              style={{
                display: "flex",
                alignSelf: "flex-start",
                gap: 10,
                padding: "8px 18px",
                borderRadius: 999,
                background: cat.hex,
                color: aqi <= 150 ? "#09090b" : "#ffffff",
                fontSize: 22,
              }}
            >
              <span style={{ fontFamily: "Geist Mono" }}>AQI {Math.round(aqi)}</span>
              <span>· {cat.short}</span>
            </div>
          ) : (
            <div style={{ fontSize: 22, color: "#a1a1aa" }}>Live US AQI</div>
          )}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Geist", data: regular, weight: 400 },
        { name: "Geist", data: semibold, weight: 600 },
        { name: "Geist Mono", data: mono, weight: 500 },
      ],
    },
  );
}

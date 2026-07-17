import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "VERH — веб-студия. Разработка сайтов под ключ в Москве.";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#f4f5f2",
          backgroundImage:
            "radial-gradient(circle at 80% 15%, rgba(199,58,68,0.20), transparent 45%)",
          display: "flex",
          flexDirection: "column",
          padding: 80,
          justifyContent: "space-between",
          color: "#14171c",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 36, fontWeight: 800, letterSpacing: -1 }}>
          <svg width="34" height="34" viewBox="0 0 107.5 107.5" fill="#c73a44">
            <path d="M97.4,0H10C4.5,0,0,4.5,0,10s4.5,10,10,10h63.2L2.9,90.3c-3.9,3.9-3.9,10.3,0,14.2c3.9,3.9,10.3,3.9,14.2,0l70.3-70.3v63.2c0,5.5,4.5,10,10,10c5.5,0,10-4.5,10-10V10C107.5,4.5,103,0,97.4,0z" />
            <path d="M61.8,72.9L44.3,90.3c-3.9,3.9-3.9,10.3,0,14.2c3.9,3.9,10.3,3.9,14.2,0l17.4-17.4c3.9-3.9,3.9-10.3,0-14.2C72,69,65.7,69,61.8,72.9z" />
          </svg>
          verh
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 86, fontWeight: 800, letterSpacing: -3, lineHeight: 1.02 }}>
            Сайты и продукты,
          </div>
          <div style={{ display: "flex", fontSize: 86, fontWeight: 800, letterSpacing: -3, lineHeight: 1.02, color: "#c73a44" }}>
            которые работают
          </div>
          <div style={{ display: "flex", marginTop: 22, fontSize: 30, color: "#565e69", letterSpacing: -0.5 }}>
            Сайты, Telegram-боты и AI. Дизайн и код — нас двое. Москва.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            color: "#565e69",
            borderTop: "1px solid rgba(18,21,27,0.12)",
            paddingTop: 26,
          }}
        >
          <div style={{ display: "flex" }}>{new URL(SITE.url).host}</div>
          <div style={{ display: "flex", color: "#a62d38", fontWeight: 600 }}>дизайн · код · AI</div>
        </div>
      </div>
    ),
    size,
  );
}

import { ImageResponse } from "next/og";

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
            "radial-gradient(circle at 80% 15%, rgba(39,195,104,0.22), transparent 45%)",
          display: "flex",
          flexDirection: "column",
          padding: 80,
          justifyContent: "space-between",
          color: "#14171c",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 36, fontWeight: 800, letterSpacing: -1 }}>
          <div
            style={{
              display: "flex",
              width: 30,
              height: 30,
              borderRadius: 8,
              backgroundColor: "#1f9d55",
            }}
          />
          verh
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 86, fontWeight: 800, letterSpacing: -3, lineHeight: 1.02 }}>
            Сайты и продукты,
          </div>
          <div style={{ display: "flex", fontSize: 86, fontWeight: 800, letterSpacing: -3, lineHeight: 1.02, color: "#1f9d55" }}>
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
          <div style={{ display: "flex" }}>verh.studio</div>
          <div style={{ display: "flex", color: "#1f9d55", fontWeight: 600 }}>дизайн · код · AI</div>
        </div>
      </div>
    ),
    size,
  );
}

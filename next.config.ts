import type { NextConfig } from "next";

// Канонический адрес сайта (тот же env, что и в src/lib/site.ts)
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://verh.tech";
const SITE_HOST = new URL(SITE_URL).host;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [],
  },
  // 301-склейка www → без www: для Яндекса это зеркала, единственный
  // рабочий механизм склейки — редирект (Host в robots.txt игнорируется с 2018).
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: `www.${SITE_HOST}` }],
        destination: `${SITE_URL}/:path*`,
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
      // Медиа кейсов (webp/mp4/webm) версионируются заменой имени файла,
      // поэтому кэшируем навсегда. При обновлении контента — новое имя (hero-v2.mp4).
      {
        source: "/works/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      // Фото команды не версионируются — сутки кэша + неделя stale-while-revalidate.
      {
        source: "/team/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
      },
      // robots.txt закрывает /api/ от краулинга, но не от индексации по внешним
      // ссылкам — X-Robots-Tag закрывает и этот кейс.
      {
        source: "/api/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;

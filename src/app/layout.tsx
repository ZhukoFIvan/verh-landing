import type { Metadata, Viewport } from "next";
import { Onest, JetBrains_Mono } from "next/font/google";
import { SITE } from "@/lib/site";
import { JsonLd } from "@/components/JsonLd";
import { organizationLd, websiteLd } from "@/lib/jsonld";
import "./globals.css";

// Onest — гротеск с родной кириллицей: текст 400–500, дисплей 600–800.
const grotesk = Onest({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-grotesk",
  display: "swap",
  preload: true,
});

// JetBrains Mono — только для мелких «данных» (url, метки). Кириллица родная.
const mono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
  preload: true,
});

export const viewport: Viewport = {
  themeColor: "#f5f6f4",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — сайты, боты и AI-сервисы · веб-студия в Москве`,
    template: `%s · ${SITE.name} Studio`,
  },
  description: SITE.description,
  keywords: SITE.keywords as unknown as string[],
  applicationName: SITE.legalName,
  generator: "Next.js",
  authors: [{ name: SITE.founder, url: SITE.url }],
  creator: SITE.legalName,
  publisher: SITE.legalName,
  category: "Веб-студия · Разработка сайтов",
  classification: "Web design studio, web development agency",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: true,
    address: false,
    telephone: true,
  },
  alternates: {
    canonical: "/",
    languages: {
      "ru-RU": "/",
      "x-default": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: SITE.url,
    siteName: `${SITE.name} Studio`,
    title: `${SITE.name} — веб-студия: разработка сайтов под ключ`,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — веб-студия`,
    description: SITE.shortDescription,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
  other: {
    "geo.region": "RU-MOW",
    "geo.placename": "Moscow",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${grotesk.variable} ${mono.variable}`}>
      <head>
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}
.hero-kicker,.hero-sub,.hero-actions,.hero-cue{opacity:1!important;transform:none!important}
.hero-title .w{transform:none!important}
.stage-reel{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <JsonLd id="ld-org" data={organizationLd()} />
        <JsonLd id="ld-site" data={websiteLd()} />
      </head>
      <body>
        <a href="#main" className="skip-link">Перейти к содержанию</a>
        {children}
      </body>
    </html>
  );
}

import { SITE } from "./site";
import { FAQ, SERVICES, WORKS } from "./content";

const stripMd = (s: string) => s.replace(/__/g, "");

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE.url}/#organization`,
    name: SITE.legalName,
    alternateName: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/favicon.svg`,
    image: `${SITE.url}/opengraph-image`,
    description: SITE.description,
    foundingDate: SITE.founded,
    founder: SITE.team.map((m) => ({
      "@type": "Person",
      name: m.full,
      jobTitle: m.role,
    })),
    priceRange: SITE.priceRange,
    email: SITE.email,
    areaServed: [
      { "@type": "Country", name: "Россия" },
      { "@type": "Country", name: "Беларусь" },
      { "@type": "Country", name: "Казахстан" },
      { "@type": "AdministrativeArea", name: "СНГ" },
      { "@type": "Place", name: "Worldwide" },
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.city,
      addressRegion: SITE.region,
      addressCountry: SITE.country,
    },
    knowsAbout: [
      "Разработка сайтов",
      "Веб-приложения",
      "Telegram-боты",
      "AI",
      "LLM",
      "Next.js",
      "UI/UX",
      "Веб-дизайн",
      "Лендинги",
      "Брендинг",
      "SEO",
    ],
    serviceType: [
      "Разработка сайтов",
      "Разработка веб-приложений",
      "Разработка Telegram-ботов",
      "AI-интеграции",
      "Дизайн интерфейсов",
    ],
    sameAs: [SITE.socials.telegram],
    contactPoint: [
      {
        "@type": "ContactPoint",
        email: SITE.email,
        contactType: "sales",
        areaServed: "RU",
        availableLanguage: ["Russian", "English"],
      },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Услуги VERH Studio",
      itemListElement: SERVICES.map((s, i) => ({
        "@type": "Offer",
        position: i + 1,
        itemOffered: {
          "@type": "Service",
          name: s.name,
          description: s.long,
          provider: { "@id": `${SITE.url}/#organization` },
          url: `${SITE.url}/#services`,
        },
      })),
    },
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.name,
    description: SITE.description,
    publisher: { "@id": `${SITE.url}/#organization` },
    inLanguage: "ru-RU",
  };
}

export function faqLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: stripMd(item.a),
      },
    })),
  };
}

export function breadcrumbLd() {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: SITE.url },
      { "@type": "ListItem", position: 2, name: "Работы", item: `${SITE.url}/#work` },
      { "@type": "ListItem", position: 3, name: "Услуги", item: `${SITE.url}/#services` },
      { "@type": "ListItem", position: 4, name: "Студия", item: `${SITE.url}/#about` },
      { "@type": "ListItem", position: 5, name: "FAQ", item: `${SITE.url}/#faq` },
      { "@type": "ListItem", position: 6, name: "Контакты", item: `${SITE.url}/#contact` },
    ],
  };
}

export function portfolioLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Портфолио VERH Studio",
    description:
      "Проекты студии VERH — сайты, веб-приложения, Telegram-боты и AI-сервисы.",
    numberOfItems: WORKS.length,
    itemListElement: WORKS.map((w, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "CreativeWork",
        name: w.accent ? `${w.title} ${w.accent}` : w.title,
        description: w.description,
        url: `${SITE.url}/#work-${w.slug}`,
        creator: { "@id": `${SITE.url}/#organization` },
        about: w.industry,
        keywords: (w.tags as readonly string[]).join(", "),
      },
    })),
  };
}

export function servicesLd() {
  return {
    "@context": "https://schema.org",
    "@graph": SERVICES.map((s) => ({
      "@type": "Service",
      "@id": `${SITE.url}/#service-${s.slug}`,
      name: s.name,
      description: s.long,
      serviceType: s.name,
      provider: { "@id": `${SITE.url}/#organization` },
      areaServed: { "@type": "Country", name: "Россия" },
      url: `${SITE.url}/#services`,
      category: (s.tags as readonly string[]).join(", "),
    })),
  };
}


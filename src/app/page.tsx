import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Work } from "@/components/Work";
import { Services } from "@/components/Services";
import { Manifesto } from "@/components/Manifesto";
import { Process } from "@/components/Process";
import { About } from "@/components/About";
import { Testimonials } from "@/components/Testimonials";
import { Faq } from "@/components/Faq";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { ScrollFx } from "@/components/ScrollFx";
import { JsonLd } from "@/components/JsonLd";
import {
  breadcrumbLd,
  faqLd,
  portfolioLd,
  servicesLd,
} from "@/lib/jsonld";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: `${SITE.name} — сайты, боты и AI-сервисы · веб-студия в Москве`,
  description:
    "VERH — небольшая веб-студия из Москвы. Двое: дизайн и код. Делаем сайты, лендинги, веб-приложения, Telegram-боты и AI-сервисы. От идеи до прода, без шаблонов. Работаем по России и СНГ.",
  alternates: { canonical: "/" },
  openGraph: {
    title: `${SITE.name} — веб-студия: разработка сайтов под ключ`,
    description: SITE.description,
    url: SITE.url,
    type: "website",
  },
};

export default function HomePage() {
  return (
    <>
      <JsonLd id="ld-breadcrumb" data={breadcrumbLd()} />
      <JsonLd id="ld-services" data={servicesLd()} />
      <JsonLd id="ld-portfolio" data={portfolioLd()} />
      <JsonLd id="ld-faq" data={faqLd()} />

      <ScrollFx />
      <Nav />

      <main id="main">
        <Hero />
        <Marquee />
        <Work />
        <Services />
        <Manifesto />
        <Process />
        <About />
        <Testimonials />
        <Faq />
        <Contact />
      </main>

      <Footer />
    </>
  );
}

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
import { faqLd, portfolioLd, servicesLd } from "@/lib/jsonld";

// title/description/openGraph/canonical наследуются из layout.tsx:
// свой metadata здесь дублировал бы их и терял og:locale/og:site_name
// (openGraph в Next.js не мержится глубоко), а к title применялся бы
// шаблон «%s · VERH Studio» — бренд в тайтле встречался бы дважды.

export default function HomePage() {
  return (
    <>
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

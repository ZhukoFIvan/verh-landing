import { SERVICES } from "@/lib/content";

export function Services() {
  return (
    <section className="block" id="services" aria-labelledby="services-title">
      <div className="section-head reveal">
        <div className="section-tag">Что умеем</div>
        <h2 className="section-title" id="services-title">
          От идеи до <em>рабочего продукта.</em>
        </h2>
        <p className="section-aside">
          Собираем всё сами — от первого экрана до кода и запуска. Берём в работу то, что реально
          можем сделать хорошо.
        </p>
      </div>

      <div className="services" role="list">
        {SERVICES.map((s) => (
          <a
            key={s.slug}
            id={`service-${s.slug}`}
            href="#contact"
            className="service reveal"
            role="listitem"
            itemScope
            itemType="https://schema.org/Service"
            aria-label={`${s.name} — обсудить услугу`}
          >
            <div className="s-top">
              <div className="s-num mono">{s.n}</div>
              <div className="s-arrow" aria-hidden="true">↗</div>
            </div>
            <div className="s-name" itemProp="name">{s.name}</div>
            <div className="s-desc" itemProp="description">{s.short}</div>
            <div className="s-tags">
              {s.tags.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
            <meta itemProp="serviceType" content={s.name} />
          </a>
        ))}
      </div>

      {/* SEO: descriptive copy with keywords, visually hidden but indexable */}
      <div className="sr-only">
        <h3>Услуги веб-студии VERH</h3>
        <ul>
          {SERVICES.map((s) => (
            <li key={s.slug}>
              <strong>{s.name}</strong>: {s.long}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

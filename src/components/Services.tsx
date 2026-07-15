import { SERVICES } from "@/lib/content";

export function Services() {
  return (
    <section className="block" id="services" aria-labelledby="services-title">
      <div className="section-head reveal">
        <div className="section-tag">Услуги студии</div>
        <h2 className="section-title" id="services-title">
          От идеи до <em>рабочего продукта.</em>
        </h2>
        <p className="section-aside">
          Разработка сайтов, веб-приложений и Telegram-ботов под ключ — от первого экрана до кода
          и запуска. Берём в работу то, что реально можем сделать хорошо.
        </p>
      </div>

      {/* Услуги размечены только в JSON-LD (servicesLd), микроданные здесь — дубль.
          Скрытый sr-only блок с ключами удалён: hidden text — риск фильтра Яндекса. */}
      <div className="services" role="list">
        {SERVICES.map((s) => (
          <a
            key={s.slug}
            id={`service-${s.slug}`}
            href="#contact"
            className="service reveal"
            role="listitem"
            aria-label={`${s.name} — обсудить услугу`}
          >
            <div className="s-top">
              <div className="s-num mono">{s.n}</div>
              <div className="s-arrow" aria-hidden="true">↗</div>
            </div>
            <h3 className="s-name">{s.name}</h3>
            <div className="s-desc">{s.short}</div>
            <div className="s-tags">
              {s.tags.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

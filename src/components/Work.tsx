"use client";

import { useEffect, useRef, useState } from "react";
import { WORKS } from "@/lib/content";

function WorkImage({ src, phClass, id, alt }: { src?: string; phClass: string; id: string; alt: string }) {
  const [broken, setBroken] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  // Картинка может успеть загрузиться (из кэша) до того, как React навесит onLoad
  // при гидрации — тогда событие не прилетит и .loaded не выставится. Проверяем сами.
  useEffect(() => {
    const img = ref.current;
    if (!img) return;
    if (img.complete) {
      if (img.naturalWidth === 0) setBroken(true);
      else setLoaded(true);
    }
  }, [src]);

  return (
    // aria-hidden только на декоративном скелете: скриншот кейса — контентная
    // картинка, её alt должен быть жив и для скринридеров, и для поисковиков
    <div className={`ph${phClass ? " " + phClass : ""}`}>
      {/* лёгкий скелет продукта, пока нет реального скриншота */}
      <div className="ph-skeleton" aria-hidden="true">
        <span className="ph-index">{id}</span>
        <span className="s-bar a" /><span className="s-bar b" /><span className="s-bar c" />
      </div>
      {src && !broken && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={ref}
          className={`work-shot${loaded ? " loaded" : ""}`}
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setBroken(true)}
        />
      )}
    </div>
  );
}

export function Work() {
  return (
    <section className="block" id="work" aria-labelledby="work-title">
      <div className="section-head reveal">
        <div className="section-tag">Работы · сайты, боты, веб-приложения</div>
        <h2 className="section-title" id="work-title">
          Не только сайты — <em>цельные продукты.</em>
        </h2>
        <p className="section-aside">
          Лендинги, SaaS и Telegram-приложения. Несколько проектов, которые мы спроектировали
          и довели до запуска — от первого экрана до кода.
        </p>
      </div>

      <div className="works">
        {WORKS.map((w) => (
          // Работы размечены только в JSON-LD (portfolioLd), микроданные — дубль
          <article
            key={w.slug}
            id={`work-${w.slug}`}
            className={`work reveal${(w as { wide?: boolean }).wide ? " wide" : ""}`}
          >
            <div className="work-media">
              <div className="corner">{w.cornerLabel}</div>
              <WorkImage
                src={(w as { image?: string }).image}
                phClass={w.phClass}
                id={w.id}
                alt={`Скриншот: ${w.title}${w.accent ? " " + w.accent : ""} — ${w.industry}`}
              />
              <div className="ph-label mono" aria-hidden="true">{w.industry}</div>
            </div>
            <div className="work-info">
              <div className="num mono">Кейс {w.id}</div>
              <h3>
                {w.title} {w.accent && <span className="acc">{w.accent}</span>}
              </h3>
              <p className="desc">
                {w.description}
              </p>
              <div className="tags" role="list" aria-label="Технологии и категории">
                {w.tags.map((t) => (
                  <span key={t} className="tag" role="listitem">{t}</span>
                ))}
              </div>
            </div>
          </article>
        ))}

        <a className="work work-cta reveal" href="#contact">
          <span className="cta-eyebrow mono">Свободны для новых проектов</span>
          <span className="cta-title">
            Здесь может быть<br />ваш проект
          </span>
          <span className="cta-go">
            Обсудить задачу <span className="arrow" aria-hidden="true">→</span>
          </span>
        </a>
      </div>
    </section>
  );
}

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
    <div className={`ph${phClass ? " " + phClass : ""}`} aria-hidden="true">
      {/* лёгкий скелет продукта, пока нет реального скриншота */}
      <div className="ph-skeleton">
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
        <div className="section-tag">Работы · 2026</div>
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
          <article
            key={w.slug}
            id={`work-${w.slug}`}
            className={`work reveal${(w as { wide?: boolean }).wide ? " wide" : ""}`}
            itemScope
            itemType="https://schema.org/CreativeWork"
          >
            <div className="work-media">
              <div className="corner">{w.cornerLabel}</div>
              <WorkImage
                src={(w as { image?: string }).image}
                phClass={w.phClass}
                id={w.id}
                alt={`${w.title}${w.accent ? " " + w.accent : ""} — ${w.industry}`}
              />
              <div className="ph-label mono" aria-hidden="true">{w.industry}</div>
              {(w as { image?: string }).image && (
                <meta itemProp="image" content={(w as { image?: string }).image} />
              )}
            </div>
            <div className="work-info">
              <div className="num mono">Кейс {w.id}</div>
              <h3 itemProp="name">
                {w.title} {w.accent && <span className="acc">{w.accent}</span>}
              </h3>
              <p className="desc" itemProp="description">
                {w.description}
              </p>
              <meta itemProp="about" content={w.industry} />
              <div className="tags" aria-label="Технологии и категории">
                {w.tags.map((t) => (
                  <span key={t} className="tag">{t}</span>
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

"use client";

import { useState } from "react";
import { SITE } from "@/lib/site";

function FounderPhoto({ src, initials, i }: { src: string; initials: string; i: number }) {
  const [broken, setBroken] = useState(false);
  return (
    <div className="f-photo" data-i={i}>
      <span className="f-initials" aria-hidden="true">{initials}</span>
      {!broken && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" loading="lazy" onError={() => setBroken(true)} />
      )}
    </div>
  );
}

export function About() {
  return (
    <section className="about" id="about" aria-labelledby="about-title">
      <div className="section-head reveal">
        <div className="section-tag">Кто мы</div>
        <h2 className="section-title" id="about-title">
          Нас двое. <em>Без агентства и наценок.</em>
        </h2>
        <p className="section-aside">
          Дизайн и код в одних руках. Мы сами ведём проект от первого созвона до запуска — без
          аккаунт-менеджеров и «вас передадут коллеге».
        </p>
      </div>

      <div className="team">
        {SITE.team.map((m, i) => (
          <article
            key={m.name}
            className="founder reveal"
            style={{ transitionDelay: `${i * 0.1}s` }}
            itemScope
            itemType="https://schema.org/Person"
          >
            <FounderPhoto src={m.photo} initials={m.initials} i={i} />
            <div className="f-body">
              <div className="f-name" itemProp="name">{m.full}</div>
              <div className="f-role" itemProp="jobTitle">{m.role}</div>
              <p className="f-bio">{m.bio}</p>
              <div className="f-focus">
                {m.focus.map((f) => (
                  <span key={f}>{f}</span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      <dl className="about-meta reveal d2">
        <div className="item">
          <dt className="k">Свои продукты</dt>
          <dd className="v"><b>2</b> в проде</dd>
        </div>
        <div className="item">
          <dt className="k">Стек</dt>
          <dd className="v">Next.js · AI · TG</dd>
        </div>
        <div className="item">
          <dt className="k">Свободных слотов</dt>
          <dd className="v"><b>2</b> сейчас</dd>
        </div>
        <div className="item">
          <dt className="k">Где</dt>
          <dd className="v">Москва · GMT+3</dd>
        </div>
      </dl>
    </section>
  );
}

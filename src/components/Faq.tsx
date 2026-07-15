"use client";

import { useState } from "react";
import { FAQ } from "@/lib/content";

function renderRich(text: string) {
  const parts = text.split(/__(.+?)__/g);
  return parts.map((p, i) => (i % 2 === 1 ? <strong key={i}>{p}</strong> : <span key={i}>{p}</span>));
}

export function Faq() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="faq" id="faq" aria-labelledby="faq-title">
      <div className="section-head reveal">
        <div className="section-tag">FAQ</div>
        <h2 className="section-title" id="faq-title">
          Сначала <em>отвечаем</em> на очевидное.
        </h2>
        <p className="section-aside">
          Если в списке нет вашего вопроса — пишите напрямую. Отвечаем в течение рабочего дня, без
          отдела продаж.
        </p>
      </div>

      {/* Единственный источник FAQ-разметки — JSON-LD faqLd() в page.tsx:
          дубль микроданными ломал валидность (две сущности FAQPage на странице). */}
      <div className="faq-list reveal">
        {FAQ.map((item, i) => {
          const open = openIdx === i;
          const qId = `faq-q-${i + 1}`;
          const aId = `faq-a-${i + 1}`;
          return (
            <div key={i} className={`faq-item${open ? " open" : ""}`}>
              <h3 className="faq-h">
                <button
                  className="faq-q"
                  type="button"
                  aria-expanded={open}
                  aria-controls={aId}
                  id={qId}
                  onClick={() => setOpenIdx(open ? null : i)}
                >
                  <span className="t">{item.q}</span>
                  <span className="plus" aria-hidden="true" />
                </button>
              </h3>
              <div
                className="faq-a"
                id={aId}
                aria-labelledby={qId}
                inert={!open ? true : undefined}
              >
                <div className="body">{renderRich(item.a)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

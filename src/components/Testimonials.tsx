import { TESTIMONIALS } from "@/lib/content";

function renderRich(text: string) {
  const parts = text.split(/__(.+?)__/g);
  return parts.map((p, i) => (i % 2 === 1 ? <strong key={i}>{p}</strong> : <span key={i}>{p}</span>));
}

export function Testimonials() {
  return (
    <section className="testimonials" id="testimonials" aria-labelledby="testi-title">
      <div className="section-head reveal">
        <div className="section-tag">Отзывы</div>
        <h2 className="section-title" id="testi-title">
          Что говорят <em>те, для кого делали.</em>
        </h2>
        <p className="section-aside">
          Пара слов от людей, чьи продукты мы запустили. Захотите — сведём с ними напрямую,
          спросите что угодно.
        </p>
      </div>

      <div className="testi-grid">
        {/* Без разметки schema.org/Review: отзывы о себе на своём сайте не имеют
            права на review snippet, а невидимый рейтинг — риск ручных санкций. */}
        {TESTIMONIALS.map((t) => (
          <figure className="testi reveal" key={t.name}>
            <blockquote className="quote">
              {renderRich(t.quote)}
            </blockquote>
            <figcaption className="author">
              <div className="avatar" aria-hidden="true">{t.initials}</div>
              <div className="who">
                <div className="name">{t.name}</div>
                <div className="role">{t.role}</div>
              </div>
              <div className="stat" aria-label={`Результат: ${t.statValue} ${t.statLabel}`}>
                <b>{t.statValue}</b>
                <small>{t.statLabel}</small>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

import { TESTIMONIALS } from "@/lib/content";

function renderRich(text: string) {
  const parts = text.split(/__(.+?)__/g);
  return parts.map((p, i) => (i % 2 === 1 ? <b key={i}>{p}</b> : <span key={i}>{p}</span>));
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
        {TESTIMONIALS.map((t) => (
          <figure
            className="testi reveal"
            key={t.name}
            itemScope
            itemType="https://schema.org/Review"
          >
            <blockquote className="quote" itemProp="reviewBody">
              {renderRich(t.quote)}
            </blockquote>
            <figcaption className="author">
              <div className="avatar" aria-hidden="true">{t.initials}</div>
              <div className="who" itemProp="author" itemScope itemType="https://schema.org/Person">
                <div className="name" itemProp="name">{t.name}</div>
                <div className="role">{t.role}</div>
              </div>
              <div className="stat" aria-label={`Результат: ${t.statValue} ${t.statLabel}`}>
                <b>{t.statValue}</b>
                <small>{t.statLabel}</small>
              </div>
              <meta itemProp="reviewRating" content="5" />
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

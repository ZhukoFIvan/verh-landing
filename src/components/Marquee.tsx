export function Marquee() {
  const items = [
    "Сайты и лендинги",
    "Веб-приложения",
    "Telegram-боты",
    "AI / LLM",
    "Дизайн интерфейсов",
    "Next.js",
  ];
  return (
    // Дубликат пунктов нужен только для бесшовного лупа анимации —
    // прячем его от скринридеров, чтобы текст не читался дважды.
    <div className="marquee">
      <div className="marquee-track">
        {items.map((t, i) => (
          <span key={`a-${i}`} className={i % 2 ? "alt" : ""}>{t}</span>
        ))}
        {items.map((t, i) => (
          <span key={`b-${i}`} className={i % 2 ? "alt" : ""} aria-hidden="true">{t}</span>
        ))}
      </div>
    </div>
  );
}

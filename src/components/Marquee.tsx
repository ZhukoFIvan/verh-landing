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
    <div className="marquee" aria-label="Что мы делаем">
      <div className="marquee-track">
        {[...items, ...items].map((t, i) => (
          <span key={i} className={i % 2 ? "alt" : ""}>{t}</span>
        ))}
      </div>
    </div>
  );
}

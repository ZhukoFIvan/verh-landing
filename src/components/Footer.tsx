import { SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="foot" aria-label="Подвал сайта">
      <div>© VERH · 2026</div>
      <div className="center socials">
        <a href={SITE.telegram} target="_blank" rel="noopener noreferrer">Telegram</a>
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
        <a href="/privacy">Политика конфиденциальности</a>
      </div>
      <div className="right">Москва · сделано вручную</div>
    </footer>
  );
}

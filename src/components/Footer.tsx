import { SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="foot" aria-label="Подвал сайта">
      <div className="foot-main">
        <div className="foot-brand">
          <a href="#hero" className="foot-logo-link" aria-label="VERH — наверх">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="foot-logo" src="/logo-footer.svg" alt="VERH — веб-студия" width={168} height={49} />
          </a>
          <p className="foot-tag">
            Сайты, Telegram-боты и веб-приложения. Дизайн и код в одних руках — от идеи до прода.
          </p>
          <span className="foot-status">Берём новые проекты</span>
        </div>

        <nav className="foot-links" aria-label="Навигация в подвале">
          <span className="foot-h">Навигация</span>
          <a href="#work">Работы</a>
          <a href="#services">Услуги</a>
          <a href="#about">Студия</a>
          <a href="#faq">FAQ</a>
        </nav>

        <nav className="foot-links" aria-label="Контакты">
          <span className="foot-h">Контакты</span>
          <a href={SITE.telegram} target="_blank" rel="noopener noreferrer">Telegram</a>
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          <a href="/privacy">Политика конфиденциальности</a>
        </nav>
      </div>

      <div className="foot-bottom">
        <span>© VERH · 2026</span>
        <span>Москва · сделано вручную</span>
      </div>
    </footer>
  );
}

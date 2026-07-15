import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 — страница не найдена",
  description:
    "Эта страница не найдена. Вернитесь на главную VERH — веб-студии, или посмотрите работы, услуги и FAQ.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <nav className="top" id="topnav" aria-label="Главная навигация">
        <Link href="/" className="logo" aria-label="VERH — на главную">
          <svg className="logo-mark" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path className="leg" d="M11 5 L20 21" />
            <path className="peak" d="M3 21 L10 2.5 L7.4 21 Z" />
          </svg>
          verh
        </Link>
        <div className="links" />
        <Link href="/#contact" className="nav-cta">Начать проект</Link>
      </nav>

      <main className="nf-wrap" id="main">
        <div className="nf-content">
          <div className="nf-num">404</div>
          <div className="nf-info">
            <div className="nf-pre">Страница не найдена</div>
            <h1>Не туда свернули — бывает.</h1>
            <p>
              Этой страницы либо <b>никогда не было</b>, либо она переехала, либо в адресе опечатка.
              Поднимемся обратно?
            </p>
            <div className="nf-actions">
              <Link href="/" className="btn primary">
                <span>На главную</span>
                <span className="arrow" aria-hidden="true">→</span>
              </Link>
              <Link href="/#contact" className="btn ghost">
                <span>Написать нам</span>
                <span className="arrow" aria-hidden="true">↗</span>
              </Link>
            </div>
            <div className="nf-suggest">
              <div className="k">Может, вы искали:</div>
              <ul>
                <li><Link href="/#work">Работы</Link></li>
                <li><Link href="/#services">Услуги</Link></li>
                <li><Link href="/#faq">FAQ</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <footer className="nf-foot">
          <div>© VERH · 2019—2026</div>
          <div className="center">Ошибка 404</div>
          <div className="right">Москва</div>
        </footer>
      </main>
    </>
  );
}

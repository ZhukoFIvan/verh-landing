"use client";

import { useState } from "react";
import { NAV_LINKS, SITE } from "@/lib/site";

export function Nav() {
  const [open, setOpen] = useState(false);

  const toggle = (next?: boolean) => {
    const v = typeof next === "boolean" ? next : !open;
    setOpen(v);
    document.body.style.overflow = v ? "hidden" : "";
  };

  return (
    <>
      <nav className="top" id="topnav" aria-label="Главная навигация">
        <a href="#hero" className="logo" aria-label="VERH — на главную">
          <svg className="logo-mark" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path className="leg" d="M11 5 L20 21" />
            <path className="peak" d="M3 21 L10 2.5 L7.4 21 Z" />
          </svg>
          verh
        </a>
        <div className="links">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </div>
        <a href="#contact" className="nav-cta">Начать проект</a>
        <button
          className={`burger${open ? " open" : ""}`}
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={open}
          aria-controls="mmenu"
          onClick={() => toggle()}
          type="button"
        />
      </nav>

      <div className={`mobile-menu${open ? " open" : ""}`} id="mmenu" aria-hidden={!open} inert={!open ? true : undefined}>
        <div className="links-m">
          {NAV_LINKS.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setTimeout(() => toggle(false), 50)}
            >
              <span className="n mono">/{String(i + 1).padStart(2, "0")}</span>
              {l.label}
            </a>
          ))}
        </div>
        <div className="m-foot">
          <span className="m-status">Берём новые проекты</span>
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          <a href={SITE.telegram} target="_blank" rel="noopener noreferrer">
            {SITE.telegramHandle} в Telegram
          </a>
        </div>
      </div>
    </>
  );
}

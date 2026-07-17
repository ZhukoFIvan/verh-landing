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
          <svg className="logo-mark" viewBox="0 0 141.7 141.7" aria-hidden="true" focusable="false">
            <path d="M128.5,0H13.2C5.9,0,0,5.9,0,13.2s5.9,13.2,13.2,13.2h83.3L3.9,119.1c-5.2,5.2-5.2,13.6,0,18.7c5.2,5.2,13.5,5.2,18.7,0l92.7-92.7v83.3c0,7.3,5.9,13.2,13.2,13.2c7.3,0,13.2-5.9,13.2-13.2V13.2C141.7,5.9,135.8,0,128.5,0z" />
            <path d="M81.4,96.2l-23,23c-5.2,5.2-5.2,13.5,0,18.7c5.2,5.2,13.5,5.2,18.7,0l23-23c5.2-5.2,5.2-13.6,0-18.7C95,91,86.6,91,81.4,96.2z" />
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

"use client";

import { useState } from "react";
import { SITE } from "@/lib/site";

const SERVICE_CHIPS = [
  "Сайт / лендинг",
  "Веб-приложение",
  "Telegram-бот",
  "AI-интеграция",
  "Брендинг",
  "Редизайн",
  "Пока не знаю",
] as const;

const BUDGET_CHIPS = ["до 300k ₽", "300—700k ₽", "700k — 1.5M ₽", "1.5M+ ₽", "обсудим"] as const;

export function Contact() {
  const [services, setServices] = useState<Set<string>>(new Set());
  const [budget, setBudget] = useState<string>("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);
  // анти-спам: время с открытия формы (боты сабмитят мгновенно)
  const [startTs] = useState(() => Date.now());

  const toggleService = (s: string) => {
    setServices((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(false);
    setSending(true);

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      contact: String(data.get("tg") || ""),
      services: Array.from(services),
      budget,
      message: String(data.get("message") || ""),
      // анти-спам: honeypot (люди не видят и не заполняют) + время заполнения
      website: String(data.get("website") || ""),
      t: Date.now() - startTs,
    };

    try {
      const res = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("bad status");
      setSent(true);
    } catch {
      // фолбэк: если бэкенд не подключён — открываем почтовый клиент с готовым письмом
      const body = [
        `Имя: ${payload.name}`,
        `Почта: ${payload.email}`,
        `Telegram/телефон: ${payload.contact}`,
        `Что нужно: ${payload.services.join(", ") || "—"}`,
        `Бюджет: ${payload.budget || "—"}`,
        "",
        payload.message,
      ].join("\n");
      window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(
        "Бриф с сайта VERH",
      )}&body=${encodeURIComponent(body)}`;
      setError(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="contact-form" id="contact" aria-labelledby="contact-title">
      <div className="container">
        <div className="contact-info">
          <h2 className="reveal" id="contact-title">
            Расскажите, <span className="grad">что нужно.</span>
          </h2>
          <p className="reveal d1">
            Напишите пару слов о задаче — ответим в течение рабочего дня и предложим короткий созвон.
            Без презентаций и продаж, просто обсудим по делу. Мы в Москве, работаем удалённо
            по всей России и СНГ.
          </p>

          <div className="channel reveal d1">
            <div className="k">Почта</div>
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </div>
          <div className="channel reveal d2">
            <div className="k">Telegram</div>
            <a href={SITE.telegram} target="_blank" rel="noopener noreferrer">
              {SITE.telegramHandle}
            </a>
          </div>

          <div className="answer-time reveal d3">
            <div className="dot" aria-hidden="true" />
            <div>
              Среднее время ответа — <b>2 часа</b> в рабочее время
            </div>
          </div>
        </div>

        {sent ? (
          <div className="form-success show" role="status">
            ✓ <b>Бриф получен.</b> Ответим в течение рабочего дня на указанную почту. Если срочно —
            пишите в Telegram.
          </div>
        ) : (
          <form className="brief reveal d1" onSubmit={onSubmit} aria-label="Бриф на разработку сайта">
            {/* honeypot: скрыто от людей (CSS + tabIndex), боты заполняют автоматом */}
            <div className="hp-field" aria-hidden="true">
              <label htmlFor="cf-website">Сайт</label>
              <input id="cf-website" type="text" name="website" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="field">
              <label htmlFor="cf-name">
                Имя <span className="req">*</span>
              </label>
              <input id="cf-name" type="text" name="name" placeholder="Как к вам обращаться" required autoComplete="name" />
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="cf-email">
                  Почта <span className="req">*</span>
                </label>
                <input id="cf-email" type="email" name="email" placeholder="you@company.com" required autoComplete="email" />
              </div>
              <div className="field">
                <label htmlFor="cf-tg">Telegram / телефон</label>
                <input id="cf-tg" type="text" name="tg" placeholder="@username" autoComplete="tel" />
              </div>
            </div>

            <div className="field">
              <label id="cf-services-label">Что нужно</label>
              <div className="chips" role="group" aria-labelledby="cf-services-label">
                {SERVICE_CHIPS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`chip${services.has(s) ? " on" : ""}`}
                    aria-pressed={services.has(s)}
                    onClick={() => toggleService(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="field">
              <label id="cf-budget-label">Ориентир по бюджету</label>
              <div className="chips" role="group" aria-labelledby="cf-budget-label">
                {BUDGET_CHIPS.map((b) => (
                  <button
                    key={b}
                    type="button"
                    aria-pressed={budget === b}
                    className={`chip${budget === b ? " on" : ""}`}
                    onClick={() => setBudget((prev) => (prev === b ? "" : b))}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div className="field">
              <label htmlFor="cf-msg">Расскажите про проект</label>
              <textarea
                id="cf-msg"
                name="message"
                placeholder="О чём бизнес, какая задача, ссылки на текущий сайт или референсы — всё, что захотите. Чем подробнее, тем точнее отвечу."
              />
            </div>

            {error && (
              <div className="form-note" role="status">
                Открыли письмо в вашем почтовом клиенте — отправьте его, и мы ответим. Или напишите
                напрямую в{" "}
                <a href={SITE.telegram} target="_blank" rel="noopener noreferrer">Telegram</a>.
              </div>
            )}

            <div className="submit-row">
              <div className="hint">
                Нажимая «Отправить», вы соглашаетесь с{" "}
                <a href="/privacy">политикой обработки данных</a>. Спама не будет — только ответ по делу.
              </div>
              <button type="submit" className="submit-btn" disabled={sending}>
                <span>{sending ? "Отправляю…" : "Отправить бриф"}</span>
                <span className="arrow" aria-hidden="true">→</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

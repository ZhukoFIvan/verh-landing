import { NextResponse } from "next/server";

// Приём брифа. Если заданы TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID —
// отправляем заявку в Telegram. Иначе возвращаем 501, и фронт открывает mailto-фолбэк.
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad-json" }, { status: 400 });
  }

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  if (!name || !email) {
    return NextResponse.json({ ok: false, error: "missing-fields" }, { status: 422 });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    // Бэкенд не настроен — сообщаем фронту, чтобы он открыл почтовый клиент.
    return NextResponse.json({ ok: false, error: "not-configured" }, { status: 501 });
  }

  const services = Array.isArray(body.services) ? body.services.join(", ") : "";
  const text = [
    "🟢 Новый бриф с сайта VERH",
    "",
    `Имя: ${name}`,
    `Почта: ${email}`,
    `Контакт: ${body.contact || "—"}`,
    `Что нужно: ${services || "—"}`,
    `Бюджет: ${body.budget || "—"}`,
    "",
    String(body.message || "").trim() || "(без описания)",
  ].join("\n");

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error("tg-failed");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "send-failed" }, { status: 502 });
  } finally {
    clearTimeout(timer);
  }
}

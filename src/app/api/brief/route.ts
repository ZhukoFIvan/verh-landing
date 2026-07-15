import { NextResponse } from "next/server";
import { esc, notifyAdmins, botConfigured, adminIds } from "@/lib/telegram";
import { allow } from "@/lib/ratelimit";

// Приём брифа с формы сайта. Уведомление уходит в Telegram всем ID из
// TELEGRAM_ADMIN_IDS (через запятую). Если бот не настроен — 501, и фронт
// открывает mailto-фолбэк.
export async function POST(req: Request) {
  if (Number(req.headers.get("content-length") ?? 0) > 65536) {
    return NextResponse.json({ ok: false, error: "too-large" }, { status: 413 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad-json" }, { status: 400 });
  }

  // ── анти-спам ──
  // 1) honeypot: скрытое поле, люди его не видят — заполнено значит бот.
  //    Отвечаем «успехом», чтобы спамер не подбирал обход.
  if (String(body.website || "").trim()) {
    return NextResponse.json({ ok: true });
  }
  // 2) тайм-гейт: человек не заполняет бриф быстрее 3 секунд
  const elapsed = Number(body.t ?? NaN);
  if (Number.isFinite(elapsed) && elapsed >= 0 && elapsed < 3000) {
    return NextResponse.json({ ok: true });
  }
  // 3) частота с одного IP: максимум 5 заявок за 10 минут
  const ip =
    req.headers.get("x-real-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  if (!allow(`brief:${ip}`, 5, 10 * 60_000)) {
    return NextResponse.json({ ok: false, error: "rate-limited" }, { status: 429 });
  }

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  if (!name || !email) {
    return NextResponse.json({ ok: false, error: "missing-fields" }, { status: 422 });
  }

  // страховка от потери лида: в лог до сетевых вызовов (pm2 пишет в файл)
  console.log("[lead:site]", JSON.stringify({ name, email, at: new Date().toISOString() }));

  if (!botConfigured() || !adminIds().length) {
    // бэкенд не настроен — сообщаем фронту, чтобы он открыл почтовый клиент
    return NextResponse.json({ ok: false, error: "not-configured" }, { status: 501 });
  }

  const services = Array.isArray(body.services) ? body.services.join(", ") : "";
  const text = [
    "🟢 <b>Новый бриф с сайта</b>",
    "",
    `Имя: ${esc(name.slice(0, 200))}`,
    `Почта: ${esc(email.slice(0, 200))}`,
    `Контакт: ${esc(String(body.contact || "—").slice(0, 200))}`,
    `Что нужно: ${esc(services || "—")}`,
    `Бюджет: ${esc(String(body.budget || "—").slice(0, 100))}`,
    "",
    esc(String(body.message || "").trim().slice(0, 3000) || "(без описания)"),
  ].join("\n");

  const delivered = await notifyAdmins(text);
  if (!delivered) {
    return NextResponse.json({ ok: false, error: "send-failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}

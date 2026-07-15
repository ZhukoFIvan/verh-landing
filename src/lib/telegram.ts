// Обёртка над Telegram Bot API: один токен, рассылка уведомлений админам.
// Токен и список получателей живут только в env — в коде и репозитории их нет.

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;

/** ID админов из TELEGRAM_ADMIN_IDS (через запятую); TELEGRAM_CHAT_ID — легаси-фолбэк. */
export function adminIds(): string[] {
  const raw = process.env.TELEGRAM_ADMIN_IDS ?? process.env.TELEGRAM_CHAT_ID ?? "";
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function botConfigured(): boolean {
  return Boolean(TOKEN);
}

/** Вызов метода Bot API с таймаутом. Бросает при ошибке — ловить на месте вызова. */
export async function tg(
  method: string,
  payload: Record<string, unknown>,
  timeoutMs = 8000,
): Promise<unknown> {
  if (!TOKEN) throw new Error("tg-not-configured");
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`https://api.telegram.org/bot${TOKEN}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: ctrl.signal,
    });
    const data = (await res.json().catch(() => null)) as { ok?: boolean; result?: unknown } | null;
    if (!res.ok || !data?.ok) throw new Error(`tg-${method}-failed`);
    return data.result;
  } finally {
    clearTimeout(timer);
  }
}

/** Экранирование для parse_mode: "HTML" — обязательно для любого пользовательского текста. */
export const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Шлёт HTML-сообщение всем админам. true — если доставлено хотя бы одному. */
export async function notifyAdmins(html: string): Promise<boolean> {
  const ids = adminIds();
  if (!ids.length) return false;
  const results = await Promise.allSettled(
    ids.map((id) =>
      tg("sendMessage", {
        chat_id: id,
        text: html,
        parse_mode: "HTML",
        link_preview_options: { is_disabled: true },
      }),
    ),
  );
  return results.some((r) => r.status === "fulfilled");
}

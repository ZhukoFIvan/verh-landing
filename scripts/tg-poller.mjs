// Long-polling мост для @verhstudio_bot.
//
// Зачем: сервер на RU-хостинге (Timeweb) — Telegram НЕ может стабильно достучаться
// до него входящими вебхуками (throttling Telegram в РФ, входящие пакеты Telegram→сервер
// теряются). А ИСХОДЯЩИЙ канал сервер→api.telegram.org работает быстро (~0.3с).
// Поэтому вместо webhook сервер сам ЗАБИРАЕТ апдейты через getUpdates и отдаёт их
// локальному вебхук-роуту (127.0.0.1:PORT/api/tg/webhook) с тем же секретом —
// логика бота (сессии, меню, заявки) не меняется вообще.
//
// Запуск (pm2): pm2 start scripts/tg-poller.mjs --name verh-tg-poller
// Требует: TELEGRAM_BOT_TOKEN, TELEGRAM_WEBHOOK_SECRET (читает и из .env рядом).

import { readFileSync } from "node:fs";

// Самодостаточная загрузка .env: не зависим от того, как pm2 прокинул окружение
// (именно из-за пустого env при рестарте раньше отваливался вебхук-секрет).
function loadEnv() {
  try {
    const txt = readFileSync(new URL("../.env", import.meta.url), "utf8");
    for (const line of txt.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
      if (m && process.env[m[1]] === undefined) {
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
      }
    }
  } catch {
    /* .env рядом нет — берём то, что дал pm2/окружение */
  }
}
loadEnv();

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const SECRET = process.env.TELEGRAM_WEBHOOK_SECRET || "";
const PORT = process.env.PORT || "3001";
const LOCAL = `http://127.0.0.1:${PORT}/api/tg/webhook`;
const API = `https://api.telegram.org/bot${TOKEN}`;
const POLL_TIMEOUT = 20; // сек, long-poll

if (!TOKEN) {
  console.error("[poller] TELEGRAM_BOT_TOKEN не задан — выходим");
  process.exit(1);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(method, params, timeoutMs = 30000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`${API}/${method}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(params || {}),
      signal: ctrl.signal,
    });
    return await res.json();
  } finally {
    clearTimeout(t);
  }
}

// Отдаём апдейт локальному вебхук-роуту так же, как это делал бы Telegram.
async function deliver(update) {
  try {
    const res = await fetch(LOCAL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-telegram-bot-api-secret-token": SECRET,
      },
      body: JSON.stringify(update),
    });
    if (!res.ok) {
      console.error(`[poller] локальная доставка update ${update.update_id}: HTTP ${res.status}`);
    }
  } catch (e) {
    console.error(`[poller] ошибка доставки update ${update.update_id}:`, e?.message || e);
  }
}

let offset = 0;
let stopped = false;

async function main() {
  // getUpdates и webhook взаимоисключающи — снимаем вебхук. drop_pending_updates=false,
  // чтобы уже накопившиеся апдейты (например, /start во время сбоя) обработались.
  const del = await api("deleteWebhook", { drop_pending_updates: false });
  console.log("[poller] deleteWebhook:", JSON.stringify(del));
  console.log(`[poller] старт long-polling → ${LOCAL} (секрет ${SECRET ? "есть" : "ПУСТ!"})`);

  let backoff = 1000;
  while (!stopped) {
    try {
      const data = await api(
        "getUpdates",
        { offset, timeout: POLL_TIMEOUT, allowed_updates: ["message", "callback_query"] },
        (POLL_TIMEOUT + 10) * 1000,
      );
      if (!data || !data.ok) {
        console.error("[poller] getUpdates:", JSON.stringify(data));
        await sleep(backoff);
        backoff = Math.min(backoff * 2, 15000);
        continue;
      }
      backoff = 1000;
      for (const upd of data.result) {
        offset = upd.update_id + 1;
        await deliver(upd);
      }
    } catch (e) {
      // AbortError на длинном опросе без апдейтов — норма, просто повторяем
      if (e?.name !== "AbortError") console.error("[poller] цикл:", e?.message || e);
      await sleep(1000);
    }
  }
  console.log("[poller] остановлен");
}

process.on("SIGTERM", () => { stopped = true; });
process.on("SIGINT", () => { stopped = true; });

main();

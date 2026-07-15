import { NextResponse } from "next/server";
import { tg, esc, notifyAdmins, botConfigured } from "@/lib/telegram";
import { allow } from "@/lib/ratelimit";
import { SITE } from "@/lib/site";
import { WORKS, SERVICES } from "@/lib/content";

// Вебхук @verhstudio_bot: меню студии + пошаговая заявка прямо в чате.
// Диалог хранится в памяти процесса (pm2 fork, 1 инстанс) — после рестарта
// пользователь просто начнёт заново с /start, для лид-бота этого достаточно.

type Session = {
  step: "service" | "budget" | "desc" | "contact" | "confirm";
  service?: string;
  budget?: string;
  desc?: string;
  contact?: string;
  ts: number;
};

const sessions = new Map<number, Session>();
const SESSION_TTL = 30 * 60 * 1000;

function getSession(chatId: number): Session | undefined {
  const s = sessions.get(chatId);
  if (s && Date.now() - s.ts > SESSION_TTL) {
    sessions.delete(chatId);
    return undefined;
  }
  return s;
}

const SERVICES_KB = [
  ["Сайт / лендинг", "Веб-приложение"],
  ["Telegram-бот", "AI-интеграция"],
  ["Другое / не знаю"],
];
const BUDGET_KB = [
  ["до 300k ₽", "300—700k ₽"],
  ["700k — 1.5M ₽", "1.5M+ ₽"],
  ["Обсудим"],
];

const kb = (rows: string[][], prefix: string) => ({
  inline_keyboard: rows.map((row) =>
    row.map((label) => ({ text: label, callback_data: `${prefix}:${label}` })),
  ),
});

const MENU_KB = {
  inline_keyboard: [
    [{ text: "📝 Оставить заявку", callback_data: "menu:brief" }],
    [
      { text: "💼 Работы", callback_data: "menu:works" },
      { text: "🛠 Услуги", callback_data: "menu:services" },
    ],
    [{ text: "📞 Контакты", callback_data: "menu:contacts" }],
  ],
};

const BACK_KB = {
  inline_keyboard: [
    [{ text: "📝 Оставить заявку", callback_data: "menu:brief" }],
    [{ text: "← Меню", callback_data: "menu:main" }],
  ],
};

const say = (chatId: number, text: string, reply_markup?: object) =>
  tg("sendMessage", {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
    link_preview_options: { is_disabled: true },
    ...(reply_markup ? { reply_markup } : {}),
  }).catch(() => {});

const MENU_TEXT = [
  "Привет! Это бот студии <b>VERH</b> — делаем сайты, Telegram-ботов и веб-приложения.",
  "",
  "Расскажите о задаче прямо здесь — ответим в течение рабочего дня. Или посмотрите, что мы уже сделали.",
].join("\n");

function worksText(): string {
  const items = WORKS.map((w) => {
    const title = w.accent ? `${w.title} ${w.accent}` : w.title;
    return `<b>${esc(title)}</b> — ${esc(w.industry)}\n${esc(w.metric)}`;
  });
  return [
    "<b>Наши работы</b>",
    "",
    items.join("\n\n"),
    "",
    `Подробнее с картинками: ${SITE.url}/#work`,
  ].join("\n");
}

function servicesText(): string {
  const items = SERVICES.map((s) => `• <b>${esc(s.name)}</b> — ${esc(s.short)}`);
  return ["<b>Чем можем помочь</b>", "", items.join("\n"), "", `Детали: ${SITE.url}/#services`].join("\n");
}

function contactsText(): string {
  return [
    "<b>Контакты</b>",
    "",
    `Почта: ${esc(SITE.email)}`,
    `Telegram: ${esc(SITE.telegramHandle)}`,
    `Сайт: ${SITE.url}`,
    "",
    "Мы в Москве, работаем удалённо по всей России и СНГ.",
  ].join("\n");
}

function summaryText(s: Session): string {
  return [
    "<b>Проверьте заявку:</b>",
    "",
    `Что нужно: ${esc(s.service ?? "—")}`,
    `Бюджет: ${esc(s.budget ?? "—")}`,
    `Задача: ${esc(s.desc ?? "—")}`,
    `Контакт: ${esc(s.contact ?? "—")}`,
  ].join("\n");
}

type TgUser = { id: number; first_name?: string; last_name?: string; username?: string };

function userLabel(u: TgUser | undefined): string {
  if (!u) return "неизвестно";
  const name = [u.first_name, u.last_name].filter(Boolean).join(" ") || "без имени";
  const uname = u.username ? ` (@${u.username})` : "";
  return `${esc(name)}${uname} · id ${u.id}`;
}

async function startBrief(chatId: number) {
  sessions.set(chatId, { step: "service", ts: Date.now() });
  await say(chatId, "Что нужно сделать?", kb(SERVICES_KB, "svc"));
}

async function finishBrief(chatId: number, s: Session, from: TgUser | undefined) {
  // страховка от потери лида: пишем в stdout ДО любых сетевых вызовов —
  // pm2 складывает это в лог-файл, откуда заявку можно достать даже при сбое доставки
  console.log("[lead]", JSON.stringify({ from, ...s, at: new Date().toISOString() }));

  const delivered = await notifyAdmins(
    [
      "🟢 <b>Новая заявка из бота</b>",
      "",
      `От: ${userLabel(from)}`,
      `Что нужно: ${esc(s.service ?? "—")}`,
      `Бюджет: ${esc(s.budget ?? "—")}`,
      `Контакт: ${esc(s.contact ?? "—")}`,
      "",
      esc(s.desc ?? "(без описания)"),
    ].join("\n"),
  );
  sessions.delete(chatId);
  if (delivered) {
    await say(chatId, "Спасибо! Заявка у нас — ответим в течение рабочего дня. 🤝", BACK_KB);
  } else {
    // доставка админам не удалась — честно говорим и даём прямой контакт
    await say(
      chatId,
      `Заявку записали, но на всякий случай продублируйте нам напрямую: ${esc(SITE.telegramHandle)} или ${esc(SITE.email)} — так точно не потеряется.`,
      BACK_KB,
    );
  }
}

// сообщение для устаревших кнопок из истории чата
const STALE_TEXT = "Эта кнопка из старого диалога. Начнём заново?";

export async function POST(req: Request) {
  if (!botConfigured()) return NextResponse.json({ ok: true });

  // защита вебхука: Telegram шлёт секрет в заголовке, чужие запросы отбрасываем
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (secret && req.headers.get("x-telegram-bot-api-secret-token") !== secret) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  // мусорные payload'ы не парсим (Telegram таких не шлёт)
  if (Number(req.headers.get("content-length") ?? 0) > 65536) {
    return NextResponse.json({ ok: true });
  }

  let update: Record<string, unknown>;
  try {
    update = await req.json();
  } catch {
    return NextResponse.json({ ok: true });
  }

  try {
    // ── нажатия inline-кнопок ──
    const cq = update.callback_query as
      | { id: string; data?: string; from?: TgUser; message?: { chat: { id: number; type?: string } } }
      | undefined;
    if (cq?.message) {
      const chatId = cq.message.chat.id;
      // лид-бот работает только в личке; флуд-контроль на кликера
      if ((cq.message.chat.type ?? "private") !== "private") return NextResponse.json({ ok: true });
      if (!allow(`tg:${chatId}`, 20, 60_000)) {
        await tg("answerCallbackQuery", { callback_query_id: cq.id }).catch(() => {});
        return NextResponse.json({ ok: true });
      }
      const data = cq.data ?? "";
      await tg("answerCallbackQuery", { callback_query_id: cq.id }).catch(() => {});

      if (data === "menu:main") await say(chatId, MENU_TEXT, MENU_KB);
      else if (data === "menu:brief") await startBrief(chatId);
      else if (data === "menu:works") await say(chatId, worksText(), BACK_KB);
      else if (data === "menu:services") await say(chatId, servicesText(), BACK_KB);
      else if (data === "menu:contacts") await say(chatId, contactsText(), BACK_KB);
      else if (data.startsWith("svc:")) {
        const existing = getSession(chatId);
        if (existing && existing.step !== "service") {
          await say(chatId, STALE_TEXT, MENU_KB);
        } else {
          const s = existing ?? { step: "service" as const, ts: Date.now() };
          s.service = data.slice(4);
          s.step = "budget";
          s.ts = Date.now();
          sessions.set(chatId, s);
          await say(chatId, "Ориентир по бюджету?", kb(BUDGET_KB, "bud"));
        }
      } else if (data.startsWith("bud:")) {
        const s = getSession(chatId);
        if (s && s.step === "budget") {
          s.budget = data.slice(4);
          s.step = "desc";
          s.ts = Date.now();
          await say(
            chatId,
            "Расскажите пару слов о задаче: о чём бизнес, что должно получиться, есть ли примеры. Одним сообщением.",
          );
        } else {
          await say(chatId, STALE_TEXT, MENU_KB);
        }
      } else if (data.startsWith("contact:username")) {
        const s = getSession(chatId);
        if (s && s.step === "contact" && cq.from?.username) {
          s.contact = `@${cq.from.username}`;
          s.step = "confirm";
          s.ts = Date.now();
          await say(chatId, summaryText(s), {
            inline_keyboard: [
              [{ text: "🚀 Отправить", callback_data: "brief:send" }],
              [{ text: "✖️ Отменить", callback_data: "brief:cancel" }],
            ],
          });
        } else {
          await say(chatId, STALE_TEXT, MENU_KB);
        }
      } else if (data === "brief:send") {
        const s = getSession(chatId);
        if (s && s.step === "confirm") {
          // кулдаун на повторные заявки: максимум 2 за 5 минут с одного чата
          if (!allow(`lead:${chatId}`, 2, 5 * 60_000)) {
            sessions.delete(chatId);
            await say(chatId, "Заявка уже у нас — ответим на первую в течение рабочего дня. 🤝", BACK_KB);
          } else {
            await finishBrief(chatId, s, cq.from);
          }
        } else if (s) await say(chatId, STALE_TEXT, MENU_KB);
        else await say(chatId, "Заявка уже отправлена или устарела. Начать заново?", MENU_KB);
      } else if (data === "brief:cancel") {
        sessions.delete(chatId);
        await say(chatId, "Отменил. Вернуться в меню:", MENU_KB);
      }
      return NextResponse.json({ ok: true });
    }

    // ── обычные сообщения ──
    const msg = update.message as
      | { chat: { id: number; type?: string }; text?: string; from?: TgUser }
      | undefined;
    if (!msg?.chat) return NextResponse.json({ ok: true });
    if ((msg.chat.type ?? "private") !== "private") return NextResponse.json({ ok: true });

    const chatId = msg.chat.id;
    if (!allow(`tg:${chatId}`, 20, 60_000)) return NextResponse.json({ ok: true });
    const text = (msg.text ?? "").trim();

    if (text.startsWith("/start")) {
      sessions.delete(chatId);
      await say(chatId, MENU_TEXT, MENU_KB);
    } else if (text.startsWith("/id")) {
      // помогает узнать свой ID для TELEGRAM_ADMIN_IDS
      await say(chatId, `Ваш chat id: <code>${chatId}</code>`);
    } else if (text.startsWith("/cancel")) {
      sessions.delete(chatId);
      await say(chatId, "Ок, отменил. Вернуться в меню:", MENU_KB);
    } else {
      const s = getSession(chatId);
      if (s?.step === "service" && text) {
        // человек ответил текстом вместо кнопки — принимаем как есть
        s.service = text.slice(0, 100);
        s.step = "budget";
        s.ts = Date.now();
        await say(chatId, "Ориентир по бюджету?", kb(BUDGET_KB, "bud"));
      } else if (s?.step === "budget" && text) {
        s.budget = text.slice(0, 100);
        s.step = "desc";
        s.ts = Date.now();
        await say(
          chatId,
          "Расскажите пару слов о задаче: о чём бизнес, что должно получиться, есть ли примеры. Одним сообщением.",
        );
      } else if (s?.step === "desc" && text) {
        s.desc = text.slice(0, 2000);
        s.step = "contact";
        s.ts = Date.now();
        const uname = msg.from?.username;
        await say(
          chatId,
          "Как с вами связаться? Напишите телефон, почту или ник в Telegram.",
          uname
            ? {
                inline_keyboard: [
                  [{ text: `Пишите мне: @${uname}`, callback_data: "contact:username" }],
                ],
              }
            : undefined,
        );
      } else if (s?.step === "contact" && text) {
        s.contact = text.slice(0, 200);
        s.step = "confirm";
        s.ts = Date.now();
        await say(chatId, summaryText(s), {
          inline_keyboard: [
            [{ text: "🚀 Отправить", callback_data: "brief:send" }],
            [{ text: "✖️ Отменить", callback_data: "brief:cancel" }],
          ],
        });
      } else if (s?.step === "confirm") {
        await say(chatId, "Проверьте заявку выше и нажмите «🚀 Отправить» или «✖️ Отменить».");
      } else {
        await say(chatId, "Я бот-приёмная студии VERH. Выберите, что нужно:", MENU_KB);
      }
    }
  } catch {
    // вебхук всегда отвечает 200 — иначе Telegram будет ретраить впустую
  }
  return NextResponse.json({ ok: true });
}

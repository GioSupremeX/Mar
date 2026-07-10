import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import { db, guestbookMessages, siteSettings } from "@workspace/db";
import { CreateGuestbookMessageBody, ListGuestbookMessagesResponse, ListGuestbookMessagesResponseItem } from "@workspace/api-zod";
import { requireAdmin } from "../lib/auth";

const router: IRouter = Router();

router.get("/guestbook", async (_req, res): Promise<void> => {
  const messages = await db
    .select()
    .from(guestbookMessages)
    .orderBy(desc(guestbookMessages.createdAt));
  res.json(ListGuestbookMessagesResponse.parse(messages));
});

interface PostAttemptState {
  count: number;
  lastPostAt: number;
}
const postAttempts = new Map<string, PostAttemptState>();
const POST_LIMIT = 5;

async function getCooldownMs(): Promise<number> {
  const rows = await db.select().from(siteSettings).where(eq(siteSettings.key, "guestbookCooldownSeconds"));
  const val = rows[0]?.value ?? process.env.GUESTBOOK_COOLDOWN_SECONDS ?? "60";
  const num = parseInt(val, 10);
  return (isNaN(num) || num < 5 ? 60 : num) * 1000;
}

function getClientIp(req: any): string {
  return req.headers["x-forwarded-for"]?.split(",")[0]?.trim()
    || req.headers["x-real-ip"]
    || req.socket?.remoteAddress
    || "unknown";
}

function verifyChallenge(answer: string | undefined, challenge: string | undefined): boolean {
  if (!answer || typeof answer !== "string" || !challenge || typeof challenge !== "string") return false;
  try {
    const [a, b] = challenge.split("+").map((x) => parseInt(x.trim(), 10));
    return parseInt(answer, 10) === a + b;
  } catch { return false; }
}

function generateChallenge(): { q: string; a: string } {
  const a = Math.floor(Math.random() * 9) + 1;
  const b = Math.floor(Math.random() * 9) + 1;
  return { q: `${a} + ${b}`, a: String(a + b) };
}

router.get("/guestbook/challenge", (_req, res): void => {
  const challenge = generateChallenge();
  res.json({ challenge: challenge.q, expiresAt: Date.now() + 60_000 });
});

router.post("/guestbook", async (req, res): Promise<void> => {
  const parsed = CreateGuestbookMessageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const ip = getClientIp(req);
  const now = Date.now();
  const cooldownMs = await getCooldownMs();
  const state = postAttempts.get(ip) ?? { count: 0, lastPostAt: 0 };
  if (now - state.lastPostAt > cooldownMs) {
    state.count = 0;
  }
  if (state.count >= POST_LIMIT) {
    const remainingSec = Math.ceil((state.lastPostAt + cooldownMs - now) / 1000);
    res.status(429).json({ error: `Too many messages. Please wait ${remainingSec}s before posting again.`, cooldownSeconds: remainingSec });
    return;
  }

  if (!verifyChallenge(req.body.answer, req.body.challenge)) {
    res.status(400).json({ error: "Please solve the challenge correctly." });
    return;
  }

  const [message] = await db
    .insert(guestbookMessages)
    .values({ name: parsed.data.name, message: parsed.data.message, emoji: parsed.data.emoji })
    .returning();

  state.count++;
  state.lastPostAt = now;
  postAttempts.set(ip, state);
  res.status(201).json({
    ...ListGuestbookMessagesResponseItem.parse(message),
    cooldownSeconds: Math.ceil(cooldownMs / 1000),
  });
});

router.delete("/guestbook/:id", requireAdmin, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const [deleted] = await db
    .delete(guestbookMessages)
    .where(eq(guestbookMessages.id, id))
    .returning();
  if (!deleted) {
    res.status(404).json({ error: "Message not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;

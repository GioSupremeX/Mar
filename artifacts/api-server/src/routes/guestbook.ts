import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import { db, guestbookMessages } from "@workspace/db";
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

router.post("/guestbook", async (req, res): Promise<void> => {
  const parsed = CreateGuestbookMessageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [message] = await db
    .insert(guestbookMessages)
    .values(parsed.data)
    .returning();
  res.status(201).json(ListGuestbookMessagesResponseItem.parse(message));
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

import { Router, type IRouter } from "express";
import { desc } from "drizzle-orm";
import { db, guestbookMessages } from "@workspace/db";
import { CreateGuestbookMessageBody, ListGuestbookMessagesResponse, ListGuestbookMessagesResponseItem } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/guestbook", async (req, res): Promise<void> => {
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

export default router;

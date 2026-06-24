import { Router, type IRouter } from "express";
import { eq, asc } from "drizzle-orm";
import { db, artworks } from "@workspace/db";
import { requireAdmin } from "../lib/auth";
import { CreateArtworkBody, UpdateArtworkBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/artworks", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(artworks)
    .orderBy(asc(artworks.position), asc(artworks.createdAt));
  res.json(rows);
});

router.post("/artworks", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateArtworkBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [artwork] = await db.insert(artworks).values(parsed.data).returning();
  res.status(201).json(artwork);
});

router.put("/artworks/:id", requireAdmin, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const parsed = UpdateArtworkBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [artwork] = await db
    .update(artworks)
    .set(parsed.data)
    .where(eq(artworks.id, id))
    .returning();
  if (!artwork) {
    res.status(404).json({ error: "Artwork not found" });
    return;
  }
  res.json(artwork);
});

router.delete("/artworks/:id", requireAdmin, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const [deleted] = await db
    .delete(artworks)
    .where(eq(artworks.id, id))
    .returning();
  if (!deleted) {
    res.status(404).json({ error: "Artwork not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;

import { Router, type IRouter } from "express";
import { db, siteSettings } from "@workspace/db";
import { requireAdmin } from "../lib/auth";

const DEFAULTS: Record<string, string> = {
  artistName: "Art & Magic",
  tagline: "Digital artist, dragon tamer & professional daydreamer",
  bio: "Hi! I'm a passionate digital artist who loves drawing characters, fantasy creatures, and fan art. When I'm not sketching, you'll find me in Dragon Adventures, Forsaken, or Block Tales.",
  heroSubtitle: "Step inside to see my latest sketches, fan art, and adventures.",
  accentColor: "#C9B8F0",
};

async function getSettings(): Promise<Record<string, string>> {
  const rows = await db.select().from(siteSettings);
  const map: Record<string, string> = { ...DEFAULTS };
  for (const row of rows) {
    map[row.key] = row.value;
  }
  return map;
}

const router: IRouter = Router();

router.get("/settings", async (_req, res): Promise<void> => {
  res.json(await getSettings());
});

router.put("/settings", requireAdmin, async (req, res): Promise<void> => {
  const updates = req.body as Record<string, string>;
  const allowedKeys = ["artistName", "tagline", "bio", "heroSubtitle", "accentColor"];
  for (const [key, value] of Object.entries(updates)) {
    if (!allowedKeys.includes(key)) continue;
    if (typeof value !== "string") continue;
    await db
      .insert(siteSettings)
      .values({ key, value })
      .onConflictDoUpdate({ target: siteSettings.key, set: { value } });
  }
  res.json(await getSettings());
});

export default router;

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import type { Request, Response, NextFunction } from "express";
import { db, siteSettings } from "@workspace/db";
import { eq } from "drizzle-orm";

const JWT_SECRET = process.env.JWT_SECRET ?? process.env.SESSION_SECRET ?? "dev-secret-change-me";
const ADMIN_PASSWORD_HASH_ENV = process.env.ADMIN_PASSWORD_HASH ?? "";
const ADMIN_PASSWORD_PLAIN = process.env.ADMIN_PASSWORD ?? "admin123";

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const rows = await db.select().from(siteSettings).where(eq(siteSettings.key, "adminPasswordHash"));
  const hash = rows[0]?.value ?? ADMIN_PASSWORD_HASH_ENV;
  if (hash) {
    return bcrypt.compare(password, hash);
  }
  return password === ADMIN_PASSWORD_PLAIN;
}

export function signAdminToken(): string {
  return jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "24h" });
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const payload = jwt.verify(auth.slice(7), JWT_SECRET) as { role: string };
    if (payload.role !== "admin") throw new Error("not admin");
    next();
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
}

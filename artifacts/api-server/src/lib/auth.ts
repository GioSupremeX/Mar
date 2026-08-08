import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import type { Request, Response, NextFunction } from "express";
import { db, siteSettings } from "@workspace/db";
import { eq } from "drizzle-orm";

const configuredJwtSecret = process.env.JWT_SECRET ?? process.env.SESSION_SECRET;
if (!configuredJwtSecret) {
  throw new Error("JWT_SECRET or SESSION_SECRET must be configured.");
}
const JWT_SECRET: string = configuredJwtSecret;
const ADMIN_PASSWORD_HASH_ENV = process.env.ADMIN_PASSWORD_HASH ?? "";
const ADMIN_PASSWORD_PLAIN = process.env.ADMIN_PASSWORD ?? "";
const DUMMY_PASSWORD_HASH = "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy";

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const rows = await db.select().from(siteSettings).where(eq(siteSettings.key, "adminPasswordHash"));
  const hash = rows[0]?.value ?? ADMIN_PASSWORD_HASH_ENV;
  if (hash) {
    return bcrypt.compare(password, hash);
  }
  if (ADMIN_PASSWORD_PLAIN) {
    return password === ADMIN_PASSWORD_PLAIN;
  }
  // Keep timing consistent while failing closed when no password is configured.
  await bcrypt.compare(password, DUMMY_PASSWORD_HASH);
  return false;
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

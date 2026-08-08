import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import { db, siteSettings } from "@workspace/db";
import { verifyAdminPassword, signAdminToken, requireAdmin } from "../lib/auth";

const router: IRouter = Router();

interface AttemptState {
  failedAttempts: number;
  lockLevel: number;
  lockedUntil: number;
  lastFailureAt: number;
}
const loginAttempts = new Map<string, AttemptState>();
const ATTEMPTS_PER_LOCK = 3;
const LOCKOUT_SECONDS = [20, 50, 60, 180] as const;
const FAILURE_RESET_MS = 15 * 60 * 1000;
const GLOBAL_FAILURE_WINDOW_MS = 60 * 1000;
const GLOBAL_FAILURE_LIMIT = 12;
const GLOBAL_LOCK_SECONDS = 60;
const globalFailures: number[] = [];
let globalLockedUntil = 0;

function getClientIp(req: any): string {
  return req.ip
    || req.socket?.remoteAddress
    || "unknown";
}

function cleanOldAttempts() {
  const now = Date.now();
  for (const [ip, state] of loginAttempts) {
    if (now - state.lastFailureAt > FAILURE_RESET_MS) {
      loginAttempts.delete(ip);
    }
  }
  while (globalFailures[0] && now - globalFailures[0] > GLOBAL_FAILURE_WINDOW_MS) {
    globalFailures.shift();
  }
}

router.post("/admin/login", async (req, res): Promise<void> => {
  const { password } = req.body ?? {};
  if (!password || typeof password !== "string") {
    res.status(400).json({ error: "Password required" });
    return;
  }

  cleanOldAttempts();
  const ip = getClientIp(req);
  const now = Date.now();
  const state = loginAttempts.get(ip) ?? {
    failedAttempts: 0,
    lockLevel: 0,
    lockedUntil: 0,
    lastFailureAt: now,
  };

  if (now < state.lockedUntil) {
    const remaining = Math.ceil((state.lockedUntil - now) / 1000);
    res.setHeader("Retry-After", String(remaining));
    res.status(429).json({
      error: "Too many login attempts. Please try again later.",
      cooldownSeconds: remaining,
    });
    return;
  }

  if (now < globalLockedUntil) {
    const remaining = Math.ceil((globalLockedUntil - now) / 1000);
    res.setHeader("Retry-After", String(remaining));
    res.status(429).json({
      error: "Too many login attempts. Please try again later.",
      cooldownSeconds: remaining,
    });
    return;
  }

  const valid = await verifyAdminPassword(password);
  if (!valid) {
    const failedAttempts = state.failedAttempts + 1;
    const shouldLock = failedAttempts >= ATTEMPTS_PER_LOCK;
    const lockLevel = shouldLock ? Math.min(state.lockLevel, LOCKOUT_SECONDS.length - 1) : state.lockLevel;
    const lockSeconds = shouldLock ? LOCKOUT_SECONDS[lockLevel] : 0;
    const newState: AttemptState = {
      failedAttempts: shouldLock ? 0 : failedAttempts,
      lockLevel: shouldLock ? Math.min(lockLevel + 1, LOCKOUT_SECONDS.length - 1) : lockLevel,
      lockedUntil: shouldLock ? now + lockSeconds * 1000 : 0,
      lastFailureAt: now,
    };
    loginAttempts.set(ip, newState);
    globalFailures.push(now);

    if (globalFailures.length >= GLOBAL_FAILURE_LIMIT) {
      globalLockedUntil = now + GLOBAL_LOCK_SECONDS * 1000;
      globalFailures.length = 0;
    }

    if (shouldLock) {
      res.setHeader("Retry-After", String(lockSeconds));
      res.status(429).json({
        error: "Too many login attempts. Please try again later.",
        cooldownSeconds: lockSeconds,
      });
      return;
    }
    res.status(401).json({
      error: "Invalid login details.",
      attemptsRemaining: ATTEMPTS_PER_LOCK - failedAttempts,
    });
    return;
  }

  loginAttempts.delete(ip);
  res.json({ token: signAdminToken() });
});

/* Change admin password — requires current password + bearer auth */
router.post("/admin/change-password", requireAdmin, async (req, res): Promise<void> => {
  const { currentPassword, newPassword } = req.body ?? {};
  if (!currentPassword || !newPassword || typeof currentPassword !== "string" || typeof newPassword !== "string") {
    res.status(400).json({ error: "Current and new password required" });
    return;
  }
  if (newPassword.length < 12) {
    res.status(400).json({ error: "New password must be at least 12 characters" });
    return;
  }
  const valid = await verifyAdminPassword(currentPassword);
  if (!valid) {
    res.status(401).json({ error: "Current password is incorrect" });
    return;
  }
  const hash = await bcrypt.hash(newPassword, 10);
  await db
    .insert(siteSettings)
    .values({ key: "adminPasswordHash", value: hash })
    .onConflictDoUpdate({ target: siteSettings.key, set: { value: hash } });
  res.json({ success: true });
});

export default router;

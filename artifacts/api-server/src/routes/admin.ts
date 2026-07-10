import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import { verifyAdminPassword, signAdminToken } from "../lib/auth";

const router: IRouter = Router();

interface AttemptState {
  count: number;
  lockedUntil: number;
}
const loginAttempts = new Map<string, AttemptState>();
const MAX_ATTEMPTS = 3;
const COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes

function getClientIp(req: any): string {
  return req.headers["x-forwarded-for"]?.split(",")[0]?.trim()
    || req.headers["x-real-ip"]
    || req.socket?.remoteAddress
    || "unknown";
}

function cleanOldAttempts() {
  const now = Date.now();
  for (const [ip, state] of loginAttempts) {
    if (now > state.lockedUntil + COOLDOWN_MS) {
      loginAttempts.delete(ip);
    }
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
  const state = loginAttempts.get(ip) ?? { count: 0, lockedUntil: 0 };

  if (Date.now() < state.lockedUntil) {
    const remaining = Math.ceil((state.lockedUntil - Date.now()) / 1000);
    res.status(429).json({ error: `Too many attempts. Wait ${remaining}s.`, cooldownSeconds: remaining });
    return;
  }

  const valid = await verifyAdminPassword(password);
  if (!valid) {
    const newState: AttemptState = {
      count: state.count + 1,
      lockedUntil: state.count + 1 >= MAX_ATTEMPTS ? Date.now() + COOLDOWN_MS : 0,
    };
    loginAttempts.set(ip, newState);
    const remaining = MAX_ATTEMPTS - newState.count;
    if (remaining <= 0) {
      res.status(429).json({ error: "Too many attempts. Locked for 5 minutes.", cooldownSeconds: 300 });
      return;
    }
    res.status(401).json({ error: "Wrong password", attemptsRemaining: remaining });
    return;
  }

  loginAttempts.delete(ip);
  res.json({ token: signAdminToken() });
});

/* Change admin password — requires current password + rate limit */
router.post("/admin/change-password", async (req, res): Promise<void> => {
  const { currentPassword, newPassword } = req.body ?? {};
  if (!currentPassword || !newPassword || typeof currentPassword !== "string" || typeof newPassword !== "string") {
    res.status(400).json({ error: "Current and new password required" });
    return;
  }
  if (newPassword.length < 6) {
    res.status(400).json({ error: "New password must be at least 6 characters" });
    return;
  }
  const valid = await verifyAdminPassword(currentPassword);
  if (!valid) {
    res.status(401).json({ error: "Current password is incorrect" });
    return;
  }
  // Hash the new password and set it as ADMIN_PASSWORD_HASH
  const hash = await bcrypt.hash(newPassword, 10);
  process.env.ADMIN_PASSWORD_HASH = hash;
  // Clear plain text override if any
  delete process.env.ADMIN_PASSWORD;
  res.json({ success: true });
});

export default router;

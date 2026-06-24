import { Router, type IRouter } from "express";
import { verifyAdminPassword, signAdminToken } from "../lib/auth";

const router: IRouter = Router();

router.post("/admin/login", async (req, res): Promise<void> => {
  const { password } = req.body ?? {};
  if (!password || typeof password !== "string") {
    res.status(400).json({ error: "Password required" });
    return;
  }
  const valid = await verifyAdminPassword(password);
  if (!valid) {
    res.status(401).json({ error: "Wrong password" });
    return;
  }
  res.json({ token: signAdminToken() });
});

export default router;

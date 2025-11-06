import { Router } from "express";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.get("/me", requireAuth, async (req, res) => {
  res.json({ user: (req as any).user });
});

export default router;
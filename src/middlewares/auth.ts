import { Request, Response, NextFunction } from "express";
import { supabasePublic } from "../lib/supabase";

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing token" });
  }

  const token = header.split(" ")[1];
  const { data, error } = await supabasePublic.auth.getUser(token);

  if (error || !data.user) {
    return res.status(401).json({ error: "Invalid token" });
  }

  (req as any).user = { id: data.user.id, email: data.user.email };
  next();
}
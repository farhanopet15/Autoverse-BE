import { Router } from "express";
import { z } from "zod";
import { supabaseAdmin } from "../lib/supabase";
import { requireAuth } from "../middlewares/auth";

const router = Router();

const VehicleSchema = z.object({
  brand: z.string().min(1),
  model: z.string().min(1),
  year: z.number().int().min(1900).max(new Date().getFullYear()).optional()
});

router.get("/", requireAuth, async (req, res) => {
  const ownerId = (req as any).user.id;
  const { data, error } = await supabaseAdmin
    .from("vehicles")
    .select("*")
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json({ data });
});

router.post("/", requireAuth, async (req, res) => {
  const parsed = VehicleSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const ownerId = (req as any).user.id;
  const { data, error } = await supabaseAdmin
    .from("vehicles")
    .insert({ ...parsed.data, owner_id: ownerId })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ data });
});

router.delete("/:id", requireAuth, async (req, res) => {
  const id = req.params.id;
  const ownerId = (req as any).user.id;

  const { error } = await supabaseAdmin
    .from("vehicles")
    .delete()
    .eq("id", id)
    .eq("owner_id", ownerId);

  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
});

export default router;
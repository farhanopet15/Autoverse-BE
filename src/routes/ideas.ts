// routes/ideas.ts
import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middlewares/auth";
import { createClient } from "@supabase/supabase-js";

const router = Router();

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ---------- Schemas ----------
const CreateBody = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  tags: z.array(z.string()).optional().default([]),
  facts: z.array(z.string()).optional().default([]),
  categories: z
    .array(z.object({ title: z.string(), items: z.array(z.string()) }))
    .optional()
    .default([]),
  imageUrl: z.string().url().optional().or(z.literal(null)),
  source: z.string().optional().default("ai-generate"),
});

const ListQuery = z.object({
  q: z.string().optional().default(""),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
  cursor: z.string().optional(),
});

const DeleteParams = z.object({
  id: z.string().uuid(),
});

// ---------- Create (POST /api/ideas) ----------
router.post("/", requireAuth, async (req, res) => {
  const parsed = CreateBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const userId = (req as any).user.id as string;
  const payload = parsed.data;

  const { error, data } = await sb
    .from("ideas")
    .insert({
      user_id: userId,
      title: payload.title,
      summary: payload.summary,
      tags: payload.tags,
      facts: payload.facts,
      categories: payload.categories,
      image_url: payload.imageUrl,
      source: payload.source,
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  return res.json({ data });
});

// ---------- List (GET /api/ideas) ----------
router.get("/", requireAuth, async (req, res) => {
  const parsed = ListQuery.safeParse(req.query);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const userId = (req as any).user.id as string;
  const { q, limit, cursor } = parsed.data;

  let query = sb
    .from("ideas")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit + 1);

  if (q) {
    // cari di title/summary, dan cocokkan tags (contains)
    query = query.or(`title.ilike.%${q}%,summary.ilike.%${q}%,tags.cs.{${q}}`);
  }

  if (cursor) {
    query = query.lt("created_at", cursor);
  }

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });

  let nextCursor: string | null = null;
  let items = data ?? [];

  if (items.length > limit) {
    const last = items[limit - 1];
    nextCursor = last?.created_at ?? null;
    items = items.slice(0, limit);
  }

  return res.json({ data: items, nextCursor });
});

// ---------- Delete (DELETE /api/ideas/:id) ----------
router.delete("/:id", requireAuth, async (req, res) => {
  const parsed = DeleteParams.safeParse(req.params);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const userId = (req as any).user.id as string;
  const { id } = parsed.data;

  const { error } = await sb.from("ideas").delete().match({ id, user_id: userId });
  if (error) return res.status(500).json({ error: error.message });

  return res.json({ ok: true, id });
});

export default router;
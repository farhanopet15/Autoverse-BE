import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middlewares/auth";
import multer from "multer";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildAdvisor, buildVehicle, detectFromText, normalizeBrand, xmur3, mulberry32 } from "../utils/auto-utils";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const STORAGE_BUCKET = process.env.STORAGE_BUCKET || "uploads";
const supaAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const GEMINI_KEY = process.env.GEMINI_API_KEY || "";
const HF_KEY = process.env.HUGGINGFACE_API_KEY || "";

const Body = z.object({
  desc: z.string().optional().default(""),
  imageUrl: z.union([z.string().url(), z.literal(""), z.undefined()]).optional()
    .transform(v => (v && v.length ? v : undefined)),
});

async function generateWithGeminiJSON(input:{ desc:string; brandHint?:string; modelHint?:string; image?:{bytes:Buffer; mime:string}|null; }){
  if(!GEMINI_KEY) return null;
  try{
    const genAI = new GoogleGenerativeAI(GEMINI_KEY);
    const model = genAI.getGenerativeModel({ model:"gemini-1.5-flash" });
    const parts:any[]=[{text:
`Kamu asisten otomotif. Keluarkan JSON PERSIS dengan skema:
{"title":string,"summary":string,"tags":string[],"facts":string[],"categories":[{"title":string,"items":string[]}]}
Hints: brand=${input.brandHint??"-"}, model=${input.modelHint??"-"}
Deskripsi: ${input.desc || "-"}`}];
    if(input.image){ parts.push({ inlineData:{ data: input.image.bytes.toString("base64"), mimeType: input.image.mime } }); }
    const resp = await model.generateContent({ contents:[{role:"user",parts}] });
    const txt = resp.response.text();
    const match = txt.match(/\{[\s\S]*\}$/);
    const json = match ? JSON.parse(match[0]) : null;
    if(!json?.title||!json?.summary) return null;
    return json;
  }catch{ return null; }
}

async function uploadToStorage(file:Express.Multer.File,userId:string){
  const ext=(file.originalname.split(".").pop()||"bin").toLowerCase();
  const name=`${Date.now()}-${crypto.randomBytes(6).toString("hex")}.${ext}`;
  const path=`users/${userId}/${name}`;
  const { error } = await supaAdmin.storage.from(STORAGE_BUCKET).upload(path,file.buffer,{contentType:file.mimetype,upsert:false});
  if(error) throw error;
  const { data } = supaAdmin.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

async function handleDescribe(req:any,res:any){
  const userId=req.user?.id as string;

  const desc=String(req.body?.desc||"");
  let imageUrl: string | undefined = undefined;
  let inlineImage: { bytes:Buffer; mime:string } | null = null;

  if(req.file){
    inlineImage={ bytes:req.file.buffer, mime:req.file.mimetype };
    try{ imageUrl=await uploadToStorage(req.file,userId); }
    catch(e:any){ return res.status(500).json({ error:"Upload gagal", detail:e?.message }); }
  }else if(req.body?.imageUrl){
    imageUrl=String(req.body.imageUrl);
  }

  const parsed=Body.safeParse({ desc, imageUrl });
  if(!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const detected = detectFromText(desc);
  const brand = normalizeBrand(detected.brand);
  const model = detected.model;

  const seedKey = desc || imageUrl || String(Date.now());
  const g = await generateWithGeminiJSON({ desc, brandHint:brand, modelHint:model, image:inlineImage });
  const fallback = (brand||model)? buildVehicle(seedKey,brand,model): buildAdvisor(seedKey,desc);
  const out = g ?? fallback;

  return res.json({
    data:{
      userId, imageUrl: imageUrl || undefined,
      title: out.title, summary: out.summary, tags: out.tags, facts: out.facts, categories: out.categories,
    }
  });
}

router.post("/describe", requireAuth, upload.single("image"), handleDescribe);
router.post("/", requireAuth, upload.single("image"), handleDescribe);

export default router;
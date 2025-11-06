// /utils/auto-utils.ts (FINAL)
import { ALL_BRANDS, BRAND_ALIASES, BRAND_ORIGIN } from "../data/brands";
import { MODEL_DB } from "../data/models";
import { SEGMENTS, BODY_STYLES, POWERTRAINS, DRIVETRAINS, AFTERMARKET } from "../data/aftermarket";

/* ===================== RNG utils ===================== */
export function xmur3(str: string) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return h >>> 0;
  };
}
export function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | a);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ✅ supports readonly arrays (works with `as const`)
export function pickN<T>(rng: () => number, arr: readonly T[], n: number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, n);
}
export function pick1<T>(rng: () => number, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

/* ===================== Text helpers ===================== */
export function normalizeText(input: string): string {
  return (input || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics
    .replace(/\s+/g, " ")
    .trim();
}
export function capitalizeBrand(name: string): string {
  return name
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}
export function levenshtein(a: string, b: string): number {
  const s = normalizeText(a),
    t = normalizeText(b);
  const m = s.length,
    n = t.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = s[i - 1] === t[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // del
        dp[i][j - 1] + 1, // ins
        dp[i - 1][j - 1] + cost // sub
      );
    }
  }
  return dp[m][n];
}

// Regex safety
function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function regexifyName(name: string): string {
  // escape dulu, lalu izinkan spasi/hyphen opsional
  return escapeRegex(name).replace(/[- ]/g, "[- ]?");
}

/* ===================== Brand helpers ===================== */
export function resolveBrandAlias(input?: string): string | undefined {
  if (!input) return undefined;
  const low = normalizeText(input);
  if (BRAND_ALIASES[low]) return BRAND_ALIASES[low];

  const exact = ALL_BRANDS.find((b) => normalizeText(b) === low);
  if (exact) return exact;

  const loose = ALL_BRANDS.find(
    (b) => normalizeText(b).replace(/[ -]/g, "") === low.replace(/[ -]/g, "")
  );
  return loose || capitalizeBrand(input);
}
export function getBrandOrigin(name?: string): string | null {
  if (!name) return null;
  const resolved = resolveBrandAlias(name);
  return resolved ? BRAND_ORIGIN[resolved] || null : null;
}
export function getAllBrands(): string[] {
  return Array.from(new Set(ALL_BRANDS)).sort((a, b) => a.localeCompare(b, "id"));
}
export function isKnownBrand(input?: string): boolean {
  const r = resolveBrandAlias(input || "");
  return !!r && ALL_BRANDS.includes(r);
}
export function searchBrands(
  query: string,
  limit = 10
): { brand: string; score: number }[] {
  const q = normalizeText(query);
  if (!q) return [];
  const scored = getAllBrands().map((brand) => {
    const bn = normalizeText(brand);
    const sub = bn.includes(q) ? 1 : 0; // reward substring
    const score = levenshtein(bn, q) - sub;
    return { brand, score };
  });
  return scored.sort((a, b) => a.score - b.score).slice(0, limit);
}

/* ============ Back-compat helpers (versi kamu sebelumnya) ============ */
export function normalizeBrand(input?: string): string | undefined {
  const r = resolveBrandAlias(input);
  return r || input;
}
export function originOf(b?: string) {
  if (!b) return "Global";
  return BRAND_ORIGIN[b] || "Global";
}
export function getRandomModel(
  rng: () => number,
  brand?: string
): string | undefined {
  const key = brand && MODEL_DB[brand] ? brand : undefined;
  if (!key) return undefined;
  return pick1(rng, MODEL_DB[key]);
}

/* ===================== Detect brand & model ===================== */
export function detectFromText(s: string) {
  const low = s.toLowerCase();

  // alias dulu
  for (const k of Object.keys(BRAND_ALIASES)) {
    if (low.includes(k)) return { brand: BRAND_ALIASES[k], model: undefined };
  }

  // brand eksplisit (regex aman untuk nama dengan simbol)
  const brand = ALL_BRANDS.find((b) =>
    new RegExp(`\\b${regexifyName(b)}\\b`, "i").test(s)
  );

  // model dari kamus
  let model: string | undefined = undefined;
  if (brand) {
    const models = MODEL_DB[brand] || [];
    for (const m of models) {
      const rx = new RegExp(`\\b${regexifyName(m)}\\b`, "i");
      if (rx.test(s)) {
        model = m;
        break;
      }
    }
  } else {
    for (const b of Object.keys(MODEL_DB)) {
      for (const m of MODEL_DB[b]) {
        const rx = new RegExp(`\\b${regexifyName(m)}\\b`, "i");
        if (rx.test(s)) {
          model = m;
          return { brand: b, model };
        }
      }
    }
  }

  // shortcut ikonik
  if (/evo\s*9|\bix\b/i.test(s))
    return { brand: "Mitsubishi", model: "Lancer Evolution IX" };
  if (/lancer\s*evolution/i.test(s))
    return { brand: "Mitsubishi", model: "Lancer Evolution" };
  if (/gtr|gt[-\s]?r/i.test(s)) return { brand: "Nissan", model: "GT-R" };
  if (/supra/i.test(s)) return { brand: "Toyota", model: "Supra" };
  if (/civic\s*type\s*r/i.test(s))
    return { brand: "Honda", model: "Civic Type R" };
  if (/mustang/i.test(s)) return { brand: "Ford", model: "Mustang" };
  if (/camaro/i.test(s)) return { brand: "Chevrolet", model: "Camaro" };
  if (/corvette/i.test(s)) return { brand: "Chevrolet", model: "Corvette" };
  if (/\b911\b/i.test(s)) return { brand: "Porsche", model: "911" };
  if (/model\s*(3|y|s|x)/i.test(s)) {
    const m = /model\s*(3|y|s|x)/i.exec(s)?.[1]?.toUpperCase();
    const map: Record<string, string> = {
      "3": "Model 3",
      Y: "Model Y",
      S: "Model S",
      X: "Model X",
    };
    return { brand: "Tesla", model: m ? map[m] : undefined };
  }

  // heuristik setelah brand
  if (brand && !model) {
    const after = s.split(new RegExp(escapeRegex(brand), "i"))[1] || "";
    const m =
      after.match(
        /\b([A-Z][A-Za-z0-9\-]+(?:\s+[A-Z0-9][A-Za-z0-9\-]+){0,2})\b/
      ) || undefined;
    model = m?.[1];
  }

  return { brand, model };
}

/* ===================== Builders ===================== */
export function buildVehicle(seedKey: string, brand?: string, model?: string) {
  const rng = mulberry32(xmur3(seedKey)());
  const nb = resolveBrandAlias(brand) || brand;
  const origin = originOf(nb);
  const seg = pick1(rng, SEGMENTS);
  const power = pick1(rng, POWERTRAINS);
  const drive = pick1(rng, DRIVETRAINS);
  const body = pick1(rng, BODY_STYLES);

  const finalModel = model || getRandomModel(rng, nb);
  const title = [nb, finalModel].filter(Boolean).join(" ") || nb || "Kendaraan";

  const am = {
    engine: pickN(rng, AFTERMARKET.engine, 2),
    exhaust: pickN(rng, AFTERMARKET.exhaust, 1),
    suspension: pickN(rng, AFTERMARKET.suspension, 1),
    brake: pickN(rng, AFTERMARKET.brake, 1),
    wheel: pickN(rng, AFTERMARKET.wheel, 1),
    electronics: pickN(rng, AFTERMARKET.electronics, 1),
    aero: pickN(rng, AFTERMARKET.aero, 1),
    tire: pickN(rng, AFTERMARKET.tire, 1),
  };

  const tags = [
    `Brand: ${nb ?? "N/A"}`,
    ...(finalModel ? [`Model: ${finalModel}`] : []),
    `Asal: ${origin}`,
    seg,
    body,
    power,
    drive,
  ];

  const summary =
    `${title} berasal dari ${origin}. Tipe bodi: ${body}. ` +
    `Konfigurasi umum: ${power} dengan ${drive}. Segmen terkait: ${seg}. ` +
    `Aftermarket populer: mesin (${am.engine.join(", ")}), knalpot (${am.exhaust[0]}), suspensi (${am.suspension[0]}), ` +
    `rem (${am.brake[0]}), velg (${am.wheel[0]}), ban (${am.tire[0]}), aero (${am.aero[0]}), elektronik (${am.electronics[0]}).`;

  const facts = [
    `Negara asal pabrikan: ${origin}`,
    `Drivetrain umum: ${drive}`,
    `Powertrain populer: ${power}`,
    `Kategori bodi: ${body}`,
    `Segmen: ${seg}`,
    `Aftermarket favorit: ${am.engine[0]}, ${am.exhaust[0]}, ${am.suspension[0]}, ${am.brake[0]}, ${am.wheel[0]}`,
  ];

  const categories = [
    {
      title: "Part Mesin",
      items: [
        "Oli full synthetic spesifikasi OEM",
        "Filter oli & udara performa",
        "Busi iridium heat-range sesuai",
        "Radiator Alu + coolant 50:50",
        "Intercooler/Komponen forced-induction (jika perlu)",
      ],
    },
    {
      title: "Suspensi & Handling",
      items: [
        "Coilover adjustable / lowering spring",
        "Bushing polyurethane",
        "Strut/sway bar",
        "Alignment sport (camber/caster/toe)",
      ],
    },
    {
      title: "Rem",
      items: [
        "Pad kevlar/ceramic",
        "Brake fluid DOT 4/5.1 high-temp",
        "Stainless brake hose",
        "Rotor slotted/ventilated",
      ],
    },
    {
      title: "Ban & Velg",
      items: [
        "Ban UHP (cek UTQG & tahun produksi)",
        "Velg flow-formed/forged (PCD & offset tepat)",
        "Torque spec lug-nut sesuai pabrikan",
      ],
    },
    {
      title: "Elektronik & Tuning",
      items: [
        "Dashcam, TPMS, OBD monitor",
        "ECU tune/standalone (legal & aman)",
        "Dyno + AFR monitoring (khusus forced-induction)",
      ],
    },
  ];

  return { title, summary, tags, facts, categories };
}

export function buildAdvisor(seedKey: string, desc: string) {
  const rng = mulberry32(xmur3(seedKey)());
  const needSport =
    /(sport|kencang|track|drag|hp|turbo|n[\W_]*a|supercharged|supercharger)/i.test(
      desc
    );
  const needFamily =
    /(keluarga|mpv|luas|nyaman|harian|daily|7\s*seater|7-seater)/i.test(desc);
  const needOff =
    /(offroad|trail|4x4|banjir|gunung|ground\s*clearance)/i.test(desc);
  const needEV = /\bev|electric|hybrid|phev|emisi|irit/i.test(desc);
  const seg = needSport
    ? "Sports Car"
    : needFamily
    ? "MPV/Minivan"
    : needOff
    ? "Off-road/4x4"
    : needEV
    ? "EV/Hybrid"
    : pick1(rng, SEGMENTS);

  return {
    title: "Auto Advisor",
    summary: `Kebutuhanmu terdeteksi: ${seg}. Berikut panduan otomotif (model contoh + parts relevan) yang bisa dijadikan acuan.`,
    tags: [
      "Advisor Mode",
      "Segment rekomendasi: " + seg,
      pick1(rng, POWERTRAINS),
      pick1(rng, DRIVETRAINS),
    ],
    facts: [
      `Segment disarankan: ${seg}`,
      "Selalu cocokkan part number OEM & legalitas jalan raya",
    ],
    categories: [
      {
        title: "Essential",
        items: [
          "Oli mesin full synthetic",
          "Filter oli & udara",
          "Wiper, coolant, brake fluid",
          "Busi iridium",
        ],
      },
      {
        title: "Maintenance",
        items: [
          "Kampas rem + cek rotor",
          "Ban (cek umur/keausan)",
          "Bushing & shock",
          "Belt/chain + waterpump",
        ],
      },
      {
        title: "Upgrades",
        items: ["Dashcam", "Peredam kabin", "Pad rem lebih pakem", "Ban UHP"],
      },
    ],
  };
}
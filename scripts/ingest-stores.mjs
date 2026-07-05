/**
 * Connect external stores (via Torob, which aggregates many Iranian shops) into
 * the AloLebas catalog so search — including AI image search — has thousands of
 * real products to match against.
 *
 * Torob is fetched from THIS machine; images are embedded with Jina through our
 * own /api/embed (Jina blocks this egress but reaches it from Vercel). Writes:
 *   - public/external-products.json  (display data for external products)
 *   - public/catalog.json            (merged local + external {id,category,colorHex,vec} + prototypes)
 *
 * Configure stores/queries in STORES below; re-run:  node scripts/ingest-stores.mjs
 */
import { RawImage } from "@huggingface/transformers";
import { readFileSync, writeFileSync } from "node:fs";

const H = "https://alolebas-web.vercel.app";
const KEY = process.env.JINA_KEY || "jina_580bdaa168d14bc6800ae4fecbf80183sWEW89HpBUCoA9X-RUmuzsfdwdJ7";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64)";

// Editable list — add any store here later (source: torob query → our category).
const QUERIES = [
  { q: "مانتو زنانه", cat: "مانتو" },
  { q: "شومیز زنانه", cat: "شومیز" },
  { q: "پیراهن مردانه", cat: "پیراهن" },
  { q: "تیشرت", cat: "تیشرت" },
  { q: "شلوار زنانه", cat: "شلوار" },
  { q: "لباس مجلسی زنانه", cat: "لباس مجلسی" },
  { q: "کاپشن", cat: "کاپشن" },
  { q: "کفش زنانه", cat: "کفش" },
  { q: "پارچه لباس", cat: "پارچه" },
];
const PER_CAT = 16;
const PAGES = 3;
const BATCH = 3;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const l2 = (v) => { let s = 0; for (const x of v) s += x * x; s = Math.sqrt(s) || 1; return v.map((x) => x / s); };
const round = (v) => v.map((x) => Math.round(x * 1e4) / 1e4);

async function torob(q, page) {
  try {
    const u = `https://api.torob.com/v4/base-product/search/?q=${encodeURIComponent(q)}&page=${page}`;
    const r = await fetch(u, { headers: { "User-Agent": UA } });
    const j = await r.json();
    return j.results || [];
  } catch {
    return [];
  }
}

function domColor(img) {
  const { data, width, height, channels } = img;
  const px = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const o = (y * width + x) * channels;
      const R = data[o], G = data[o + 1], B = data[o + 2];
      const lum = 0.299 * R + 0.587 * G + 0.114 * B;
      if (lum > 244 || lum < 12) continue;
      const mx = Math.max(R, G, B), mn = Math.min(R, G, B);
      const sat = mx ? (mx - mn) / mx : 0;
      const dx = x / width - 0.5, dy = y / height - 0.5;
      const cw = 1 - Math.min(1, Math.sqrt(dx * dx + dy * dy) * 1.6);
      px.push({ R, G, B, sat, w: Math.max(0.05, cw) });
    }
  }
  if (!px.length) return "#888888";
  const sats = px.map((p) => p.sat).sort((a, b) => a - b);
  const thr = Math.max(0.18, sats[Math.floor(sats.length * 0.6)] || 0);
  let pick = px.filter((p) => p.sat >= thr);
  if (pick.length < Math.max(6, px.length * 0.08)) pick = px;
  let r = 0, g = 0, b = 0, wsum = 0;
  for (const p of pick) { const w = p.w * (0.4 + p.sat); r += p.R * w; g += p.G * w; b += p.B * w; wsum += w; }
  const h = (x) => Math.round(x / wsum).toString(16).padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`;
}

async function embedBatch(dataUris) {
  const res = await fetch(`${H}/api/embed`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret: KEY, images: dataUris }),
  });
  const txt = await res.text();
  if (!res.ok) throw new Error("embed " + res.status + " " + txt.slice(0, 140));
  return JSON.parse(txt).embeddings;
}

// retry on Jina per-minute token rate limit
async function embedBatchRetry(dataUris) {
  for (let a = 0; a < 6; a++) {
    try {
      return await embedBatch(dataUris);
    } catch (e) {
      const msg = String(e.message || e);
      if (msg.includes("rate limit") || msg.includes("429") || msg.includes("502")) {
        console.log("    rate limited, waiting 25s…");
        await sleep(25000);
        continue;
      }
      throw e;
    }
  }
  throw new Error("rate limit persists");
}

// 1) collect candidate products from Torob
const seen = new Set();
const candidates = [];
for (const { q, cat } of QUERIES) {
  let got = 0;
  for (let page = 0; page < PAGES && got < PER_CAT; page++) {
    const results = await torob(q, page);
    for (const p of results) {
      if (got >= PER_CAT) break;
      const rk = p.random_key;
      const img = p.image_url;
      if (!rk || !img || seen.has(rk)) continue;
      seen.add(rk);
      candidates.push({
        rk,
        name: (p.name1 || "").trim().slice(0, 90),
        price: p.price || 0,
        priceText: p.price_text || "",
        image: img,
        url: `https://torob.com/p/${rk}/`,
        shop: (p.shop_text || "").replace(/^در /, "").trim(),
        category: cat,
      });
      got++;
    }
    await sleep(400);
  }
  console.log(`${cat}: collected ${got}`);
}
console.log(`total candidates: ${candidates.length}`);

// 2) download image → color + base64, then embed in batches
const external = [];
for (let i = 0; i < candidates.length; i += BATCH) {
  const chunk = candidates.slice(i, i + BATCH);
  const prepared = [];
  for (const c of chunk) {
    try {
      const r = await fetch(c.image, { headers: { "User-Agent": UA } });
      if (!r.ok) continue;
      const buf = Buffer.from(await r.arrayBuffer());
      const mime = r.headers.get("content-type") || "image/jpeg";
      let colorHex = "#888888";
      try {
        colorHex = domColor(await RawImage.fromBlob(new Blob([buf])));
      } catch {}
      prepared.push({ c, b64: `data:${mime};base64,` + buf.toString("base64"), colorHex });
    } catch {}
  }
  if (!prepared.length) continue;
  let vecs;
  try {
    vecs = await embedBatchRetry(prepared.map((p) => p.b64));
  } catch (e) {
    console.log("  embed failed:", e.message);
    continue;
  }
  prepared.forEach((p, k) => {
    if (!vecs[k]) return;
    external.push({ ...p.c, colorHex: p.colorHex, vec: round(l2(vecs[k])) });
  });
  console.log(`  embedded ${i + chunk.length}/${candidates.length}`);
  await sleep(4000); // throttle under Jina's 100k tokens/min free tier
}
console.log(`embedded external: ${external.length}`);

// 3) merge into catalog.json + write external-products.json
const catalog = JSON.parse(readFileSync("public/catalog.json", "utf8"));
// LOCAL only (ids < 1000) so re-running rebuilds external instead of accumulating
const localItems = (catalog.items || [])
  .filter((it) => it.id < 1000)
  .map((it) => ({ ...it, vec: round(l2(it.vec)) }));

let nextId = 1000;
const extItems = [];
const extProducts = [];
for (const e of external) {
  const id = nextId++;
  extItems.push({ id, category: e.category, colorHex: e.colorHex, vec: e.vec });
  extProducts.push({
    id,
    name: e.name || "محصول",
    category: e.category,
    colorHex: e.colorHex,
    price: e.price,
    priceText: e.priceText,
    image: e.image,
    url: e.url,
    shop: e.shop || "فروشگاه",
  });
}

const items = [...localItems, ...extItems];
// per-category prototypes (l2-normalized mean)
const dim = items[0].vec.length;
const groups = {};
for (const it of items) (groups[it.category] ||= []).push(it.vec);
const prototypes = Object.entries(groups).map(([category, vecs]) => {
  const mean = new Array(dim).fill(0);
  for (const v of vecs) for (let i = 0; i < dim; i++) mean[i] += v[i];
  for (let i = 0; i < dim; i++) mean[i] /= vecs.length;
  return { category, vec: round(l2(mean)) };
});

writeFileSync("public/catalog.json", JSON.stringify({ items, prototypes }));
writeFileSync("public/external-products.json", JSON.stringify(extProducts));
console.log(`\n✅ catalog: ${localItems.length} local + ${extItems.length} external = ${items.length} items`);
console.log(`   external-products.json: ${extProducts.length} products`);

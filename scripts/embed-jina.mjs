/**
 * Embed the product catalog with Jina jina-clip-v2 (multimodal) for the backend.
 * Writes public/catalog.json = { model, dim, items:[{id,category,colorHex,vec}], prototypes }.
 * Run:  JINA_API_KEY=... node scripts/embed-jina.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const KEY = process.env.JINA_API_KEY;
if (!KEY) throw new Error("set JINA_API_KEY");
const MODEL = "jina-clip-v2";
const BATCH = 8;

const src = readFileSync("src/data/products.data.ts", "utf8");
const PRODUCTS = JSON.parse(src.slice(src.indexOf("= [") + 2, src.lastIndexOf("]") + 1));

async function toB64(file) {
  const buf = await sharp(file).resize({ width: 224, withoutEnlargement: true }).jpeg({ quality: 80 }).toBuffer();
  return buf.toString("base64");
}

async function embed(inputs) {
  const res = await fetch("https://api.jina.ai/v1/embeddings", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${KEY}` },
    body: JSON.stringify({ model: MODEL, input: inputs }),
  });
  const j = await res.json();
  if (!res.ok || !j.data) throw new Error("jina error: " + JSON.stringify(j).slice(0, 300));
  return { vecs: j.data.sort((a, b) => a.index - b.index).map((d) => d.embedding), tokens: j.usage?.total_tokens || 0 };
}

const items = [];
let totalTokens = 0;
for (let i = 0; i < PRODUCTS.length; i += BATCH) {
  const chunk = PRODUCTS.slice(i, i + BATCH);
  const inputs = await Promise.all(
    chunk.map(async (p) => ({ image: await toB64(`public${p.image}`) })),
  );
  const { vecs, tokens } = await embed(inputs);
  totalTokens += tokens;
  chunk.forEach((p, k) => items.push({ id: p.id, category: p.category, colorHex: p.colorHex, vec: vecs[k] }));
  console.log(`embedded ${Math.min(i + BATCH, PRODUCTS.length)}/${PRODUCTS.length}  (tokens so far: ${totalTokens})`);
  if (i + BATCH < PRODUCTS.length) await new Promise((r) => setTimeout(r, 26000)); // stay under 100k tokens/min
}

const l2 = (v) => { let s = 0; for (const x of v) s += x * x; s = Math.sqrt(s) || 1; return v.map((x) => x / s); };
const dim = items[0].vec.length;
for (const it of items) it.vec = l2(it.vec);
const groups = {};
for (const e of items) (groups[e.category] ||= []).push(e.vec);
const prototypes = Object.entries(groups).map(([category, vecs]) => {
  const mean = new Array(dim).fill(0);
  for (const v of vecs) for (let d = 0; d < dim; d++) mean[d] += v[d];
  for (let d = 0; d < dim; d++) mean[d] /= vecs.length;
  return { category, vec: l2(mean) };
});

writeFileSync("public/catalog.json", JSON.stringify({ model: MODEL, dim, items, prototypes }));
console.log(`\nDONE: ${items.length} items, dim ${dim}, ${prototypes.length} prototypes, ${totalTokens} tokens total`);

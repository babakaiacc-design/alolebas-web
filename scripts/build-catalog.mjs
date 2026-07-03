/**
 * Build the product catalog + CLIP image embeddings from the real photos in
 * public/products/*.jpg. Writes:
 *   - src/data/products.data.ts   (PRODUCTS array, image-backed)
 *   - public/product-embeddings.json  (MobileCLIP image embeddings, dim 512)
 *
 * Re-run whenever photos change:  node scripts/build-catalog.mjs
 */
import { pipeline, RawImage, env } from "@huggingface/transformers";
import { readdirSync, writeFileSync } from "node:fs";

env.allowLocalModels = true;
env.allowRemoteModels = false;
env.localModelPath = "./public/models/";
const MODEL = "Xenova/mobileclip_s0";
const DTYPE = "q8";

const CAT = {
  manto:   { display: "مانتو",       sizes: ["S","M","L","XL"], price: [500000, 950000], mats: ["نخ","کتان","کرپ"], adj: ["اداری","کلاسیک","نخی روشن","بلند","کژوال","جلوباز","اسپرت","تک‌دکمه","کوتاه","ساده"] },
  pirahan: { display: "پیراهن",      sizes: ["M","L","XL"],     price: [300000, 560000], mats: ["پنبه","نخ"], adj: ["آستین‌بلند","کلاسیک","نخی","چهارخانه","ساده","رسمی","کژوال","آکسفورد"] },
  tishirt: { display: "تیشرت",       sizes: ["S","M","L","XL"], price: [150000, 360000], mats: ["پنبه","نخ‌پنبه"], adj: ["ساده","یقه‌گرد","طرح‌دار","اسپرت","نخی","اورسایز","ملانژ","آستین‌کوتاه","جودون","پایه"] },
  shalvar: { display: "شلوار",       sizes: ["38","40","42","44"], price: [350000, 650000], mats: ["جین","کتان"], adj: ["جین","کتان","اسلش","راسته","دم‌پا","اداری","کژوال"] },
  shomiz:  { display: "شومیز",       sizes: ["S","M","L"],      price: [300000, 520000], mats: ["حریر","نخ"], adj: ["حریر","ساده","گلدار","یقه‌آرشال","اسپرت","نخی","رسمی"] },
  majlesi: { display: "لباس مجلسی",  sizes: ["S","M","L"],      price: [1400000, 2600000], mats: ["ساتن","حریر","مخمل"], adj: ["بلند","کوتاه","دنباله‌دار","یقه‌باز","ماکسی","شب","مخمل"] },
  kapshen: { display: "کاپشن",       sizes: ["M","L","XL"],     price: [850000, 1700000], mats: ["پلی‌استر ضدآب","کتان"], adj: ["زمستانی","پافر","اسپرت","کلاه‌دار","بادگیر","ضدآب","کوهنوردی"] },
  kafsh:   { display: "کفش",         sizes: ["40","41","42","43","44"], price: [550000, 1250000], mats: ["چرم طبیعی","چرم مصنوعی"], adj: ["کالج چرم","اسپرت","کژوال","رسمی","کتانی","لوفر","بوت","تخت"] },
  parche:  { display: "پارچه",       sizes: ["متر"],            price: [120000, 260000], mats: ["کرپ","نخ","حریر"], adj: ["کرپ","حریر","نخی","مجلسی"], wholesale: true },
};
const ORDER = ["manto","pirahan","tishirt","shalvar","shomiz","majlesi","kapshen","kafsh","parche"];
const SELLERS = ["مزون آوا","تیرداد استایل","کاژه","مزون رُز","اسپرت‌لند","مزون نیلا","چرم‌دوز","بازار تهران","جین‌سرا","تولیدی مهتا"];
const DISTS = [2,3,4,5,6,7,9,11,14,8,1,12];

function avgColor(img) {
  const { data, width, height, channels } = img;
  let r = 0, g = 0, b = 0, n = 0;
  for (let i = 0; i < width * height; i++) {
    const o = i * channels;
    const R = data[o], G = data[o + 1], B = data[o + 2];
    const lum = 0.299 * R + 0.587 * G + 0.114 * B;
    if (lum > 244 || lum < 12) continue; // skip background white / hard black
    r += R; g += G; b += B; n++;
  }
  if (!n) return "#888888";
  const h = (x) => Math.round(x / n).toString(16).padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`;
}

// group files by category
const files = readdirSync("./public/products").filter((f) => /\.(jpg|jpeg|png)$/i.test(f));
const byCat = {};
for (const f of files) {
  const m = f.match(/^([a-z]+)-(\d+)/i);
  if (!m || !CAT[m[1]]) continue;
  (byCat[m[1]] ||= []).push({ file: f, num: parseInt(m[2], 10) });
}
for (const c of Object.keys(byCat)) byCat[c].sort((a, b) => a.num - b.num);

console.log("loading model…");
const extractor = await pipeline("image-feature-extraction", MODEL, { dtype: DTYPE });

const products = [];
const embeddings = [];
let id = 0;
let sIdx = 0;

for (const cat of ORDER) {
  const list = byCat[cat] || [];
  const meta = CAT[cat];
  for (let i = 0; i < list.length; i++) {
    id++;
    const { file } = list[i];
    const img = await RawImage.read(`./public/products/${file}`);
    const colorHex = avgColor(img);
    const out = await extractor(img);
    embeddings.push({ id, category: CAT[cat].display, vec: Array.from(out.data) });

    const adj = meta.adj[i % meta.adj.length];
    const name = cat === "parche" ? `پارچه ${adj} (متری)` : `${meta.display} ${adj}`;
    const [lo, hi] = meta.price;
    const price = Math.round((lo + ((i * 137) % (hi - lo))) / 10000) * 10000;
    const hasOld = i % 3 === 1;
    const p = {
      id,
      name,
      category: meta.display,
      colorName: "",
      colorHex,
      price,
      seller: SELLERS[sIdx++ % SELLERS.length],
      distance: DISTS[id % DISTS.length],
      wholesale: !!meta.wholesale,
      sizes: meta.sizes,
      material: meta.mats[i % meta.mats.length],
      rating: Math.round((4.2 + (id % 8) * 0.09) * 10) / 10,
      ratingCount: 20 + ((id * 13) % 300),
      image: `/products/${file}`,
    };
    if (hasOld) p.oldPrice = Math.round((price * 1.25) / 10000) * 10000;
    if (meta.wholesale) p.minOrder = "حداقل ۵ متر";
    products.push(p);
  }
}

const ts =
  `// AUTO-GENERATED by scripts/build-catalog.mjs — do not edit by hand.\n` +
  `import type { Product } from "./products";\n\n` +
  `export const PRODUCTS: Product[] = ${JSON.stringify(products, null, 2)};\n`;
writeFileSync("src/data/products.data.ts", ts);

// per-category prototype = normalized mean of that category's image embeddings
const l2 = (v) => { let s = 0; for (const x of v) s += x * x; s = Math.sqrt(s) || 1; return v.map((x) => x / s); };
const dim = embeddings[0].vec.length;
const groups = {};
for (const e of embeddings) (groups[e.category] ||= []).push(l2(e.vec));
const prototypes = Object.entries(groups).map(([category, vecs]) => {
  const mean = new Array(dim).fill(0);
  for (const v of vecs) for (let i = 0; i < dim; i++) mean[i] += v[i];
  for (let i = 0; i < dim; i++) mean[i] /= vecs.length;
  return { category, vec: l2(mean) };
});

writeFileSync("public/product-embeddings.json", JSON.stringify({ dim, items: embeddings, prototypes }));
console.log(`wrote ${products.length} products + ${embeddings.length} embeddings (dim ${dim}) + ${prototypes.length} category prototypes`);

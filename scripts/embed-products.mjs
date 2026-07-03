/**
 * Precompute CLIP embeddings for the product catalog and write them to
 * public/product-embeddings.json (consumed by src/lib/visualSearch.ts).
 *
 * Today each product's "image" is its colour swatch, so we embed a solid-colour
 * image per product. When real product photos exist, swap `solidImage(hex)` for
 * `await RawImage.read(path/url)` per product and re-run:  node scripts/embed-products.mjs
 */
import { pipeline, RawImage, env } from "@huggingface/transformers";
import { writeFileSync } from "node:fs";

// Use the SAME self-hosted model the browser uses, so vectors are comparable.
env.allowLocalModels = true;
env.allowRemoteModels = false;
env.localModelPath = "./public/models/";

const MODEL = "Xenova/mobileclip_s0";
const DTYPE = "q8";

// id -> current product image representation (colour swatch hex, from src/data/products.ts)
const CATALOG = [
  [1, "#efe7d8"], [2, "#2f4a7a"], [3, "#4b7a4a"], [4, "#6e2033"],
  [5, "#2d2d2d"], [6, "#f4f4f0"], [7, "#c8963e"], [8, "#1b2a4a"],
  [9, "#d68aa0"], [10, "#9a8663"], [11, "#8a8f98"], [12, "#5a3a22"],
];

function solidImage(hex, size = 96) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const data = new Uint8ClampedArray(size * size * 3);
  for (let i = 0; i < size * size; i++) {
    data[i * 3] = r;
    data[i * 3 + 1] = g;
    data[i * 3 + 2] = b;
  }
  return new RawImage(data, size, size, 3);
}

console.log("loading model…");
const extractor = await pipeline("image-feature-extraction", MODEL, { dtype: DTYPE });

const items = [];
for (const [id, hex] of CATALOG) {
  const out = await extractor(solidImage(hex));
  items.push({ id, vec: Array.from(out.data) });
  console.log(`embedded product ${id}`);
}

writeFileSync("public/product-embeddings.json", JSON.stringify(items));
console.log(`wrote public/product-embeddings.json (${items.length} vectors, dim ${items[0].vec.length})`);

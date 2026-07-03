/**
 * Client-side AI visual search using Transformers.js (CLIP in the browser).
 * Strategy (works well even with a small on-device model):
 *   1. embed the query image (MobileCLIP, lazy-loaded, self-hosted ~12MB)
 *   2. detect the GARMENT TYPE via nearest per-category prototype
 *      (prototype = mean of that category's real product image embeddings)
 *   3. restrict results to that category, then rank by COLOR closeness
 *      (blended with visual similarity) so "white pants" → white pants only.
 * Embeddings + prototypes are precomputed by scripts/build-catalog.mjs.
 */
import { getProduct, colorDistance, type Product } from "../data/products";

export const VISUAL_MODEL = "Xenova/mobileclip_s0";

type Extractor = (input: string) => Promise<{ data: Float32Array | number[] }>;

let extractorPromise: Promise<Extractor> | null = null;

async function getExtractor(onProgress?: (pct: number) => void): Promise<Extractor> {
  if (!extractorPromise) {
    extractorPromise = (async () => {
      const { pipeline, env } = await import("@huggingface/transformers");
      env.allowLocalModels = true;
      env.allowRemoteModels = false;
      env.localModelPath = "/models/";
      env.useBrowserCache = true;
      const pipe = await pipeline("image-feature-extraction", VISUAL_MODEL, {
        dtype: "q8",
        progress_callback: (d: any) => {
          if (onProgress && d?.status === "progress" && typeof d.progress === "number") {
            onProgress(Math.round(d.progress));
          }
        },
      });
      return pipe as unknown as Extractor;
    })();
  }
  return extractorPromise;
}

function l2norm(v: number[]): number[] {
  let s = 0;
  for (let i = 0; i < v.length; i++) s += v[i] * v[i];
  const n = Math.sqrt(s) || 1;
  return v.map((x) => x / n);
}

function cosine(a: number[], b: number[]): number {
  let s = 0;
  for (let i = 0; i < a.length && i < b.length; i++) s += a[i] * b[i];
  return s;
}

export async function embedImageSrc(src: string, onProgress?: (pct: number) => void): Promise<number[]> {
  const ext = await getExtractor(onProgress);
  const out = await ext(src);
  return l2norm(Array.from(out.data as Float32Array));
}

type Item = { id: number; category: string; vec: number[] };
type Proto = { category: string; vec: number[] };
type Catalog = { items: Item[]; prototypes: Proto[] };
let catalog: Catalog | undefined;

async function loadCatalog(): Promise<Catalog> {
  if (catalog !== undefined) return catalog;
  try {
    const res = await fetch("/product-embeddings.json");
    if (!res.ok) throw new Error("no embeddings");
    const data = await res.json();
    const rawItems: Item[] = Array.isArray(data) ? data : (data.items ?? []);
    const items = rawItems.map((e) => ({ id: e.id, category: e.category, vec: l2norm(e.vec) }));
    const prototypes: Proto[] = (data.prototypes ?? []).map((p: Proto) => ({
      category: p.category,
      vec: l2norm(p.vec),
    }));
    catalog = { items, prototypes };
  } catch {
    catalog = { items: [], prototypes: [] };
  }
  return catalog;
}

export async function hasVisualCatalog(): Promise<boolean> {
  return (await loadCatalog()).items.length > 0;
}

export type VisualResult = { category: string | null; ids: number[] };

/**
 * AI image search. Detects garment type, filters to it, ranks by color+visual.
 * @param src        object URL / URL of the query image
 * @param queryColor dominant hex color of the query (for in-category ranking)
 */
export async function searchByImageSrc(
  src: string,
  queryColor: string | null,
  onProgress?: (pct: number) => void,
): Promise<VisualResult | null> {
  const cat = await loadCatalog();
  if (cat.items.length === 0) return null;

  const q = await embedImageSrc(src, onProgress);

  // 1) detect garment type via nearest category prototype
  let detected: string | null = null;
  if (cat.prototypes.length) {
    let best = -Infinity;
    for (const p of cat.prototypes) {
      const s = cosine(q, p.vec);
      if (s > best) {
        best = s;
        detected = p.category;
      }
    }
  }

  // 2) rank ALL products by blended color-distance + visual similarity.
  //    Type narrowing is applied by the caller via the category chip (which is
  //    100% reliable); the small on-device model isn't accurate enough to hard-filter.
  const W_COLOR = 0.62;
  const W_VISUAL = 0.38;
  const scored = cat.items.map((it) => {
    const prod = getProduct(it.id) as Product | undefined;
    const colorD = prod && queryColor ? colorDistance(queryColor, prod.colorHex) / 441 : 0.5; // 0..1
    const visualD = 1 - cosine(q, it.vec); // 0..2 (≈0..1 for normalized)
    return { id: it.id, cost: W_COLOR * colorD + W_VISUAL * visualD };
  });
  scored.sort((a, b) => a.cost - b.cost);

  return { category: detected, ids: scored.map((s) => s.id) };
}

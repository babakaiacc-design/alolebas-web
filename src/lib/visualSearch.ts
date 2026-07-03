/**
 * Client-side AI visual search using Transformers.js (CLIP in the browser).
 * The model is lazy-loaded only when image search is first used.
 * Product image embeddings are precomputed (scripts/embed-products.mjs) into
 * public/product-embeddings.json — same model, so vectors are comparable.
 */

// Self-hosted from /public/models (served by Vercel same-origin) so it works
// without any dependency on huggingface.co at runtime. ~12MB, lazy-loaded.
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

/** Embed an image (URL / object URL) into a normalized vector using CLIP. */
export async function embedImageSrc(src: string, onProgress?: (pct: number) => void): Promise<number[]> {
  const ext = await getExtractor(onProgress);
  const out = await ext(src);
  return l2norm(Array.from(out.data as Float32Array));
}

type ProductEmb = { id: number; vec: number[] };
let productEmbs: ProductEmb[] | undefined;

async function loadProductEmbeddings(): Promise<ProductEmb[]> {
  if (productEmbs !== undefined) return productEmbs;
  try {
    const res = await fetch("/product-embeddings.json");
    if (!res.ok) throw new Error("no embeddings");
    const data = await res.json();
    const items: ProductEmb[] = Array.isArray(data) ? data : data.items ?? [];
    productEmbs = items.map((e) => ({ id: e.id, vec: l2norm(e.vec) }));
  } catch {
    productEmbs = [];
  }
  return productEmbs;
}

/** True once we have a precomputed catalog to match against. */
export async function hasVisualCatalog(): Promise<boolean> {
  return (await loadProductEmbeddings()).length > 0;
}

/**
 * AI image search: returns product ids ranked by visual similarity, or null if
 * no catalog embeddings exist yet (caller can fall back to color matching).
 */
export async function searchByImageSrc(
  src: string,
  onProgress?: (pct: number) => void,
): Promise<{ id: number; score: number }[] | null> {
  const embs = await loadProductEmbeddings();
  if (embs.length === 0) return null;
  const q = await embedImageSrc(src, onProgress);
  return embs
    .map((e) => ({ id: e.id, score: cosine(q, e.vec) }))
    .sort((a, b) => b.score - a.score);
}

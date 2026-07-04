// Vercel serverless function: AI search over the product catalog using Jina
// jina-clip-v2 multimodal embeddings. The API key stays server-side (env var
// JINA_API_KEY); it is never shipped to the browser. Catalog embeddings are
// fetched at runtime from the deployment's own static /catalog.json.
const JINA = "https://api.jina.ai/v1/embeddings";
const MODEL = "jina-clip-v2";

type Item = { id: number; category: string; colorHex: string; vec: number[] };
type Proto = { category: string; vec: number[] };
type Catalog = { items: Item[]; prototypes: Proto[] };

let catalogCache: Catalog | null = null;

async function getCatalog(req: any): Promise<Catalog> {
  if (catalogCache) return catalogCache;
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const proto = req.headers["x-forwarded-proto"] || "https";
  const r = await fetch(`${proto}://${host}/catalog.json`);
  const data = (await r.json()) as { items?: Item[]; prototypes?: Proto[] };
  catalogCache = { items: data.items || [], prototypes: data.prototypes || [] };
  return catalogCache;
}

function cos(a: number[], b: number[]): number {
  let s = 0;
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) s += a[i] * b[i];
  return s;
}
function l2(v: number[]): number[] {
  let s = 0;
  for (const x of v) s += x * x;
  s = Math.sqrt(s) || 1;
  return v.map((x) => x / s);
}

// Embed a batch of inputs ({text} or {image}) in one call, then average +
// normalize into a single query vector (so a user can send up to 3 images).
async function embedQuery(inputs: unknown[], key: string): Promise<number[]> {
  const r = await fetch(JINA, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({ model: MODEL, input: inputs }),
  });
  const j = (await r.json()) as { data?: { embedding: number[] }[]; detail?: string };
  if (!r.ok || !j.data || !j.data.length) throw new Error(j?.detail || "embed failed");
  const dim = j.data[0].embedding.length;
  const mean = new Array(dim).fill(0);
  for (const d of j.data) {
    const v = l2(d.embedding);
    for (let i = 0; i < dim; i++) mean[i] += v[i];
  }
  for (let i = 0; i < dim; i++) mean[i] /= j.data.length;
  return l2(mean);
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method" });
    return;
  }
  const key = process.env.JINA_API_KEY;
  if (!key) {
    res.status(503).json({ error: "no-key" });
    return;
  }
  try {
    const { items, prototypes } = await getCatalog(req);
    if (!items.length) {
      res.status(503).json({ error: "no-catalog" });
      return;
    }

    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const { mode, q, image, images } = body as {
      mode?: string;
      q?: string;
      image?: string;
      images?: string[];
    };

    let inputs: unknown[];
    if (mode === "image") {
      const imgs = (Array.isArray(images) && images.length ? images : image ? [image] : []).slice(0, 3);
      if (!imgs.length) {
        res.status(400).json({ error: "empty" });
        return;
      }
      inputs = imgs.map((x) => ({ image: x }));
    } else if (q && q.trim()) {
      inputs = [{ text: q.trim() }];
    } else {
      res.status(400).json({ error: "empty" });
      return;
    }

    const qv = await embedQuery(inputs, key);

    // top categories by prototype similarity — a SOFT hint (no hard filter)
    const categories = prototypes
      .map((p) => ({ category: p.category, score: cos(qv, p.vec) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((c) => c.category);

    // rank by real similarity score (this is the strong signal)
    const results = items
      .map((it) => ({ id: it.id, score: cos(qv, it.vec) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 40);

    res.status(200).json({ category: categories[0] ?? null, categories, results });
  } catch (e) {
    res.status(500).json({ error: String((e as Error)?.message || e) });
  }
}

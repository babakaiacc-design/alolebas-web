// Vercel serverless function: AI search over the product catalog using Jina
// jina-clip-v2 multimodal embeddings. The API key stays server-side (env var
// JINA_API_KEY); it is never shipped to the browser.
import catalog from "./_catalog.json";

const JINA = "https://api.jina.ai/v1/embeddings";
const MODEL = "jina-clip-v2";

type Item = { id: number; category: string; colorHex: string; vec: number[] };
type Proto = { category: string; vec: number[] };
const items = (catalog as { items: Item[] }).items || [];
const protos = (catalog as { prototypes: Proto[] }).prototypes || [];

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

async function embedQuery(input: unknown, key: string): Promise<number[]> {
  const r = await fetch(JINA, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({ model: MODEL, input: [input] }),
  });
  const j = (await r.json()) as { data?: { embedding: number[] }[]; detail?: string };
  if (!r.ok || !j.data) throw new Error(j?.detail || "embed failed");
  return l2(j.data[0].embedding);
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
  if (!items.length) {
    res.status(503).json({ error: "no-catalog" });
    return;
  }
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const { mode, q, image } = body as { mode?: string; q?: string; image?: string };

    let input: unknown;
    if (mode === "image" && image) input = { image };
    else if (q && q.trim()) input = { text: q.trim() };
    else {
      res.status(400).json({ error: "empty" });
      return;
    }

    const qv = await embedQuery(input, key);

    let category: string | null = null;
    if (mode === "image" && protos.length) {
      let best = -Infinity;
      for (const p of protos) {
        const s = cos(qv, p.vec);
        if (s > best) {
          best = s;
          category = p.category;
        }
      }
    }

    const ranked = items
      .map((it) => ({ id: it.id, score: cos(qv, it.vec) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 40);

    res.status(200).json({ category, results: ranked });
  } catch (e) {
    res.status(500).json({ error: String((e as Error)?.message || e) });
  }
}

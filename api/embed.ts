// Ingestion helper: embeds a batch of base64 images with Jina jina-clip-v2,
// running on Vercel's egress (Jina is reachable there). Gated by the Jina key
// itself so only the catalog builder (which knows the key) can call it.
const JINA = "https://api.jina.ai/v1/embeddings";
const MODEL = "jina-clip-v2";

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
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const { images, secret } = body as { images?: string[]; secret?: string };
    if (secret !== key) {
      res.status(403).json({ error: "forbidden" });
      return;
    }
    if (!Array.isArray(images) || !images.length) {
      res.status(400).json({ error: "empty" });
      return;
    }
    const r = await fetch(JINA, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({ model: MODEL, input: images.map((image) => ({ image })) }),
    });
    const j = (await r.json()) as { data?: { embedding: number[] }[]; detail?: string };
    if (!r.ok || !j.data) {
      res.status(502).json({ error: j?.detail || "embed failed" });
      return;
    }
    res.status(200).json({ embeddings: j.data.map((d) => d.embedding) });
  } catch (e) {
    res.status(500).json({ error: String((e as Error)?.message || e) });
  }
}

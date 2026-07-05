/**
 * Talks to the /api/search backend (Jina jina-clip-v2). Returns null on any
 * failure (missing key, offline, error) so the caller can fall back to the
 * on-device engine — the site never breaks.
 */
export type Scored = { id: number; score: number };
export type BackendResult = { category: string | null; categories: string[]; results: Scored[] };

async function post(payload: unknown): Promise<BackendResult | null> {
  try {
    const r = await fetch("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!r.ok) return null;
    const j = (await r.json()) as {
      category?: string | null;
      categories?: string[];
      results?: Scored[];
    };
    if (!j.results) return null;
    return { category: j.category ?? null, categories: j.categories ?? [], results: j.results };
  } catch {
    return null;
  }
}

/**
 * Prepare an uploaded photo for embedding: CENTER-CROP to drop the cluttered
 * edges (wardrobe/wall/hanger that pollute the match) and downscale to a small
 * JPEG base64. The garment is almost always centered, so keeping the central
 * ~82% removes most background while preserving the clothing.
 */
export function fileToBase64(file: File, max = 384, cropFrac = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const cw = img.width * cropFrac;
      const ch = img.height * cropFrac;
      const sx = (img.width - cw) / 2;
      const sy = (img.height - ch) / 2;
      const scale = Math.min(1, max / Math.max(cw, ch));
      const w = Math.max(1, Math.round(cw * scale));
      const h = Math.max(1, Math.round(ch * scale));
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      const ctx = c.getContext("2d");
      URL.revokeObjectURL(url);
      if (!ctx) return reject(new Error("no ctx"));
      ctx.drawImage(img, sx, sy, cw, ch, 0, 0, w, h);
      resolve(c.toDataURL("image/jpeg", 0.85).split(",")[1]);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("img load"));
    };
    img.src = url;
  });
}

/** Up to 3 images — averaged server-side into one query vector. */
export async function backendImageSearch(files: File[]): Promise<BackendResult | null> {
  const some = files.slice(0, 3);
  if (!some.length) return null;
  let images: string[];
  try {
    images = await Promise.all(some.map((f) => fileToBase64(f)));
  } catch {
    return null;
  }
  return post({ mode: "image", images });
}

export async function backendTextSearch(q: string): Promise<BackendResult | null> {
  return post({ mode: "text", q });
}

/**
 * Talks to the /api/search backend (Jina jina-clip-v2). Returns null on any
 * failure (missing key, offline, error) so the caller can fall back to the
 * on-device engine — the site never breaks.
 */
export type BackendResult = { category: string | null; ids: number[] };

async function post(payload: unknown): Promise<BackendResult | null> {
  try {
    const r = await fetch("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!r.ok) return null;
    const j = (await r.json()) as { category?: string | null; results?: { id: number }[] };
    if (!j.results) return null;
    return { category: j.category ?? null, ids: j.results.map((x) => x.id) };
  } catch {
    return null;
  }
}

/** Downscale a File to a small JPEG base64 (keeps token cost + upload low). */
export function fileToBase64(file: File, max = 256): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      const ctx = c.getContext("2d");
      URL.revokeObjectURL(url);
      if (!ctx) return reject(new Error("no ctx"));
      ctx.drawImage(img, 0, 0, w, h);
      resolve(c.toDataURL("image/jpeg", 0.8).split(",")[1]);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("img load"));
    };
    img.src = url;
  });
}

export async function backendImageSearch(file: File): Promise<BackendResult | null> {
  let image: string;
  try {
    image = await fileToBase64(file);
  } catch {
    return null;
  }
  return post({ mode: "image", image });
}

export async function backendTextSearch(q: string): Promise<BackendResult | null> {
  return post({ mode: "text", q });
}

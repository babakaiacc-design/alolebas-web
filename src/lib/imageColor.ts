/**
 * Extract the dominant GARMENT color from an uploaded photo (client-side).
 * Real user photos have cluttered backgrounds (wardrobe, wall, hanger), so a
 * naive average is polluted. We bias toward the clothing by:
 *   - sampling a center-weighted region (the garment is usually centered),
 *   - preferring saturated pixels (clothing color pops; wood/wall is muted).
 */
export function dominantColorFromFile(file: File): Promise<string> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      try {
        const S = 48;
        const canvas = document.createElement("canvas");
        canvas.width = S;
        canvas.height = S;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          URL.revokeObjectURL(url);
          resolve("#888888");
          return;
        }
        ctx.drawImage(img, 0, 0, S, S);
        const { data } = ctx.getImageData(0, 0, S, S);
        URL.revokeObjectURL(url);

        type Px = { r: number; g: number; b: number; sat: number; w: number };
        const px: Px[] = [];
        for (let y = 0; y < S; y++) {
          for (let x = 0; x < S; x++) {
            const i = (y * S + x) * 4;
            if (data[i + 3] < 125) continue;
            const r = data[i], g = data[i + 1], b = data[i + 2];
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;
            if (lum > 244 || lum < 12) continue; // skip near-white / near-black
            const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
            const sat = mx ? (mx - mn) / mx : 0;
            const dx = x / S - 0.5, dy = y / S - 0.5;
            const cw = 1 - Math.min(1, Math.sqrt(dx * dx + dy * dy) * 1.6); // center weight
            px.push({ r, g, b, sat, w: Math.max(0.05, cw) });
          }
        }
        if (!px.length) {
          resolve("#888888");
          return;
        }
        // keep the more-saturated pixels (garment), drop the muted background
        const sats = px.map((p) => p.sat).sort((a, b) => a - b);
        const thr = Math.max(0.18, sats[Math.floor(sats.length * 0.6)] || 0);
        let pick = px.filter((p) => p.sat >= thr);
        if (pick.length < Math.max(6, px.length * 0.08)) pick = px; // fallback if too few colorful
        let r = 0, g = 0, b = 0, wsum = 0;
        for (const p of pick) {
          const w = p.w * (0.4 + p.sat);
          r += p.r * w;
          g += p.g * w;
          b += p.b * w;
          wsum += w;
        }
        if (!wsum) {
          resolve("#888888");
          return;
        }
        const h = (v: number) => Math.round(v / wsum).toString(16).padStart(2, "0");
        resolve(`#${h(r)}${h(g)}${h(b)}`);
      } catch {
        URL.revokeObjectURL(url);
        resolve("#888888");
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve("#888888");
    };
    img.src = url;
  });
}

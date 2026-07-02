/** Extract the average garment color from an uploaded image (client-side, no backend). */
export function dominantColorFromFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      try {
        const size = 28;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          URL.revokeObjectURL(url);
          resolve("#888888");
          return;
        }
        ctx.drawImage(img, 0, 0, size, size);
        const { data } = ctx.getImageData(0, 0, size, size);
        let r = 0,
          g = 0,
          b = 0,
          count = 0;
        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] < 125) continue; // skip transparent
          const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          if (lum > 244 || lum < 12) continue; // skip near-white/black background
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }
        URL.revokeObjectURL(url);
        if (count === 0) {
          resolve("#888888");
          return;
        }
        const to2 = (n: number) => Math.round(n / count).toString(16).padStart(2, "0");
        resolve(`#${to2(r)}${to2(g)}${to2(b)}`);
      } catch {
        URL.revokeObjectURL(url);
        resolve("#888888");
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("image load failed"));
    };
    img.src = url;
  });
}

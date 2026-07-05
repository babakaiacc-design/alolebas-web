import type { Product } from "./products";

/**
 * External-store products (connected shops via Torob) live in
 * /external-products.json and are loaded at runtime (ids >= 1000). They appear
 * in AI image search results and link out to the store.
 */
let cache: Map<number, Product> | null = null;
let inflight: Promise<Map<number, Product>> | null = null;

export function loadExternal(): Promise<Map<number, Product>> {
  if (cache) return Promise.resolve(cache);
  if (inflight) return inflight;
  inflight = fetch("/external-products.json")
    .then((r) => (r.ok ? r.json() : []))
    .then((arr: any[]) => {
      const m = new Map<number, Product>();
      for (const e of arr) {
        m.set(e.id, {
          id: e.id,
          name: e.name,
          category: e.category,
          colorName: "",
          colorHex: e.colorHex || "#888888",
          price: e.price || 0,
          seller: e.shop || "فروشگاه",
          distance: 0,
          wholesale: false,
          sizes: [],
          material: "",
          rating: 0,
          ratingCount: 0,
          image: e.image,
          url: e.url,
          shop: e.shop,
          priceText: e.priceText,
          external: true,
        });
      }
      cache = m;
      return m;
    })
    .catch(() => {
      cache = new Map();
      return cache!;
    });
  return inflight;
}

import { PRODUCTS } from "./products.data";
export { PRODUCTS };

export type Product = {
  id: number;
  name: string;
  category: string;
  colorName: string;
  colorHex: string;
  price: number;
  oldPrice?: number;
  seller: string;
  distance: number; // km
  wholesale: boolean;
  sizes: string[];
  material: string;
  rating: number;
  ratingCount: number;
  minOrder?: string; // for wholesale
  altColors?: string[]; // extra swatch hexes for the gallery
  image?: string; // real product photo path
};

export const CATEGORIES = ["همه", ...Array.from(new Set(PRODUCTS.map((p) => p.category)))];
export const NEAR_KM = 8;

const FA = "۰۱۲۳۴۵۶۷۸۹";
export const fa = (n: number | string) => String(n).replace(/\d/g, (d) => FA[+d]);
export const money = (n: number) => fa(n.toLocaleString("en-US"));

export function isLight(hex: string) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return 0.299 * r + 0.587 * g + 0.114 * b > 150;
}

export const getProduct = (id: number) => PRODUCTS.find((p) => p.id === id);

/* ---------------- search helpers ---------------- */
const STOPWORDS = new Set([
  "یک", "یه", "می‌خوام", "میخوام", "می", "خوام", "برای", "با", "و", "رو", "را",
  "که", "این", "اون", "آن", "تا", "از", "به", "دنبال", "میگردم", "می‌گردم", "لطفا", "لطفاً",
]);

export function searchProducts(q: string): Product[] {
  const s = q.trim();
  if (!s) return PRODUCTS;
  const tokens = s
    .replace(/[؟?.,!،]/g, " ")
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
  if (tokens.length === 0) return PRODUCTS;
  return PRODUCTS.filter((p) => {
    const hay = `${p.name} ${p.category} ${p.colorName} ${p.material} ${p.seller}`;
    return tokens.some((t) => hay.includes(t));
  });
}

export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

export function colorDistance(a: string, b: string): number {
  const [r1, g1, b1] = hexToRgb(a);
  const [r2, g2, b2] = hexToRgb(b);
  return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
}

/** products sorted by how close their color is to the given hex (nearest first) */
export function productsByColor(hex: string): Product[] {
  return [...PRODUCTS].sort((a, b) => colorDistance(a.colorHex, hex) - colorDistance(b.colorHex, hex));
}

export function relatedProducts(p: Product, n = 3) {
  const same = PRODUCTS.filter((x) => x.id !== p.id && x.category === p.category);
  const others = PRODUCTS.filter((x) => x.id !== p.id && x.category !== p.category);
  return [...same, ...others].slice(0, n);
}

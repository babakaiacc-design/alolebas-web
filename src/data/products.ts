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
};

export const PRODUCTS: Product[] = [
  { id: 1, name: "مانتو نخی روشن", category: "مانتو", colorName: "کرم", colorHex: "#efe7d8", price: 620000, oldPrice: 780000, seller: "مزون آوا", distance: 3, wholesale: false, sizes: ["S", "M", "L"], material: "نخ", rating: 4.7, ratingCount: 128, altColors: ["#e3d7c2", "#d8c7a8", "#c9b48c"] },
  { id: 2, name: "پیراهن مردانه آستین‌بلند", category: "پیراهن", colorName: "آبی", colorHex: "#2f4a7a", price: 450000, seller: "تیرداد استایل", distance: 6, wholesale: false, sizes: ["M", "L", "XL"], material: "پنبه", rating: 4.5, ratingCount: 96, altColors: ["#2f4a7a", "#3d5c92", "#20355c"] },
  { id: 3, name: "شلوار جین سبز", category: "شلوار", colorName: "سبز", colorHex: "#4b7a4a", price: 540000, seller: "جین‌سرا", distance: 2, wholesale: false, sizes: ["38", "40", "42"], material: "جین (دنیم)", rating: 4.6, ratingCount: 210, altColors: ["#4b7a4a", "#3f6a3f", "#5c8c5b"] },
  { id: 4, name: "لباس مجلسی بلند", category: "مجلسی", colorName: "شرابی", colorHex: "#6e2033", price: 1850000, oldPrice: 2200000, seller: "مزون رُز", distance: 11, wholesale: false, sizes: ["S", "M"], material: "ساتن", rating: 4.9, ratingCount: 74, altColors: ["#6e2033", "#4a1622", "#8a2a42"] },
  { id: 5, name: "مانتو کتان اداری", category: "مانتو", colorName: "ذغالی", colorHex: "#2d2d2d", price: 690000, seller: "کاژه", distance: 5, wholesale: false, sizes: ["M", "L"], material: "کتان", rating: 4.4, ratingCount: 63, altColors: ["#2d2d2d", "#3f3f3f", "#1c1c1c"] },
  { id: 6, name: "تیشرت پنبه‌ای", category: "تیشرت", colorName: "سفید", colorHex: "#f4f4f0", price: 220000, seller: "بازار تهران", distance: 1, wholesale: false, sizes: ["S", "M", "L", "XL"], material: "پنبه", rating: 4.3, ratingCount: 320, altColors: ["#f4f4f0", "#e6e6df", "#d9d9d0"] },
  { id: 7, name: "پارچه کرپ (متری)", category: "پارچه", colorName: "طلایی", colorHex: "#c8963e", price: 180000, seller: "واردات نخ‌وپود", distance: 9, wholesale: true, sizes: ["متر"], material: "کرپ", rating: 4.6, ratingCount: 41, minOrder: "حداقل ۵ متر", altColors: ["#c8963e", "#b3812f", "#dcae5a"] },
  { id: 8, name: "کاپشن زمستانی", category: "کاپشن", colorName: "سرمه‌ای", colorHex: "#1b2a4a", price: 1250000, seller: "اسپرت‌لند", distance: 14, wholesale: false, sizes: ["M", "L", "XL"], material: "پلی‌استر ضدآب", rating: 4.5, ratingCount: 88, altColors: ["#1b2a4a", "#0f1a2e", "#2d3f63"] },
  { id: 9, name: "شومیز حریر", category: "شومیز", colorName: "صورتی", colorHex: "#d68aa0", price: 380000, seller: "مزون نیلا", distance: 4, wholesale: false, sizes: ["S", "M", "L"], material: "حریر", rating: 4.7, ratingCount: 112, altColors: ["#d68aa0", "#c56f88", "#e6a3b6"] },
  { id: 10, name: "شلوار کتان مردانه", category: "شلوار", colorName: "خاکی", colorHex: "#9a8663", price: 490000, seller: "تیرداد استایل", distance: 6, wholesale: false, sizes: ["40", "42", "44"], material: "کتان", rating: 4.4, ratingCount: 57, altColors: ["#9a8663", "#847152", "#b09b76"] },
  { id: 11, name: "مانتو عمده (بسته ۱۲تایی)", category: "مانتو", colorName: "طوسی", colorHex: "#8a8f98", price: 5400000, seller: "تولیدی مهتا", distance: 12, wholesale: true, sizes: ["متنوع"], material: "نخ", rating: 4.5, ratingCount: 33, minOrder: "بسته‌ی ۱۲تایی", altColors: ["#8a8f98", "#767b84", "#a1a6ad"] },
  { id: 12, name: "کفش کالج چرم", category: "کفش", colorName: "قهوه‌ای", colorHex: "#5a3a22", price: 890000, seller: "چرم‌دوز", distance: 7, wholesale: false, sizes: ["40", "41", "42", "43"], material: "چرم طبیعی", rating: 4.8, ratingCount: 145, altColors: ["#5a3a22", "#48301c", "#6e492c"] },
];

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

export function relatedProducts(p: Product, n = 3) {
  const same = PRODUCTS.filter((x) => x.id !== p.id && x.category === p.category);
  const others = PRODUCTS.filter((x) => x.id !== p.id && x.category !== p.category);
  return [...same, ...others].slice(0, n);
}

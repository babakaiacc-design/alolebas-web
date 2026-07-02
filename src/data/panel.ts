import type { Tone } from "../components/dashboard";

/* ---------------- Buyer ---------------- */
export type Order = {
  code: string;
  date: string;
  items: string;
  count: number;
  total: number;
  status: string;
  tone: Tone;
  escrow: string;
  escrowTone: Tone;
};

export const BUYER_ORDERS: Order[] = [
  { code: "AL-10421", date: "۱۴۰۵/۰۴/۱۰", items: "مانتو نخی روشن + شومیز حریر", count: 2, total: 1000000, status: "تحویل داده شده", tone: "green", escrow: "وجه آزاد شد", escrowTone: "green" },
  { code: "AL-10418", date: "۱۴۰۵/۰۴/۰۹", items: "شلوار جین سبز", count: 1, total: 540000, status: "ارسال شده", tone: "indigo", escrow: "وجه نزد الولباس", escrowTone: "teal" },
  { code: "AL-10405", date: "۱۴۰۵/۰۴/۰۷", items: "لباس مجلسی بلند", count: 1, total: 1850000, status: "در انتظار تأیید تو", tone: "amber", escrow: "منتظر تأیید", escrowTone: "amber" },
  { code: "AL-10390", date: "۱۴۰۵/۰۴/۰۳", items: "تیشرت پنبه‌ای ×۳", count: 3, total: 660000, status: "تکمیل شده", tone: "green", escrow: "وجه آزاد شد", escrowTone: "green" },
  { code: "AL-10377", date: "۱۴۰۵/۰۳/۲۹", items: "کاپشن زمستانی", count: 1, total: 1250000, status: "لغو شده", tone: "red", escrow: "وجه بازگشت", escrowTone: "gray" },
];

export type WalletTx = { date: string; desc: string; amount: number; kind: "in" | "out" };
export const BUYER_TX: WalletTx[] = [
  { date: "۱۴۰۵/۰۴/۱۰", desc: "پرداخت سفارش AL-10421", amount: -1000000, kind: "out" },
  { date: "۱۴۰۵/۰۴/۰۹", desc: "شارژ کیف پول", amount: 2000000, kind: "in" },
  { date: "۱۴۰۵/۰۴/۰۳", desc: "بازگشت وجه سفارش AL-10377", amount: 1250000, kind: "in" },
  { date: "۱۴۰۵/۰۳/۲۸", desc: "پرداخت سفارش AL-10360", amount: -430000, kind: "out" },
];
export const BUYER_BALANCE = 2820000;

export type Watch = { product: string; current: number; target: number; active: boolean };
export const BUYER_WATCHES: Watch[] = [
  { product: "کاپشن زمستانی", current: 1250000, target: 1100000, active: true },
  { product: "لباس مجلسی بلند", current: 1850000, target: 1600000, active: true },
  { product: "کفش کالج چرم", current: 890000, target: 800000, active: false },
];

export type Address = { title: string; full: string; isDefault: boolean };
export const BUYER_ADDRESSES: Address[] = [
  { title: "خانه", full: "تهران، سعادت‌آباد، خیابان بیست‌وچهارم، پلاک ۱۲، واحد ۵", isDefault: true },
  { title: "محل کار", full: "تهران، ونک، برج نگار، طبقه ۸", isDefault: false },
];

export type Ticket = { code: string; subject: string; status: string; tone: Tone; date: string };
export const BUYER_TICKETS: Ticket[] = [
  { code: "T-2051", subject: "پیگیری مرسوله سفارش AL-10418", status: "پاسخ داده شد", tone: "teal", date: "۱۴۰۵/۰۴/۰۹" },
  { code: "T-2043", subject: "سوال درباره سایز مانتو", status: "بسته شده", tone: "gray", date: "۱۴۰۵/۰۴/۰۱" },
];

export const BUYER_FAVORITES = [1, 3, 4, 9, 12, 6];

/* ---------------- Seller ---------------- */
export type SellerProduct = {
  name: string;
  price: number;
  stock: number;
  status: string;
  tone: Tone;
  visits: number;
};
export const SELLER_PRODUCTS: SellerProduct[] = [
  { name: "مانتو نخی روشن", price: 620000, stock: 24, status: "تأیید شده", tone: "green", visits: 1280 },
  { name: "مانتو کتان اداری", price: 690000, stock: 11, status: "تأیید شده", tone: "green", visits: 860 },
  { name: "شومیز حریر گلدار", price: 410000, stock: 0, status: "ناموجود", tone: "gray", visits: 540 },
  { name: "پالتو بلند زمستانی", price: 1450000, stock: 6, status: "در انتظار تأیید", tone: "amber", visits: 0 },
];

export type SellerOrder = {
  code: string;
  date: string;
  customer: string;
  item: string;
  total: number;
  status: string;
  tone: Tone;
};
export const SELLER_ORDERS: SellerOrder[] = [
  { code: "AL-10421", date: "۱۴۰۵/۰۴/۱۰", customer: "سارا م.", item: "مانتو نخی روشن", total: 620000, status: "جدید", tone: "amber" },
  { code: "AL-10419", date: "۱۴۰۵/۰۴/۱۰", customer: "نگار ر.", item: "مانتو کتان اداری", total: 690000, status: "آماده ارسال", tone: "teal" },
  { code: "AL-10412", date: "۱۴۰۵/۰۴/۰۹", customer: "مهدی ک.", item: "مانتو نخی روشن ×۲", total: 1240000, status: "ارسال شده", tone: "indigo" },
  { code: "AL-10401", date: "۱۴۰۵/۰۴/۰۷", customer: "لیلا ن.", item: "مانتو کتان اداری", total: 690000, status: "تحویل داده شده", tone: "green" },
];

export type Rfq = { business: string; product: string; qty: string; date: string; status: string; tone: Tone };
export const SELLER_RFQS: Rfq[] = [
  { business: "بوتیک ایده", product: "مانتو نخی (عمده)", qty: "۵۰ عدد", date: "۱۴۰۵/۰۴/۱۰", status: "نیازمند قیمت", tone: "amber" },
  { business: "پخش پوشاک رها", product: "مانتو کتان (عمده)", qty: "۱۲۰ عدد", date: "۱۴۰۵/۰۴/۰۸", status: "قیمت ارسال شد", tone: "teal" },
];

export const SELLER_SALES_7D = [3.2, 4.1, 2.8, 5.6, 4.9, 6.3, 5.1]; // میلیون تومان
export const SELLER_SALES_DAYS = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

export type SellerTx = { date: string; desc: string; amount: number; kind: "in" | "out" };
export const SELLER_TX: SellerTx[] = [
  { date: "۱۴۰۵/۰۴/۱۰", desc: "فروش سفارش AL-10421 (پس از کمیسیون)", amount: 310000, kind: "in" },
  { date: "۱۴۰۵/۰۴/۰۹", desc: "فروش سفارش AL-10412 (پس از کمیسیون)", amount: 620000, kind: "in" },
  { date: "۱۴۰۵/۰۴/۰۵", desc: "درخواست برداشت", amount: -1500000, kind: "out" },
];
export const SELLER_BALANCE = 4180000;
export const SELLER_COMMISSION = 50;

export const SELLER_REVIEWS = [
  { name: "سارا", stars: 5, text: "کیفیت دوخت عالی بود و سریع ارسال شد. ممنون." },
  { name: "نگار", stars: 4, text: "پارچه خوب بود، بسته‌بندی می‌توانست بهتر باشد." },
  { name: "مهدی", stars: 5, text: "دقیقاً مطابق توضیحات. حتماً باز هم خرید می‌کنم." },
];

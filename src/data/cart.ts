export type CartLine = { productId: number; size: string; qty: number };

export const CART_ITEMS: CartLine[] = [
  { productId: 1, size: "M", qty: 1 },
  { productId: 3, size: "40", qty: 1 },
  { productId: 6, size: "L", qty: 2 },
];

export const SHIPPING_METHODS = [
  { id: "express", label: "پیک ۳ ساعته (هم‌شهری)", price: 45000, hint: "تحویل تا ۳ ساعت در تهران" },
  { id: "post", label: "پست پیشتاز", price: 60000, hint: "۲ تا ۴ روز کاری" },
] as const;

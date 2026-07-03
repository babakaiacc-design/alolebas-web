import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShieldCheck, ArrowLeft, Store, ShoppingBag } from "lucide-react";
import { C, CONTAINER, SiteHeader, SiteFooter } from "../components/site-chrome";
import { getProduct, fa, money, isLight } from "../data/products";
import { CART_ITEMS, type CartLine } from "../data/cart";

export default function CartPage() {
  const [lines, setLines] = useState<CartLine[]>(CART_ITEMS);

  useEffect(() => {
    document.title = "سبد خرید | الولباس";
    window.scrollTo(0, 0);
  }, []);

  const rows = lines
    .map((l) => ({ line: l, product: getProduct(l.productId) }))
    .filter((r) => r.product);

  const subtotal = rows.reduce((a, r) => a + (r.product!.price * r.line.qty), 0);
  const discount = rows.reduce(
    (a, r) => a + (r.product!.oldPrice ? (r.product!.oldPrice - r.product!.price) * r.line.qty : 0),
    0,
  );
  const shipping = subtotal > 0 ? 45000 : 0;
  const total = subtotal + shipping;

  function setQty(i: number, delta: number) {
    setLines((ls) => ls.map((l, j) => (j === i ? { ...l, qty: Math.max(1, l.qty + delta) } : l)));
  }
  function remove(i: number) {
    setLines((ls) => ls.filter((_, j) => j !== i));
  }

  return (
    <div style={{ background: C.cream, color: C.dark, minHeight: "100vh" }}>
      <SiteHeader />
      <section className={`${CONTAINER} py-8`}>
        <h1 className="mb-6 text-2xl font-black" style={{ color: C.indigo }}>
          سبد خرید
        </h1>

        {rows.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center rounded-2xl py-20 text-center"
            style={{ background: "#fff", border: `1px solid ${C.border}` }}
          >
            <div
              className="mb-4 flex h-16 w-16 items-center justify-center rounded-full"
              style={{ background: C.cream, color: C.muted }}
            >
              <ShoppingBag size={28} aria-hidden />
            </div>
            <p className="mb-5 text-sm" style={{ color: C.muted }}>
              سبد خریدت خالی است.
            </p>
            <Link
              to="/search"
              className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white"
              style={{ background: C.teal }}
            >
              شروع خرید
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            {/* items */}
            <div className="space-y-3">
              {rows.map((r, i) => {
                const p = r.product!;
                return (
                  <div
                    key={i}
                    className="flex gap-4 rounded-2xl p-3"
                    style={{ background: "#fff", border: `1px solid ${C.border}` }}
                  >
                    <Link
                      to={`/product/${p.id}`}
                      className="flex h-24 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl"
                      style={{ background: p.colorHex }}
                    >
                      {p.image ? (
                        <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover" />
                      ) : (
                        <Store size={26} style={{ color: isLight(p.colorHex) ? "rgba(0,0,0,.22)" : "rgba(255,255,255,.55)" }} aria-hidden />
                      )}
                    </Link>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <Link to={`/product/${p.id}`} className="text-sm font-bold" style={{ color: C.indigo }}>
                          {p.name}
                        </Link>
                        <button onClick={() => remove(i)} aria-label="حذف" style={{ color: "#b84040" }}>
                          <Trash2 size={17} aria-hidden />
                        </button>
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-xs" style={{ color: C.muted }}>
                        <span>سایز {r.line.size}</span>
                        <span>·</span>
                        <span>{p.colorName}</span>
                        <span>·</span>
                        <span>{p.seller}</span>
                      </div>

                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div
                          className="flex items-center gap-3 rounded-lg px-2 py-1"
                          style={{ border: `1px solid ${C.border}` }}
                        >
                          <button onClick={() => setQty(i, 1)} aria-label="افزایش" style={{ color: C.indigo }}>
                            <Plus size={15} aria-hidden />
                          </button>
                          <span className="min-w-5 text-center text-sm font-bold" style={{ color: C.indigo }}>
                            {fa(r.line.qty)}
                          </span>
                          <button onClick={() => setQty(i, -1)} aria-label="کاهش" style={{ color: C.indigo }}>
                            <Minus size={15} aria-hidden />
                          </button>
                        </div>
                        <div className="text-sm font-black" style={{ color: C.indigo }}>
                          {money(p.price * r.line.qty)} <span className="text-xs font-normal" style={{ color: C.muted }}>تومان</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* summary */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-2xl p-5" style={{ background: "#fff", border: `1px solid ${C.border}` }}>
                <h2 className="mb-4 text-base font-bold" style={{ color: C.indigo }}>
                  خلاصه سفارش
                </h2>
                <SummaryRow label="جمع کالاها" value={`${money(subtotal)} تومان`} />
                {discount > 0 && <SummaryRow label="تخفیف" value={`− ${money(discount)}`} accent="#b84040" />}
                <SummaryRow label="هزینه ارسال (تخمینی)" value={`${money(shipping)} تومان`} />
                <div className="my-3" style={{ borderTop: `1px solid ${C.border}` }} />
                <SummaryRow label="قابل پرداخت" value={`${money(total)} تومان`} bold />

                <div
                  className="mt-4 flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs"
                  style={{ background: "#eef6ee", color: "#2a4a2a" }}
                >
                  <ShieldCheck size={15} aria-hidden />
                  این خرید با امین خرید محافظت می‌شود.
                </div>

                <Link
                  to="/checkout"
                  className="al-pulse mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white"
                  style={{ background: C.gold }}
                >
                  ادامه‌ی خرید
                  <ArrowLeft size={16} aria-hidden />
                </Link>
              </div>
            </aside>
          </div>
        )}
      </section>
      <SiteFooter />
    </div>
  );
}

function SummaryRow({ label, value, bold, accent }: { label: string; value: string; bold?: boolean; accent?: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm" style={{ color: C.muted }}>
        {label}
      </span>
      <span
        className={bold ? "text-base font-black" : "text-sm font-medium"}
        style={{ color: accent || C.indigo }}
      >
        {value}
      </span>
    </div>
  );
}

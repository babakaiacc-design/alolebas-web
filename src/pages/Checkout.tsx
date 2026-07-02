import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Truck,
  Wallet,
  CreditCard,
  Check,
  ShieldCheck,
  Clock,
  Plus,
  CircleCheck,
  Package,
} from "lucide-react";
import { C, CONTAINER, SiteHeader, SiteFooter } from "../components/site-chrome";
import { getProduct, fa, money } from "../data/products";
import { CART_ITEMS, SHIPPING_METHODS } from "../data/cart";
import { BUYER_ADDRESSES } from "../data/panel";

const STEPS = [
  { n: 1, label: "آدرس" },
  { n: 2, label: "ارسال" },
  { n: 3, label: "پرداخت" },
];

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [addr, setAddr] = useState(0);
  const [ship, setShip] = useState<(typeof SHIPPING_METHODS)[number]["id"]>("express");
  const [pay, setPay] = useState<"wallet" | "gateway">("wallet");
  const [placed, setPlaced] = useState(false);

  useEffect(() => {
    document.title = "تسویه حساب | الولباس";
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step, placed]);

  const rows = CART_ITEMS.map((l) => ({ line: l, product: getProduct(l.productId) })).filter((r) => r.product);
  const subtotal = rows.reduce((a, r) => a + r.product!.price * r.line.qty, 0);
  const shippingPrice = SHIPPING_METHODS.find((m) => m.id === ship)!.price;
  const total = subtotal + shippingPrice;

  if (placed) return <Success total={total} />;

  return (
    <div style={{ background: C.cream, color: C.dark, minHeight: "100vh" }}>
      <SiteHeader />
      <section className={`${CONTAINER} py-8`}>
        {/* stepper */}
        <div className="mx-auto mb-8 flex max-w-lg items-center">
          {STEPS.map((s, i) => (
            <div key={s.n} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold"
                  style={{
                    background: step >= s.n ? C.indigo : "#fff",
                    color: step >= s.n ? "#fff" : C.muted,
                    border: `1px solid ${step >= s.n ? C.indigo : C.border}`,
                  }}
                >
                  {step > s.n ? <Check size={16} aria-hidden /> : fa(s.n)}
                </div>
                <span className="text-xs font-medium" style={{ color: step >= s.n ? C.indigo : C.muted }}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="mx-2 h-0.5 flex-1" style={{ background: step > s.n ? C.indigo : C.border }} />
              )}
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div>
            {step === 1 && (
              <Panel title="آدرس تحویل" action={<AddBtn label="افزودن آدرس" />}>
                <div className="space-y-3">
                  {BUYER_ADDRESSES.map((a, i) => {
                    const on = i === addr;
                    return (
                      <button
                        key={a.title}
                        onClick={() => setAddr(i)}
                        className="flex w-full items-start gap-3 rounded-xl p-4 text-right"
                        style={{
                          background: on ? C.lightTeal : C.cream,
                          border: `1px solid ${on ? C.teal : C.border}`,
                        }}
                      >
                        <MapPin size={18} style={{ color: on ? C.tealInk : C.muted }} aria-hidden className="mt-0.5" />
                        <div>
                          <div className="text-sm font-bold" style={{ color: C.indigo }}>
                            {a.title}
                          </div>
                          <div className="mt-0.5 text-sm leading-6" style={{ color: C.muted }}>
                            {a.full}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </Panel>
            )}

            {step === 2 && (
              <Panel title="روش ارسال">
                <div className="space-y-3">
                  {SHIPPING_METHODS.map((m) => {
                    const on = m.id === ship;
                    return (
                      <button
                        key={m.id}
                        onClick={() => setShip(m.id)}
                        className="flex w-full items-center justify-between gap-3 rounded-xl p-4 text-right"
                        style={{ background: on ? C.lightTeal : C.cream, border: `1px solid ${on ? C.teal : C.border}` }}
                      >
                        <div className="flex items-center gap-3">
                          {m.id === "express" ? (
                            <Clock size={18} style={{ color: on ? C.tealInk : C.muted }} aria-hidden />
                          ) : (
                            <Truck size={18} style={{ color: on ? C.tealInk : C.muted }} aria-hidden />
                          )}
                          <div>
                            <div className="text-sm font-bold" style={{ color: C.indigo }}>
                              {m.label}
                            </div>
                            <div className="text-xs" style={{ color: C.muted }}>
                              {m.hint}
                            </div>
                          </div>
                        </div>
                        <span className="text-sm font-bold" style={{ color: C.indigo }}>
                          {money(m.price)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </Panel>
            )}

            {step === 3 && (
              <Panel title="روش پرداخت">
                <div className="space-y-3">
                  <PayOption
                    on={pay === "wallet"}
                    onClick={() => setPay("wallet")}
                    icon={Wallet}
                    title="کیف پول الولباس"
                    hint="موجودی: ۲٬۸۲۰٬۰۰۰ تومان"
                  />
                  <PayOption
                    on={pay === "gateway"}
                    onClick={() => setPay("gateway")}
                    icon={CreditCard}
                    title="درگاه پرداخت بانکی"
                    hint="پرداخت امن از طریق زرین‌پال"
                  />
                </div>
                <div
                  className="mt-4 flex items-start gap-2 rounded-xl px-4 py-3 text-sm leading-7"
                  style={{ background: "#eef6ee", color: "#2a4a2a" }}
                >
                  <ShieldCheck size={18} aria-hidden className="mt-0.5 flex-shrink-0" />
                  <span>
                    مبلغ نزد الولباس امانت می‌ماند و تا وقتی کالا را نگرفتی و تأیید نکردی به
                    فروشنده پرداخت نمی‌شود.
                  </span>
                </div>
              </Panel>
            )}

            {/* nav */}
            <div className="mt-5 flex items-center justify-between">
              {step > 1 ? (
                <button
                  onClick={() => setStep((s) => s - 1)}
                  className="rounded-xl px-5 py-2.5 text-sm font-bold"
                  style={{ background: "#fff", color: C.indigo, border: `1px solid ${C.border}` }}
                >
                  مرحله قبل
                </button>
              ) : (
                <Link
                  to="/cart"
                  className="rounded-xl px-5 py-2.5 text-sm font-bold"
                  style={{ background: "#fff", color: C.indigo, border: `1px solid ${C.border}` }}
                >
                  بازگشت به سبد
                </Link>
              )}

              {step < 3 ? (
                <button
                  onClick={() => setStep((s) => s + 1)}
                  className="rounded-xl px-7 py-2.5 text-sm font-bold text-white"
                  style={{ background: C.indigo }}
                >
                  مرحله بعد
                </button>
              ) : (
                <button
                  onClick={() => setPlaced(true)}
                  className="al-pulse rounded-xl px-7 py-2.5 text-sm font-bold text-white"
                  style={{ background: C.gold }}
                >
                  ثبت و پرداخت
                </button>
              )}
            </div>
          </div>

          {/* summary */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl p-5" style={{ background: "#fff", border: `1px solid ${C.border}` }}>
              <h2 className="mb-4 text-base font-bold" style={{ color: C.indigo }}>
                خلاصه سفارش
              </h2>
              <div className="mb-3 space-y-2">
                {rows.map((r, i) => (
                  <div key={i} className="flex items-center justify-between text-xs" style={{ color: C.muted }}>
                    <span className="truncate">
                      {r.product!.name} × {fa(r.line.qty)}
                    </span>
                    <span style={{ color: C.indigo }}>{money(r.product!.price * r.line.qty)}</span>
                  </div>
                ))}
              </div>
              <div className="my-3" style={{ borderTop: `1px solid ${C.border}` }} />
              <Row label="جمع کالاها" value={money(subtotal)} />
              <Row label="ارسال" value={money(shippingPrice)} />
              <div className="my-3" style={{ borderTop: `1px solid ${C.border}` }} />
              <Row label="قابل پرداخت" value={`${money(total)} تومان`} bold />
            </div>
          </aside>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

function Success({ total }: { total: number }) {
  const code = "AL-10" + Math.floor(400 + Math.random() * 99);
  return (
    <div style={{ background: C.cream, color: C.dark, minHeight: "100vh" }}>
      <SiteHeader />
      <section className={`${CONTAINER} flex flex-col items-center justify-center py-20 text-center`}>
        <div
          className="mb-5 flex h-20 w-20 items-center justify-center rounded-full"
          style={{ background: "#eef6ee", color: C.sage }}
        >
          <CircleCheck size={40} aria-hidden />
        </div>
        <h1 className="text-2xl font-black" style={{ color: C.indigo }}>
          سفارشت ثبت شد
        </h1>
        <p className="mt-2 text-sm" style={{ color: C.muted }}>
          کد سفارش: <span className="font-bold" style={{ color: C.indigo }}>{code}</span> — مبلغ{" "}
          {money(total)} تومان
        </p>

        <div
          className="mt-6 flex max-w-md items-start gap-2 rounded-2xl px-5 py-4 text-right text-sm leading-7"
          style={{ background: "#eef6ee", color: "#2a4a2a" }}
        >
          <ShieldCheck size={20} aria-hidden className="mt-0.5 flex-shrink-0" />
          <span>
            مبلغ سفارش با <b>امین خرید</b> نزد الولباس امانت است. به‌محض دریافت کالا و تأیید
            تو، به فروشنده پرداخت می‌شود.
          </span>
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/account"
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white"
            style={{ background: C.indigo }}
          >
            <Package size={16} aria-hidden />
            پیگیری سفارش
          </Link>
          <Link
            to="/search"
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold"
            style={{ background: "#fff", color: C.indigo, border: `1px solid ${C.border}` }}
          >
            ادامه‌ی خرید
          </Link>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

function Panel({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-2xl p-5 sm:p-6" style={{ background: "#fff", border: `1px solid ${C.border}` }}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-bold" style={{ color: C.indigo }}>
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function PayOption({
  on,
  onClick,
  icon: Icon,
  title,
  hint,
}: {
  on: boolean;
  onClick: () => void;
  icon: typeof Wallet;
  title: string;
  hint: string;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl p-4 text-right"
      style={{ background: on ? C.lightTeal : C.cream, border: `1px solid ${on ? C.teal : C.border}` }}
    >
      <Icon size={18} style={{ color: on ? C.tealInk : C.muted }} aria-hidden />
      <div>
        <div className="text-sm font-bold" style={{ color: C.indigo }}>
          {title}
        </div>
        <div className="text-xs" style={{ color: C.muted }}>
          {hint}
        </div>
      </div>
    </button>
  );
}

function AddBtn({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-bold" style={{ color: C.teal }}>
      <Plus size={13} aria-hidden />
      {label}
    </span>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm" style={{ color: C.muted }}>
        {label}
      </span>
      <span className={bold ? "text-base font-black" : "text-sm font-medium"} style={{ color: C.indigo }}>
        {value}
      </span>
    </div>
  );
}

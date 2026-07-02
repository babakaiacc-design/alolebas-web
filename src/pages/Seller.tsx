import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  FileText,
  Wallet,
  Store,
  Star,
  Plus,
  Check,
  Eye,
  TrendingUp,
  Truck,
  ArrowDownLeft,
  ArrowUpRight,
} from "lucide-react";
import { C, Reveal } from "../components/site-chrome";
import { DashShell, StatCard, Panel, StatusBadge, PrimaryButton, GhostButton, type NavItem, type Tone } from "../components/dashboard";
import { fa, money } from "../data/products";
import {
  SELLER_PRODUCTS,
  SELLER_ORDERS,
  SELLER_RFQS,
  SELLER_TX,
  SELLER_BALANCE,
  SELLER_COMMISSION,
  SELLER_REVIEWS,
  SELLER_SALES_7D,
  SELLER_SALES_DAYS,
  type SellerOrder,
} from "../data/panel";

const NAV: NavItem[] = [
  { id: "dashboard", label: "داشبورد", icon: LayoutDashboard },
  { id: "products", label: "محصولات", icon: Package },
  { id: "orders", label: "سفارش‌ها", icon: ShoppingBag, badge: 1 },
  { id: "rfq", label: "درخواست قیمت", icon: FileText, badge: 1 },
  { id: "finance", label: "مالی", icon: Wallet },
  { id: "storefront", label: "ویترین فروشگاه", icon: Store },
  { id: "reviews", label: "نظرها", icon: Star },
];

export default function SellerPage() {
  const [active, setActive] = useState("dashboard");
  useEffect(() => {
    document.title = "پنل فروشنده | الولباس";
    window.scrollTo(0, 0);
  }, []);

  return (
    <DashShell avatarText="آو" name="مزون آوا" meta="فروشنده · تهران" nav={NAV} active={active} onSelect={setActive}>
      <Reveal key={active} immediate>
        {active === "dashboard" && <Dashboard onNav={setActive} />}
        {active === "products" && <Products />}
        {active === "orders" && <Orders />}
        {active === "rfq" && <RFQ />}
        {active === "finance" && <Finance />}
        {active === "storefront" && <Storefront />}
        {active === "reviews" && <Reviews />}
      </Reveal>
    </DashShell>
  );
}

/* table helpers */
function TWrap({ children }: { children: ReactNode }) {
  return <div className="overflow-x-auto">{children}</div>;
}
function Th({ children }: { children: ReactNode }) {
  return (
    <th className="whitespace-nowrap px-3 py-2.5 text-right text-xs font-bold" style={{ color: C.muted }}>
      {children}
    </th>
  );
}
function Td({ children }: { children: ReactNode }) {
  return (
    <td className="whitespace-nowrap px-3 py-3 text-sm" style={{ color: C.dark }}>
      {children}
    </td>
  );
}
function Row({ children }: { children: ReactNode }) {
  return <tr style={{ borderTop: `1px solid ${C.border}` }}>{children}</tr>;
}

/* ---------- Dashboard ---------- */
function Dashboard({ onNav }: { onNav: (id: string) => void }) {
  const totalVisits = SELLER_PRODUCTS.reduce((a, p) => a + p.visits, 0);
  const maxSale = Math.max(...SELLER_SALES_7D);
  return (
    <>
      <div className="mb-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={TrendingUp} label="فروش امروز (تومان)" value={money(Math.round(SELLER_SALES_7D[6] * 1_000_000))} tint={C.lightTeal} ink={C.tealInk} />
        <StatCard icon={ShoppingBag} label="سفارش جدید" value={fa(1)} tint={C.lightGold} ink="#8a5a12" />
        <StatCard icon={Wallet} label="قابل برداشت" value={money(SELLER_BALANCE)} tint="#e9edf5" ink={C.indigo} />
        <StatCard icon={Eye} label="بازدید محصولات" value={fa(totalVisits.toLocaleString("en-US"))} tint="#fdf0ef" ink="#a32d2d" />
      </div>

      <Panel title="فروش هفت روز اخیر (میلیون تومان)">
        <div className="flex items-end justify-between gap-2" style={{ height: 160 }}>
          {SELLER_SALES_7D.map((v, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex w-full flex-1 items-end">
                <div
                  className="w-full rounded-t-lg"
                  style={{ height: `${(v / maxSale) * 100}%`, background: i === 6 ? C.gold : C.teal, minHeight: 6 }}
                  title={`${fa(v)} م.ت`}
                />
              </div>
              <span className="text-[11px]" style={{ color: C.muted }}>
                {SELLER_SALES_DAYS[i]}
              </span>
            </div>
          ))}
        </div>
      </Panel>

      <Panel
        title="سفارش‌های اخیر"
        action={
          <button onClick={() => onNav("orders")} className="text-xs font-bold" style={{ color: C.teal }}>
            مدیریت سفارش‌ها
          </button>
        }
      >
        <TWrap>
          <table className="w-full">
            <thead>
              <tr>
                <Th>کد</Th>
                <Th>مشتری</Th>
                <Th>کالا</Th>
                <Th>مبلغ</Th>
                <Th>وضعیت</Th>
              </tr>
            </thead>
            <tbody>
              {SELLER_ORDERS.slice(0, 4).map((o) => (
                <Row key={o.code}>
                  <Td>{o.code}</Td>
                  <Td>{o.customer}</Td>
                  <Td>
                    <span style={{ color: C.muted }}>{o.item}</span>
                  </Td>
                  <Td>{money(o.total)}</Td>
                  <Td>
                    <StatusBadge label={o.status} tone={o.tone} />
                  </Td>
                </Row>
              ))}
            </tbody>
          </table>
        </TWrap>
      </Panel>
    </>
  );
}

/* ---------- Products ---------- */
function Products() {
  return (
    <Panel
      title="محصولات من"
      action={
        <PrimaryButton tone="gold">
          <Plus size={14} aria-hidden />
          افزودن محصول
        </PrimaryButton>
      }
    >
      <TWrap>
        <table className="w-full">
          <thead>
            <tr>
              <Th>محصول</Th>
              <Th>قیمت</Th>
              <Th>موجودی</Th>
              <Th>بازدید</Th>
              <Th>وضعیت</Th>
              <Th> </Th>
            </tr>
          </thead>
          <tbody>
            {SELLER_PRODUCTS.map((p) => (
              <Row key={p.name}>
                <Td>{p.name}</Td>
                <Td>{money(p.price)}</Td>
                <Td>
                  <span style={{ color: p.stock === 0 ? "#a32d2d" : C.dark }}>{fa(p.stock)}</span>
                </Td>
                <Td>{fa(p.visits.toLocaleString("en-US"))}</Td>
                <Td>
                  <StatusBadge label={p.status} tone={p.tone} />
                </Td>
                <Td>
                  <button className="text-xs font-bold" style={{ color: C.teal }}>
                    ویرایش
                  </button>
                </Td>
              </Row>
            ))}
          </tbody>
        </table>
      </TWrap>
    </Panel>
  );
}

/* ---------- Orders (interactive management) ---------- */
function Orders() {
  const [orders, setOrders] = useState<SellerOrder[]>(SELLER_ORDERS);

  function advance(code: string) {
    setOrders((os) =>
      os.map((o) => {
        if (o.code !== code) return o;
        if (o.status === "جدید" || o.status === "آماده ارسال")
          return { ...o, status: "ارسال شده", tone: "indigo" as Tone };
        if (o.status === "ارسال شده") return { ...o, status: "تحویل داده شده", tone: "green" as Tone };
        return o;
      }),
    );
  }

  return (
    <Panel title="مدیریت سفارش‌ها">
      <TWrap>
        <table className="w-full">
          <thead>
            <tr>
              <Th>کد</Th>
              <Th>تاریخ</Th>
              <Th>مشتری</Th>
              <Th>کالا</Th>
              <Th>مبلغ</Th>
              <Th>وضعیت</Th>
              <Th>عملیات</Th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <Row key={o.code}>
                <Td>{o.code}</Td>
                <Td>{o.date}</Td>
                <Td>{o.customer}</Td>
                <Td>
                  <span style={{ color: C.muted }}>{o.item}</span>
                </Td>
                <Td>{money(o.total)}</Td>
                <Td>
                  <StatusBadge label={o.status} tone={o.tone} />
                </Td>
                <Td>
                  {o.status === "جدید" || o.status === "آماده ارسال" ? (
                    <PrimaryButton tone="teal" onClick={() => advance(o.code)}>
                      <Truck size={13} aria-hidden />
                      علامت ارسال
                    </PrimaryButton>
                  ) : o.status === "ارسال شده" ? (
                    <GhostButton onClick={() => advance(o.code)}>
                      <Check size={13} aria-hidden />
                      علامت تحویل
                    </GhostButton>
                  ) : (
                    <span className="text-xs" style={{ color: C.sage }}>
                      تکمیل شد
                    </span>
                  )}
                </Td>
              </Row>
            ))}
          </tbody>
        </table>
      </TWrap>
    </Panel>
  );
}

/* ---------- RFQ ---------- */
function RFQ() {
  const [sentCodes, setSentCodes] = useState<string[]>([]);
  return (
    <Panel title="درخواست‌های قیمت عمده (RFQ)">
      <div className="space-y-3">
        {SELLER_RFQS.map((r) => {
          const done = sentCodes.includes(r.business) || r.status === "قیمت ارسال شد";
          return (
            <div
              key={r.business}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl p-4"
              style={{ background: C.cream, border: `1px solid ${C.border}` }}
            >
              <div>
                <div className="text-sm font-bold" style={{ color: C.indigo }}>
                  {r.business}
                </div>
                <div className="mt-0.5 text-xs" style={{ color: C.muted }}>
                  {r.product} · {r.qty} · {r.date}
                </div>
              </div>
              {done ? (
                <StatusBadge label="قیمت ارسال شد" tone="teal" />
              ) : (
                <PrimaryButton tone="gold" onClick={() => setSentCodes((s) => [...s, r.business])}>
                  ارسال قیمت
                </PrimaryButton>
              )}
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

/* ---------- Finance ---------- */
function Finance() {
  return (
    <>
      <div
        className="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl p-6"
        style={{ background: `linear-gradient(135deg, ${C.indigo}, ${C.indigo2})` }}
      >
        <div>
          <div className="text-xs" style={{ color: "rgba(255,255,255,.6)" }}>
            موجودی قابل برداشت
          </div>
          <div className="mt-1 text-3xl font-black text-white">
            {money(SELLER_BALANCE)} <span className="text-sm font-normal">تومان</span>
          </div>
          <div className="mt-1 text-xs" style={{ color: "rgba(255,255,255,.5)" }}>
            کمیسیون الولباس: {fa(SELLER_COMMISSION)}٪
          </div>
        </div>
        <PrimaryButton tone="gold">
          <ArrowUpRight size={14} aria-hidden />
          درخواست برداشت
        </PrimaryButton>
      </div>
      <Panel title="تراکنش‌های مالی">
        <div className="space-y-2">
          {SELLER_TX.map((t, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-xl px-4 py-3"
              style={{ background: C.cream, border: `1px solid ${C.border}` }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full"
                  style={{ background: t.kind === "in" ? "#eef6ee" : "#fdf0ef", color: t.kind === "in" ? "#2a4a2a" : "#a32d2d" }}
                >
                  {t.kind === "in" ? <ArrowDownLeft size={15} aria-hidden /> : <ArrowUpRight size={15} aria-hidden />}
                </span>
                <div>
                  <div className="text-sm" style={{ color: C.indigo }}>
                    {t.desc}
                  </div>
                  <div className="text-xs" style={{ color: C.muted }}>
                    {t.date}
                  </div>
                </div>
              </div>
              <span className="text-sm font-bold" style={{ color: t.kind === "in" ? C.sage : "#a32d2d" }}>
                {t.kind === "in" ? "+" : "−"}
                {money(Math.abs(t.amount))}
              </span>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}

/* ---------- Storefront ---------- */
function Storefront() {
  const [saved, setSaved] = useState(false);
  const inputStyle = { background: C.cream, border: `1px solid ${C.border}`, color: C.dark } as const;
  return (
    <Panel title="ویترین فروشگاه">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSaved(true);
          setTimeout(() => setSaved(false), 2200);
        }}
        className="grid gap-4 sm:grid-cols-2"
      >
        <Field label="نام فروشگاه">
          <input className="al-input" style={inputStyle} defaultValue="مزون آوا" />
        </Field>
        <Field label="شماره تماس فروشگاه">
          <input className="al-input" style={inputStyle} defaultValue="۰۲۱۸۸۸۸۸۸۸۸" dir="ltr" />
        </Field>
        <div className="sm:col-span-2">
          <Field label="توضیح کوتاه فروشگاه">
            <input className="al-input" style={inputStyle} defaultValue="تولید و عرضه‌ی مانتوی نخی و اداری" />
          </Field>
        </div>
        <Field label="ساعت کاری">
          <input className="al-input" style={inputStyle} defaultValue="۹ صبح تا ۸ شب" />
        </Field>
        <Field label="اینستاگرام">
          <input className="al-input" style={inputStyle} defaultValue="@mezon_ava" dir="ltr" />
        </Field>
        <div className="sm:col-span-2">
          <Field label="آدرس فروشگاه">
            <input className="al-input" style={inputStyle} defaultValue="تهران، بازار بزرگ، راسته‌ی پوشاک" />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold text-white"
            style={{ background: saved ? C.sage : C.gold }}
          >
            {saved ? (
              <>
                <Check size={16} aria-hidden />
                ذخیره شد
              </>
            ) : (
              "ذخیره ویترین"
            )}
          </button>
        </div>
      </form>
    </Panel>
  );
}

/* ---------- Reviews ---------- */
function Reviews() {
  const avg = (SELLER_REVIEWS.reduce((a, r) => a + r.stars, 0) / SELLER_REVIEWS.length).toFixed(1);
  return (
    <>
      <div
        className="mb-5 flex items-center gap-5 rounded-2xl p-6"
        style={{ background: "#fff", border: `1px solid ${C.border}` }}
      >
        <div className="text-center">
          <div className="text-4xl font-black" style={{ color: C.indigo }}>
            {fa(avg)}
          </div>
          <div className="mt-1 flex items-center justify-center gap-0.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star key={i} size={13} style={{ color: C.gold }} fill={i < Math.round(Number(avg)) ? C.gold : "none"} aria-hidden />
            ))}
          </div>
        </div>
        <div className="text-sm" style={{ color: C.muted }}>
          میانگین امتیاز از {fa(SELLER_REVIEWS.length)} نظر ثبت‌شده برای فروشگاه شما.
        </div>
      </div>
      <Panel title="نظر مشتری‌ها">
        <div className="space-y-3">
          {SELLER_REVIEWS.map((r) => (
            <div key={r.name} className="rounded-xl p-4" style={{ background: C.cream, border: `1px solid ${C.border}` }}>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-sm font-bold" style={{ color: C.indigo }}>
                  {r.name}
                </span>
                <div className="flex items-center gap-0.5">
                  {[0, 1, 2, 3, 4].map((s) => (
                    <Star key={s} size={12} style={{ color: C.gold }} fill={s < r.stars ? C.gold : "none"} aria-hidden />
                  ))}
                </div>
              </div>
              <p className="text-sm leading-7" style={{ color: C.muted }}>
                {r.text}
              </p>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold" style={{ color: C.indigo }}>
        {label}
      </span>
      {children}
    </label>
  );
}

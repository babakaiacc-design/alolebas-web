import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShieldCheck,
  Wallet,
  Heart,
  Bell,
  MapPin,
  LifeBuoy,
  User,
  Plus,
  Check,
  ArrowDownLeft,
  ArrowUpRight,
  ChevronLeft,
  Store,
} from "lucide-react";
import { C, Reveal } from "../components/site-chrome";
import { DashShell, StatCard, Panel, StatusBadge, PrimaryButton, GhostButton, type NavItem } from "../components/dashboard";
import { ProductCard } from "../components/product-card";
import { getProduct, fa, money } from "../data/products";
import {
  BUYER_ORDERS,
  BUYER_TX,
  BUYER_BALANCE,
  BUYER_WATCHES,
  BUYER_ADDRESSES,
  BUYER_TICKETS,
  BUYER_FAVORITES,
} from "../data/panel";

const NAV: NavItem[] = [
  { id: "dashboard", label: "داشبورد", icon: LayoutDashboard },
  { id: "orders", label: "سفارش‌ها", icon: Package, badge: 2 },
  { id: "amin", label: "امین خرید", icon: ShieldCheck },
  { id: "wallet", label: "کیف پول", icon: Wallet },
  { id: "favorites", label: "علاقه‌مندی‌ها", icon: Heart },
  { id: "alerts", label: "هشدار قیمت", icon: Bell },
  { id: "addresses", label: "آدرس‌ها", icon: MapPin },
  { id: "support", label: "پشتیبانی", icon: LifeBuoy },
  { id: "profile", label: "پروفایل", icon: User },
];

export default function AccountPage() {
  const [active, setActive] = useState("dashboard");

  useEffect(() => {
    document.title = "پنل خریدار | الولباس";
    window.scrollTo(0, 0);
  }, []);

  return (
    <DashShell avatarText="سا" name="سارا محمدی" meta="خریدار · تهران" nav={NAV} active={active} onSelect={setActive}>
      <Reveal key={active} immediate>
        {active === "dashboard" && <Dashboard onNav={setActive} />}
        {active === "orders" && <Orders />}
        {active === "amin" && <Amin />}
        {active === "wallet" && <WalletSection />}
        {active === "favorites" && <Favorites />}
        {active === "alerts" && <Alerts />}
        {active === "addresses" && <Addresses />}
        {active === "support" && <Support />}
        {active === "profile" && <Profile />}
      </Reveal>
    </DashShell>
  );
}

/* ---------- table helpers ---------- */
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

/* ---------- sections ---------- */
function Dashboard({ onNav }: { onNav: (id: string) => void }) {
  return (
    <>
      <div className="mb-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Package} label="سفارش‌های فعال" value={fa(2)} tint={C.lightTeal} ink={C.tealInk} />
        <StatCard icon={Wallet} label="کیف پول (تومان)" value={money(BUYER_BALANCE)} tint="#e9edf5" ink={C.indigo} />
        <StatCard icon={Heart} label="علاقه‌مندی‌ها" value={fa(BUYER_FAVORITES.length)} tint="#fdf0ef" ink="#a32d2d" />
        <StatCard icon={Bell} label="هشدار فعال" value={fa(BUYER_WATCHES.filter((w) => w.active).length)} tint={C.lightGold} ink="#8a5a12" />
      </div>

      <Panel
        title="سفارش‌های اخیر"
        action={
          <button onClick={() => onNav("orders")} className="flex items-center gap-1 text-xs font-bold" style={{ color: C.teal }}>
            همه <ChevronLeft size={13} aria-hidden />
          </button>
        }
      >
        <TWrap>
          <table className="w-full">
            <thead>
              <tr>
                <Th>کد</Th>
                <Th>تاریخ</Th>
                <Th>مبلغ</Th>
                <Th>وضعیت</Th>
              </tr>
            </thead>
            <tbody>
              {BUYER_ORDERS.slice(0, 3).map((o) => (
                <Row key={o.code}>
                  <Td>{o.code}</Td>
                  <Td>{o.date}</Td>
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

      <Panel title="هشدارهای قیمت">
        <div className="space-y-2">
          {BUYER_WATCHES.filter((w) => w.active).map((w) => (
            <div
              key={w.product}
              className="flex items-center justify-between rounded-xl px-4 py-3"
              style={{ background: C.cream, border: `1px solid ${C.border}` }}
            >
              <span className="text-sm font-medium" style={{ color: C.indigo }}>
                {w.product}
              </span>
              <span className="text-xs" style={{ color: C.muted }}>
                فعلی {money(w.current)} · هدف {money(w.target)}
              </span>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}

function Orders() {
  return (
    <Panel title="همه‌ی سفارش‌ها">
      <TWrap>
        <table className="w-full">
          <thead>
            <tr>
              <Th>کد</Th>
              <Th>تاریخ</Th>
              <Th>اقلام</Th>
              <Th>مبلغ</Th>
              <Th>وضعیت</Th>
              <Th> </Th>
            </tr>
          </thead>
          <tbody>
            {BUYER_ORDERS.map((o) => (
              <Row key={o.code}>
                <Td>{o.code}</Td>
                <Td>{o.date}</Td>
                <Td>
                  <span style={{ color: C.muted }}>{o.items}</span>
                </Td>
                <Td>{money(o.total)}</Td>
                <Td>
                  <StatusBadge label={o.status} tone={o.tone} />
                </Td>
                <Td>
                  <button className="text-xs font-bold" style={{ color: C.teal }}>
                    جزئیات
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

function Amin() {
  return (
    <>
      <div
        className="mb-5 flex items-start gap-3 rounded-2xl p-5"
        style={{ background: "#eef6ee", border: "1px solid #c7e0c6" }}
      >
        <ShieldCheck size={22} style={{ color: C.sage }} aria-hidden />
        <p className="text-sm leading-7" style={{ color: "#2a4a2a" }}>
          هر سفارش تا وقتی کالا را نگرفتی و تأیید نکردی، تحت پوشش امین خرید است. وجه پیش
          الولباس می‌ماند و بعد از تأیید تو به فروشنده پرداخت می‌شود.{" "}
          <Link to="/amin-kharid" className="font-bold" style={{ color: C.sage }}>
            بیشتر بدانید
          </Link>
        </p>
      </div>
      <Panel title="سفارش‌های تحت ضمانت">
        <TWrap>
          <table className="w-full">
            <thead>
              <tr>
                <Th>کد</Th>
                <Th>اقلام</Th>
                <Th>مبلغ</Th>
                <Th>وضعیت امین خرید</Th>
              </tr>
            </thead>
            <tbody>
              {BUYER_ORDERS.map((o) => (
                <Row key={o.code}>
                  <Td>{o.code}</Td>
                  <Td>
                    <span style={{ color: C.muted }}>{o.items}</span>
                  </Td>
                  <Td>{money(o.total)}</Td>
                  <Td>
                    <StatusBadge label={o.escrow} tone={o.escrowTone} />
                    {o.status === "در انتظار تأیید تو" && (
                      <PrimaryButton tone="teal">
                        <Check size={13} aria-hidden />
                        تأیید دریافت
                      </PrimaryButton>
                    )}
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

function WalletSection() {
  return (
    <>
      <div
        className="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl p-6"
        style={{ background: `linear-gradient(135deg, ${C.indigo}, ${C.indigo2})` }}
      >
        <div>
          <div className="text-xs" style={{ color: "rgba(255,255,255,.6)" }}>
            موجودی کیف پول
          </div>
          <div className="mt-1 text-3xl font-black text-white">
            {money(BUYER_BALANCE)} <span className="text-sm font-normal">تومان</span>
          </div>
        </div>
        <div className="flex gap-2">
          <PrimaryButton tone="gold">
            <Plus size={14} aria-hidden />
            شارژ کیف پول
          </PrimaryButton>
          <GhostButton>درخواست برداشت</GhostButton>
        </div>
      </div>
      <Panel title="تراکنش‌ها">
        <div className="space-y-2">
          {BUYER_TX.map((t, i) => (
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

function Favorites() {
  const items = BUYER_FAVORITES.map(getProduct).filter(Boolean);
  return (
    <Panel title="علاقه‌مندی‌ها">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {items.map((p) => p && <ProductCard key={p.id} p={p} />)}
      </div>
    </Panel>
  );
}

function Alerts() {
  const [watches, setWatches] = useState(BUYER_WATCHES);
  return (
    <Panel title="هشدار قیمت و موجودی">
      <div className="space-y-2">
        {watches.map((w, i) => (
          <div
            key={w.product}
            className="flex items-center justify-between rounded-xl px-4 py-3"
            style={{ background: C.cream, border: `1px solid ${C.border}` }}
          >
            <div>
              <div className="text-sm font-medium" style={{ color: C.indigo }}>
                {w.product}
              </div>
              <div className="text-xs" style={{ color: C.muted }}>
                فعلی {money(w.current)} · وقتی به {money(w.target)} رسید خبرت می‌کنیم
              </div>
            </div>
            <button
              onClick={() => setWatches((ws) => ws.map((x, j) => (j === i ? { ...x, active: !x.active } : x)))}
              className="rounded-full px-3 py-1.5 text-xs font-bold"
              style={{
                background: w.active ? C.lightTeal : "#f1efe8",
                color: w.active ? C.tealInk : C.muted,
              }}
            >
              {w.active ? "فعال" : "غیرفعال"}
            </button>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function Addresses() {
  return (
    <Panel
      title="آدرس‌های من"
      action={
        <PrimaryButton tone="teal">
          <Plus size={14} aria-hidden />
          افزودن آدرس
        </PrimaryButton>
      }
    >
      <div className="space-y-3">
        {BUYER_ADDRESSES.map((a) => (
          <div
            key={a.title}
            className="flex items-start justify-between rounded-xl p-4"
            style={{ background: C.cream, border: `1px solid ${C.border}` }}
          >
            <div className="flex items-start gap-3">
              <MapPin size={18} style={{ color: C.teal }} aria-hidden className="mt-0.5" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold" style={{ color: C.indigo }}>
                    {a.title}
                  </span>
                  {a.isDefault && <StatusBadge label="پیش‌فرض" tone="teal" />}
                </div>
                <div className="mt-1 text-sm leading-6" style={{ color: C.muted }}>
                  {a.full}
                </div>
              </div>
            </div>
            <button className="text-xs font-bold" style={{ color: C.teal }}>
              ویرایش
            </button>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function Support() {
  return (
    <Panel
      title="تیکت‌های پشتیبانی"
      action={
        <PrimaryButton tone="teal">
          <Plus size={14} aria-hidden />
          تیکت جدید
        </PrimaryButton>
      }
    >
      <TWrap>
        <table className="w-full">
          <thead>
            <tr>
              <Th>کد</Th>
              <Th>موضوع</Th>
              <Th>تاریخ</Th>
              <Th>وضعیت</Th>
            </tr>
          </thead>
          <tbody>
            {BUYER_TICKETS.map((t) => (
              <Row key={t.code}>
                <Td>{t.code}</Td>
                <Td>{t.subject}</Td>
                <Td>{t.date}</Td>
                <Td>
                  <StatusBadge label={t.status} tone={t.tone} />
                </Td>
              </Row>
            ))}
          </tbody>
        </table>
      </TWrap>
    </Panel>
  );
}

function Profile() {
  const [saved, setSaved] = useState(false);
  const inputStyle = { background: C.cream, border: `1px solid ${C.border}`, color: C.dark } as const;
  return (
    <Panel title="اطلاعات حساب">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSaved(true);
          setTimeout(() => setSaved(false), 2200);
        }}
        className="grid gap-4 sm:grid-cols-2"
      >
        <Field label="نام و نام خانوادگی">
          <input className="al-input" style={inputStyle} defaultValue="سارا محمدی" />
        </Field>
        <Field label="شماره موبایل">
          <input className="al-input" style={inputStyle} defaultValue="۰۹۱۲۳۴۵۶۷۸۹" dir="ltr" />
        </Field>
        <Field label="ایمیل">
          <input className="al-input" style={inputStyle} defaultValue="sara@example.com" dir="ltr" />
        </Field>
        <Field label="شماره شبا (برای بازگشت وجه)">
          <input className="al-input" style={inputStyle} placeholder="IR…" dir="ltr" />
        </Field>
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
              "ذخیره تغییرات"
            )}
          </button>
        </div>
      </form>
      <div className="mt-6 flex items-center gap-2 rounded-xl p-4" style={{ background: C.lightGold }}>
        <Store size={18} style={{ color: "#8a5a12" }} aria-hidden />
        <span className="text-sm" style={{ color: "#8a5a12" }}>
          می‌خواهی بفروشی؟{" "}
          <Link to="/seller" className="font-bold underline">
            پنل فروشنده
          </Link>
        </span>
      </div>
    </Panel>
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

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Search, Mic, Camera, MapPin, Clock, SlidersHorizontal, Sparkles } from "lucide-react";
import { C, CONTAINER, Reveal, SiteHeader, SiteFooter } from "../components/site-chrome";
import { ProductCard } from "../components/product-card";
import { PRODUCTS, CATEGORIES, NEAR_KM, fa, money } from "../data/products";

const MODES = [
  { id: "text", label: "متنی", icon: Search },
  { id: "voice", label: "صوتی", icon: Mic },
  { id: "image", label: "تصویری", icon: Camera },
] as const;

export default function SearchPage() {
  const [mode, setMode] = useState<(typeof MODES)[number]["id"]>("text");
  const [cat, setCat] = useState("همه");
  const [channel, setChannel] = useState<"all" | "retail" | "wholesale">("all");
  const [maxPrice, setMaxPrice] = useState(6000000);
  const [nearOnly, setNearOnly] = useState(false);
  const [sort, setSort] = useState<"popular" | "near" | "cheap">("near");

  useEffect(() => {
    document.title = "جستجو | الولباس";
  }, []);

  const results = useMemo(() => {
    let list = PRODUCTS.filter((p) => {
      if (cat !== "همه" && p.category !== cat) return false;
      if (channel === "retail" && p.wholesale) return false;
      if (channel === "wholesale" && !p.wholesale) return false;
      if (p.price > maxPrice) return false;
      if (nearOnly && p.distance > NEAR_KM) return false;
      return true;
    });
    if (sort === "near") list = [...list].sort((a, b) => a.distance - b.distance);
    else if (sort === "cheap") list = [...list].sort((a, b) => a.price - b.price);
    return list;
  }, [cat, channel, maxPrice, nearOnly, sort]);

  return (
    <div style={{ background: C.cream, color: C.dark, minHeight: "100vh" }}>
      <SiteHeader />

      {/* search band */}
      <section className="relative overflow-hidden" style={{ background: C.indigo }}>
        <div
          className="al-orb"
          style={{
            width: 360,
            height: 360,
            top: -140,
            insetInlineStart: "8%",
            background: "radial-gradient(circle, rgba(42,157,143,.4), transparent 65%)",
            animation: "al-float 16s ease-in-out infinite",
          }}
          aria-hidden
        />
        <div className={`${CONTAINER} relative py-8`}>
          <div
            className="mx-auto w-full max-w-2xl rounded-2xl p-3"
            style={{ background: "#fff", boxShadow: "0 24px 60px -30px rgba(0,0,0,.5)" }}
          >
            <div
              className="mb-3 grid grid-cols-3 gap-1.5 rounded-xl p-1.5"
              style={{ background: "#f4f1eb" }}
              role="tablist"
              aria-label="حالت جستجو"
            >
              {MODES.map((m) => {
                const Icon = m.icon;
                const on = m.id === mode;
                return (
                  <button
                    key={m.id}
                    role="tab"
                    aria-selected={on}
                    onClick={() => setMode(m.id)}
                    className="flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-colors"
                    style={{ background: on ? C.indigo : "transparent", color: on ? "#fff" : C.muted }}
                  >
                    <Icon size={16} aria-hidden />
                    {m.label}
                  </button>
                );
              })}
            </div>
            <div
              className="flex h-12 items-center gap-3 rounded-xl px-3"
              style={{ border: `1px solid ${C.border}` }}
            >
              <Search size={19} style={{ color: C.teal }} aria-hidden />
              <span className="flex-1 truncate text-sm" style={{ color: C.dark }}>
                شلوار جین سبز
              </span>
              <span
                className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium"
                style={{ background: C.lightTeal, color: C.tealInk, border: "1px solid #9fe1cb" }}
              >
                <MapPin size={13} aria-hidden />
                تهران
              </span>
            </div>
          </div>

          <div
            className="mt-4 flex items-center justify-center gap-2 text-sm"
            style={{ color: "rgba(255,255,255,.6)" }}
          >
            <Sparkles size={15} style={{ color: C.gold }} aria-hidden />
            <span>{fa(results.length)} نتیجه پیدا شد — نزدیک‌ترین تأمین‌کننده‌ها اول</span>
          </div>
        </div>
      </section>

      {/* results + filters */}
      <section className={`${CONTAINER} py-10`}>
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl p-5" style={{ background: "#fff", border: `1px solid ${C.border}` }}>
              <div className="mb-4 flex items-center gap-2 text-sm font-bold" style={{ color: C.indigo }}>
                <SlidersHorizontal size={17} aria-hidden />
                فیلترها
              </div>

              <FilterLabel>دسته‌بندی</FilterLabel>
              <div className="mb-5 flex flex-wrap gap-1.5">
                {CATEGORIES.map((c) => {
                  const on = c === cat;
                  return (
                    <button
                      key={c}
                      onClick={() => setCat(c)}
                      className="rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
                      style={{
                        background: on ? C.indigo : C.cream,
                        color: on ? "#fff" : C.dark,
                        border: `1px solid ${on ? C.indigo : C.border}`,
                      }}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>

              <FilterLabel>نوع خرید</FilterLabel>
              <div
                className="mb-5 grid grid-cols-3 gap-1 rounded-lg p-1"
                style={{ background: C.cream, border: `1px solid ${C.border}` }}
              >
                {([
                  ["all", "همه"],
                  ["retail", "خرده"],
                  ["wholesale", "عمده"],
                ] as const).map(([val, label]) => {
                  const on = channel === val;
                  return (
                    <button
                      key={val}
                      onClick={() => setChannel(val)}
                      className="rounded-md py-1.5 text-xs font-medium transition-colors"
                      style={{
                        background: on ? "#fff" : "transparent",
                        color: on ? C.indigo : C.muted,
                        boxShadow: on ? "0 1px 3px rgba(0,0,0,.08)" : "none",
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              <FilterLabel>حداکثر بودجه</FilterLabel>
              <input
                type="range"
                min={200000}
                max={6000000}
                step={50000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#2a9d8f]"
                dir="ltr"
                aria-label="حداکثر بودجه"
              />
              <div className="mb-5 mt-1 text-xs" style={{ color: C.muted }}>
                تا {money(maxPrice)} تومان
              </div>

              <label
                className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5"
                style={{ background: C.lightGold, border: "1px solid #efe0c4" }}
              >
                <span className="flex items-center gap-2 text-xs font-medium" style={{ color: "#8a5a12" }}>
                  <Clock size={15} aria-hidden />
                  فقط تحویل ۳ ساعته
                </span>
                <input
                  type="checkbox"
                  checked={nearOnly}
                  onChange={(e) => setNearOnly(e.target.checked)}
                  className="h-4 w-4 accent-[#c8963e]"
                />
              </label>
            </div>
          </aside>

          <div>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <span className="text-sm" style={{ color: C.muted }}>
                {fa(results.length)} کالا
              </span>
              <div className="flex items-center gap-2 text-sm">
                <span style={{ color: C.muted }}>مرتب‌سازی:</span>
                {([
                  ["near", "نزدیک‌ترین"],
                  ["cheap", "ارزان‌ترین"],
                  ["popular", "محبوب‌ترین"],
                ] as const).map(([val, label]) => {
                  const on = sort === val;
                  return (
                    <button
                      key={val}
                      onClick={() => setSort(val)}
                      className="rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
                      style={{
                        background: on ? C.teal : "#fff",
                        color: on ? "#fff" : C.dark,
                        border: `1px solid ${on ? C.teal : C.border}`,
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {results.length === 0 ? (
              <div
                className="rounded-2xl p-12 text-center text-sm"
                style={{ background: "#fff", border: `1px solid ${C.border}`, color: C.muted }}
              >
                چیزی با این فیلترها پیدا نشد. کمی فیلترها را باز کن.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {results.map((p, i) => (
                  <Reveal key={p.id} delay={Math.min(i, 6) * 60}>
                    <ProductCard p={p} />
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function FilterLabel({ children }: { children: ReactNode }) {
  return (
    <div className="mb-2 text-xs font-bold" style={{ color: C.indigo }}>
      {children}
    </div>
  );
}

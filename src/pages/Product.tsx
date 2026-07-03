import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Star,
  Minus,
  Plus,
  Check,
  ShieldCheck,
  Clock,
  Truck,
  MapPin,
  Store,
  ChevronLeft,
  RotateCcw,
} from "lucide-react";
import { C, CONTAINER, Reveal, SiteHeader, SiteFooter } from "../components/site-chrome";
import { ProductCard } from "../components/product-card";
import {
  getProduct,
  relatedProducts,
  fa,
  money,
  isLight,
  NEAR_KM,
  type Product,
} from "../data/products";

export default function ProductPage() {
  const { id } = useParams();
  const product = getProduct(Number(id));

  useEffect(() => {
    document.title = product ? `${product.name} | الولباس` : "محصول یافت نشد | الولباس";
    window.scrollTo(0, 0);
  }, [product]);

  if (!product) {
    return (
      <div style={{ background: C.cream, color: C.dark, minHeight: "100vh" }}>
        <SiteHeader />
        <div className={`${CONTAINER} py-24 text-center`}>
          <h1 className="mb-3 text-2xl font-black" style={{ color: C.indigo }}>
            محصول پیدا نشد
          </h1>
          <p className="mb-6 text-sm" style={{ color: C.muted }}>
            این محصول وجود ندارد یا حذف شده است.
          </p>
          <Link
            to="/search"
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white"
            style={{ background: C.teal }}
          >
            بازگشت به جستجو
          </Link>
        </div>
        <SiteFooter />
      </div>
    );
  }

  return <ProductView key={product.id} product={product} />;
}

function ProductView({ product: p }: { product: Product }) {
  const swatches = p.altColors && p.altColors.length ? p.altColors : [p.colorHex];
  const [colorIdx, setColorIdx] = useState(0);
  const [size, setSize] = useState(p.sizes[0]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const near = p.distance <= NEAR_KM;
  const mainColor = swatches[colorIdx];
  const related = relatedProducts(p, 3);

  function addToCart() {
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  }

  return (
    <div style={{ background: C.cream, color: C.dark }}>
      <SiteHeader />

      {/* breadcrumb */}
      <div className={`${CONTAINER} flex items-center gap-1.5 pt-6 text-xs`} style={{ color: C.muted }}>
        <Link to="/">خانه</Link>
        <ChevronLeft size={13} aria-hidden />
        <Link to="/search">جستجو</Link>
        <ChevronLeft size={13} aria-hidden />
        <span style={{ color: C.indigo }}>{p.name}</span>
      </div>

      {/* main */}
      <section className={`${CONTAINER} grid gap-8 py-8 lg:grid-cols-2`}>
        {/* gallery */}
        <Reveal immediate>
          <div>
            <div
              className="relative flex h-80 items-center justify-center overflow-hidden rounded-2xl sm:h-96"
              style={{ background: mainColor, border: `1px solid ${C.border}` }}
            >
              {p.image ? (
                <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
              ) : (
                <Store
                  size={64}
                  style={{ color: isLight(mainColor) ? "rgba(0,0,0,.18)" : "rgba(255,255,255,.5)" }}
                  aria-hidden
                />
              )}
              <div className="absolute right-3 top-3 flex flex-col gap-1.5">
                <span
                  className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold"
                  style={{ background: "#eef6ee", color: "#2a4a2a" }}
                >
                  <ShieldCheck size={12} aria-hidden />
                  امین خرید
                </span>
                {near && (
                  <span
                    className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold text-white"
                    style={{ background: C.gold }}
                  >
                    <Clock size={12} aria-hidden />
                    تحویل ۳ ساعته
                  </span>
                )}
              </div>
            </div>
            {/* thumbnails (swatches only when there is no real photo) */}
            {!p.image && (
              <div className="mt-3 flex gap-2">
                {swatches.map((c, i) => (
                  <button
                    key={c + i}
                    onClick={() => setColorIdx(i)}
                    aria-label={`رنگ ${fa(i + 1)}`}
                    className="h-16 w-16 rounded-xl transition-all"
                    style={{
                      background: c,
                      border: `2px solid ${i === colorIdx ? C.teal : C.border}`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </Reveal>

        {/* info */}
        <Reveal immediate delay={120}>
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs" style={{ color: C.muted }}>
              <Store size={14} aria-hidden />
              {p.seller}
              <span>·</span>
              <MapPin size={13} aria-hidden />
              {fa(p.distance)} کیلومتر تا تو
            </div>

            <h1 className="mb-3 text-2xl font-black sm:text-3xl" style={{ color: C.indigo }}>
              {p.name}
            </h1>

            {/* rating */}
            <div className="mb-5 flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star
                    key={i}
                    size={16}
                    style={{ color: C.gold }}
                    fill={i < Math.round(p.rating) ? C.gold : "none"}
                    aria-hidden
                  />
                ))}
              </div>
              <span className="text-sm font-bold" style={{ color: C.indigo }}>
                {fa(p.rating)}
              </span>
              <span className="text-xs" style={{ color: C.muted }}>
                ({fa(p.ratingCount)} نظر)
              </span>
            </div>

            {/* price */}
            <div className="mb-5 flex items-baseline gap-3">
              <span className="text-3xl font-black" style={{ color: C.indigo }}>
                {money(p.price)}
              </span>
              <span className="text-sm" style={{ color: C.muted }}>
                تومان
              </span>
              {p.oldPrice && (
                <>
                  <span className="text-sm line-through" style={{ color: "#b0aca4" }}>
                    {money(p.oldPrice)}
                  </span>
                  <span
                    className="rounded-full px-2 py-0.5 text-xs font-bold text-white"
                    style={{ background: "#b84040" }}
                  >
                    {fa(Math.round((1 - p.price / p.oldPrice) * 100))}٪ تخفیف
                  </span>
                </>
              )}
            </div>

            {p.wholesale && p.minOrder && (
              <div
                className="mb-5 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium"
                style={{ background: C.lightGold, color: "#8a5a12" }}
              >
                <Store size={14} aria-hidden />
                فروش عمده — {p.minOrder}
              </div>
            )}

            {/* color (only when we have named/multiple colors) */}
            {(p.colorName || (p.altColors && p.altColors.length > 1)) && (
              <div className="mb-4">
                <div className="mb-2 text-xs font-bold" style={{ color: C.indigo }}>
                  رنگ:{p.colorName && <span style={{ color: C.muted }}> {p.colorName}</span>}
                </div>
                <div className="flex gap-2">
                  {swatches.map((c, i) => (
                    <button
                      key={c + i}
                      onClick={() => setColorIdx(i)}
                      aria-label={`انتخاب رنگ ${fa(i + 1)}`}
                      className="h-8 w-8 rounded-full transition-all"
                      style={{ background: c, border: `2px solid ${i === colorIdx ? C.teal : C.border}` }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* size */}
            <div className="mb-5">
              <div className="mb-2 text-xs font-bold" style={{ color: C.indigo }}>
                سایز
              </div>
              <div className="flex flex-wrap gap-2">
                {p.sizes.map((s) => {
                  const on = s === size;
                  return (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className="min-w-11 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                      style={{
                        background: on ? C.indigo : "#fff",
                        color: on ? "#fff" : C.dark,
                        border: `1px solid ${on ? C.indigo : C.border}`,
                      }}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* quantity + actions */}
            <div className="mb-5 flex items-center gap-3">
              <div
                className="flex items-center gap-3 rounded-xl px-2 py-1.5"
                style={{ background: "#fff", border: `1px solid ${C.border}` }}
              >
                <button
                  onClick={() => setQty((q) => q + 1)}
                  aria-label="افزایش"
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ background: C.cream, color: C.indigo }}
                >
                  <Plus size={16} aria-hidden />
                </button>
                <span className="min-w-6 text-center text-sm font-bold" style={{ color: C.indigo }}>
                  {fa(qty)}
                </span>
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="کاهش"
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ background: C.cream, color: C.indigo }}
                >
                  <Minus size={16} aria-hidden />
                </button>
              </div>

              <button
                onClick={addToCart}
                className="al-pulse flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition-colors"
                style={{ background: added ? C.sage : C.gold }}
              >
                {added ? (
                  <>
                    <Check size={17} aria-hidden />
                    به سبد اضافه شد
                  </>
                ) : (
                  "افزودن به سبد"
                )}
              </button>
            </div>

            {/* trust row */}
            <div className="grid grid-cols-3 gap-2">
              <TrustItem icon={ShieldCheck} title="امین خرید" sub="پول نزد ما" tint="#eef6ee" ink="#2a4a2a" />
              <TrustItem
                icon={near ? Clock : Truck}
                title={near ? "۳ ساعته" : "ارسال سریع"}
                sub={near ? "هم‌شهری" : "پیک/پست"}
                tint={C.lightGold}
                ink="#8a5a12"
              />
              <TrustItem icon={RotateCcw} title="بازگشت" sub="اگر فرق داشت" tint={C.lightTeal} ink={C.tealInk} />
            </div>
          </div>
        </Reveal>
      </section>

      {/* specs + escrow */}
      <section className={`${CONTAINER} grid gap-6 pb-4 lg:grid-cols-2`}>
        <Reveal>
          <div className="rounded-2xl p-6" style={{ background: "#fff", border: `1px solid ${C.border}` }}>
            <h2 className="mb-4 text-lg font-bold" style={{ color: C.indigo }}>
              مشخصات
            </h2>
            <dl className="text-sm">
              <SpecRow label="دسته‌بندی" value={p.category} />
              <SpecRow label="جنس" value={p.material} />
              <SpecRow label="رنگ" value={p.colorName} />
              <SpecRow label="نوع خرید" value={p.wholesale ? "عمده" : "خرده"} />
              <SpecRow label="فروشنده" value={p.seller} last />
            </dl>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div
            className="flex h-full flex-col justify-center rounded-2xl p-6"
            style={{ background: "#eef6ee", border: "1px solid #c7e0c6" }}
          >
            <div className="mb-3 flex items-center gap-2">
              <ShieldCheck size={22} style={{ color: C.sage }} aria-hidden />
              <h2 className="text-lg font-bold" style={{ color: "#2a4a2a" }}>
                با امین خرید، خیالت راحت
              </h2>
            </div>
            <p className="mb-4 text-sm leading-7" style={{ color: "#2a4a2a" }}>
              پولت پیش الولباس می‌ماند و تا وقتی کالا را نگرفتی و تأیید نکردی، به فروشنده
              پرداخت نمی‌شود. اگر با چیزی که دیدی فرق داشت، پولت برمی‌گردد — بدون اما و اگر.
            </p>
            <Link
              to="/amin-kharid"
              className="inline-flex items-center gap-1.5 text-sm font-bold"
              style={{ color: C.sage }}
            >
              امین خرید چطور کار می‌کند؟
              <ChevronLeft size={15} aria-hidden />
            </Link>
          </div>
        </Reveal>
      </section>

      {/* reviews */}
      <section className={`${CONTAINER} py-8`}>
        <h2 className="mb-5 text-lg font-bold" style={{ color: C.indigo }}>
          نظر خریدارها
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <Reveal key={r.name} delay={i * 100}>
              <div
                className="h-full rounded-2xl p-5"
                style={{ background: "#fff", border: `1px solid ${C.border}` }}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-bold" style={{ color: C.indigo }}>
                    {r.name}
                  </span>
                  <div className="flex items-center gap-0.5">
                    {[0, 1, 2, 3, 4].map((s) => (
                      <Star
                        key={s}
                        size={12}
                        style={{ color: C.gold }}
                        fill={s < r.stars ? C.gold : "none"}
                        aria-hidden
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm leading-7" style={{ color: C.muted }}>
                  {r.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* related */}
      <section className={`${CONTAINER} pb-16`}>
        <h2 className="mb-5 text-lg font-bold" style={{ color: C.indigo }}>
          این‌ها هم بهت می‌خوره
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {related.map((rp, i) => (
            <Reveal key={rp.id} delay={i * 80}>
              <ProductCard p={rp} />
            </Reveal>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

const REVIEWS = [
  { name: "سارا", stars: 5, text: "دقیقاً همون چیزی بود که تو عکس دیدم. کیفیت پارچه عالی بود و سریع رسید." },
  { name: "مهدی", stars: 4, text: "خوب بود، سایزش کمی بزرگ‌تر از حد معمول. امین خرید خیالمو راحت کرد." },
  { name: "نگار", stars: 5, text: "همون‌روز به دستم رسید. رنگش دقیقاً مثل تصویر بود، ممنون از فروشنده." },
];

function TrustItem({
  icon: Icon,
  title,
  sub,
  tint,
  ink,
}: {
  icon: typeof ShieldCheck;
  title: string;
  sub: string;
  tint: string;
  ink: string;
}) {
  return (
    <div className="rounded-xl p-3 text-center" style={{ background: tint }}>
      <Icon size={18} style={{ color: ink }} aria-hidden className="mx-auto mb-1" />
      <div className="text-xs font-bold" style={{ color: ink }}>
        {title}
      </div>
      <div className="text-[10px]" style={{ color: ink, opacity: 0.75 }}>
        {sub}
      </div>
    </div>
  );
}

function SpecRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div
      className="flex items-center justify-between py-2.5"
      style={{ borderBottom: last ? "none" : `1px solid ${C.border}` }}
    >
      <dt style={{ color: C.muted }}>{label}</dt>
      <dd className="font-medium" style={{ color: C.indigo }}>
        {value}
      </dd>
    </div>
  );
}

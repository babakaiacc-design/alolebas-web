import { Link } from "react-router-dom";
import { MapPin, ShieldCheck, Clock, Store, ExternalLink } from "lucide-react";
import { C } from "./site-chrome";
import { type Product, fa, money, isLight, NEAR_KM } from "../data/products";

export function ProductCard({ p }: { p: Product }) {
  const near = p.distance <= NEAR_KM;
  const light = isLight(p.colorHex);

  const media = (
    <div className="relative flex h-44 items-center justify-center overflow-hidden" style={{ background: p.colorHex }}>
      {p.image ? (
        <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover" />
      ) : (
        <Store size={30} style={{ color: light ? "rgba(0,0,0,.25)" : "rgba(255,255,255,.55)" }} aria-hidden />
      )}
      <div className="absolute right-2 top-2 flex flex-col gap-1.5">
        {p.external ? (
          <span
            className="flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold"
            style={{ background: "#e9edf5", color: C.indigo }}
          >
            <ExternalLink size={11} aria-hidden />
            فروشگاه متصل
          </span>
        ) : (
          <>
            <span
              className="flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold"
              style={{ background: "#eef6ee", color: "#2a4a2a" }}
            >
              <ShieldCheck size={11} aria-hidden />
              امین خرید
            </span>
            {near && (
              <span
                className="flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold"
                style={{ background: C.gold, color: "#fff" }}
              >
                <Clock size={11} aria-hidden />۳ ساعته
              </span>
            )}
          </>
        )}
      </div>
      {p.oldPrice && (
        <span
          className="absolute bottom-2 left-2 rounded-full px-2 py-1 text-[10px] font-bold text-white"
          style={{ background: "#b84040" }}
        >
          {fa(Math.round((1 - p.price / p.oldPrice) * 100))}٪ تخفیف
        </span>
      )}
    </div>
  );

  const body = (
    <div className="flex flex-1 flex-col p-3.5">
      <div className="mb-1 flex items-center gap-1.5 text-[11px]" style={{ color: C.muted }}>
        <Store size={12} aria-hidden />
        {p.external ? p.shop : p.seller}
        {!p.external && (
          <>
            <span>·</span>
            <MapPin size={12} aria-hidden />
            {fa(p.distance)} کیلومتر
          </>
        )}
      </div>
      <h3 className="mb-2 line-clamp-2 text-sm font-bold leading-6" style={{ color: C.indigo }}>
        {p.name}
      </h3>

      {p.external ? (
        <div className="mb-3">
          <span className="inline-flex items-center gap-1 text-[11px] font-medium" style={{ color: C.teal }}>
            مشاهده در فروشگاه
            <ExternalLink size={11} aria-hidden />
          </span>
        </div>
      ) : (
        <div className="mb-3 flex flex-wrap gap-1">
          {p.sizes.map((s) => (
            <span
              key={s}
              className="rounded px-1.5 py-0.5 text-[10px]"
              style={{ background: C.cream, color: C.muted, border: `1px solid ${C.border}` }}
            >
              {s}
            </span>
          ))}
          {p.wholesale && (
            <span
              className="rounded px-1.5 py-0.5 text-[10px] font-medium"
              style={{ background: C.lightGold, color: "#8a5a12" }}
            >
              عمده
            </span>
          )}
        </div>
      )}

      <div className="mt-auto flex items-baseline gap-2">
        {p.external && p.priceText ? (
          <span className="text-sm font-black" style={{ color: C.indigo }}>
            {p.priceText}
          </span>
        ) : (
          <>
            <span className="text-sm font-black" style={{ color: C.indigo }}>
              {money(p.price)}
            </span>
            <span className="text-[11px]" style={{ color: C.muted }}>
              تومان
            </span>
          </>
        )}
        {p.oldPrice && (
          <span className="text-[11px] line-through" style={{ color: "#b0aca4" }}>
            {money(p.oldPrice)}
          </span>
        )}
      </div>
    </div>
  );

  const cls = "al-card-lift flex h-full flex-col overflow-hidden rounded-2xl";
  const style = { background: "#fff", border: `1px solid ${C.border}` };

  if (p.external && p.url) {
    return (
      <a href={p.url} target="_blank" rel="noopener noreferrer" className={cls} style={style}>
        {media}
        {body}
      </a>
    );
  }
  return (
    <Link to={`/product/${p.id}`} className={cls} style={style}>
      {media}
      {body}
    </Link>
  );
}

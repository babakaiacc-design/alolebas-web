import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Home } from "lucide-react";
import { C, CONTAINER, SiteHeader, SiteFooter } from "../components/site-chrome";

export default function NotFoundPage() {
  useEffect(() => {
    document.title = "صفحه پیدا نشد | الولباس";
  }, []);

  return (
    <div style={{ background: C.cream, color: C.dark, minHeight: "100vh" }}>
      <SiteHeader />
      <section className={`${CONTAINER} flex flex-col items-center justify-center py-24 text-center sm:py-32`}>
        <div className="al-font-en text-7xl font-bold" style={{ color: C.indigo }}>
          ۴۰۴
        </div>
        <h1 className="mt-3 text-2xl font-black" style={{ color: C.indigo }}>
          این صفحه پیدا نشد
        </h1>
        <p className="mt-2 max-w-md text-sm leading-7" style={{ color: C.muted }}>
          آدرسی که دنبالش هستی وجود ندارد یا جابه‌جا شده. بیا از اول شروع کنیم — بپرس چی
          بپوشی، ما پیدایش می‌کنیم.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white"
            style={{ background: C.indigo }}
          >
            <Home size={16} aria-hidden />
            صفحه اصلی
          </Link>
          <Link
            to="/search"
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold"
            style={{ background: "#fff", color: C.indigo, border: `1px solid ${C.border}` }}
          >
            <Search size={16} aria-hidden />
            جستجوی محصولات
          </Link>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

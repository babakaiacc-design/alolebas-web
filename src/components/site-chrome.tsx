import { Link } from "react-router-dom";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ShoppingBag, User, Bell } from "lucide-react";

/* Brand tokens (brand guide v2) */
export const C = {
  indigo: "#1b2a4a",
  indigo2: "#0f1a2e",
  teal: "#2a9d8f",
  tealInk: "#0f6e56",
  gold: "#c8963e",
  cream: "#faf7f2",
  sage: "#5b8c5a",
  dark: "#2d2d2d",
  border: "#e0dcd5",
  lightTeal: "#e6f5f3",
  lightGold: "#fbf5e9",
  muted: "#6b6b6b",
};

export const CONTAINER = "mx-auto w-full max-w-6xl px-5";

/* Scroll / entrance reveal (reduced-motion aware) */
export function Reveal({
  children,
  immediate = false,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  immediate?: boolean;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (immediate) {
      const t = setTimeout(() => setShown(true), delay);
      return () => clearTimeout(t);
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [immediate, delay]);

  return (
    <div
      ref={ref}
      className={`al-reveal ${shown ? "al-in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function SiteHeader() {
  return (
    <header
      className="sticky top-0 z-50"
      style={{ background: C.indigo, borderBottom: "1px solid rgba(255,255,255,.08)" }}
    >
      <div className={`${CONTAINER} flex items-center justify-between py-3.5`}>
        <div className="flex items-center gap-7">
          <Link to="/" aria-label="الولباس">
            <img
              src="/assets/logo-alolebas-light.png"
              alt="الولباس"
              className="h-7 w-auto sm:h-8"
              width={1018}
              height={205}
            />
          </Link>
          <nav
            className="hidden items-center gap-6 text-sm md:flex"
            style={{ color: "rgba(255,255,255,.65)" }}
          >
            <Link to="/search">جستجو</Link>
            <Link to="/amin-kharid">امین خرید</Link>
            <Link to="/services">خدمات</Link>
            <Link to="/b2b">عمده</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4" style={{ color: "rgba(255,255,255,.8)" }}>
          <Link to="/account" className="hidden items-center gap-1.5 text-sm sm:flex">
            <User size={17} aria-hidden /> حساب من
          </Link>
          <Link to="/account" aria-label="سبد خرید">
            <ShoppingBag size={19} aria-hidden />
          </Link>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer style={{ background: C.indigo2, color: "rgba(255,255,255,.55)" }}>
      <div className={`${CONTAINER} py-14`}>
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <img
              src="/assets/logo-alolebas-light.png"
              alt="الولباس"
              className="mb-4 h-8 w-auto"
              width={1018}
              height={205}
            />
            <p className="text-sm leading-7">
              مارکت‌پلیس هوشمند پوشاک — مشاور، ضامن و پیک تو.
            </p>
          </div>
          <FooterCol title="خرید" items={["دسته‌بندی‌ها", "پیشنهاد استایل", "تحویل ۳ ساعته", "امین خرید"]} />
          <FooterCol title="کسب‌وکار" items={["درگاه عمده", "تأمین پارچه", "ثبت‌نام فروشنده", "همکاری B2B"]} />
          <FooterCol title="پشتیبانی" items={["سوالات متداول", "تماس با ما", "قوانین", "حریم خصوصی"]} />
        </div>
        <div
          className="mt-10 flex flex-col items-center justify-between gap-3 pt-6 text-xs sm:flex-row"
          style={{ borderTop: "1px solid rgba(255,255,255,.08)" }}
        >
          <span>© ۱۴۰۵ الولباس — تمام حقوق محفوظ است.</span>
          <span className="flex items-center gap-1.5">
            <Bell size={13} aria-hidden /> بپوش، مطمئن باش.
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="mb-3 text-sm font-bold text-white">{title}</h4>
      <ul className="space-y-2 text-sm">
        {items.map((it) => (
          <li key={it}>{it}</li>
        ))}
      </ul>
    </div>
  );
}

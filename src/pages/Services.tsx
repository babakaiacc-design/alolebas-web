import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  WashingMachine,
  Scissors,
  Ruler,
  CalendarClock,
  Bike,
  PackageCheck,
  Check,
  ArrowLeft,
  type LucideIcon,
} from "lucide-react";
import { C, CONTAINER, Reveal, SiteHeader, SiteFooter } from "../components/site-chrome";

export default function ServicesPage() {
  useEffect(() => {
    document.title = "خدمات | الولباس";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ background: C.cream, color: C.dark }}>
      <SiteHeader />

      {/* hero */}
      <section className="relative overflow-hidden" style={{ background: C.indigo }}>
        <div
          className="al-orb"
          style={{
            width: 360,
            height: 360,
            top: -120,
            insetInlineStart: "14%",
            background: "radial-gradient(circle, rgba(42,157,143,.4), transparent 65%)",
            animation: "al-float 16s ease-in-out infinite",
          }}
          aria-hidden
        />
        <div className={`${CONTAINER} relative py-16 text-center sm:py-20`}>
          <Reveal immediate delay={60}>
            <div className="mb-3 text-xs font-bold tracking-widest" style={{ color: C.gold }}>
              فراتر از خرید
            </div>
          </Reveal>
          <Reveal immediate delay={140}>
            <h1 className="text-4xl font-black text-white sm:text-5xl">خدمات یکپارچه</h1>
          </Reveal>
          <Reveal immediate delay={240}>
            <p className="mx-auto mt-4 max-w-xl text-base sm:text-lg" style={{ color: "rgba(255,255,255,.62)" }}>
              خرید، خشکشویی، خیاطی و شخصی‌دوزی — همه در یک اپ. از نگهداری تا دوخت
              سفارشی، بدون خروج از خانه.
            </p>
          </Reveal>
        </div>
      </section>

      {/* services */}
      <section className={`${CONTAINER} py-16 sm:py-20`}>
        <div className="grid gap-5 md:grid-cols-3">
          {SERVICES.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.title} delay={i * 110}>
                <div
                  className="al-card-lift flex h-full flex-col rounded-2xl p-6"
                  style={{ background: "#fff", border: `1px solid ${C.border}` }}
                >
                  <div
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{ background: s.tint, color: s.ink }}
                  >
                    <Icon size={22} aria-hidden />
                  </div>
                  <h3 className="mb-2 text-lg font-bold" style={{ color: C.indigo }}>
                    {s.title}
                  </h3>
                  <p className="mb-4 text-sm leading-7" style={{ color: C.muted }}>
                    {s.body}
                  </p>
                  <ul className="mt-auto space-y-2">
                    {s.items.map((it) => (
                      <li key={it} className="flex items-center gap-2 text-sm" style={{ color: C.indigo }}>
                        <span
                          className="flex h-5 w-5 items-center justify-center rounded-full"
                          style={{ background: s.tint, color: s.ink }}
                        >
                          <Check size={12} aria-hidden />
                        </span>
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* how it works */}
      <section className="py-16 sm:py-20" style={{ background: "#fff", borderBlock: `1px solid ${C.border}` }}>
        <div className={CONTAINER}>
          <div className="mb-10 text-center">
            <div className="mb-2 text-xs font-bold tracking-widest" style={{ color: C.teal }}>
              چطور کار می‌کند
            </div>
            <h2 className="text-2xl font-black sm:text-3xl" style={{ color: C.indigo }}>
              در سه قدم، درِ خانه
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <Reveal key={s.title} delay={i * 110}>
                  <div
                    className="relative h-full rounded-2xl p-6"
                    style={{ background: C.cream, border: `1px solid ${C.border}` }}
                  >
                    <div
                      className="al-font-en absolute left-5 top-4 text-3xl font-bold"
                      style={{ color: "rgba(42,157,143,.14)" }}
                    >
                      {i + 1}
                    </div>
                    <div
                      className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
                      style={{ background: C.lightTeal, color: C.tealInk }}
                    >
                      <Icon size={22} aria-hidden />
                    </div>
                    <h3 className="mb-2 text-base font-bold" style={{ color: C.indigo }}>
                      {s.title}
                    </h3>
                    <p className="text-sm leading-7" style={{ color: C.muted }}>
                      {s.body}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* cta */}
      <section className={`${CONTAINER} py-16`}>
        <Reveal>
          <div
            className="relative overflow-hidden rounded-3xl px-6 py-12 text-center"
            style={{ background: `linear-gradient(135deg, ${C.indigo}, ${C.indigo2})` }}
          >
            <h2 className="text-2xl font-black text-white sm:text-3xl">لباست را به ما بسپار</h2>
            <p className="mx-auto mt-3 max-w-md text-sm" style={{ color: "rgba(255,255,255,.6)" }}>
              از خرید تا نگهداری و دوخت، همه در یک اکوسیستم امن.
            </p>
            <Link
              to="/search"
              className="al-pulse mt-6 inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-sm font-bold text-white"
              style={{ background: C.gold }}
            >
              شروع کن
              <ArrowLeft size={17} aria-hidden />
            </Link>
          </div>
        </Reveal>
      </section>

      <SiteFooter />
    </div>
  );
}

const SERVICES: {
  icon: LucideIcon;
  title: string;
  body: string;
  items: string[];
  tint: string;
  ink: string;
}[] = [
  {
    icon: WashingMachine,
    title: "خشکشویی",
    body: "سفارش، تحویل و بازگشت لباس تمیز، بدون خروج از خانه.",
    items: ["شست‌وشوی تخصصی", "اتوکشی و تاکردن", "پیک رفت و برگشت"],
    tint: "#e6f5f3",
    ink: "#0f6e56",
  },
  {
    icon: Scissors,
    title: "خیاطی و ترمیم",
    body: "تنگ، کوتاه و اصلاح لباس توسط خیاط‌های تأییدشده.",
    items: ["کوتاه و تنگ کردن", "تعویض زیپ و دکمه", "ترمیم و وصله"],
    tint: "#fbf5e9",
    ink: "#8a5a12",
  },
  {
    icon: Ruler,
    title: "شخصی‌دوزی",
    body: "لباس دوخت سفارشی با اندازه‌ی خودت، از پارچه‌ی دلخواه.",
    items: ["اندازه‌گیری دقیق", "انتخاب پارچه از الولباس", "دوخت سفارشی"],
    tint: "#eef6ee",
    ink: "#2a4a2a",
  },
];

const STEPS: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: CalendarClock, title: "درخواست از اپ", body: "خدمت موردنظرت را انتخاب و زمان دریافت را تعیین می‌کنی." },
  { icon: Bike, title: "پیک می‌آید و می‌برد", body: "پیک الولباس لباس را از درِ خانه‌ات تحویل می‌گیرد." },
  { icon: PackageCheck, title: "تحویل آماده", body: "لباس تمیز، اصلاح‌شده یا دوخته‌شده به دستت می‌رسد." },
];

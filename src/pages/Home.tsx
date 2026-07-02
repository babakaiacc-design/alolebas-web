import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  Search,
  Mic,
  Camera,
  MapPin,
  ShieldCheck,
  BadgeCheck,
  Clock,
  Shirt,
  Store,
  Sparkles,
  Truck,
  ArrowLeft,
  Scissors,
  Ruler,
  WashingMachine,
  MessagesSquare,
} from "lucide-react";
import { C, CONTAINER, Reveal, SiteHeader, SiteFooter } from "../components/site-chrome";

const MODES = [
  { id: "text", label: "متنی", icon: Search, placeholder: "یک شلوار جین سبز می‌خوام…" },
  { id: "voice", label: "صوتی", icon: Mic, placeholder: "میکروفون را بزن و بگو چی می‌خوای…" },
  { id: "image", label: "تصویری", icon: Camera, placeholder: "عکس لباسی که دوست داری را بفرست…" },
] as const;

function SearchBox() {
  const [mode, setMode] = useState<(typeof MODES)[number]["id"]>("text");
  const active = MODES.find((m) => m.id === mode)!;
  const ActiveIcon = active.icon;

  return (
    <div
      className="mx-auto w-full max-w-xl rounded-2xl p-3 text-right"
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
        className="mb-3 flex h-12 items-center gap-3 rounded-xl px-3"
        style={{ border: `1px solid ${C.border}` }}
      >
        <ActiveIcon size={19} style={{ color: C.teal }} aria-hidden />
        <span className="flex-1 truncate text-sm" style={{ color: "#9a968e" }}>
          {active.placeholder}
        </span>
        <span
          className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium"
          style={{ background: C.lightTeal, color: C.tealInk, border: "1px solid #9fe1cb" }}
        >
          <MapPin size={13} aria-hidden />
          تهران
        </span>
      </div>

      <Link
        to="/search"
        className="al-pulse flex h-12 w-full items-center justify-center rounded-xl text-base font-bold text-white"
        style={{ background: C.gold }}
      >
        از دستیار بپرس
      </Link>
    </div>
  );
}

function TrustChip({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium"
      style={{ background: "#eef6ee", color: "#2a4a2a", border: "1px solid #c7e0c6" }}
    >
      <Icon size={15} aria-hidden />
      {label}
    </span>
  );
}

function SectionHead({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="mb-8 text-center">
      <div className="mb-2 text-xs font-bold tracking-widest" style={{ color: C.teal }}>
        {kicker}
      </div>
      <h2 className="text-2xl font-black sm:text-3xl" style={{ color: C.indigo }}>
        {title}
      </h2>
    </div>
  );
}

export default function Home() {
  useEffect(() => {
    document.title = "الولباس | چی بپوشم؟ — مارکت‌پلیس هوشمند پوشاک";
  }, []);

  return (
    <div style={{ background: C.cream, color: C.dark }}>
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden" style={{ background: C.indigo }}>
        <div
          className="al-orb"
          style={{
            width: 460,
            height: 460,
            top: -140,
            insetInlineStart: -120,
            background: "radial-gradient(circle, rgba(42,157,143,.55), transparent 65%)",
            animation: "al-float 14s ease-in-out infinite",
          }}
          aria-hidden
        />
        <div
          className="al-orb"
          style={{
            width: 380,
            height: 380,
            bottom: -120,
            insetInlineEnd: -90,
            background: "radial-gradient(circle, rgba(200,150,62,.4), transparent 65%)",
            animation: "al-float-2 17s ease-in-out infinite",
          }}
          aria-hidden
        />
        <div
          className="al-orb"
          style={{
            width: 300,
            height: 300,
            top: "30%",
            insetInlineEnd: "22%",
            background: "radial-gradient(circle, rgba(91,140,90,.28), transparent 70%)",
            animation: "al-float 20s ease-in-out infinite",
          }}
          aria-hidden
        />

        <div className={`${CONTAINER} relative py-20 text-center sm:py-28`}>
          <Reveal immediate delay={80}>
            <div
              className="mb-4 flex items-center justify-center gap-2 text-sm"
              style={{ color: "rgba(255,255,255,.55)" }}
            >
              <Sparkles size={16} style={{ color: C.gold }} aria-hidden />
              دستیار هوشمند پوشاک
            </div>
          </Reveal>

          <Reveal immediate delay={160}>
            <h1 className="text-5xl font-black leading-tight text-white sm:text-6xl">چی بپوشم؟</h1>
          </Reveal>

          <Reveal immediate delay={260}>
            <p
              className="mx-auto mt-4 max-w-lg text-base sm:text-lg"
              style={{ color: "rgba(255,255,255,.62)" }}
            >
              بپرس — با متن، صدا یا عکس. نزدیک‌ترین تأمین‌کننده را برایت پیدا می‌کنیم و
              تا ۳ ساعت به دستت می‌رسانیم.
            </p>
          </Reveal>

          <Reveal immediate delay={380} className="mt-8">
            <SearchBox />
          </Reveal>

          <Reveal immediate delay={520} className="mt-8">
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <TrustChip icon={ShieldCheck} label="امین خرید" />
              <TrustChip icon={BadgeCheck} label="تضمین اصالت ۱۰۰٪" />
              <TrustChip icon={Clock} label="تحویل تا ۳ ساعت" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* GATEWAYS */}
      <section id="gateways" className={`${CONTAINER} py-16 sm:py-20`}>
        <div className="grid gap-5 md:grid-cols-2">
          <Reveal>
            <Gateway
              icon={Shirt}
              iconBg={C.lightTeal}
              iconColor={C.tealInk}
              title="می‌خوام بخرم"
              body="مشاوره‌ی استایل، خرید تکی و تحویل سریع هم‌شهری. لباس مناسب هر موقعیت را با خیال راحت پیدا کن."
              cta="شروع خرید"
              to="/search"
            />
          </Reveal>
          <Reveal delay={120}>
            <Gateway
              icon={Store}
              iconBg={C.lightGold}
              iconColor="#8a5a12"
              title="کسب‌وکار دارم"
              body="خرید عمده، تأمین پارچه و اتصال امن B2B بدون واسطه. مزون، بوتیک و تولیدی را به هم وصل می‌کنیم."
              cta="ورود به درگاه عمده"
              to="/b2b"
            />
          </Reveal>
        </div>
      </section>

      {/* PILLARS */}
      <section
        id="pillars"
        className="py-16 sm:py-20"
        style={{ background: "#fff", borderBlock: `1px solid ${C.border}` }}
      >
        <div className={CONTAINER}>
          <SectionHead kicker="چرا الولباس" title="مشاور، ضامن، پیک — در یک اپ" />
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                icon: MessagesSquare,
                tint: C.lightTeal,
                ink: C.tealInk,
                title: "مشاوره‌ی هوشمند",
                body: "نمی‌دونی چی بپوشی؟ دستیار ما بر اساس موقعیت، بودجه و سایزت بهترین گزینه را پیدا می‌کند.",
              },
              {
                icon: ShieldCheck,
                tint: "#eef6ee",
                ink: "#2a4a2a",
                title: "امین خرید",
                body: "پولت پیش ما می‌ماند تا مطمئن شوی کالا درست است. اگر با عکسش فرق داشت، برمی‌گردد — بدون اما و اگر.",
              },
              {
                icon: Truck,
                tint: C.lightGold,
                ink: "#8a5a12",
                title: "تحویل تا ۳ ساعت",
                body: "اگر تأمین‌کننده‌ات هم‌شهرت باشد، لباست را همان روز — تا ۳ ساعت بعد — تحویل می‌گیری.",
              },
            ].map((p, i) => {
              const Icon = p.icon;
              return (
                <Reveal key={p.title} delay={i * 110}>
                  <div
                    className="al-card-lift h-full rounded-2xl p-6"
                    style={{ background: C.cream, border: `1px solid ${C.border}` }}
                  >
                    <div
                      className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
                      style={{ background: p.tint, color: p.ink }}
                    >
                      <Icon size={22} aria-hidden />
                    </div>
                    <h3 className="mb-2 text-lg font-bold" style={{ color: C.indigo }}>
                      {p.title}
                    </h3>
                    <p className="text-sm leading-7" style={{ color: C.muted }}>
                      {p.body}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* SEARCH MODES */}
      <section id="search" className={`${CONTAINER} py-16 sm:py-20`}>
        <SectionHead kicker="سه راه برای پرسیدن" title="هرطور راحتی، بپرس" />
        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              icon: Search,
              title: "جستجوی متنی",
              body: "تایپ کن: «مانتوی نخی روشن زیر ۵۰۰ تومن». فیلترها را هوشمند اعمال می‌کنیم.",
            },
            {
              icon: Mic,
              title: "جستجوی صوتی",
              body: "بگو: «یک شلوار جین سبز می‌خوام». حرفت را می‌فهمیم و می‌گردیم.",
            },
            {
              icon: Camera,
              title: "جستجوی تصویری",
              body: "عکس لباسی که دیدی را بفرست؛ تأمین‌کننده‌های همان کالا را پیدا می‌کنیم.",
            },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.title} delay={i * 110}>
                <div
                  className="al-card-lift flex h-full flex-col rounded-2xl p-6"
                  style={{ background: "#fff", border: `1px solid ${C.border}` }}
                >
                  <div
                    className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl text-white"
                    style={{ background: C.indigo }}
                  >
                    <Icon size={20} aria-hidden />
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

        <Reveal delay={120}>
          <div
            className="mt-5 flex items-center justify-center gap-2.5 rounded-2xl px-5 py-4 text-center text-sm"
            style={{ background: C.lightTeal, color: C.tealInk }}
          >
            <MapPin size={18} aria-hidden />
            <span>
              هر سه حالت با <b>لایه‌ی مکانی</b> کار می‌کنند: نزدیک‌ترین تأمین‌کننده به تو،
              اول نمایش داده می‌شود.
            </span>
          </div>
        </Reveal>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-16 sm:py-20" style={{ background: C.indigo }}>
        <div className={CONTAINER}>
          <div className="mb-8 text-center">
            <div className="mb-2 text-xs font-bold tracking-widest" style={{ color: C.gold }}>
              فراتر از خرید
            </div>
            <h2 className="text-2xl font-black text-white sm:text-3xl">
              خرید، خشکشویی، خیاطی — همه در یک اکوسیستم
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              { icon: WashingMachine, title: "خشکشویی", body: "سفارش، تحویل و بازگشت لباس تمیز، بدون خروج از خانه." },
              { icon: Scissors, title: "خیاطی و ترمیم", body: "تنگ، کوتاه و اصلاح لباس توسط خیاط‌های تأییدشده." },
              { icon: Ruler, title: "شخصی‌دوزی", body: "لباس دوخت سفارشی با اندازه‌ی خودت، از پارچه‌ی دلخواه." },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <Reveal key={s.title} delay={i * 110}>
                  <div
                    className="al-card-lift h-full rounded-2xl p-6"
                    style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)" }}
                  >
                    <div
                      className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
                      style={{ background: "rgba(200,150,62,.15)", color: C.gold }}
                    >
                      <Icon size={22} aria-hidden />
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-white">{s.title}</h3>
                    <p className="text-sm leading-7" style={{ color: "rgba(255,255,255,.6)" }}>
                      {s.body}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* CATEGORIES MARQUEE */}
      <section className="py-16 sm:py-20">
        <div className={CONTAINER}>
          <SectionHead kicker="کشف کن" title="دسته‌بندی‌های محبوب" />
        </div>
        <div className="al-marquee-mask overflow-hidden">
          <div className="al-marquee-track flex w-max gap-3" style={{ direction: "ltr" }}>
            {[0, 1].map((dup) => (
              <div key={dup} className="flex gap-3 pl-3">
                {[
                  "مانتو و پالتو",
                  "پیراهن مردانه",
                  "شلوار جین",
                  "لباس مجلسی",
                  "پارچه و مواد اولیه",
                  "کیف و کفش",
                  "بچگانه",
                  "لباس ورزشی",
                  "شال و روسری",
                  "لباس راحتی",
                ].map((cat) => (
                  <span
                    key={cat + dup}
                    className="whitespace-nowrap rounded-full px-5 py-2.5 text-sm"
                    style={{ background: "#fff", border: `1px solid ${C.border}`, color: C.indigo }}
                  >
                    {cat}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={`${CONTAINER} pb-20`}>
        <Reveal>
          <div
            className="relative overflow-hidden rounded-3xl px-6 py-14 text-center"
            style={{ background: `linear-gradient(135deg, ${C.indigo}, ${C.indigo2})` }}
          >
            <div
              className="al-orb"
              style={{
                width: 300,
                height: 300,
                top: -100,
                insetInlineStart: "10%",
                background: "radial-gradient(circle, rgba(42,157,143,.4), transparent 65%)",
                animation: "al-float 16s ease-in-out infinite",
              }}
              aria-hidden
            />
            <div className="relative">
              <h2 className="text-3xl font-black text-white sm:text-4xl">چی بپوشم؟ الولباس.</h2>
              <p className="mx-auto mt-3 max-w-md text-base" style={{ color: "rgba(255,255,255,.6)" }}>
                از سردرگمی تا استایل، در چند دقیقه. همین حالا شروع کن.
              </p>
              <Link
                to="/search"
                className="al-pulse mt-7 inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-base font-bold text-white"
                style={{ background: C.gold }}
              >
                شروع کن
                <ArrowLeft size={18} aria-hidden />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      <SiteFooter />
    </div>
  );
}

function Gateway({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  body,
  cta,
  to,
}: {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  title: string;
  body: string;
  cta: string;
  to?: string;
}) {
  const inner = (
    <>
      <div
        className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
        style={{ background: iconBg, color: iconColor }}
      >
        <Icon size={22} aria-hidden />
      </div>
      <h3 className="mb-2 text-xl font-bold" style={{ color: C.indigo }}>
        {title}
      </h3>
      <p className="mb-4 text-sm leading-7" style={{ color: C.muted }}>
        {body}
      </p>
      <span className="inline-flex items-center gap-1.5 text-sm font-medium" style={{ color: C.teal }}>
        {cta}
        <ArrowLeft size={16} aria-hidden />
      </span>
    </>
  );
  const cls = "al-card-lift block h-full rounded-2xl p-7";
  const style = { background: "#fff", border: `1px solid ${C.border}` };
  if (to) {
    return (
      <Link to={to} className={cls} style={style}>
        {inner}
      </Link>
    );
  }
  return (
    <div className={cls} style={style}>
      {inner}
    </div>
  );
}

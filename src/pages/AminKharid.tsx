import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Wallet,
  Package,
  CircleCheck,
  RotateCcw,
  BadgeCheck,
  Scale,
  ArrowLeft,
  type LucideIcon,
} from "lucide-react";
import { C, CONTAINER, Reveal, SiteHeader, SiteFooter } from "../components/site-chrome";

export default function AminKharidPage() {
  useEffect(() => {
    document.title = "امین خرید | الولباس";
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
            width: 380,
            height: 380,
            top: -120,
            insetInlineStart: "12%",
            background: "radial-gradient(circle, rgba(91,140,90,.4), transparent 65%)",
            animation: "al-float 16s ease-in-out infinite",
          }}
          aria-hidden
        />
        <div className={`${CONTAINER} relative py-16 text-center sm:py-20`}>
          <Reveal immediate delay={60}>
            <div
              className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{ background: "rgba(91,140,90,.2)" }}
            >
              <ShieldCheck size={28} style={{ color: "#a7d3a6" }} aria-hidden />
            </div>
          </Reveal>
          <Reveal immediate delay={140}>
            <h1 className="text-4xl font-black text-white sm:text-5xl">امین خرید</h1>
          </Reveal>
          <Reveal immediate delay={240}>
            <p
              className="mx-auto mt-4 max-w-lg text-base sm:text-lg"
              style={{ color: "rgba(255,255,255,.62)" }}
            >
              پولت پیش الولباس می‌ماند تا کالا را بگیری و تأیید کنی. اگر با چیزی که دیدی
              فرق داشت، برمی‌گردد — بدون اما و اگر.
            </p>
          </Reveal>
        </div>
      </section>

      {/* how it works */}
      <section className={`${CONTAINER} py-16 sm:py-20`}>
        <div className="mb-10 text-center">
          <div className="mb-2 text-xs font-bold tracking-widest" style={{ color: C.teal }}>
            چطور کار می‌کند
          </div>
          <h2 className="text-2xl font-black sm:text-3xl" style={{ color: C.indigo }}>
            در چهار قدم ساده
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.title} delay={i * 100}>
                <div
                  className="relative h-full rounded-2xl p-6"
                  style={{ background: "#fff", border: `1px solid ${C.border}` }}
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
      </section>

      {/* guarantees */}
      <section className="py-16 sm:py-20" style={{ background: "#fff", borderBlock: `1px solid ${C.border}` }}>
        <div className={CONTAINER}>
          <div className="mb-10 text-center">
            <div className="mb-2 text-xs font-bold tracking-widest" style={{ color: C.teal }}>
              تضمین‌ها
            </div>
            <h2 className="text-2xl font-black sm:text-3xl" style={{ color: C.indigo }}>
              چیزی که وعده می‌دهیم
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {GUARANTEES.map((g, i) => {
              const Icon = g.icon;
              return (
                <Reveal key={g.title} delay={i * 100}>
                  <div
                    className="al-card-lift h-full rounded-2xl p-6 text-center"
                    style={{ background: C.cream, border: `1px solid ${C.border}` }}
                  >
                    <div
                      className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
                      style={{ background: "#eef6ee", color: "#2a4a2a" }}
                    >
                      <Icon size={22} aria-hidden />
                    </div>
                    <h3 className="mb-2 text-base font-bold" style={{ color: C.indigo }}>
                      {g.title}
                    </h3>
                    <p className="text-sm leading-7" style={{ color: C.muted }}>
                      {g.body}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* buyer vs seller */}
      <section className={`${CONTAINER} py-16 sm:py-20`}>
        <div className="grid gap-5 md:grid-cols-2">
          <Reveal>
            <div
              className="h-full rounded-2xl p-7"
              style={{ background: C.lightTeal, border: "1px solid #9fe1cb" }}
            >
              <h3 className="mb-2 text-lg font-bold" style={{ color: C.tealInk }}>
                برای خریدار — خیال راحت
              </h3>
              <p className="text-sm leading-7" style={{ color: "#0d5b47" }}>
                پولت تا لحظه‌ای که کالا را نگرفتی و تأیید نکردی، دست‌نخورده نزد الولباس
                می‌ماند. ریسک خرید آنلاین را ما برمی‌داریم.
              </p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div
              className="h-full rounded-2xl p-7"
              style={{ background: C.lightGold, border: "1px solid #efe0c4" }}
            >
              <h3 className="mb-2 text-lg font-bold" style={{ color: "#8a5a12" }}>
                برای فروشنده — اطمینان پرداخت
              </h3>
              <p className="text-sm leading-7" style={{ color: "#6e4a12" }}>
                به‌محض این‌که کالا تحویل داده شد و تأیید گرفت، پرداخت تضمین‌شده به حسابت
                واریز می‌شود. با طرف ناشناس هم بی‌دغدغه معامله کن.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* faq */}
      <section className={`${CONTAINER} pb-16`}>
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-black sm:text-3xl" style={{ color: C.indigo }}>
            سوال‌های پرتکرار
          </h2>
        </div>
        <div className="mx-auto max-w-2xl space-y-3">
          {FAQ.map((f, i) => (
            <Reveal key={f.q} delay={i * 70}>
              <div
                className="rounded-2xl p-5"
                style={{ background: "#fff", border: `1px solid ${C.border}` }}
              >
                <h3 className="mb-1.5 text-sm font-bold" style={{ color: C.indigo }}>
                  {f.q}
                </h3>
                <p className="text-sm leading-7" style={{ color: C.muted }}>
                  {f.a}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* cta */}
      <section className={`${CONTAINER} pb-20`}>
        <Reveal>
          <div
            className="rounded-3xl px-6 py-12 text-center"
            style={{ background: "#eef6ee", border: "1px solid #c7e0c6" }}
          >
            <h2 className="text-2xl font-black sm:text-3xl" style={{ color: "#2a4a2a" }}>
              با خیال راحت خرید کن
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm" style={{ color: "#2a4a2a" }}>
              هر خریدی در الولباس، به‌صورت پیش‌فرض با امین خرید محافظت می‌شود.
            </p>
            <Link
              to="/search"
              className="mt-6 inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-sm font-bold text-white"
              style={{ background: C.sage }}
            >
              شروع خرید
              <ArrowLeft size={17} aria-hidden />
            </Link>
          </div>
        </Reveal>
      </section>

      <SiteFooter />
    </div>
  );
}

const STEPS: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: Wallet, title: "سفارش و پرداخت امن", body: "سفارش می‌دهی و مبلغ را به الولباس می‌سپاری — نه مستقیم به فروشنده." },
  { icon: ShieldCheck, title: "نگهداری امن وجه", body: "پولت نزد ما امانت می‌ماند تا کالا سالم به دستت برسد." },
  { icon: Package, title: "دریافت و بررسی", body: "کالا را می‌گیری و با چیزی که سفارش دادی مطابقت می‌دهی." },
  { icon: CircleCheck, title: "تأیید و تسویه", body: "تو تأیید می‌کنی، بعد ما مبلغ را به فروشنده پرداخت می‌کنیم." },
];

const GUARANTEES: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: BadgeCheck, title: "تضمین اصالت ۱۰۰٪", body: "آنچه می‌بینی همان است که تحویل می‌گیری؛ در غیر این‌صورت پولت برمی‌گردد." },
  { icon: RotateCcw, title: "بازگشت کامل وجه", body: "اگر کالا با سفارشت فرق داشت، مبلغ به‌طور کامل به تو بازگردانده می‌شود." },
  { icon: Scale, title: "داوری و حل اختلاف", body: "اگر بین تو و فروشنده اختلافی پیش بیاید، الولباس منصفانه داوری می‌کند." },
];

const FAQ = [
  { q: "چند وقت فرصت بررسی دارم؟", a: "پس از تحویل، فرصت داری کالا را بررسی کنی و بعد تأیید کنی؛ تا وقتی تأیید نکرده‌ای، پول به فروشنده پرداخت نمی‌شود." },
  { q: "اگر کالا با عکس فرق داشت چه می‌شود؟", a: "کالا را رد می‌کنی و وجه به‌طور کامل به تو برمی‌گردد — بدون اما و اگر." },
  { q: "اگر کالا اصلاً نرسید؟", a: "چون پول نزد الولباس امانت است، تا زمان دریافت به فروشنده پرداخت نمی‌شود و در صورت عدم تحویل، به تو بازمی‌گردد." },
  { q: "هزینه‌ی امین خرید چقدر است؟", a: "استفاده از امین خرید برای خریدار رایگان است و روی همه‌ی سفارش‌ها به‌صورت پیش‌فرض فعال است." },
];

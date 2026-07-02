import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  TrendingDown,
  Layers,
  Handshake,
  ShieldCheck,
  Store,
  Send,
  Check,
  ArrowLeft,
  type LucideIcon,
} from "lucide-react";
import { C, CONTAINER, Reveal, SiteHeader, SiteFooter } from "../components/site-chrome";

export default function B2BPage() {
  useEffect(() => {
    document.title = "درگاه عمده و کسب‌وکار | الولباس";
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
            insetInlineEnd: "10%",
            background: "radial-gradient(circle, rgba(200,150,62,.35), transparent 65%)",
            animation: "al-float-2 17s ease-in-out infinite",
          }}
          aria-hidden
        />
        <div className={`${CONTAINER} relative py-16 text-center sm:py-20`}>
          <Reveal immediate delay={60}>
            <div className="mb-3 text-xs font-bold tracking-widest" style={{ color: C.gold }}>
              ویژه‌ی کسب‌وکارها
            </div>
          </Reveal>
          <Reveal immediate delay={140}>
            <h1 className="text-4xl font-black text-white sm:text-5xl">درگاه عمده الولباس</h1>
          </Reveal>
          <Reveal immediate delay={240}>
            <p className="mx-auto mt-4 max-w-xl text-base sm:text-lg" style={{ color: "rgba(255,255,255,.62)" }}>
              مزون‌ها، بوتیک‌ها، تولیدی‌ها و واردکنندگان پارچه را بدون واسطه و با امنیت
              مالی به هم وصل می‌کنیم.
            </p>
          </Reveal>
          <Reveal immediate delay={360}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#rfq"
                className="al-pulse inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold text-white"
                style={{ background: C.gold }}
              >
                درخواست قیمت
              </a>
              <Link
                to="/search"
                className="inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold"
                style={{ background: "rgba(255,255,255,.1)", color: "#fff", border: "1px solid rgba(255,255,255,.2)" }}
              >
                دیدن محصولات عمده
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* value props */}
      <section className={`${CONTAINER} py-16 sm:py-20`}>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v, i) => {
            const Icon = v.icon;
            return (
              <Reveal key={v.title} delay={i * 90}>
                <div
                  className="al-card-lift h-full rounded-2xl p-6"
                  style={{ background: "#fff", border: `1px solid ${C.border}` }}
                >
                  <div
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{ background: C.lightGold, color: "#8a5a12" }}
                  >
                    <Icon size={22} aria-hidden />
                  </div>
                  <h3 className="mb-2 text-base font-bold" style={{ color: C.indigo }}>
                    {v.title}
                  </h3>
                  <p className="text-sm leading-7" style={{ color: C.muted }}>
                    {v.body}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* supplier categories */}
      <section className="py-16 sm:py-20" style={{ background: "#fff", borderBlock: `1px solid ${C.border}` }}>
        <div className={CONTAINER}>
          <div className="mb-10 text-center">
            <div className="mb-2 text-xs font-bold tracking-widest" style={{ color: C.teal }}>
              شبکه‌ی تأمین
            </div>
            <h2 className="text-2xl font-black sm:text-3xl" style={{ color: C.indigo }}>
              با چه کسب‌وکارهایی کار می‌کنیم
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {["تولیدی پوشاک", "واردکننده پارچه", "عمده‌فروش نخ و لوازم", "مزون و آتلیه", "بوتیک", "پخش‌کننده"].map(
              (t) => (
                <span
                  key={t}
                  className="rounded-full px-5 py-2.5 text-sm font-medium"
                  style={{ background: C.cream, color: C.indigo, border: `1px solid ${C.border}` }}
                >
                  {t}
                </span>
              ),
            )}
          </div>
        </div>
      </section>

      {/* RFQ form */}
      <section id="rfq" className={`${CONTAINER} py-16 sm:py-20`}>
        <div className="grid gap-8 lg:grid-cols-2">
          <Reveal>
            <div>
              <div className="mb-2 text-xs font-bold tracking-widest" style={{ color: C.teal }}>
                درخواست قیمت (RFQ)
              </div>
              <h2 className="mb-3 text-2xl font-black sm:text-3xl" style={{ color: C.indigo }}>
                بگو چی می‌خوای، بهترین قیمت را بگیر
              </h2>
              <p className="text-sm leading-7" style={{ color: C.muted }}>
                نیازت را ثبت کن؛ تأمین‌کننده‌های معتبر برایت قیمت می‌فرستند و می‌توانی
                مقایسه کنی. همه‌ی معامله‌ها با پرداخت تضمین‌شده‌ی امین خرید انجام می‌شود.
              </p>
              <div className="mt-6 space-y-3">
                {["احراز هویت تأمین‌کننده‌ها", "قیمت پلکانی شفاف", "پرداخت تضمین‌شده"].map((t) => (
                  <div key={t} className="flex items-center gap-2 text-sm" style={{ color: C.indigo }}>
                    <span
                      className="flex h-5 w-5 items-center justify-center rounded-full"
                      style={{ background: "#eef6ee", color: "#2a4a2a" }}
                    >
                      <Check size={12} aria-hidden />
                    </span>
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <RFQForm />
          </Reveal>
        </div>
      </section>

      {/* cta */}
      <section className={`${CONTAINER} pb-20`}>
        <Reveal>
          <div
            className="relative overflow-hidden rounded-3xl px-6 py-12 text-center"
            style={{ background: `linear-gradient(135deg, ${C.indigo}, ${C.indigo2})` }}
          >
            <h2 className="text-2xl font-black text-white sm:text-3xl">کسب‌وکارت را به الولباس بیاور</h2>
            <p className="mx-auto mt-3 max-w-md text-sm" style={{ color: "rgba(255,255,255,.6)" }}>
              ثبت‌نام کن، احراز هویت شو و بدون واسطه بفروش یا تأمین کن.
            </p>
            <a
              href="#rfq"
              className="al-pulse mt-6 inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-sm font-bold text-white"
              style={{ background: C.gold }}
            >
              شروع همکاری
              <ArrowLeft size={17} aria-hidden />
            </a>
          </div>
        </Reveal>
      </section>

      <SiteFooter />
    </div>
  );
}

function RFQForm() {
  const [sent, setSent] = useState(false);
  const inputStyle = {
    background: C.cream,
    border: `1px solid ${C.border}`,
    color: C.dark,
  } as const;

  return (
    <div className="rounded-2xl p-6" style={{ background: "#fff", border: `1px solid ${C.border}` }}>
      {sent ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div
            className="mb-4 flex h-14 w-14 items-center justify-center rounded-full"
            style={{ background: "#eef6ee", color: C.sage }}
          >
            <Check size={28} aria-hidden />
          </div>
          <h3 className="mb-1 text-lg font-bold" style={{ color: C.indigo }}>
            درخواستت ثبت شد
          </h3>
          <p className="text-sm" style={{ color: C.muted }}>
            تأمین‌کننده‌ها به‌زودی برایت قیمت می‌فرستند.
          </p>
          <button
            onClick={() => setSent(false)}
            className="mt-5 text-sm font-bold"
            style={{ color: C.teal }}
          >
            ثبت درخواست دیگر
          </button>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="space-y-4"
        >
          <Field label="نام کسب‌وکار">
            <input required className="al-input" style={inputStyle} placeholder="مثلاً مزون آوا" />
          </Field>
          <Field label="محصول موردنیاز">
            <input required className="al-input" style={inputStyle} placeholder="مثلاً پارچه کرپ کرم" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="تعداد / مقدار">
              <input required className="al-input" style={inputStyle} placeholder="مثلاً ۲۰۰ متر" />
            </Field>
            <Field label="شماره تماس">
              <input required className="al-input" style={inputStyle} placeholder="۰۹…" dir="ltr" />
            </Field>
          </div>
          <Field label="توضیحات (اختیاری)">
            <textarea rows={3} className="al-input" style={inputStyle} placeholder="جزئیات بیشتر…" />
          </Field>
          <button
            type="submit"
            className="al-pulse flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white"
            style={{ background: C.gold }}
          >
            <Send size={16} aria-hidden />
            ارسال درخواست قیمت
          </button>
        </form>
      )}
    </div>
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

const VALUES: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: TrendingDown, title: "قیمت پلکانی", body: "هرچه بیشتر بخری، ارزان‌تر. قیمت عمده‌ی شفاف بدون چانه‌زنی." },
  { icon: Layers, title: "تأمین پارچه و مواد", body: "دسترسی مستقیم به واردکننده‌ها و تولیدی‌های پارچه و لوازم." },
  { icon: Handshake, title: "اتصال بدون واسطه", body: "مزون، بوتیک و تولیدی مستقیم به هم وصل می‌شوند." },
  { icon: ShieldCheck, title: "پرداخت تضمین‌شده", body: "امین خرید نسخه‌ی B2B: اطمینان پرداخت برای هر دو طرف معامله." },
];

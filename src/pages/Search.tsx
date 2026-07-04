import { useEffect, useMemo, useRef, useState, type ReactNode, type ChangeEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Mic, Camera, MapPin, Clock, SlidersHorizontal, Sparkles, X, Upload, Plus } from "lucide-react";
import { C, CONTAINER, Reveal, SiteHeader, SiteFooter } from "../components/site-chrome";
import { ProductCard } from "../components/product-card";
import {
  CATEGORIES,
  NEAR_KM,
  fa,
  money,
  searchProducts,
  productsByColor,
  getProduct,
  colorDistance,
  parseColor,
  saturation,
  type Product,
} from "../data/products";
import { dominantColorFromFile } from "../lib/imageColor";
import { searchByImageSrc } from "../lib/visualSearch";
import { backendImageSearch } from "../lib/backendSearch";

const MODES = [
  { id: "text", label: "متنی", icon: Search },
  { id: "voice", label: "صوتی", icon: Mic },
  { id: "image", label: "تصویری", icon: Camera },
] as const;
type Mode = (typeof MODES)[number]["id"];

const IMAGE_LIMIT = 12;
const MAX_IMAGES = 3;

function avgHex(hexes: string[]): string | null {
  if (!hexes.length) return null;
  let r = 0, g = 0, b = 0;
  for (const h of hexes) {
    const x = h.replace("#", "");
    r += parseInt(x.slice(0, 2), 16);
    g += parseInt(x.slice(2, 4), 16);
    b += parseInt(x.slice(4, 6), 16);
  }
  const n = hexes.length;
  const t = (v: number) => Math.round(v / n).toString(16).padStart(2, "0");
  return `#${t(r)}${t(g)}${t(b)}`;
}

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const [mode, setMode] = useState<Mode>((params.get("mode") as Mode) || "text");
  const [q, setQ] = useState(params.get("q") || "");

  // voice
  const [listening, setListening] = useState(false);
  const [voiceMsg, setVoiceMsg] = useState<string | null>(null);
  const recRef = useRef<any>(null);

  // image (up to 3)
  const [imgFiles, setImgFiles] = useState<File[]>([]);
  const [imgPreviews, setImgPreviews] = useState<string[]>([]);
  const [imgColor, setImgColor] = useState<string | null>(null);
  const [aiIds, setAiIds] = useState<number[] | null>(null);
  const [aiScores, setAiScores] = useState<Map<number, number> | null>(null);
  const [aiCategories, setAiCategories] = useState<string[]>([]);
  const [aiStatus, setAiStatus] = useState<"idle" | "loading" | "ai" | "color">("idle");
  const [modelPct, setModelPct] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  // filters
  const [cat, setCat] = useState("همه");
  const [channel, setChannel] = useState<"all" | "retail" | "wholesale">("all");
  const [maxPrice, setMaxPrice] = useState(6000000);
  const [nearOnly, setNearOnly] = useState(false);
  const [sort, setSort] = useState<"popular" | "near" | "cheap">("near");

  useEffect(() => {
    document.title = "جستجو | الولباس";
    window.scrollTo(0, 0);
    if ((params.get("mode") as Mode) === "voice") startVoice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const next: Record<string, string> = {};
    if (q.trim()) next.q = q.trim();
    if (mode !== "text") next.mode = mode;
    setParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, mode]);

  function startVoice() {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setMode("voice");
    if (!SR) {
      setVoiceMsg("مرورگرت از جستجوی صوتی پشتیبانی نمی‌کند. با کروم امتحان کن یا متنی بنویس.");
      return;
    }
    try {
      const rec = new SR();
      rec.lang = "fa-IR";
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      rec.onstart = () => {
        setListening(true);
        setVoiceMsg("گوش می‌دم… حرف بزن.");
      };
      rec.onerror = () => {
        setListening(false);
        setVoiceMsg("صدایی نشنیدم. دوباره بزن و واضح‌تر بگو.");
      };
      rec.onend = () => setListening(false);
      rec.onresult = (e: any) => {
        const t = e.results[0][0].transcript as string;
        setQ(t);
        setVoiceMsg(`شنیدم: «${t}»`);
        setMode("text");
      };
      recRef.current = rec;
      rec.start();
    } catch {
      setListening(false);
      setVoiceMsg("جستجوی صوتی در دسترس نیست.");
    }
  }

  async function runImageSearch(files: File[], previews: string[]) {
    setAiIds(null);
    setAiScores(null);
    setAiCategories([]);
    setAiStatus("loading");
    setModelPct(0);

    const colors = (await Promise.all(files.map((f) => dominantColorFromFile(f).catch(() => null)))).filter(
      (c): c is string => Boolean(c),
    );
    const qc = avgHex(colors);
    setImgColor(qc);

    // 1) strong backend (Jina) — up to 3 images averaged
    const be = await backendImageSearch(files);
    if (be && be.results.length) {
      setAiIds(be.results.map((r) => r.id));
      setAiScores(new Map(be.results.map((r) => [r.id, r.score])));
      setAiCategories(be.categories);
      setAiStatus("ai");
      return;
    }

    // 2) fallback: on-device MobileCLIP (first image only)
    try {
      const ai = await searchByImageSrc(previews[0], qc, (p) => setModelPct(p));
      if (ai && ai.ids.length) {
        setAiIds(ai.ids);
        setAiScores(null);
        setAiCategories(ai.category ? [ai.category] : []);
        setAiStatus("ai");
        return;
      }
      setAiStatus("color");
    } catch {
      setAiStatus("color");
    }
  }

  function onFiles(e: ChangeEvent<HTMLInputElement>) {
    const list = e.target.files;
    if (!list || !list.length) return;
    const room = MAX_IMAGES - imgFiles.length;
    const picked = Array.from(list).slice(0, room);
    if (!picked.length) return;
    const files = [...imgFiles, ...picked];
    const previews = [...imgPreviews, ...picked.map((f) => URL.createObjectURL(f))];
    setImgFiles(files);
    setImgPreviews(previews);
    if (fileRef.current) fileRef.current.value = "";
    void runImageSearch(files, previews);
  }

  function removeImg(i: number) {
    URL.revokeObjectURL(imgPreviews[i]);
    const files = imgFiles.filter((_, j) => j !== i);
    const previews = imgPreviews.filter((_, j) => j !== i);
    setImgFiles(files);
    setImgPreviews(previews);
    if (files.length) void runImageSearch(files, previews);
    else clearImage();
  }

  function clearImage() {
    imgPreviews.forEach((u) => URL.revokeObjectURL(u));
    setImgFiles([]);
    setImgPreviews([]);
    setImgColor(null);
    setAiIds(null);
    setAiScores(null);
    setAiCategories([]);
    setAiStatus("idle");
    if (fileRef.current) fileRef.current.value = "";
  }

  const results = useMemo(() => {
    let base: Product[];
    if (mode === "image" && aiIds) {
      base = aiIds.map(getProduct).filter((p): p is Product => Boolean(p));
    } else if (mode === "image" && imgColor) {
      base = productsByColor(imgColor);
    } else {
      base = searchProducts(q);
    }
    let list = base.filter((p) => {
      if (cat !== "همه" && p.category !== cat) return false;
      if (channel === "retail" && p.wholesale) return false;
      if (channel === "wholesale" && !p.wholesale) return false;
      if (p.price > maxPrice) return false;
      if (nearOnly && p.distance > NEAR_KM) return false;
      return true;
    });

    if (mode === "image") {
      if (aiIds) {
        // rank by real similarity score + color. The color weight ADAPTS to how
        // colorful the query is: a vivid red garment leans harder on color so
        // red items surface; a neutral/gray photo leans on shape.
        const N = aiIds.length || 1;
        const rankOf = new Map(aiIds.map((id, i) => [id, i]));
        const shapeScore = (id: number) => aiScores?.get(id) ?? 1 - (rankOf.get(id) ?? N) / N;
        const colorSim = (hex: string) => (imgColor ? Math.max(0, 1 - colorDistance(hex, imgColor) / 150) : 0);
        const cw = imgColor ? Math.min(0.55, 0.2 + 0.5 * saturation(imgColor)) : 0;
        const sw = 1 - cw;
        const score = (p: Product) => sw * shapeScore(p.id) + cw * colorSim(p.colorHex);
        list = [...list].sort((a, b) => score(b) - score(a));
      }
      list = list.slice(0, IMAGE_LIMIT);
    } else {
      const tc = parseColor(q);
      if (tc) list = [...list].sort((a, b) => colorDistance(a.colorHex, tc) - colorDistance(b.colorHex, tc));
      else if (sort === "near") list = [...list].sort((a, b) => a.distance - b.distance);
      else if (sort === "cheap") list = [...list].sort((a, b) => a.price - b.price);
    }
    return list;
  }, [q, mode, imgColor, aiIds, aiScores, cat, channel, maxPrice, nearOnly, sort]);

  const summary =
    mode === "image"
      ? aiStatus === "ai"
        ? "شبیه‌ترین‌ها بر اساس تصویر و رنگ"
        : aiStatus === "loading"
          ? "در حال تحلیل تصویر…"
          : aiStatus === "color"
            ? "جستجو بر اساس رنگ"
            : "تا ۳ عکس آپلود کن"
      : q.trim()
        ? `نتایج برای «${q.trim()}»`
        : "همه‌ی محصولات";

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
            {/* tabs */}
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
                    onClick={() => {
                      if (m.id === "voice") startVoice();
                      else setMode(m.id);
                    }}
                    className="flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-colors"
                    style={{ background: on ? C.indigo : "transparent", color: on ? "#fff" : C.muted }}
                  >
                    <Icon size={16} aria-hidden />
                    {m.label}
                  </button>
                );
              })}
            </div>

            {/* TEXT */}
            {mode === "text" && (
              <div className="flex h-12 items-center gap-3 rounded-xl px-3" style={{ border: `1px solid ${C.border}` }}>
                <Search size={19} style={{ color: C.teal }} aria-hidden />
                <input
                  autoFocus
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="مثلاً: شلوار جین سبز"
                  className="al-input flex-1"
                  style={{ border: "none", padding: 0, background: "transparent" }}
                />
                {q && (
                  <button onClick={() => setQ("")} aria-label="پاک کردن" style={{ color: C.muted }}>
                    <X size={16} aria-hidden />
                  </button>
                )}
                <span
                  className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium"
                  style={{ background: C.lightTeal, color: C.tealInk, border: "1px solid #9fe1cb" }}
                >
                  <MapPin size={13} aria-hidden />
                  تهران
                </span>
              </div>
            )}

            {/* VOICE */}
            {mode === "voice" && (
              <div className="flex flex-col items-center gap-3 rounded-xl py-6" style={{ border: `1px solid ${C.border}` }}>
                <button
                  onClick={startVoice}
                  aria-label="شروع ضبط صدا"
                  className={listening ? "al-pulse" : ""}
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 9999,
                    background: listening ? C.gold : C.teal,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Mic size={26} aria-hidden />
                </button>
                <span className="text-sm" style={{ color: voiceMsg ? C.indigo : C.muted }}>
                  {voiceMsg || "بزن و بگو چی می‌خوای"}
                </span>
              </div>
            )}

            {/* IMAGE (up to 3) */}
            {mode === "image" && (
              <div className="rounded-xl p-3" style={{ border: `1px solid ${C.border}` }}>
                <input ref={fileRef} type="file" accept="image/*" multiple onChange={onFiles} className="hidden" />
                {imgPreviews.length ? (
                  <div>
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      {imgPreviews.map((src, i) => (
                        <div key={i} className="relative">
                          <img src={src} alt={`نمونه ${fa(i + 1)}`} className="h-16 w-16 rounded-lg object-cover" />
                          <button
                            onClick={() => removeImg(i)}
                            aria-label="حذف"
                            className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full text-white"
                            style={{ background: "#b84040" }}
                          >
                            <X size={12} aria-hidden />
                          </button>
                        </div>
                      ))}
                      {imgFiles.length < MAX_IMAGES && (
                        <button
                          onClick={() => fileRef.current?.click()}
                          className="flex h-16 w-16 flex-col items-center justify-center gap-1 rounded-lg text-xs"
                          style={{ background: C.cream, border: `1px dashed ${C.border}`, color: C.teal }}
                        >
                          <Plus size={18} aria-hidden />
                          افزودن
                        </button>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-xs" style={{ color: C.muted }}>
                        {aiStatus === "loading" && (
                          <span className="flex items-center gap-1.5" style={{ color: C.indigo }}>
                            <Sparkles size={14} style={{ color: C.teal }} aria-hidden />
                            در حال تحلیل…{modelPct ? ` ${fa(modelPct)}٪` : ""}
                          </span>
                        )}
                        {aiStatus === "ai" && aiCategories.length > 0 && (
                          <span className="flex flex-wrap items-center gap-1.5">
                            <Sparkles size={14} style={{ color: C.teal }} aria-hidden />
                            شبیه:
                            {aiCategories.map((c) => (
                              <button
                                key={c}
                                onClick={() => setCat(cat === c ? "همه" : c)}
                                className="rounded-full px-2 py-0.5 text-[11px] font-bold"
                                style={{
                                  background: cat === c ? C.teal : C.lightTeal,
                                  color: cat === c ? "#fff" : C.tealInk,
                                }}
                              >
                                {c}
                              </button>
                            ))}
                          </span>
                        )}
                        {aiStatus === "color" && <span>بر اساس رنگ مرتب شد.</span>}
                      </div>
                      <button onClick={clearImage} className="text-xs font-bold" style={{ color: C.muted }}>
                        پاک کردن
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="flex w-full flex-col items-center gap-2 rounded-lg py-6"
                    style={{ background: C.cream, border: `1px dashed ${C.border}` }}
                  >
                    <Upload size={24} style={{ color: C.teal }} aria-hidden />
                    <span className="text-sm font-medium" style={{ color: C.indigo }}>
                      عکس لباس را آپلود کن (تا ۳ عکس)
                    </span>
                    <span className="text-xs" style={{ color: C.muted }}>
                      چند زاویه بفرست تا دقیق‌تر پیدا کنیم
                    </span>
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 text-sm" style={{ color: "rgba(255,255,255,.6)" }}>
            <Sparkles size={15} style={{ color: C.gold }} aria-hidden />
            <span>
              {fa(results.length)} نتیجه — {summary}
            </span>
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
              {mode !== "image" && (
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
              )}
            </div>

            {results.length === 0 ? (
              <div
                className="rounded-2xl p-12 text-center text-sm"
                style={{ background: "#fff", border: `1px solid ${C.border}`, color: C.muted }}
              >
                چیزی پیدا نشد. یک کلمه‌ی دیگر امتحان کن یا فیلترها را باز کن.
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

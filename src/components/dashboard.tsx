import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { C, CONTAINER, SiteHeader, SiteFooter } from "./site-chrome";

export type NavItem = { id: string; label: string; icon: LucideIcon; badge?: number };

export function DashShell({
  avatarText,
  name,
  meta,
  nav,
  active,
  onSelect,
  children,
}: {
  avatarText: string;
  name: string;
  meta: string;
  nav: NavItem[];
  active: string;
  onSelect: (id: string) => void;
  children: ReactNode;
}) {
  return (
    <div style={{ background: C.cream, color: C.dark, minHeight: "100vh" }}>
      <SiteHeader />
      <div className={`${CONTAINER} py-8`}>
        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div
              className="mb-4 flex items-center gap-3 rounded-2xl p-4"
              style={{ background: "#fff", border: `1px solid ${C.border}` }}
            >
              <div
                className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ background: C.indigo }}
              >
                {avatarText}
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-bold" style={{ color: C.indigo }}>
                  {name}
                </div>
                <div className="truncate text-xs" style={{ color: C.muted }}>
                  {meta}
                </div>
              </div>
            </div>

            <nav
              className="flex gap-1 overflow-x-auto rounded-2xl p-2 lg:flex-col lg:overflow-visible"
              style={{ background: "#fff", border: `1px solid ${C.border}` }}
            >
              {nav.map((n) => {
                const Icon = n.icon;
                const on = n.id === active;
                return (
                  <button
                    key={n.id}
                    onClick={() => onSelect(n.id)}
                    className="flex flex-shrink-0 items-center gap-2.5 whitespace-nowrap rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors lg:w-full"
                    style={{
                      background: on ? C.indigo : "transparent",
                      color: on ? "#fff" : C.dark,
                    }}
                  >
                    <Icon size={17} aria-hidden />
                    {n.label}
                    {typeof n.badge === "number" && n.badge > 0 && (
                      <span
                        className="mr-auto rounded-full px-1.5 text-[10px] font-bold"
                        style={{ background: on ? "rgba(255,255,255,.2)" : C.gold, color: "#fff" }}
                      >
                        {n.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </aside>

          <div className="min-w-0">{children}</div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  tint,
  ink,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  tint: string;
  ink: string;
}) {
  return (
    <div className="rounded-2xl p-5" style={{ background: "#fff", border: `1px solid ${C.border}` }}>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs" style={{ color: C.muted }}>
            {label}
          </div>
          <div className="mt-1 text-2xl font-black" style={{ color: C.indigo }}>
            {value}
          </div>
        </div>
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ background: tint, color: ink }}
        >
          <Icon size={20} aria-hidden />
        </div>
      </div>
      {hint && (
        <div className="mt-2 text-xs" style={{ color: C.muted }}>
          {hint}
        </div>
      )}
    </div>
  );
}

export function Panel({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section
      className="mb-5 rounded-2xl p-5 sm:p-6"
      style={{ background: "#fff", border: `1px solid ${C.border}` }}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-bold" style={{ color: C.indigo }}>
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export type Tone = "amber" | "teal" | "green" | "red" | "indigo" | "gray";

const TONES: Record<Tone, { bg: string; fg: string }> = {
  amber: { bg: "#fbf5e9", fg: "#8a5a12" },
  teal: { bg: "#e6f5f3", fg: "#0f6e56" },
  green: { bg: "#eef6ee", fg: "#2a4a2a" },
  red: { bg: "#fdf0ef", fg: "#a32d2d" },
  indigo: { bg: "#e9edf5", fg: "#1b2a4a" },
  gray: { bg: "#f1efe8", fg: "#5f5e5a" },
};

export function StatusBadge({ label, tone }: { label: string; tone: Tone }) {
  const t = TONES[tone];
  return (
    <span
      className="inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold"
      style={{ background: t.bg, color: t.fg }}
    >
      {label}
    </span>
  );
}

export function PrimaryButton({
  children,
  onClick,
  tone = "gold",
}: {
  children: ReactNode;
  onClick?: () => void;
  tone?: "gold" | "teal" | "indigo";
}) {
  const bg = tone === "gold" ? C.gold : tone === "teal" ? C.teal : C.indigo;
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white"
      style={{ background: bg }}
    >
      {children}
    </button>
  );
}

export function GhostButton({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold"
      style={{ background: C.cream, color: C.indigo, border: `1px solid ${C.border}` }}
    >
      {children}
    </button>
  );
}

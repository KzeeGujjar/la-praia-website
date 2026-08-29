"use client";

import { useEffect, useState } from "react";

/**
 * Temporary in-browser picker for trying color palettes and font pairings
 * live on the real site. Not part of the restaurant's actual design — once
 * a combination is chosen, hardcode it into globals.css/layout.tsx and
 * delete this component.
 */
const THEMES = [
  { id: "costiera", label: "Costiera", swatches: ["#0e2a3d", "#c1603a", "#faf5ea", "#e7b93b"] },
  { id: "charcoal", label: "Charcoal & Terracotta", swatches: ["#262320", "#b5572f", "#f7f2e7", "#c99a3e"] },
  { id: "olive", label: "Olive & Ochre", swatches: ["#23261c", "#bf7d35", "#f6f1e4", "#d1a34a"] },
  { id: "wine", label: "Wine & Stone", swatches: ["#241417", "#a8452f", "#f8f1e9", "#c9a24a"] },
] as const;

const DISPLAY_FONTS = [
  { id: "fraunces", label: "Fraunces" },
  { id: "playfair", label: "Playfair Display" },
  { id: "cormorant", label: "Cormorant Garamond" },
] as const;

const BODY_FONTS = [
  { id: "inter", label: "Inter" },
  { id: "manrope", label: "Manrope" },
] as const;

const STORAGE_KEYS = {
  theme: "themeLab.theme",
  display: "themeLab.display",
  body: "themeLab.body",
};

export function ThemeLab() {
  const [open, setOpen] = useState(true);
  const [theme, setTheme] = useState<string>("costiera");
  const [displayFont, setDisplayFont] = useState<string>("fraunces");
  const [bodyFont, setBodyFont] = useState<string>("inter");

  useEffect(() => {
    const root = document.documentElement;
    try {
      const savedTheme = window.localStorage.getItem(STORAGE_KEYS.theme);
      const savedDisplay = window.localStorage.getItem(STORAGE_KEYS.display);
      const savedBody = window.localStorage.getItem(STORAGE_KEYS.body);
      if (savedTheme) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTheme(savedTheme);
        root.setAttribute("data-theme", savedTheme);
      }
      if (savedDisplay) {
        setDisplayFont(savedDisplay);
        root.setAttribute("data-font-display", savedDisplay);
      }
      if (savedBody) {
        setBodyFont(savedBody);
        root.setAttribute("data-font-body", savedBody);
      }
    } catch {
      // localStorage unavailable — fall back to defaults silently
    }
  }, []);

  function applyTheme(id: string) {
    setTheme(id);
    document.documentElement.setAttribute("data-theme", id);
    try {
      window.localStorage.setItem(STORAGE_KEYS.theme, id);
    } catch {}
  }

  function applyDisplay(id: string) {
    setDisplayFont(id);
    document.documentElement.setAttribute("data-font-display", id);
    try {
      window.localStorage.setItem(STORAGE_KEYS.display, id);
    } catch {}
  }

  function applyBody(id: string) {
    setBodyFont(id);
    document.documentElement.setAttribute("data-font-body", id);
    try {
      window.localStorage.setItem(STORAGE_KEYS.body, id);
    } catch {}
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed right-4 top-20 z-50 rounded-full bg-black/85 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-lg"
      >
        Theme Lab
      </button>
    );
  }

  return (
    <div className="fixed right-4 top-20 z-50 w-72 rounded-lg bg-black/85 p-4 text-white shadow-xl backdrop-blur">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
          Theme Lab (preview only)
        </p>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close theme lab"
          className="text-white/60 hover:text-white"
        >
          ✕
        </button>
      </div>

      <div className="mt-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-white/50">
          Color palette
        </p>
        <div className="mt-2 flex flex-col gap-1.5">
          {THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => applyTheme(t.id)}
              className={`flex items-center gap-2 rounded px-2 py-1.5 text-left text-xs transition-colors ${
                theme === t.id ? "bg-white/15" : "hover:bg-white/5"
              }`}
            >
              <span className="flex shrink-0 gap-0.5">
                {t.swatches.map((c) => (
                  <span
                    key={c}
                    className="h-3.5 w-3.5 rounded-full border border-white/20"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-white/50">
          Heading font
        </p>
        <div className="mt-2 flex flex-col gap-1.5">
          {DISPLAY_FONTS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => applyDisplay(f.id)}
              className={`rounded px-2 py-1.5 text-left text-sm transition-colors ${
                displayFont === f.id ? "bg-white/15" : "hover:bg-white/5"
              }`}
              style={{ fontFamily: `var(--font-${f.id === "fraunces" ? "fraunces" : f.id})` }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-white/50">
          Body font
        </p>
        <div className="mt-2 flex flex-col gap-1.5">
          {BODY_FONTS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => applyBody(f.id)}
              className={`rounded px-2 py-1.5 text-left text-xs transition-colors ${
                bodyFont === f.id ? "bg-white/15" : "hover:bg-white/5"
              }`}
              style={{ fontFamily: `var(--font-${f.id})` }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-4 text-[10px] leading-relaxed text-white/40">
        Tell me which combination you like and I&apos;ll make it the site&apos;s real, permanent design.
      </p>
    </div>
  );
}

"use client";

import { useLanguage } from "@/lib/language-context";

/**
 * Stand-in for real restaurant photography. No stock photos are used here —
 * swap this out for actual food/interior shots (e.g. via next/image) once
 * they're available.
 */
export function PhotoPlaceholder({
  className = "",
  labelIt,
  labelEn,
}: {
  className?: string;
  labelIt?: string;
  labelEn?: string;
}) {
  const { locale, t } = useLanguage();
  const label =
    locale === "it" ? labelIt ?? t.about.photoNote : labelEn ?? t.about.photoNote;

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden border border-navy/12 bg-[linear-gradient(155deg,_var(--color-sand-dark)_0%,_var(--color-sand)_100%)] text-center ${className}`}
    >
      <div className="flex flex-col items-center gap-3 px-6 py-8 text-navy/45">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1}
          className="h-6 w-6"
          aria-hidden="true"
        >
          <rect x="3" y="5" width="18" height="14" rx="1" />
          <circle cx="9" cy="10" r="1.25" />
          <path d="M3 16l5-4 4 3 3-2 6 5" />
        </svg>
        <p className="font-display text-sm italic tracking-wide">{label}</p>
      </div>
    </div>
  );
}

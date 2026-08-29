"use client";

import { useLanguage } from "@/lib/language-context";

export function LanguageToggle({
  className = "",
  variant = "light",
}: {
  className?: string;
  variant?: "light" | "dark";
}) {
  const { locale, setLocale, t } = useLanguage();

  const inactiveClasses =
    variant === "dark" ? "text-sand/50 hover:text-sand" : "text-navy/40 hover:text-navy";
  const separatorClasses = variant === "dark" ? "text-sand/25" : "text-navy/25";

  return (
    <div
      role="group"
      aria-label={t.common.languageToggleLabel}
      className={`inline-flex items-center gap-1.5 text-sm font-semibold tracking-wide ${className}`}
    >
      <button
        type="button"
        onClick={() => setLocale("it")}
        aria-pressed={locale === "it"}
        className={`rounded-md px-1.5 py-1 uppercase transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta ${
          locale === "it" ? "text-terracotta" : inactiveClasses
        }`}
      >
        IT
      </button>
      <span className={separatorClasses} aria-hidden="true">
        |
      </span>
      <button
        type="button"
        onClick={() => setLocale("en")}
        aria-pressed={locale === "en"}
        className={`rounded-md px-1.5 py-1 uppercase transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta ${
          locale === "en" ? "text-terracotta" : inactiveClasses
        }`}
      >
        EN
      </button>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { LanguageToggle } from "@/components/LanguageToggle";

const sectionIds = ["home", "menu", "about", "contact", "location"] as const;

export function Header() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("home");

  const links = [
    { id: "home", label: t.nav.home },
    { id: "menu", label: t.nav.menu },
    { id: "about", label: t.nav.about },
    { id: "contact", label: t.nav.contact },
    { id: "location", label: t.nav.location },
  ];

  // Highlight the nav link for whichever section is currently in view.
  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-navy/10 bg-sand/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <a
          href="#home"
          className="font-display text-2xl font-semibold tracking-tight text-navy"
          onClick={() => setOpen(false)}
        >
          La Praia
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {links.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              aria-current={active === link.id ? "true" : undefined}
              className={`text-sm font-medium transition-colors hover:text-terracotta ${
                active === link.id ? "text-terracotta" : "text-navy/80"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageToggle />
          <a
            href="#contact"
            className="inline-flex items-center bg-terracotta px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-sand transition-colors hover:bg-terracotta-dark"
          >
            {t.nav.reserve}
          </a>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full border border-navy/20 p-2 text-navy md:hidden"
          aria-expanded={open}
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            className="h-5 w-5"
            aria-hidden="true"
          >
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-navy/10 bg-sand px-4 pb-4 md:hidden">
          <nav className="flex flex-col gap-1 pt-2" aria-label="Main mobile">
            {links.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={() => setOpen(false)}
                aria-current={active === link.id ? "true" : undefined}
                className={`rounded-lg px-2 py-2 text-base font-medium hover:bg-navy/5 ${
                  active === link.id ? "text-terracotta" : "text-navy"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-3 flex items-center justify-between gap-3">
            <LanguageToggle />
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="inline-flex items-center bg-terracotta px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-sand"
            >
              {t.nav.reserve}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

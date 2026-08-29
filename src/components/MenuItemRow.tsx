"use client";

import { useLanguage } from "@/lib/language-context";
import type { MenuItem } from "@/data/menu";

export function MenuItemRow({ item }: { item: MenuItem }) {
  const { locale, t } = useLanguage();
  const description =
    locale === "it" ? item.descriptionIt ?? item.descriptionEn : item.descriptionEn ?? item.descriptionIt;

  return (
    <li className="border-b border-navy/10 py-3 last:border-none">
      <div className="flex items-baseline gap-3">
        <p className="shrink-0 font-display text-base font-semibold text-navy">
          {item.name}
          {item.glutenFree && (
            <span className="ml-2 rounded-full bg-olive/10 px-2 py-0.5 text-[10px] font-sans font-semibold uppercase tracking-wide text-olive align-middle">
              {t.menuPage.glutenFreeNote}
            </span>
          )}
        </p>
        <span
          className="mb-1 h-0 flex-1 border-b border-dotted border-navy/25"
          aria-hidden="true"
        />
        <p className="shrink-0 whitespace-nowrap font-display text-base font-semibold text-terracotta">
          {item.price.toFixed(2).replace(".", ",")} €
        </p>
      </div>
      {description && <p className="mt-0.5 text-sm text-ink/60">{description}</p>}
    </li>
  );
}

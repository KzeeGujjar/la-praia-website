"use client";

import { useLanguage } from "@/lib/language-context";
import { business } from "@/data/business";
import { LanguageToggle } from "@/components/LanguageToggle";

export function Footer() {
  const { t } = useLanguage();
  const days: (keyof typeof t.contact.days)[] = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  return (
    <footer className="mt-24 border-t border-navy/10 bg-navy pb-20 text-sand/90 md:pb-0">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div>
          <p className="font-display text-2xl font-semibold text-sand">
            {business.shortName}
          </p>
          <p className="mt-1 text-sm text-sand/70">{t.footer.typeLabel}</p>
          <p className="text-sm text-sand/70">{t.footer.cityLabel}</p>
          <p className="mt-2 max-w-xs text-sm text-sand/70">{t.footer.tagline}</p>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-lemon">
            {t.footer.linksTitle}
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a href="#home" className="hover:text-lemon">
                {t.nav.home}
              </a>
            </li>
            <li>
              <a href="#menu" className="hover:text-lemon">
                {t.nav.menu}
              </a>
            </li>
            <li>
              <a href="#about" className="hover:text-lemon">
                {t.nav.about}
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-lemon">
                {t.nav.contact}
              </a>
            </li>
            <li>
              <a href="#location" className="hover:text-lemon">
                {t.nav.location}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-lemon">
            {t.footer.contactTitle}
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-sand/80">
            <li>{business.address.street}</li>
            <li>
              {business.address.postalCode} {business.address.city}
            </li>
            <li>
              <a href={`tel:${business.phoneE164}`} className="hover:text-lemon">
                {business.phoneDisplay}
              </a>
            </li>
            <li>
              <a
                href={business.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-lemon"
              >
                {t.contact.directionsCta}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-lemon">
            {t.footer.hoursTitle}
          </h3>
          <ul className="mt-3 space-y-1 text-sm text-sand/80">
            {days.map((day) => {
              const entry = business.hours.find((h) => h.day === day);
              return (
                <li key={day} className="flex justify-between gap-4">
                  <span>{t.contact.days[day]}</span>
                  <span>{entry?.pickup ?? t.contact.closedLabel}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="border-t border-sand/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 text-xs text-sand/60 sm:flex-row sm:items-end sm:justify-between sm:px-6">
          <div>
            <p>
              <span className="font-semibold text-sand/70">
                {t.footer.noticeTitle}:
              </span>{" "}
              {t.footer.notice}
            </p>
            <p className="mt-2">
              © {new Date().getFullYear()} {business.shortName}. {t.footer.rights}
            </p>
          </div>
          <LanguageToggle variant="dark" />
        </div>
      </div>
    </footer>
  );
}

"use client";

import { useLanguage } from "@/lib/language-context";
import { business } from "@/data/business";
import { menu, menuHighlights } from "@/data/menu";
import { ContactButtons } from "@/components/ContactButtons";
import { PhotoPlaceholder } from "@/components/PhotoPlaceholder";
import { MapEmbed } from "@/components/MapEmbed";
import { MenuItemRow } from "@/components/MenuItemRow";
import { Reveal } from "@/components/Reveal";

const dayOrder = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export default function Home() {
  const { t, locale } = useLanguage();

  const highlightItems = menuHighlights
    .map(({ categoryId, itemName }) => {
      const category = menu.find((c) => c.id === categoryId);
      const item = category?.items.find((i) => i.name === itemName);
      return item ? { item, category } : null;
    })
    .filter((v): v is NonNullable<typeof v> => Boolean(v));

  return (
    <>
      {/* HOME */}
      <section id="home" className="relative scroll-mt-16 overflow-hidden bg-navy text-sand">
        <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,_var(--color-lemon)_0,_transparent_45%),radial-gradient(circle_at_80%_0%,_var(--color-terracotta)_0,_transparent_40%)]" />
        <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-7 px-4 py-28 sm:px-6 md:py-40">
          <span className="animate-fade-up rounded-full border border-sand/25 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-lemon">
            {t.hero.eyebrow}
          </span>
          <h1 className="animate-fade-up animate-fade-up-d1 font-display text-6xl font-semibold leading-none tracking-tight sm:text-7xl md:text-8xl">
            {t.hero.title}
          </h1>
          <p className="animate-fade-up animate-fade-up-d2 max-w-md text-lg font-light tracking-wide text-sand/80">
            {t.hero.subtitle}
          </p>
          <div className="animate-fade-up animate-fade-up-d3 flex flex-wrap gap-4 pt-3">
            <a
              href="#contact"
              className="inline-flex items-center justify-center bg-lemon px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-navy-dark transition-colors duration-300 hover:bg-lemon/90"
            >
              {t.hero.ctaContact}
            </a>
            <a
              href="#menu"
              className="inline-flex items-center justify-center border border-sand/40 px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-sand transition-colors duration-300 hover:border-sand hover:bg-sand/5"
            >
              {t.hero.ctaMenu}
            </a>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:items-center md:py-24">
        <Reveal>
          <PhotoPlaceholder className="aspect-[4/3] w-full" />
        </Reveal>
        <Reveal>
          <span className="text-xs font-semibold uppercase tracking-widest text-terracotta">
            {t.home.introEyebrow}
          </span>
          <h2 className="mt-2 font-display text-3xl font-semibold text-navy sm:text-4xl">
            {t.home.introTitle}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink/75">
            {t.home.introBody}
          </p>
          <a
            href="#about"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-terracotta hover:text-terracotta-dark"
          >
            {t.home.introCta}
            <span aria-hidden="true">→</span>
          </a>
        </Reveal>
      </section>

      {/* Highlights */}
      <section className="border-y border-navy/10 bg-sand-dark/50 py-16 md:py-24">
        <Reveal className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center font-display text-3xl font-semibold text-navy sm:text-4xl">
            {t.home.highlightsTitle}
          </h2>
          <div className="mt-14 grid divide-y divide-navy/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {t.home.highlights.map((highlight, i) => (
              <div
                key={highlight.title}
                className="py-8 first:pt-0 sm:px-10 sm:py-0 sm:first:pl-0 sm:last:pr-0"
              >
                <span className="font-display text-4xl italic text-terracotta/70">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-navy">
                  {highlight.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/70">
                  {highlight.body}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Menu preview */}
      <Reveal className="mx-auto max-w-3xl px-4 py-16 sm:px-6 md:py-24">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-terracotta">
              {t.home.menuPreviewEyebrow}
            </span>
            <h2 className="mt-2 font-display text-3xl font-semibold text-navy sm:text-4xl">
              {t.home.menuPreviewTitle}
            </h2>
          </div>
          <a
            href="#menu"
            className="inline-flex items-center gap-2 text-sm font-semibold text-terracotta hover:text-terracotta-dark"
          >
            {t.home.menuPreviewCta}
            <span aria-hidden="true">→</span>
          </a>
        </div>

        <div className="mt-8 divide-y divide-navy/10 border-t border-navy/10">
          {highlightItems.map(({ item, category }) => {
            const description =
              locale === "it"
                ? item.descriptionIt ?? item.descriptionEn
                : item.descriptionEn ?? item.descriptionIt;
            return (
              <div key={item.name} className="py-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-terracotta/80">
                  {locale === "it" ? category?.nameIt : category?.nameEn}
                </p>
                <div className="mt-1 flex items-baseline gap-3">
                  <p className="shrink-0 font-display text-lg font-semibold text-navy">
                    {item.name}
                  </p>
                  <span
                    className="mb-1 h-0 flex-1 border-b border-dotted border-navy/25"
                    aria-hidden="true"
                  />
                  <p className="shrink-0 font-display text-lg font-semibold text-terracotta">
                    {item.price.toFixed(2).replace(".", ",")} €
                  </p>
                </div>
                {description && (
                  <p className="mt-1 text-sm text-ink/60">{description}</p>
                )}
              </div>
            );
          })}
        </div>
      </Reveal>

      {/* MENU */}
      <section
        id="menu"
        className="scroll-mt-16 border-t border-navy/10 bg-sand py-16 sm:px-0 md:py-24"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-widest text-terracotta">
              {t.menuPage.eyebrow}
            </span>
            <h2 className="mt-2 font-display text-4xl font-semibold text-navy sm:text-5xl">
              {t.menuPage.title}
            </h2>
            <p className="mt-4 text-base text-ink/70">{t.menuPage.subtitle}</p>
          </Reveal>

          <div className="mt-10 grid gap-10 lg:grid-cols-[220px_1fr]">
            {/* Category jump nav */}
            <nav
              aria-label="Menu categories"
              className="hidden lg:sticky lg:top-24 lg:block lg:h-fit"
            >
              <ul className="space-y-1 border-l border-navy/10 pl-4 text-sm">
                {menu.map((category) => (
                  <li key={category.id}>
                    <a
                      href={`#${category.id}`}
                      className="block py-1 text-ink/60 hover:text-terracotta"
                    >
                      {locale === "it" ? category.nameIt : category.nameEn}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Mobile category chips */}
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 lg:hidden">
              {menu.map((category) => (
                <a
                  key={category.id}
                  href={`#${category.id}`}
                  className="shrink-0 rounded-full border border-navy/15 bg-white px-3 py-1.5 text-xs font-medium text-navy/70 hover:border-terracotta hover:text-terracotta"
                >
                  {locale === "it" ? category.nameIt : category.nameEn}
                </a>
              ))}
            </div>

            <div className="space-y-14 lg:col-start-2 lg:row-start-1">
              {menu.map((category) => (
                <section
                  key={category.id}
                  id={category.id}
                  className="scroll-mt-32"
                >
                  <h3 className="font-display text-2xl font-semibold text-navy sm:text-3xl">
                    {locale === "it" ? category.nameIt : category.nameEn}
                  </h3>
                  <ul className="mt-4">
                    {category.items.map((item) => (
                      <MenuItemRow key={item.name} item={item} />
                    ))}
                  </ul>
                </section>
              ))}

              <p className="border-l-2 border-terracotta/40 bg-sand-dark/40 py-3 pl-5 text-sm italic text-ink/70">
                {t.menuPage.allergenNote}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section
        id="about"
        className="scroll-mt-16 border-t border-navy/10 bg-sand-dark/40 py-16 md:py-24"
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-widest text-terracotta">
              {t.about.eyebrow}
            </span>
            <h2 className="mt-2 font-display text-4xl font-semibold text-navy sm:text-5xl">
              {t.about.title}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-ink/75">
              {t.about.intro}
            </p>
          </Reveal>

          <Reveal>
            <PhotoPlaceholder className="mt-10 aspect-[16/9] w-full" />
          </Reveal>

          <Reveal className="mt-12 grid gap-10 sm:grid-cols-2">
            <div>
              <h3 className="font-display text-2xl font-semibold text-navy">
                {t.about.philosophyTitle}
              </h3>
              <p className="mt-3 leading-relaxed text-ink/70">
                {t.about.philosophyBody}
              </p>
            </div>
            <div>
              <h3 className="font-display text-2xl font-semibold text-navy">
                {t.about.ingredientsTitle}
              </h3>
              <p className="mt-3 leading-relaxed text-ink/70">
                {t.about.ingredientsBody}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CONTACT / RESERVATIONS */}
      <section
        id="contact"
        className="scroll-mt-16 border-t border-navy/10 bg-navy text-sand"
      >
        <Reveal className="mx-auto max-w-4xl px-4 py-16 sm:px-6 md:py-24">
          <span className="text-xs font-semibold uppercase tracking-widest text-lemon">
            {t.contact.eyebrow}
          </span>
          <h2 className="mt-2 font-display text-4xl font-semibold sm:text-5xl">
            {t.contact.title}
          </h2>
          <p className="mt-4 max-w-xl text-base text-sand/80">
            {t.contact.subtitle}
          </p>
          <ContactButtons className="mt-6" variant="dark" />

          <div className="mt-14 grid gap-10 sm:grid-cols-2">
            <div>
              <h3 className="font-display text-xl font-semibold">
                {t.contact.phoneTitle}
              </h3>
              <a
                href={`tel:${business.phoneE164}`}
                className="mt-2 block text-sand/80 hover:text-lemon"
              >
                {business.phoneDisplay}
              </a>
            </div>

            <div>
              <h3 className="font-display text-xl font-semibold">
                {t.contact.hoursTitle}
              </h3>
              <dl className="mt-3 divide-y divide-sand/10 border-t border-sand/10">
                {dayOrder.map((day) => {
                  const entry = business.hours.find((h) => h.day === day);
                  return (
                    <div
                      key={day}
                      className="flex items-center justify-between py-2.5 text-sm"
                    >
                      <dt className="font-medium text-sand">
                        {t.contact.days[day]}
                      </dt>
                      <dd className="text-sand/70">
                        {entry?.pickup ?? t.contact.closedLabel}
                      </dd>
                    </div>
                  );
                })}
              </dl>
              <p className="mt-3 text-xs text-sand/60">
                {t.contact.deliveryNote}
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* LOCATION */}
      <section id="location" className="scroll-mt-16 border-t border-navy/10 bg-sand">
        <Reveal className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:items-center md:py-24">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-terracotta">
              {t.location.eyebrow}
            </span>
            <h2 className="mt-2 font-display text-4xl font-semibold text-navy sm:text-5xl">
              {t.location.title}
            </h2>
            <p className="mt-4 max-w-md text-base text-ink/70">
              {t.location.subtitle}
            </p>
            <p className="mt-6 text-ink/70">
              {business.address.street}
              <br />
              {business.address.postalCode} {business.address.city},{" "}
              {t.common.country}
            </p>
            <a
              href={business.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-terracotta hover:text-terracotta-dark"
            >
              {t.contact.directionsCta}
              <span aria-hidden="true">→</span>
            </a>
          </div>
          <MapEmbed className="h-full min-h-[320px]" />
        </Reveal>
      </section>
    </>
  );
}

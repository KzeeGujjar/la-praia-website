"use client";

import { useLanguage } from "@/lib/language-context";
import { ReservationForm } from "@/components/ReservationForm";

export default function ReservationPage() {
  const { t } = useLanguage();

  return (
    <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6 md:py-24">
      <span className="text-xs font-semibold uppercase tracking-widest text-terracotta">
        {t.reservation.eyebrow}
      </span>
      <h1 className="mt-2 font-display text-4xl font-semibold text-navy sm:text-5xl">
        {t.reservation.title}
      </h1>
      <p className="mt-4 text-base text-ink/70">{t.reservation.subtitle}</p>

      <div className="mt-10">
        <ReservationForm />
      </div>
    </section>
  );
}

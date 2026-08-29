"use client";

import { useLanguage } from "@/lib/language-context";
import { business } from "@/data/business";

export function ContactButtons({
  className = "",
  variant = "light",
  compact = false,
}: {
  className?: string;
  variant?: "light" | "dark";
  /** Equal-width buttons on one row, no wrapping — for tight spaces like the mobile action bar. */
  compact?: boolean;
}) {
  const { t, locale } = useLanguage();

  const whatsappMessage =
    locale === "it"
      ? "Ciao! Vorrei prenotare un tavolo da La Praia."
      : "Hi! I'd like to reserve a table at La Praia.";

  const primaryClasses =
    variant === "dark"
      ? "bg-lemon text-navy-dark hover:bg-lemon/90"
      : "bg-terracotta text-sand hover:bg-terracotta-dark";

  const secondaryClasses =
    variant === "dark"
      ? "border border-sand/40 text-sand hover:bg-sand/10"
      : "border border-navy/25 text-navy hover:bg-navy/5";

  const layoutClasses = compact ? "flex gap-2" : "flex flex-wrap gap-3";
  const shapeClasses = compact ? "rounded-full text-xs" : "text-xs uppercase tracking-[0.16em]";
  const buttonClasses = compact ? "flex-1 justify-center px-3 py-2.5" : "px-7 py-3.5";

  return (
    <div className={`${layoutClasses} ${className}`}>
      <a
        href={`tel:${business.phoneE164}`}
        className={`inline-flex items-center gap-2 font-semibold transition-colors ${shapeClasses} ${buttonClasses} ${primaryClasses}`}
      >
        <PhoneIcon className="h-4 w-4 shrink-0" />
        {compact ? t.nav.call : t.contact.callCta}
      </a>
      <a
        href={`https://wa.me/${business.whatsappE164}?text=${encodeURIComponent(whatsappMessage)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 font-semibold transition-colors ${shapeClasses} ${buttonClasses} ${secondaryClasses}`}
      >
        <WhatsAppIcon className="h-4 w-4 shrink-0" />
        {compact ? "WhatsApp" : t.contact.whatsappCta}
      </a>
    </div>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.9 9.9 0 0 0 4.75 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.5 2 12.04 2zm5.8 14.03c-.24.68-1.4 1.3-1.94 1.38-.5.08-1.12.11-1.8-.11-.42-.13-.95-.3-1.64-.6-2.9-1.25-4.79-4.17-4.94-4.36-.14-.2-1.18-1.57-1.18-3s.74-2.13 1-2.42c.26-.29.57-.36.76-.36.19 0 .38 0 .55.01.18.01.42-.07.65.5.24.58.81 2 .88 2.15.07.15.12.32.02.51-.1.2-.15.32-.3.5-.15.18-.31.4-.44.53-.15.15-.3.31-.13.6.17.3.76 1.25 1.63 2.02 1.12 1 2.06 1.31 2.36 1.46.3.15.47.13.65-.08.18-.2.75-.87.95-1.17.2-.3.4-.25.66-.15.27.1 1.7.8 1.99.95.29.15.48.22.55.34.07.13.07.72-.17 1.4z" />
    </svg>
  );
}

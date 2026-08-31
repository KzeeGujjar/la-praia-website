"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { ContactButtons } from "@/components/ContactButtons";

type Status = "idle" | "submitting" | "success" | "error";

export function ReservationForm() {
  const { t, locale } = useLanguage();
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const form = e.currentTarget;
    const data = new FormData(form);
    const dateValue = data.get("requestedFor");
    const requestedFor = typeof dateValue === "string" && dateValue ? new Date(dateValue).toISOString() : "";

    const payload = {
      customerName: String(data.get("customerName") ?? ""),
      customerPhone: String(data.get("customerPhone") ?? ""),
      customerEmail: String(data.get("customerEmail") ?? "") || undefined,
      partySize: Number(data.get("partySize")),
      requestedFor,
      notes: String(data.get("notes") ?? "") || undefined,
      allergies: String(data.get("allergies") ?? "") || undefined,
      language: locale,
    };

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 422) {
        setErrorMessage(t.reservation.errorOutsideHours);
        setStatus("error");
        return;
      }
      if (!res.ok) throw new Error("Request failed");

      const result = await res.json();
      setConfirmationCode(result.confirmationCode ?? "");
      setStatus("success");
      form.reset();
    } catch {
      setErrorMessage(t.reservation.errorGeneric);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="border border-navy/15 bg-white px-6 py-8 text-center">
        <h3 className="font-display text-2xl font-semibold text-navy">{t.reservation.successTitle}</h3>
        <p className="mt-2 text-sm text-ink/70">{t.reservation.successBody}</p>
        {confirmationCode && (
          <div className="mx-auto mt-5 max-w-xs border border-navy/15 bg-sand-dark/40 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-navy/70">
              {t.reservation.confirmationCodeLabel}
            </p>
            <p className="mt-1 font-display text-2xl font-semibold tracking-widest text-terracotta">
              {confirmationCode}
            </p>
            <p className="mt-1 text-xs text-ink/60">{t.reservation.confirmationCodeNote}</p>
          </div>
        )}
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-5 text-sm font-semibold text-terracotta underline underline-offset-2 hover:text-terracotta-dark"
        >
          {t.reservation.newRequestCta}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t.reservation.nameLabel}>
          <input name="customerName" type="text" required maxLength={100} className={inputClasses} />
        </Field>
        <Field label={t.reservation.phoneLabel}>
          <input name="customerPhone" type="tel" required maxLength={20} className={inputClasses} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t.reservation.emailLabel}>
          <input name="customerEmail" type="email" maxLength={200} className={inputClasses} />
        </Field>
        <Field label={t.reservation.partySizeLabel}>
          <input name="partySize" type="number" min={1} max={20} defaultValue={2} required className={inputClasses} />
        </Field>
      </div>

      <Field label={t.reservation.dateLabel}>
        <input name="requestedFor" type="datetime-local" required className={inputClasses} />
      </Field>

      <Field label={t.reservation.allergiesLabel}>
        <input name="allergies" type="text" maxLength={500} className={inputClasses} />
      </Field>

      <Field label={t.reservation.notesLabel}>
        <textarea name="notes" rows={3} maxLength={500} className={inputClasses} />
      </Field>

      <p className="text-xs text-ink/55">{t.reservation.largePartyNote}</p>

      {status === "error" && (
        <p className="border border-terracotta/30 bg-terracotta/10 px-3 py-2 text-sm text-terracotta-dark">
          {errorMessage}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="bg-terracotta px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-sand transition-colors hover:bg-terracotta-dark disabled:opacity-50"
        >
          {status === "submitting" ? t.reservation.submittingLabel : t.reservation.submitLabel}
        </button>
        <ContactButtons />
      </div>
    </form>
  );
}

const inputClasses =
  "w-full border border-navy/20 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-terracotta";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-navy/70">{label}</span>
      {children}
    </label>
  );
}

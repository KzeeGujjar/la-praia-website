"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Reservation } from "@prisma/client";

const STATUSES = ["PENDING", "CONFIRMED", "SEATED", "COMPLETED", "CANCELLED", "NO_SHOW"] as const;

export function ReservationsTable({ reservations }: { reservations: Reservation[] }) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function updateStatus(id: string, status: string) {
    setPendingId(id);
    try {
      const res = await fetch(`/api/admin/reservations/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) router.refresh();
    } finally {
      setPendingId(null);
    }
  }

  if (reservations.length === 0) {
    return <p className="border border-navy/10 bg-white px-5 py-8 text-center text-sm text-ink/60">No reservations found.</p>;
  }

  return (
    <div className="overflow-x-auto border border-navy/10 bg-white">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-b border-navy/10 bg-sand-dark/30 text-xs font-semibold uppercase tracking-wide text-navy/70">
          <tr>
            <th className="px-4 py-3">When</th>
            <th className="px-4 py-3">Guest</th>
            <th className="px-4 py-3">Party</th>
            <th className="px-4 py-3">Contact</th>
            <th className="px-4 py-3">Notes</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-navy/5">
          {reservations.map((r) => (
            <tr key={r.id}>
              <td className="whitespace-nowrap px-4 py-3 text-ink/80">
                {new Date(r.requestedFor).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}
              </td>
              <td className="px-4 py-3 font-medium text-navy">{r.customerName}</td>
              <td className="px-4 py-3 text-ink/80">{r.partySize}</td>
              <td className="px-4 py-3 text-ink/70">
                <div>{r.customerPhone}</div>
                {r.customerEmail && <div className="text-xs text-ink/50">{r.customerEmail}</div>}
              </td>
              <td className="max-w-[220px] px-4 py-3 text-xs text-ink/60">
                {r.allergies && <div>⚠ {r.allergies}</div>}
                {r.notes && <div>{r.notes}</div>}
              </td>
              <td className="px-4 py-3">
                <select
                  value={r.status}
                  disabled={pendingId === r.id}
                  onChange={(e) => updateStatus(r.id, e.target.value)}
                  className="border border-navy/20 bg-white px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-navy outline-none focus:border-terracotta disabled:opacity-50"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

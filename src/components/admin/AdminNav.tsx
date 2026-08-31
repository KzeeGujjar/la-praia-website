"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { SessionUser } from "@/lib/auth/session";

const REFRESH_INTERVAL_MS = 10 * 60 * 1000;

export function AdminNav({ user }: { user: SessionUser }) {
  const pathname = usePathname();
  const router = useRouter();
  const canEditMenu = user.role === "MANAGER" || user.role === "SUPER_ADMIN";

  // The access-token cookie expires after 15 min (src/lib/auth/tokens.ts); without
  // this, staff would get bounced to /login mid-shift just from being idle-ish.
  useEffect(() => {
    const id = setInterval(() => {
      fetch("/api/auth/refresh", { method: "POST" }).catch(() => {});
    }, REFRESH_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const links = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/reservations", label: "Reservations" },
    ...(canEditMenu ? [{ href: "/admin/menu", label: "Menu" }] : []),
  ];

  return (
    <header className="border-b border-navy/10 bg-navy text-sand">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-8">
          <span className="font-display text-lg font-semibold">La Praia Admin</span>
          <nav className="flex items-center gap-5" aria-label="Admin">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-lemon ${
                  pathname === link.href ? "text-lemon" : "text-sand/80"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-sand/60">
            {user.firstName} · {user.role.replace("_", " ").toLowerCase()}
          </span>
          <button
            type="button"
            onClick={handleLogout}
            className="border border-sand/30 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-sand hover:bg-sand/10"
          >
            Log Out
          </button>
        </div>
      </div>
    </header>
  );
}

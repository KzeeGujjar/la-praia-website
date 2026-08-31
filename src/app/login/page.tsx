"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STAFF_ROLES = ["STAFF", "MANAGER", "SUPER_ADMIN"];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        setError(res.status === 401 ? "Invalid email or password." : "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      const user = await res.json();
      router.push(STAFF_ROLES.includes(user.role) ? "/admin" : "/");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-sand px-4">
      <div className="w-full max-w-sm border border-navy/15 bg-white p-8">
        <h1 className="font-display text-2xl font-semibold text-navy">La Praia — Sign In</h1>
        <p className="mt-1 text-sm text-ink/60">Staff and admin access.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-navy/70">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-navy/20 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-terracotta"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-navy/70">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-navy/20 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-terracotta"
            />
          </label>

          {error && (
            <p className="border border-terracotta/30 bg-terracotta/10 px-3 py-2 text-sm text-terracotta-dark">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-terracotta px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-sand transition-colors hover:bg-terracotta-dark disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

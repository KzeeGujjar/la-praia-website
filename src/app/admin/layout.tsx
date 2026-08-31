import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/session";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole("STAFF", "MANAGER", "SUPER_ADMIN");
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-sand-dark/30">
      <AdminNav user={user} />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}

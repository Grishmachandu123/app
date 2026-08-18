import type { Metadata } from "next";
import { redirect } from "next/navigation";

import AdminNav from "@/components/admin/AdminNav";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return (
      <div className="container-page py-16">
        <div className="card mx-auto max-w-lg p-8">
          <h1 className="text-2xl">Supabase is not configured</h1>
          <p className="mt-3 text-sm text-ink-700">
            Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, run
            <code className="mx-1 rounded bg-cream-200 px-1">supabase/schema.sql</code>
            in the Supabase SQL editor, then reload.
          </p>
        </div>
      </div>
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-cream-100">
      <AdminNav email={user.email ?? ""} />
      <main className="container-page py-8">{children}</main>
    </div>
  );
}

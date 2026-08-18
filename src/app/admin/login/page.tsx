import type { Metadata } from "next";
import { Suspense } from "react";

import LoginForm from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-100 px-4 py-12">
      <div className="card w-full max-w-md p-8">
        <p className="eyebrow">Boutique Admin</p>
        <h1 className="mt-3 text-3xl">Sign in</h1>
        <p className="mt-2 text-sm text-ink-700">
          Only the business owner can access the dashboard.
        </p>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}

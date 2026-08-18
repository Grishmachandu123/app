"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { createClient } from "@/lib/supabase/client";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/settings", label: "Site Settings" },
];

export default function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function signOut() {
    setSigningOut(true);
    try {
      await createClient().auth.signOut();
      router.push("/admin/login");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <header className="border-b border-cream-300 bg-white">
      <div className="container-page flex flex-wrap items-center justify-between gap-3 py-4">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="font-serif text-xl">
            Boutique Admin
          </Link>
          <nav className="flex gap-4 text-sm" aria-label="Admin">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={
                  (link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href))
                    ? "text-gold-500"
                    : "text-ink-700 hover:text-gold-500"
                }
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <Link href="/" target="_blank" className="text-ink-700 hover:text-gold-500">
            View site ↗
          </Link>
          <span className="hidden text-ink-700 sm:inline">{email}</span>
          <button
            type="button"
            onClick={signOut}
            disabled={signingOut}
            className="btn-outline px-4 py-2 text-xs"
          >
            {signingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>
      </div>
    </header>
  );
}

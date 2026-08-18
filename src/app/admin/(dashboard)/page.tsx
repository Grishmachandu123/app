import Link from "next/link";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function counts() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { total: 0, sarees: 0, jewellery: 0, available: 0, soldOut: 0, newArrivals: 0 };
  }

  const baseQuery = () =>
    supabase.from("products").select("id, category:categories!inner(slug)", {
      count: "exact",
      head: true,
    });

  const [total, sarees, jewellery, available, soldOut, newArrivals] = await Promise.all([
    baseQuery(),
    baseQuery().eq("category.slug", "sarees"),
    baseQuery().eq("category.slug", "one-gram-gold"),
    baseQuery().eq("availability", "available"),
    baseQuery().eq("availability", "sold_out"),
    baseQuery().eq("new_arrival", true),
  ]).then((results) => results.map((result) => result.count ?? 0));

  return { total, sarees, jewellery, available, soldOut, newArrivals };
}

export default async function AdminDashboardPage() {
  const stats = await counts();

  const cards = [
    { label: "Total Products", value: stats.total },
    { label: "Sarees", value: stats.sarees },
    { label: "One-Gram Jewellery", value: stats.jewellery },
    { label: "Available Products", value: stats.available },
    { label: "Sold Out Products", value: stats.soldOut },
    { label: "New Arrivals", value: stats.newArrivals },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Overview</p>
          <h1 className="mt-2 text-3xl">Dashboard</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/products/new?category=sarees" className="btn-primary">
            + Add Saree
          </Link>
          <Link href="/admin/products/new?category=one-gram-gold" className="btn-gold">
            + Add Jewellery
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="card p-6">
            <p className="text-sm text-ink-700">{card.label}</p>
            <p className="mt-2 font-serif text-4xl text-ink-900">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="card mt-8 p-6">
        <h2 className="text-xl">Quick links</h2>
        <ul className="mt-4 space-y-2 text-sm">
          <li>
            <Link href="/admin/products" className="text-gold-500 hover:text-gold-600">
              Manage all products →
            </Link>
          </li>
          <li>
            <Link href="/admin/settings" className="text-gold-500 hover:text-gold-600">
              Update WhatsApp number and site details →
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

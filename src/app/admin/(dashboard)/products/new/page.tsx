import Link from "next/link";

import ProductForm from "@/components/admin/ProductForm";
import { getCategories } from "@/lib/queries";
import type { CategorySlug } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function NewProductPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const requested = Array.isArray(params.category) ? params.category[0] : params.category;
  const defaultCategorySlug: CategorySlug = requested === "one-gram-gold" ? "one-gram-gold" : "sarees";

  const categories = await getCategories();

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/products" className="text-sm text-gold-500 hover:text-gold-600">
          ← Back to products
        </Link>
        <h1 className="mt-2 text-3xl">Add product</h1>
      </div>

      {categories.length === 0 ? (
        <div className="card p-6 text-sm text-ink-700">
          No categories found. Run <code>supabase/schema.sql</code> in the Supabase SQL editor first.
        </div>
      ) : (
        <ProductForm categories={categories} defaultCategorySlug={defaultCategorySlug} />
      )}
    </div>
  );
}

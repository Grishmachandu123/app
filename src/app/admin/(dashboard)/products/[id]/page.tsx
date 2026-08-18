import Link from "next/link";
import { notFound } from "next/navigation";

import ProductForm from "@/components/admin/ProductForm";
import RelatedProductsManager from "@/components/admin/RelatedProductsManager";
import { getCategories } from "@/lib/queries";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ProductWithRelations } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  if (!supabase) notFound();

  const [{ data }, categories] = await Promise.all([
    supabase
      .from("products")
      .select("*, category:categories(id, slug, name), images:product_images(*)")
      .eq("id", id)
      .maybeSingle(),
    getCategories(),
  ]);

  const product = data as ProductWithRelations | null;
  if (!product) notFound();

  product.images = [...(product.images ?? [])].sort(
    (a, b) => Number(b.is_primary) - Number(a.is_primary) || a.display_order - b.display_order,
  );

  const [{ data: relationships }, { data: candidates }] = await Promise.all([
    supabase
      .from("product_relationships")
      .select("id, product_id, related_product_id")
      .or(`product_id.eq.${id},related_product_id.eq.${id}`),
    supabase
      .from("products")
      .select("id, name, product_code, category:categories(slug, name)")
      .neq("id", id)
      .order("created_at", { ascending: false })
      .limit(200),
  ]);

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/products" className="text-sm text-gold-500 hover:text-gold-600">
          ← Back to products
        </Link>
        <h1 className="mt-2 text-3xl">Edit {product.name}</h1>
      </div>

      <ProductForm categories={categories} product={product} />

      <div className="mt-8">
        <RelatedProductsManager
          productId={product.id}
          relationships={
            (relationships as { id: string; product_id: string; related_product_id: string }[] | null) ??
            []
          }
          candidates={
            (candidates as {
              id: string;
              name: string;
              product_code: string;
              category: { slug: string; name: string } | null;
            }[] | null) ?? []
          }
        />
      </div>
    </div>
  );
}

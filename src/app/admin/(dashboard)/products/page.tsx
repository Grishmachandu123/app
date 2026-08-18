import Image from "next/image";
import Link from "next/link";

import ProductRowActions from "@/components/admin/ProductRowActions";
import { formatPrice } from "@/lib/format";
import { productPath } from "@/lib/product-url";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ProductWithRelations } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const query = (Array.isArray(params.q) ? params.q[0] : params.q)?.trim() ?? "";

  const supabase = await createSupabaseServerClient();
  let products: ProductWithRelations[] = [];

  if (supabase) {
    let request = supabase
      .from("products")
      .select("*, category:categories(id, slug, name), images:product_images(*)")
      .order("created_at", { ascending: false })
      .limit(200);

    if (query) {
      const like = `%${query.replace(/[%,()]/g, " ")}%`;
      request = request.or(`name.ilike.${like},product_code.ilike.${like}`);
    }

    const { data } = await request;
    products = (data as ProductWithRelations[] | null) ?? [];
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Catalogue</p>
          <h1 className="mt-2 text-3xl">Products</h1>
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

      <form className="mt-6 flex max-w-md gap-2" action="/admin/products">
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Search by name or product ID"
          className="input"
        />
        <button type="submit" className="btn-outline px-5 py-2 text-xs">
          Search
        </button>
      </form>

      <div className="card mt-6 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-cream-300 text-xs uppercase tracking-wide text-ink-700">
            <tr>
              <th className="p-4">Product</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-ink-700">
                  No products yet. Use “Add Saree” or “Add Jewellery” to publish your first product.
                </td>
              </tr>
            )}

            {products.map((product) => {
              const image = [...(product.images ?? [])].sort(
                (a, b) => Number(b.is_primary) - Number(a.is_primary) || a.display_order - b.display_order,
              )[0];

              return (
                <tr key={product.id} className="border-b border-cream-200 last:border-b-0">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded bg-cream-200">
                        {image && (
                          <Image
                            src={image.image_url}
                            alt={product.name}
                            fill
                            sizes="60px"
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-ink-900">{product.name}</p>
                        <p className="text-xs text-ink-700">{product.product_code}</p>
                        <Link
                          href={productPath(product)}
                          target="_blank"
                          className="text-xs text-gold-500 hover:text-gold-600"
                        >
                          View on site ↗
                        </Link>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-ink-700">
                    {product.category?.name}
                    {product.subcategory && (
                      <span className="block text-xs text-ink-700/70">{product.subcategory}</span>
                    )}
                  </td>
                  <td className="p-4">{formatPrice(Number(product.price))}</td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] ${
                          product.availability === "sold_out"
                            ? "bg-maroon-600/10 text-maroon-700"
                            : "bg-green-600/10 text-green-700"
                        }`}
                      >
                        {product.availability === "sold_out" ? "Sold out" : "Available"}
                      </span>
                      {product.featured && (
                        <span className="rounded-full bg-gold-100 px-2 py-0.5 text-[11px] text-gold-600">
                          Featured
                        </span>
                      )}
                      {product.new_arrival && (
                        <span className="rounded-full bg-cream-200 px-2 py-0.5 text-[11px] text-ink-700">
                          New
                        </span>
                      )}
                      {!product.published && (
                        <span className="rounded-full bg-ink-900/10 px-2 py-0.5 text-[11px] text-ink-800">
                          Hidden
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <ProductRowActions
                      productId={product.id}
                      availability={product.availability}
                      featured={product.featured}
                      newArrival={product.new_arrival}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import type { Metadata } from "next";

import Pagination from "@/components/product/Pagination";
import ProductGrid from "@/components/product/ProductGrid";
import { PRODUCTS_PER_PAGE } from "@/lib/constants";
import { getProducts, getSiteSettings } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "New Arrivals",
  description: "The latest sarees and one-gram gold jewellery added to our boutique.",
  alternates: { canonical: "/new-arrivals" },
};

export default async function NewArrivalsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const rawPage = Array.isArray(params.page) ? params.page[0] : params.page;
  const page = Math.max(1, Number(rawPage) || 1);

  const [settings, { products, total }] = await Promise.all([
    getSiteSettings(),
    getProducts({ newArrival: true, page, perPage: PRODUCTS_PER_PAGE }),
  ]);

  return (
    <div className="container-page py-10 lg:py-14">
      <header className="max-w-2xl">
        <p className="eyebrow">Just In</p>
        <h1 className="mt-3 text-4xl sm:text-5xl">New Arrivals</h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-700">
          Freshly added sarees and one-gram gold jewellery from both collections.
        </p>
      </header>

      <div className="mt-10">
        <ProductGrid
          products={products}
          whatsappNumber={settings.whatsapp_number}
          emptyMessage="No new arrivals just yet. Please check back soon."
        />
        <Pagination
          currentPage={page}
          totalPages={Math.max(1, Math.ceil(total / PRODUCTS_PER_PAGE))}
          basePath="/new-arrivals"
          searchParams={params}
        />
      </div>
    </div>
  );
}

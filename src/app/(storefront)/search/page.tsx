import type { Metadata } from "next";

import Pagination from "@/components/product/Pagination";
import ProductGrid from "@/components/product/ProductGrid";
import SearchBar from "@/components/site/SearchBar";
import { PRODUCTS_PER_PAGE } from "@/lib/constants";
import { getProducts, getSiteSettings } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Search",
  description: "Search sarees and one-gram gold jewellery by name, product ID, colour or design.",
  robots: { index: false, follow: true },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const query = (Array.isArray(params.q) ? params.q[0] : params.q)?.trim() ?? "";
  const rawPage = Array.isArray(params.page) ? params.page[0] : params.page;
  const page = Math.max(1, Number(rawPage) || 1);

  const settings = await getSiteSettings();
  const { products, total } = query
    ? await getProducts({ search: query, page, perPage: PRODUCTS_PER_PAGE })
    : { products: [], total: 0 };

  return (
    <div className="container-page py-10 lg:py-14">
      <header className="max-w-2xl">
        <p className="eyebrow">Search</p>
        <h1 className="mt-3 text-4xl sm:text-5xl">Find Your Piece</h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-700">
          Search across sarees and one-gram gold jewellery by name, product ID, colour, design or type.
        </p>
        <div className="mt-6">
          <SearchBar initialValue={query} />
        </div>
      </header>

      <div className="mt-10">
        {query ? (
          <>
            <p className="mb-5 text-sm text-ink-700">
              {total} {total === 1 ? "result" : "results"} for &ldquo;{query}&rdquo;
            </p>
            <ProductGrid
              products={products}
              whatsappNumber={settings.whatsapp_number}
              emptyMessage={`No products matched "${query}". Try another word or browse our collections.`}
            />
            <Pagination
              currentPage={page}
              totalPages={Math.max(1, Math.ceil(total / PRODUCTS_PER_PAGE))}
              basePath="/search"
              searchParams={params}
            />
          </>
        ) : (
          <div className="card p-10 text-center text-sm text-ink-700">
            Type a product name, product ID, colour or design to begin.
          </div>
        )}
      </div>
    </div>
  );
}

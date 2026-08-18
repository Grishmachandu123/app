import Pagination from "@/components/product/Pagination";
import ProductFilters from "@/components/product/ProductFilters";
import ProductGrid from "@/components/product/ProductGrid";
import SubcategoryTabs from "@/components/product/SubcategoryTabs";
import SearchBar from "@/components/site/SearchBar";
import { PRODUCTS_PER_PAGE } from "@/lib/constants";
import { getFacets, getProducts, getSiteSettings } from "@/lib/queries";
import type { CategorySlug, ProductFilters as Filters } from "@/lib/types";

export type SearchParams = Record<string, string | string[] | undefined>;

function single(value: string | string[] | undefined): string | undefined {
  if (value === undefined) return undefined;
  const first = Array.isArray(value) ? value[0] : value;
  return first?.trim() ? first : undefined;
}

function numeric(value: string | string[] | undefined): number | undefined {
  const raw = single(value);
  if (raw === undefined) return undefined;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export default async function CategoryListing({
  category,
  title,
  intro,
  subcategories,
  allLabel,
  searchParams,
}: {
  category: CategorySlug;
  title: string;
  intro: string;
  subcategories: readonly string[];
  allLabel: string;
  searchParams: SearchParams;
}) {
  const basePath = category === "sarees" ? "/sarees" : "/one-gram-gold";
  const page = Math.max(1, numeric(searchParams.page) ?? 1);

  const sortParam = single(searchParams.sort);
  const filters: Filters = {
    category,
    subcategory: single(searchParams.subcategory),
    colour: single(searchParams.colour),
    fabric: single(searchParams.fabric),
    sareeType: single(searchParams.sareeType),
    jewelleryType: single(searchParams.jewelleryType),
    design: single(searchParams.design),
    availability: single(searchParams.availability) === "sold_out" ? "sold_out" : single(searchParams.availability) === "available" ? "available" : undefined,
    minPrice: numeric(searchParams.minPrice),
    maxPrice: numeric(searchParams.maxPrice),
    newArrival: single(searchParams.newArrival) === "1" ? true : undefined,
    search: single(searchParams.q),
    sort:
      sortParam === "price_asc" || sortParam === "price_desc" || sortParam === "name_asc"
        ? sortParam
        : "newest",
    page,
    perPage: PRODUCTS_PER_PAGE,
  };

  const [settings, { products, total }, facets] = await Promise.all([
    getSiteSettings(),
    getProducts(filters),
    getFacets(category),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PRODUCTS_PER_PAGE));

  return (
    <div className="container-page py-10 lg:py-14">
      <header className="max-w-2xl">
        <p className="eyebrow">{allLabel}</p>
        <h1 className="mt-3 text-4xl sm:text-5xl">{title}</h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-700">{intro}</p>
      </header>

      <div className="mt-8 max-w-xl">
        <SearchBar initialValue={single(searchParams.q) ?? ""} />
      </div>

      <div className="mt-8">
        <SubcategoryTabs
          basePath={basePath}
          allLabel={allLabel}
          subcategories={subcategories}
          activeSubcategory={single(searchParams.subcategory)}
          newArrivalsActive={single(searchParams.newArrival) === "1"}
        />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
        <ProductFilters category={category} facets={facets} />

        <div>
          <p className="mb-4 text-sm text-ink-700">
            {total} {total === 1 ? "product" : "products"}
          </p>
          <ProductGrid products={products} whatsappNumber={settings.whatsapp_number} />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            basePath={basePath}
            searchParams={searchParams}
          />
        </div>
      </div>
    </div>
  );
}

import "server-only";

import { PRODUCTS_PER_PAGE } from "./constants";
import { createSupabaseServerClient } from "./supabase/server";
import type {
  Category,
  CategorySlug,
  ProductFilters,
  ProductWithRelations,
  SiteSettings,
} from "./types";

const PRODUCT_COLUMNS = "*, category:categories!inner(id, slug, name), images:product_images(*)";

export const FALLBACK_SETTINGS: SiteSettings = {
  id: "fallback",
  business_name: "Vyshnavi Sarees Center",
  whatsapp_number: "919052736066",
  instagram_url: null,
  contact_information: "Call or WhatsApp us any day between 10 AM and 8 PM.",
  about_text:
    "We are a small family run boutique bringing you handpicked sarees and one-gram gold jewellery at honest prices.",
  logo_url: null,
};

function sortImages(product: ProductWithRelations): ProductWithRelations {
  const images = [...(product.images ?? [])].sort((a, b) => {
    if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;
    return a.display_order - b.display_order;
  });
  return { ...product, images };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return FALLBACK_SETTINGS;

  const { data } = await supabase.from("site_settings").select("*").limit(1).maybeSingle();
  return (data as SiteSettings | null) ?? FALLBACK_SETTINGS;
}

export async function getCategories(): Promise<Category[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];

  const { data } = await supabase.from("categories").select("*").order("display_order");
  return (data as Category[] | null) ?? [];
}

export async function getProducts(
  filters: ProductFilters = {},
): Promise<{ products: ProductWithRelations[]; total: number }> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { products: [], total: 0 };

  const perPage = filters.perPage ?? PRODUCTS_PER_PAGE;
  const page = Math.max(1, filters.page ?? 1);
  const from = (page - 1) * perPage;

  let query = supabase.from("products").select(PRODUCT_COLUMNS, { count: "exact" }).eq("published", true);

  if (filters.category) query = query.eq("category.slug", filters.category);
  if (filters.subcategory) query = query.eq("subcategory", filters.subcategory);
  if (filters.colour) query = query.eq("colour", filters.colour);
  if (filters.fabric) query = query.eq("fabric", filters.fabric);
  if (filters.sareeType) query = query.eq("saree_type", filters.sareeType);
  if (filters.jewelleryType) query = query.eq("jewellery_type", filters.jewelleryType);
  if (filters.design) query = query.eq("design", filters.design);
  if (filters.availability) query = query.eq("availability", filters.availability);
  if (filters.featured) query = query.eq("featured", true);
  if (filters.newArrival) query = query.eq("new_arrival", true);
  if (typeof filters.minPrice === "number") query = query.gte("price", filters.minPrice);
  if (typeof filters.maxPrice === "number") query = query.lte("price", filters.maxPrice);

  if (filters.search) {
    const term = filters.search.replace(/[%,()]/g, " ").trim();
    if (term) {
      const like = `%${term}%`;
      query = query.or(
        [
          `name.ilike.${like}`,
          `product_code.ilike.${like}`,
          `description.ilike.${like}`,
          `colour.ilike.${like}`,
          `design.ilike.${like}`,
          `product_type.ilike.${like}`,
          `subcategory.ilike.${like}`,
          `fabric.ilike.${like}`,
          `saree_type.ilike.${like}`,
          `jewellery_type.ilike.${like}`,
          `occasion.ilike.${like}`,
        ].join(","),
      );
    }
  }

  switch (filters.sort) {
    case "price_asc":
      query = query.order("price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false });
      break;
    case "name_asc":
      query = query.order("name", { ascending: true });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  const { data, count, error } = await query.range(from, from + perPage - 1);
  if (error) {
    console.error("getProducts failed", error.message);
    return { products: [], total: 0 };
  }

  const products = ((data as ProductWithRelations[] | null) ?? []).map(sortImages);
  return { products, total: count ?? products.length };
}

export async function getProductBySlug(
  categorySlug: CategorySlug,
  slug: string,
): Promise<ProductWithRelations | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const { data } = await supabase
    .from("products")
    .select("*, category:categories!inner(id, slug, name), images:product_images(*)")
    .eq("published", true)
    .eq("slug", slug)
    .eq("category.slug", categorySlug)
    .maybeSingle();

  const product = data as ProductWithRelations | null;
  return product ? sortImages(product) : null;
}

export async function getRelatedProducts(productId: string): Promise<ProductWithRelations[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("product_relationships")
    .select("related_product_id, product_id")
    .or(`product_id.eq.${productId},related_product_id.eq.${productId}`);

  const ids = ((data as { related_product_id: string; product_id: string }[] | null) ?? [])
    .map((row) => (row.product_id === productId ? row.related_product_id : row.product_id))
    .filter((id) => id !== productId);

  if (ids.length === 0) return [];

  const { data: products } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .in("id", Array.from(new Set(ids)))
    .eq("published", true);

  return ((products as ProductWithRelations[] | null) ?? []).map(sortImages);
}

export interface LookPairing {
  saree: ProductWithRelations;
  jewellery: ProductWithRelations;
}

/** Saree + jewellery pairs used by the "Shop the Look" homepage section. */
export async function getShopTheLook(limit = 2): Promise<LookPairing[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];

  const { data: links } = await supabase
    .from("product_relationships")
    .select("product_id, related_product_id")
    .order("created_at", { ascending: false })
    .limit(30);

  const rows = (links as { product_id: string; related_product_id: string }[] | null) ?? [];
  if (rows.length === 0) return [];

  const ids = Array.from(new Set(rows.flatMap((r) => [r.product_id, r.related_product_id])));
  const { data: products } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .in("id", ids)
    .eq("published", true);

  const byId = new Map<string, ProductWithRelations>();
  ((products as ProductWithRelations[] | null) ?? []).forEach((p) => byId.set(p.id, sortImages(p)));

  const pairs: LookPairing[] = [];
  const used = new Set<string>();

  for (const row of rows) {
    const a = byId.get(row.product_id);
    const b = byId.get(row.related_product_id);
    if (!a || !b) continue;
    const saree = a.category?.slug === "sarees" ? a : b.category?.slug === "sarees" ? b : null;
    const jewellery =
      a.category?.slug === "one-gram-gold" ? a : b.category?.slug === "one-gram-gold" ? b : null;
    if (!saree || !jewellery) continue;
    const key = `${saree.id}:${jewellery.id}`;
    if (used.has(key)) continue;
    used.add(key);
    pairs.push({ saree, jewellery });
    if (pairs.length >= limit) break;
  }

  return pairs;
}

export interface FacetValues {
  colours: string[];
  fabrics: string[];
  sareeTypes: string[];
  jewelleryTypes: string[];
  designs: string[];
  subcategories: string[];
  maxPrice: number;
}

export async function getFacets(category: CategorySlug): Promise<FacetValues> {
  const empty: FacetValues = {
    colours: [],
    fabrics: [],
    sareeTypes: [],
    jewelleryTypes: [],
    designs: [],
    subcategories: [],
    maxPrice: 0,
  };

  const supabase = await createSupabaseServerClient();
  if (!supabase) return empty;

  const { data } = await supabase
    .from("products")
    .select(
      "colour, fabric, saree_type, jewellery_type, design, subcategory, price, category:categories!inner(slug)",
    )
    .eq("published", true)
    .eq("category.slug", category);

  type FacetRow = {
    colour: string | null;
    fabric: string | null;
    saree_type: string | null;
    jewellery_type: string | null;
    design: string | null;
    subcategory: string | null;
    price: number;
  };

  const rows = (data as FacetRow[] | null) ?? [];
  const uniq = (values: (string | null)[]) =>
    Array.from(new Set(values.filter((v): v is string => Boolean(v && v.trim())))).sort();

  return {
    colours: uniq(rows.map((r) => r.colour)),
    fabrics: uniq(rows.map((r) => r.fabric)),
    sareeTypes: uniq(rows.map((r) => r.saree_type)),
    jewelleryTypes: uniq(rows.map((r) => r.jewellery_type)),
    designs: uniq(rows.map((r) => r.design)),
    subcategories: uniq(rows.map((r) => r.subcategory)),
    maxPrice: rows.reduce((max, r) => Math.max(max, Number(r.price) || 0), 0),
  };
}

export interface SitemapProduct {
  slug: string;
  updated_at: string;
  category: { slug: CategorySlug } | null;
}

export async function getAllProductsForSitemap(): Promise<SitemapProduct[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("products")
    .select("slug, updated_at, category:categories(slug)")
    .eq("published", true);

  return (data as SitemapProduct[] | null) ?? [];
}

import type { ProductWithRelations } from "./types";

export function productPath(product: Pick<ProductWithRelations, "slug" | "category">): string {
  const categorySlug = product.category?.slug ?? "sarees";
  return `/${categorySlug}/${product.slug}`;
}

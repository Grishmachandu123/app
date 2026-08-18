import type { MetadataRoute } from "next";

import { getAllProductsForSitemap } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const staticRoutes = ["", "/sarees", "/one-gram-gold", "/new-arrivals", "/about", "/contact"].map(
    (path) => ({
      url: `${siteUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    }),
  );

  const products = await getAllProductsForSitemap();
  const productRoutes = products
    .filter((product) => product.category?.slug)
    .map((product) => ({
      url: `${siteUrl}/${product.category!.slug}/${product.slug}`,
      lastModified: new Date(product.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  return [...staticRoutes, ...productRoutes];
}

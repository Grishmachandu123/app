import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProductDetail from "@/components/product/ProductDetail";
import { getProductBySlug } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug("sarees", slug);
  if (!product) return { title: "Saree not found" };

  return {
    title: product.name,
    description:
      product.description?.slice(0, 160) ??
      `${product.name} (${product.product_code}) — order this saree on WhatsApp.`,
    alternates: { canonical: `/sarees/${product.slug}` },
    openGraph: {
      title: product.name,
      images: product.images[0]?.image_url ? [product.images[0].image_url] : undefined,
    },
  };
}

export default async function SareeDetailPage({ params }: Params) {
  const { slug } = await params;
  const product = await getProductBySlug("sarees", slug);
  if (!product) notFound();

  return <ProductDetail product={product} />;
}

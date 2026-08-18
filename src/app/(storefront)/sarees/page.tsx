import type { Metadata } from "next";

import CategoryListing, { type SearchParams } from "@/components/product/CategoryListing";
import { SAREE_SUBCATEGORIES } from "@/lib/constants";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sarees",
  description:
    "Browse pattu, silk, cotton, designer and party wear sarees. Order easily on WhatsApp with no online payment.",
  alternates: { canonical: "/sarees" },
};

export default async function SareesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  return (
    <CategoryListing
      category="sarees"
      title="Sarees for Every Occasion"
      intro="Pattu, silk, cotton and designer sarees — handpicked weaves, honest prices and personal help on WhatsApp."
      subcategories={SAREE_SUBCATEGORIES}
      allLabel="All Sarees"
      searchParams={params}
    />
  );
}

import type { Metadata } from "next";

import CategoryListing, { type SearchParams } from "@/components/product/CategoryListing";
import { JEWELLERY_SUBCATEGORIES } from "@/lib/constants";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "One-Gram Gold Jewellery",
  description:
    "Necklace sets, haram, vaddanam, bangles, chains, rings and earrings in one-gram gold. Order on WhatsApp.",
  alternates: { canonical: "/one-gram-gold" },
};

export default async function OneGramGoldPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  return (
    <CategoryListing
      category="one-gram-gold"
      title="One-Gram Gold Jewellery"
      intro="Temple-inspired necklace sets, haram, vaddanam, bangles and earrings with a rich, long-lasting finish."
      subcategories={JEWELLERY_SUBCATEGORIES}
      allLabel="All Jewellery"
      searchParams={params}
    />
  );
}

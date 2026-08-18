import Link from "next/link";

export default function SubcategoryTabs({
  basePath,
  allLabel,
  subcategories,
  activeSubcategory,
  newArrivalsActive,
}: {
  basePath: string;
  allLabel: string;
  subcategories: readonly string[];
  activeSubcategory?: string;
  newArrivalsActive?: boolean;
}) {
  const tabClass = (active: boolean) =>
    `whitespace-nowrap rounded-full border px-4 py-2 text-sm transition-colors ${
      active
        ? "border-gold-400 bg-gold-400 text-white"
        : "border-cream-300 bg-white text-ink-800 hover:border-gold-300"
    }`;

  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
      <div className="flex gap-2">
        <Link href={basePath} className={tabClass(!activeSubcategory && !newArrivalsActive)}>
          {allLabel}
        </Link>
        {subcategories.map((subcategory) => (
          <Link
            key={subcategory}
            href={`${basePath}?subcategory=${encodeURIComponent(subcategory)}`}
            className={tabClass(activeSubcategory === subcategory)}
          >
            {subcategory}
          </Link>
        ))}
        <Link href={`${basePath}?newArrival=1`} className={tabClass(Boolean(newArrivalsActive))}>
          New Arrivals
        </Link>
      </div>
    </div>
  );
}

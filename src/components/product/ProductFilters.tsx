"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import type { FacetValues } from "@/lib/queries";
import type { CategorySlug } from "@/lib/types";

interface FilterConfig {
  key: string;
  label: string;
  options: string[];
}

export default function ProductFilters({
  category,
  facets,
}: {
  category: CategorySlug;
  facets: FacetValues;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const groups: FilterConfig[] =
    category === "sarees"
      ? [
          { key: "colour", label: "Colour", options: facets.colours },
          { key: "fabric", label: "Fabric", options: facets.fabrics },
          { key: "sareeType", label: "Saree Type", options: facets.sareeTypes },
        ]
      : [
          { key: "jewelleryType", label: "Jewellery Type", options: facets.jewelleryTypes },
          { key: "design", label: "Design", options: facets.designs },
          { key: "colour", label: "Colour", options: facets.colours },
        ];

  const activeCount = ["colour", "fabric", "sareeType", "jewelleryType", "design", "availability", "minPrice", "maxPrice"].filter(
    (key) => searchParams.get(key),
  ).length;

  const clearAll = () => {
    const params = new URLSearchParams();
    const subcategory = searchParams.get("subcategory");
    if (subcategory) params.set("subcategory", subcategory);
    router.push(params.toString() ? `${pathname}?${params.toString()}` : pathname, { scroll: false });
  };

  const body = (
    <div className="space-y-6">
      {groups
        .filter((group) => group.options.length > 0)
        .map((group) => (
          <div key={group.key}>
            <label className="label" htmlFor={`filter-${group.key}`}>
              {group.label}
            </label>
            <select
              id={`filter-${group.key}`}
              className="input"
              value={searchParams.get(group.key) ?? ""}
              onChange={(event) => setParam(group.key, event.target.value)}
            >
              <option value="">All</option>
              {group.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        ))}

      <div>
        <span className="label">Price (₹)</span>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            inputMode="numeric"
            placeholder="Min"
            aria-label="Minimum price"
            className="input"
            defaultValue={searchParams.get("minPrice") ?? ""}
            onBlur={(event) => setParam("minPrice", event.target.value)}
          />
          <span className="text-ink-700">–</span>
          <input
            type="number"
            min={0}
            inputMode="numeric"
            placeholder={facets.maxPrice ? String(Math.ceil(facets.maxPrice)) : "Max"}
            aria-label="Maximum price"
            className="input"
            defaultValue={searchParams.get("maxPrice") ?? ""}
            onBlur={(event) => setParam("maxPrice", event.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="filter-availability">
          Availability
        </label>
        <select
          id="filter-availability"
          className="input"
          value={searchParams.get("availability") ?? ""}
          onChange={(event) => setParam("availability", event.target.value)}
        >
          <option value="">All</option>
          <option value="available">Available</option>
          <option value="sold_out">Sold out</option>
        </select>
      </div>

      <div>
        <label className="label" htmlFor="filter-sort">
          Sort by
        </label>
        <select
          id="filter-sort"
          className="input"
          value={searchParams.get("sort") ?? "newest"}
          onChange={(event) => setParam("sort", event.target.value === "newest" ? "" : event.target.value)}
        >
          <option value="newest">Newest first</option>
          <option value="price_asc">Price: low to high</option>
          <option value="price_desc">Price: high to low</option>
          <option value="name_asc">Name: A to Z</option>
        </select>
      </div>

      {activeCount > 0 && (
        <button type="button" onClick={clearAll} className="btn-outline w-full py-2 text-xs">
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <>
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="btn-outline w-full py-3"
        >
          {open ? "Hide filters" : `Filters${activeCount ? ` (${activeCount})` : ""}`}
        </button>
        {open && <div className="card mt-3 p-5">{body}</div>}
      </div>

      <aside className="card hidden h-fit p-6 lg:block" aria-label="Product filters">
        <h2 className="mb-5 font-serif text-lg">Filters</h2>
        {body}
      </aside>
    </>
  );
}

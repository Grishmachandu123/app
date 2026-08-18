"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";

import ImageManager from "@/components/admin/ImageManager";
import { persistGallery, toGalleryItems, type GalleryItem } from "@/lib/admin/images";
import {
  COLOURS,
  JEWELLERY_DESIGNS,
  JEWELLERY_SUBCATEGORIES,
  OCCASIONS,
  SAREE_FABRICS,
  SAREE_SUBCATEGORIES,
} from "@/lib/constants";
import { slugify } from "@/lib/format";
import { createClient } from "@/lib/supabase/client";
import type { Category, CategorySlug, ProductWithRelations } from "@/lib/types";

interface FormState {
  category_id: string;
  name: string;
  slug: string;
  product_code: string;
  price: string;
  original_price: string;
  description: string;
  colour: string;
  material: string;
  product_type: string;
  subcategory: string;
  occasion: string;
  availability: "available" | "sold_out";
  featured: boolean;
  new_arrival: boolean;
  published: boolean;
  fabric: string;
  saree_type: string;
  blouse_information: string;
  design: string;
  length_meters: string;
  jewellery_type: string;
  set_contents: string;
}

function initialState(product: ProductWithRelations | undefined, defaultCategoryId: string): FormState {
  return {
    category_id: product?.category_id ?? defaultCategoryId,
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    product_code: product?.product_code ?? "",
    price: product ? String(product.price) : "",
    original_price: product?.original_price ? String(product.original_price) : "",
    description: product?.description ?? "",
    colour: product?.colour ?? "",
    material: product?.material ?? "",
    product_type: product?.product_type ?? "",
    subcategory: product?.subcategory ?? "",
    occasion: product?.occasion ?? "",
    availability: product?.availability ?? "available",
    featured: product?.featured ?? false,
    new_arrival: product?.new_arrival ?? true,
    published: product?.published ?? true,
    fabric: product?.fabric ?? "",
    saree_type: product?.saree_type ?? "",
    blouse_information: product?.blouse_information ?? "",
    design: product?.design ?? "",
    length_meters: product?.length_meters ? String(product.length_meters) : "",
    jewellery_type: product?.jewellery_type ?? "",
    set_contents: product?.set_contents ?? "",
  };
}

export default function ProductForm({
  categories,
  product,
  defaultCategorySlug = "sarees",
}: {
  categories: Category[];
  product?: ProductWithRelations;
  defaultCategorySlug?: CategorySlug;
}) {
  const router = useRouter();
  const defaultCategoryId = useMemo(
    () => categories.find((category) => category.slug === defaultCategorySlug)?.id ?? categories[0]?.id ?? "",
    [categories, defaultCategorySlug],
  );

  const [form, setForm] = useState<FormState>(() => initialState(product, defaultCategoryId));
  const [items, setItems] = useState<GalleryItem[]>(() => toGalleryItems(product?.images ?? []));
  const [removed, setRemoved] = useState<GalleryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const selectedCategory = categories.find((category) => category.id === form.category_id);
  const isSaree = selectedCategory?.slug !== "one-gram-gold";

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!form.category_id) {
      setError("Please choose a category.");
      return;
    }

    setSaving(true);
    try {
      const supabase = createClient();
      const slug = slugify(form.slug || form.name);

      const payload = {
        category_id: form.category_id,
        name: form.name.trim(),
        slug,
        product_code: form.product_code.trim(),
        price: Number(form.price),
        original_price: form.original_price ? Number(form.original_price) : null,
        description: form.description.trim() || null,
        colour: form.colour || null,
        material: form.material.trim() || null,
        product_type: form.product_type.trim() || null,
        subcategory: form.subcategory || null,
        occasion: form.occasion || null,
        availability: form.availability,
        featured: form.featured,
        new_arrival: form.new_arrival,
        published: form.published,
        fabric: isSaree ? form.fabric || null : null,
        saree_type: isSaree ? form.saree_type.trim() || null : null,
        blouse_information: isSaree ? form.blouse_information.trim() || null : null,
        design: form.design.trim() || null,
        length_meters: isSaree && form.length_meters ? Number(form.length_meters) : null,
        jewellery_type: !isSaree ? form.jewellery_type.trim() || null : null,
        set_contents: !isSaree ? form.set_contents.trim() || null : null,
      };

      let productId = product?.id;

      if (productId) {
        const { error: updateError } = await supabase.from("products").update(payload).eq("id", productId);
        if (updateError) throw new Error(updateError.message);
      } else {
        const { data, error: insertError } = await supabase
          .from("products")
          .insert(payload)
          .select("id")
          .single();
        if (insertError) throw new Error(insertError.message);
        productId = (data as { id: string }).id;
      }

      await persistGallery(productId, items, removed);

      router.push(`/admin/products`);
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not save the product.");
    } finally {
      setSaving(false);
    }
  }

  const subcategories = isSaree ? SAREE_SUBCATEGORIES : JEWELLERY_SUBCATEGORIES;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="card p-6">
        <h2 className="text-xl">Category</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {categories.map((category) => (
            <label
              key={category.id}
              className={`cursor-pointer rounded-full border px-5 py-2.5 text-sm ${
                form.category_id === category.id
                  ? "border-gold-400 bg-gold-400 text-white"
                  : "border-cream-300 bg-white text-ink-800"
              }`}
            >
              <input
                type="radio"
                name="category"
                className="sr-only"
                checked={form.category_id === category.id}
                onChange={() => update("category_id", category.id)}
              />
              {category.name}
            </label>
          ))}
        </div>
      </section>

      <section className="card p-6">
        <h2 className="text-xl">Product details</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="name">
              Product name *
            </label>
            <input
              id="name"
              required
              className="input"
              value={form.name}
              onChange={(event) => {
                const value = event.target.value;
                update("name", value);
                if (!product) update("slug", slugify(value));
              }}
            />
          </div>

          <div>
            <label className="label" htmlFor="product_code">
              Product ID *
            </label>
            <input
              id="product_code"
              required
              placeholder="SR102"
              className="input"
              value={form.product_code}
              onChange={(event) => update("product_code", event.target.value)}
            />
          </div>

          <div>
            <label className="label" htmlFor="slug">
              URL slug *
            </label>
            <input
              id="slug"
              required
              className="input"
              value={form.slug}
              onChange={(event) => update("slug", event.target.value)}
            />
            <p className="mt-1 text-xs text-ink-700">
              /{isSaree ? "sarees" : "one-gram-gold"}/{form.slug || "product-name"}
            </p>
          </div>

          <div>
            <label className="label" htmlFor="subcategory">
              Product category
            </label>
            <select
              id="subcategory"
              className="input"
              value={form.subcategory}
              onChange={(event) => update("subcategory", event.target.value)}
            >
              <option value="">Not set</option>
              {subcategories.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label" htmlFor="price">
              Price (₹) *
            </label>
            <input
              id="price"
              type="number"
              min={0}
              step="1"
              required
              className="input"
              value={form.price}
              onChange={(event) => update("price", event.target.value)}
            />
          </div>

          <div>
            <label className="label" htmlFor="original_price">
              Original price (₹)
            </label>
            <input
              id="original_price"
              type="number"
              min={0}
              step="1"
              className="input"
              value={form.original_price}
              onChange={(event) => update("original_price", event.target.value)}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="label" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              className="input"
              value={form.description}
              onChange={(event) => update("description", event.target.value)}
            />
          </div>

          <div>
            <label className="label" htmlFor="colour">
              Colour
            </label>
            <input
              id="colour"
              list="colour-options"
              className="input"
              value={form.colour}
              onChange={(event) => update("colour", event.target.value)}
            />
            <datalist id="colour-options">
              {COLOURS.map((colour) => (
                <option key={colour} value={colour} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="label" htmlFor="material">
              Material
            </label>
            <input
              id="material"
              className="input"
              value={form.material}
              onChange={(event) => update("material", event.target.value)}
            />
          </div>

          <div>
            <label className="label" htmlFor="product_type">
              Product type
            </label>
            <input
              id="product_type"
              className="input"
              value={form.product_type}
              onChange={(event) => update("product_type", event.target.value)}
            />
          </div>

          <div>
            <label className="label" htmlFor="occasion">
              Occasion
            </label>
            <input
              id="occasion"
              list="occasion-options"
              className="input"
              value={form.occasion}
              onChange={(event) => update("occasion", event.target.value)}
            />
            <datalist id="occasion-options">
              {OCCASIONS.map((occasion) => (
                <option key={occasion} value={occasion} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="label" htmlFor="design">
              Design
            </label>
            <input
              id="design"
              list="design-options"
              className="input"
              value={form.design}
              onChange={(event) => update("design", event.target.value)}
            />
            <datalist id="design-options">
              {JEWELLERY_DESIGNS.map((design) => (
                <option key={design} value={design} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="label" htmlFor="availability">
              Availability
            </label>
            <select
              id="availability"
              className="input"
              value={form.availability}
              onChange={(event) =>
                update("availability", event.target.value === "sold_out" ? "sold_out" : "available")
              }
            >
              <option value="available">Available</option>
              <option value="sold_out">Sold out</option>
            </select>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-5">
          {(
            [
              ["featured", "Featured"],
              ["new_arrival", "New arrival"],
              ["published", "Visible on website"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="h-4 w-4 accent-[#c39c43]"
                checked={form[key]}
                onChange={(event) => update(key, event.target.checked)}
              />
              {label}
            </label>
          ))}
        </div>
      </section>

      <section className="card p-6">
        <h2 className="text-xl">{isSaree ? "Saree details" : "Jewellery details"}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {isSaree ? (
            <>
              <div>
                <label className="label" htmlFor="fabric">
                  Fabric
                </label>
                <input
                  id="fabric"
                  list="fabric-options"
                  className="input"
                  value={form.fabric}
                  onChange={(event) => update("fabric", event.target.value)}
                />
                <datalist id="fabric-options">
                  {SAREE_FABRICS.map((fabric) => (
                    <option key={fabric} value={fabric} />
                  ))}
                </datalist>
              </div>
              <div>
                <label className="label" htmlFor="saree_type">
                  Saree type
                </label>
                <input
                  id="saree_type"
                  className="input"
                  value={form.saree_type}
                  onChange={(event) => update("saree_type", event.target.value)}
                />
              </div>
              <div>
                <label className="label" htmlFor="blouse_information">
                  Blouse information
                </label>
                <input
                  id="blouse_information"
                  className="input"
                  value={form.blouse_information}
                  onChange={(event) => update("blouse_information", event.target.value)}
                />
              </div>
              <div>
                <label className="label" htmlFor="length_meters">
                  Length (metres)
                </label>
                <input
                  id="length_meters"
                  type="number"
                  step="0.1"
                  min={0}
                  className="input"
                  value={form.length_meters}
                  onChange={(event) => update("length_meters", event.target.value)}
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="label" htmlFor="jewellery_type">
                  Jewellery type
                </label>
                <input
                  id="jewellery_type"
                  className="input"
                  value={form.jewellery_type}
                  onChange={(event) => update("jewellery_type", event.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="label" htmlFor="set_contents">
                  Set contents
                </label>
                <input
                  id="set_contents"
                  placeholder="Necklace + 2 earrings"
                  className="input"
                  value={form.set_contents}
                  onChange={(event) => update("set_contents", event.target.value)}
                />
              </div>
            </>
          )}
        </div>
      </section>

      <section className="card p-6">
        <h2 className="text-xl">Photographs</h2>
        <p className="mt-1 text-sm text-ink-700">
          Upload real product photographs. Reorder with the arrows — the first image is used on product
          cards.
        </p>
        <div className="mt-4">
          <ImageManager
            items={items}
            onChange={setItems}
            onRemove={(item) => setRemoved((current) => [...current, item])}
          />
        </div>
      </section>

      {error && (
        <p role="alert" className="rounded-lg bg-maroon-600/10 px-4 py-3 text-sm text-maroon-700">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? "Saving…" : product ? "Save changes" : "Publish product"}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-outline">
          Cancel
        </button>
      </div>
    </form>
  );
}

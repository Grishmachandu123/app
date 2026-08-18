import Link from "next/link";

import ProductGallery from "@/components/product/ProductGallery";
import ProductGrid from "@/components/product/ProductGrid";
import { WhatsAppIcon } from "@/components/ui/icons";
import { discountPercent, formatPrice } from "@/lib/format";
import { getRelatedProducts, getSiteSettings } from "@/lib/queries";
import type { ProductWithRelations } from "@/lib/types";
import { enquiryMessage, orderMessage, whatsappLink } from "@/lib/whatsapp";

function Spec({ label, value }: { label: string; value: string | number | null | undefined }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="flex gap-3 border-b border-cream-200 py-2.5 text-sm last:border-b-0">
      <dt className="w-40 shrink-0 text-ink-700">{label}</dt>
      <dd className="text-ink-900">{value}</dd>
    </div>
  );
}

export default async function ProductDetail({ product }: { product: ProductWithRelations }) {
  const [settings, related] = await Promise.all([getSiteSettings(), getRelatedProducts(product.id)]);

  const isSaree = product.category?.slug === "sarees";
  const categoryPath = isSaree ? "/sarees" : "/one-gram-gold";
  const categoryLabel = isSaree ? "Sarees" : "One-Gram Gold Jewellery";
  const soldOut = product.availability === "sold_out";
  const discount = discountPercent(Number(product.price), product.original_price);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const productUrl = siteUrl ? `${siteUrl}${categoryPath}/${product.slug}` : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.product_code,
    description: product.description ?? `${product.name} from ${settings.business_name}`,
    image: product.images.map((image) => image.image_url),
    category: categoryLabel,
    color: product.colour ?? undefined,
    material: product.material ?? undefined,
    brand: { "@type": "Brand", name: settings.business_name },
    offers: {
      "@type": "Offer",
      price: Number(product.price),
      priceCurrency: "INR",
      availability: soldOut ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
      url: productUrl,
    },
  };

  return (
    <div className="container-page py-8 lg:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav aria-label="Breadcrumb" className="mb-6 text-xs text-ink-700">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-gold-500">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href={categoryPath} className="hover:text-gold-500">
              {categoryLabel}
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-ink-900">{product.name}</li>
        </ol>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} productName={product.name} />

        <div>
          <p className="eyebrow">{product.subcategory ?? categoryLabel}</p>
          <h1 className="mt-3 text-3xl leading-tight sm:text-4xl">{product.name}</h1>
          <p className="mt-2 text-sm text-ink-700">Product ID: {product.product_code}</p>

          <div className="mt-5 flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-semibold text-ink-900">
              {formatPrice(Number(product.price))}
            </span>
            {product.original_price && Number(product.original_price) > Number(product.price) && (
              <span className="text-lg text-ink-700/60 line-through">
                {formatPrice(Number(product.original_price))}
              </span>
            )}
            {discount && (
              <span className="rounded-full bg-maroon-600 px-2.5 py-1 text-xs font-semibold text-white">
                {discount}% off
              </span>
            )}
          </div>

          <p className={`mt-3 text-sm font-medium ${soldOut ? "text-maroon-600" : "text-green-700"}`}>
            {soldOut ? "Currently sold out" : "Available now"}
          </p>

          {product.description && (
            <p className="mt-6 whitespace-pre-line text-sm leading-relaxed text-ink-700">
              {product.description}
            </p>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={whatsappLink(settings.whatsapp_number, orderMessage(product, productUrl))}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp flex-1"
            >
              <WhatsAppIcon />
              Order on WhatsApp
            </a>
            <a
              href={whatsappLink(settings.whatsapp_number, enquiryMessage(product))}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline flex-1"
            >
              Ask About This Product
            </a>
          </div>

          <div className="card mt-8 p-6">
            <h2 className="mb-2 text-lg">Product Details</h2>
            <dl>
              <Spec label="Product ID" value={product.product_code} />
              <Spec label="Category" value={categoryLabel} />
              <Spec label="Product Type" value={product.product_type} />
              <Spec label="Colour" value={product.colour} />
              <Spec label="Material" value={product.material} />
              <Spec label="Occasion" value={product.occasion} />
              <Spec label="Design" value={product.design} />
              {isSaree ? (
                <>
                  <Spec label="Fabric" value={product.fabric} />
                  <Spec label="Saree Type" value={product.saree_type} />
                  <Spec label="Blouse" value={product.blouse_information} />
                  <Spec
                    label="Length"
                    value={product.length_meters ? `${product.length_meters} metres` : null}
                  />
                </>
              ) : (
                <>
                  <Spec label="Jewellery Type" value={product.jewellery_type} />
                  <Spec label="Set Contents" value={product.set_contents} />
                </>
              )}
              <Spec label="Availability" value={soldOut ? "Sold out" : "Available"} />
            </dl>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <div className="mb-8">
            <p className="eyebrow">Styled Together</p>
            <h2 className="mt-2 text-3xl">Complete the Look</h2>
          </div>
          <ProductGrid products={related} whatsappNumber={settings.whatsapp_number} />
        </section>
      )}
    </div>
  );
}

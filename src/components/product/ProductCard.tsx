import Image from "next/image";
import Link from "next/link";

import { WhatsAppIcon } from "@/components/ui/icons";
import { discountPercent, formatPrice } from "@/lib/format";
import { productPath } from "@/lib/product-url";
import type { ProductWithRelations } from "@/lib/types";
import { orderMessage, whatsappLink } from "@/lib/whatsapp";

export default function ProductCard({
  product,
  whatsappNumber,
  priority = false,
}: {
  product: ProductWithRelations;
  whatsappNumber: string;
  priority?: boolean;
}) {
  const href = productPath(product);
  const image = product.images?.[0];
  const discount = discountPercent(Number(product.price), product.original_price);
  const soldOut = product.availability === "sold_out";

  return (
    <article className="card group flex flex-col overflow-hidden transition-shadow hover:shadow-soft">
      <Link href={href} className="relative block aspect-[3/4] overflow-hidden bg-cream-200">
        {image ? (
          <Image
            src={image.image_url}
            alt={image.alt_text || product.name}
            fill
            priority={priority}
            loading={priority ? undefined : "lazy"}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cream-200 to-gold-50 text-sm text-ink-700">
            Photo coming soon
          </div>
        )}

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.new_arrival && (
            <span className="rounded-full bg-gold-400 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
              New
            </span>
          )}
          {discount && (
            <span className="rounded-full bg-maroon-600 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
              {discount}% off
            </span>
          )}
        </div>

        {soldOut && (
          <span className="absolute right-3 top-3 rounded-full bg-ink-900/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-cream-50">
            Sold out
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] uppercase tracking-wider text-ink-700/70">{product.product_code}</p>
        <h3 className="mt-1 line-clamp-2 text-base leading-snug">
          <Link href={href} className="hover:text-gold-500">
            {product.name}
          </Link>
        </h3>

        <div className="mt-2 flex flex-wrap items-baseline gap-2">
          <span className="text-lg font-semibold text-ink-900">{formatPrice(Number(product.price))}</span>
          {product.original_price && Number(product.original_price) > Number(product.price) && (
            <span className="text-sm text-ink-700/60 line-through">
              {formatPrice(Number(product.original_price))}
            </span>
          )}
        </div>

        <p className={`mt-1 text-xs ${soldOut ? "text-maroon-600" : "text-green-700"}`}>
          {soldOut ? "Sold out" : "Available"}
        </p>

        <div className="mt-4 flex flex-col gap-2 pt-1 sm:flex-row">
          <Link href={href} className="btn-outline flex-1 px-3 py-2.5 text-xs">
            View Details
          </Link>
          <a
            href={whatsappLink(whatsappNumber, orderMessage(product))}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp flex-1 px-3 py-2.5 text-xs"
          >
            <WhatsAppIcon width={16} height={16} />
            Order
          </a>
        </div>
      </div>
    </article>
  );
}

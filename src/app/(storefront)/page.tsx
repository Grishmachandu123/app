import Image from "next/image";
import Link from "next/link";

import ProductGrid from "@/components/product/ProductGrid";
import { SparkleIcon, WhatsAppIcon } from "@/components/ui/icons";
import { formatPrice } from "@/lib/format";
import { productPath } from "@/lib/product-url";
import { getProducts, getShopTheLook, getSiteSettings } from "@/lib/queries";
import { GENERAL_MESSAGE, whatsappLink } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

const WHY_CHOOSE_US = [
  {
    title: "Quality Products",
    description: "Every saree and jewellery piece is personally checked before it reaches you.",
  },
  {
    title: "Beautiful Designs",
    description: "Traditional weaves and temple-inspired jewellery, refreshed every season.",
  },
  {
    title: "Affordable Prices",
    description: "Boutique quality without boutique mark-ups — honest pricing, always.",
  },
  {
    title: "Personal WhatsApp Assistance",
    description: "Chat with us for photos, videos, measurements and styling advice.",
  },
];

export default async function HomePage() {
  const [settings, newArrivals, featuredSarees, featuredJewellery, looks] = await Promise.all([
    getSiteSettings(),
    getProducts({ newArrival: true, perPage: 8 }),
    getProducts({ category: "sarees", featured: true, perPage: 4 }),
    getProducts({ category: "one-gram-gold", featured: true, perPage: 4 }),
    getShopTheLook(2),
  ]);

  const heroImage =
    featuredSarees.products[0]?.images?.[0]?.image_url ??
    newArrivals.products[0]?.images?.[0]?.image_url ??
    null;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-cream-100">
        <div className="container-page grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-24">
          <div className="animate-fade-up">
            <p className="eyebrow">Sarees &amp; One-Gram Gold</p>
            <h1 className="mt-4 text-4xl leading-tight sm:text-5xl lg:text-6xl">
              Elegance in Every Thread &amp; Sparkle
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-700 sm:text-lg">
              Beautiful Sarees &amp; One-Gram Gold Jewellery for Every Occasion
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/sarees" className="btn-primary">
                Shop Sarees
              </Link>
              <Link href="/one-gram-gold" className="btn-outline">
                Shop One-Gram Gold
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-gradient-to-br from-gold-100 via-cream-200 to-cream-300 shadow-soft">
              {heroImage ? (
                <Image
                  src={heroImage}
                  alt="Featured saree from our latest collection"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
                  <SparkleIcon className="h-10 w-10 text-gold-400" />
                  <p className="font-serif text-2xl text-ink-800">Handpicked for you</p>
                  <p className="max-w-xs text-sm text-ink-700">
                    Add your first products in the admin dashboard and they will appear here.
                  </p>
                </div>
              )}
            </div>
            <div className="pointer-events-none absolute -bottom-6 -left-6 hidden h-24 w-24 rounded-full border border-gold-200 sm:block" />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container-page py-16">
        <div className="text-center">
          <p className="eyebrow">Our Collections</p>
          <h2 className="mt-3 text-3xl sm:text-4xl">Two Traditions, One Boutique</h2>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {[
            {
              href: "/sarees",
              title: "Sarees",
              description:
                "Pattu, silk, cotton and designer sarees woven for weddings, festivals and everyday grace.",
              image: featuredSarees.products[0]?.images?.[0]?.image_url ?? null,
            },
            {
              href: "/one-gram-gold",
              title: "One-Gram Gold Jewellery",
              description:
                "Necklace sets, haram, vaddanam, bangles and earrings with a rich traditional finish.",
              image: featuredJewellery.products[0]?.images?.[0]?.image_url ?? null,
            },
          ].map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="card group overflow-hidden transition-shadow hover:shadow-soft"
            >
              <div className="relative aspect-[16/10] bg-gradient-to-br from-cream-200 to-gold-50">
                {card.image && (
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="p-6">
                <h3 className="text-2xl">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-700">{card.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-gold-500">
                  Shop Now →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* New arrivals */}
      {newArrivals.products.length > 0 && (
        <section className="bg-cream-100 py-16">
          <div className="container-page">
            <SectionHeading
              eyebrow="Just In"
              title="New Arrivals"
              href="/new-arrivals"
              linkLabel="View all new arrivals"
            />
            <ProductGrid
              products={newArrivals.products}
              whatsappNumber={settings.whatsapp_number}
            />
          </div>
        </section>
      )}

      {/* Featured sarees */}
      {featuredSarees.products.length > 0 && (
        <section className="container-page py-16">
          <SectionHeading
            eyebrow="Handpicked"
            title="Featured Sarees"
            href="/sarees"
            linkLabel="View all sarees"
          />
          <ProductGrid products={featuredSarees.products} whatsappNumber={settings.whatsapp_number} />
        </section>
      )}

      {/* Featured jewellery */}
      {featuredJewellery.products.length > 0 && (
        <section className="bg-cream-100 py-16">
          <div className="container-page">
            <SectionHeading
              eyebrow="Handpicked"
              title="Featured Jewellery"
              href="/one-gram-gold"
              linkLabel="View all jewellery"
            />
            <ProductGrid
              products={featuredJewellery.products}
              whatsappNumber={settings.whatsapp_number}
            />
          </div>
        </section>
      )}

      {/* Shop the look */}
      {looks.length > 0 && (
        <section className="container-page py-16">
          <div className="text-center">
            <p className="eyebrow">Styled Together</p>
            <h2 className="mt-3 text-3xl sm:text-4xl">Shop the Look</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-ink-700">
              Matching saree and jewellery pairings, curated by us.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {looks.map((look) => (
              <div key={`${look.saree.id}-${look.jewellery.id}`} className="card overflow-hidden p-5">
                <div className="grid grid-cols-2 gap-4">
                  {[look.saree, look.jewellery].map((item) => (
                    <Link key={item.id} href={productPath(item)} className="group">
                      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-cream-200">
                        {item.images?.[0] && (
                          <Image
                            src={item.images[0].image_url}
                            alt={item.images[0].alt_text || item.name}
                            fill
                            sizes="(max-width: 1024px) 50vw, 25vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        )}
                      </div>
                      <p className="mt-3 line-clamp-1 text-sm font-medium">{item.name}</p>
                      <p className="text-sm text-ink-700">{formatPrice(Number(item.price))}</p>
                    </Link>
                  ))}
                </div>
                <p className="mt-4 text-center text-sm text-ink-700">
                  {look.saree.name} <span className="text-gold-500">+</span> {look.jewellery.name}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Why choose us */}
      <section className="bg-cream-100 py-16">
        <div className="container-page">
          <div className="text-center">
            <p className="eyebrow">Why Choose Us</p>
            <h2 className="mt-3 text-3xl sm:text-4xl">A Boutique That Feels Personal</h2>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_CHOOSE_US.map((item) => (
              <div key={item.title} className="card h-full p-6">
                <SparkleIcon className="h-6 w-6 text-gold-400" />
                <h3 className="mt-4 text-lg">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-700">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="container-page py-16">
        <div className="rounded-3xl border border-gold-200 bg-gradient-to-br from-cream-100 to-gold-50 px-6 py-14 text-center">
          <h2 className="text-3xl sm:text-4xl">Have a question or looking for something special?</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-ink-700">
            Send us a message and we will share photos, videos and prices right away.
          </p>
          <a
            href={whatsappLink(settings.whatsapp_number, GENERAL_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp mt-7"
          >
            <WhatsAppIcon />
            Chat with us on WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}

function SectionHeading({
  eyebrow,
  title,
  href,
  linkLabel,
}: {
  eyebrow: string;
  title: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-2 text-3xl sm:text-4xl">{title}</h2>
      </div>
      <Link href={href} className="text-sm font-medium text-gold-500 hover:text-gold-600">
        {linkLabel} →
      </Link>
    </div>
  );
}

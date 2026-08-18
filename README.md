# Vasthra Boutique

Catalogue website for an Indian women's fashion business selling **sarees** and **one-gram gold jewellery**
under one brand. Customers browse real product photographs and order over WhatsApp — there is no online
payment, no customer account and no checkout.

Built with Next.js (App Router), React, TypeScript, Tailwind CSS, Supabase (PostgreSQL, Auth, Storage) and
deployable on Vercel's free tier.

## Features

**Storefront**
- Home page with hero, category cards, new arrivals, featured sarees/jewellery, Shop the Look, why-choose-us and a WhatsApp CTA
- `/sarees` and `/one-gram-gold` listings with subcategory tabs, price/colour/fabric/type/design/availability filters, sorting and pagination
- Product pages at `/sarees/[slug]` and `/one-gram-gold/[slug]` with a zoomable gallery, full specifications, Complete the Look and JSON-LD structured data
- Global search across name, product ID, colour, design and product type
- Floating WhatsApp button; every product has "Order on WhatsApp" and "Ask about this product" with a pre-filled message
- Sitemap, robots.txt, per-page metadata, responsive mobile-first layout

**Admin** (`/admin`, Supabase Auth only — no public sign-up)
- Dashboard counts: total, sarees, jewellery, available, sold out, new arrivals
- Product list with search, inline toggles (sold out / featured / new arrival) and delete
- Add/edit form with category-specific fields (fabric, saree type, blouse, length / jewellery type, set contents)
- Image manager: multi-upload, browser-side compression to WebP, preview, reorder, delete, main-image selection
- Shop the Look relationship manager
- Site settings: business name, WhatsApp number, Instagram, contact info, about text, logo

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in the Supabase values
npm run dev
```

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `NEXT_PUBLIC_SITE_URL` | Public site URL, used for metadata and the sitemap |

## Supabase setup

1. Create a free project at [supabase.com](https://supabase.com).
2. Open the SQL editor and run [`supabase/schema.sql`](supabase/schema.sql). It creates the `categories`,
   `products`, `product_images`, `product_relationships` and `site_settings` tables with indexes, triggers,
   seed data, Row Level Security policies and the public `product-images` storage bucket.
3. Create the owner account under **Authentication → Users → Add user** (email + password). This is the only
   account that can reach `/admin`; leave public sign-ups disabled.
4. Copy the project URL and anon key into `.env.local`.
5. Sign in at `/admin/login` and set the WhatsApp number under **Site settings** before publishing products.

### Security model

Anonymous visitors can read published products, their images, categories and site settings. Every write
(products, images, relationships, settings, storage uploads) requires an authenticated session, enforced by
RLS in Postgres and by middleware protecting `/admin/*`.

## Deploying to Vercel

1. Push the repository to GitHub and import it in Vercel.
2. Add the three environment variables above (set `NEXT_PUBLIC_SITE_URL` to the production domain).
3. Deploy — the app uses no local filesystem or long-running server processes.

## Scripts

```bash
npm run dev     # development server
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
```

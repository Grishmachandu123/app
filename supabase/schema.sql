-- Vasthra Boutique — Supabase schema
-- Run this once in the Supabase SQL editor (Dashboard → SQL → New query).
-- It is idempotent enough to re-run during development.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  image_url text,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  product_code text not null unique,
  name text not null,
  slug text not null unique,
  category_id uuid not null references categories (id) on delete restrict,
  subcategory text,
  price numeric(10, 2) not null check (price >= 0),
  original_price numeric(10, 2) check (original_price >= 0),
  description text,
  colour text,
  material text,
  product_type text,
  occasion text,
  availability text not null default 'available'
    check (availability in ('available', 'sold_out')),
  featured boolean not null default false,
  new_arrival boolean not null default false,
  published boolean not null default true,
  -- saree specific
  fabric text,
  saree_type text,
  blouse_information text,
  design text,
  length_meters numeric(5, 2),
  -- jewellery specific
  jewellery_type text,
  set_contents text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products (id) on delete cascade,
  image_url text not null,
  storage_path text,
  alt_text text,
  is_primary boolean not null default false,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists product_relationships (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products (id) on delete cascade,
  related_product_id uuid not null references products (id) on delete cascade,
  relationship_type text not null default 'complete_the_look',
  created_at timestamptz not null default now(),
  constraint product_relationships_distinct check (product_id <> related_product_id),
  constraint product_relationships_unique unique (product_id, related_product_id, relationship_type)
);

create table if not exists site_settings (
  id uuid primary key default gen_random_uuid(),
  business_name text not null default 'Vyshnavi Sarees Center',
  whatsapp_number text not null default '910000000000',
  instagram_url text,
  contact_information text,
  about_text text,
  logo_url text,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

create index if not exists products_category_id_idx on products (category_id);
create index if not exists products_availability_idx on products (availability);
create index if not exists products_featured_idx on products (featured);
create index if not exists products_new_arrival_idx on products (new_arrival);
create index if not exists products_created_at_idx on products (created_at desc);
create index if not exists products_subcategory_idx on products (subcategory);
create index if not exists product_images_product_id_idx on product_images (product_id);
create index if not exists product_images_display_order_idx on product_images (product_id, display_order);
create index if not exists product_relationships_product_id_idx on product_relationships (product_id);
create index if not exists product_relationships_related_idx on product_relationships (related_product_id);

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------

create or replace function set_updated_at() returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on products;
create trigger products_set_updated_at
  before update on products
  for each row execute function set_updated_at();

drop trigger if exists site_settings_set_updated_at on site_settings;
create trigger site_settings_set_updated_at
  before update on site_settings
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- Seed data
-- ---------------------------------------------------------------------------

insert into categories (slug, name, description, display_order)
values
  ('sarees', 'Sarees', 'Handpicked pattu, silk, cotton and designer sarees for every occasion.', 1),
  ('one-gram-gold', 'One-Gram Gold Jewellery', 'Traditional one-gram gold necklace sets, haram, bangles and more.', 2)
on conflict (slug) do nothing;

insert into site_settings (business_name, whatsapp_number, contact_information, about_text)
select 'Vyshnavi Sarees Center', '910000000000',
       'Call or WhatsApp us any day between 10 AM and 8 PM.',
       'We are a small family run boutique bringing you handpicked sarees and one-gram gold jewellery at honest prices.'
where not exists (select 1 from site_settings);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- Only the business owner has an account, so "authenticated" == admin.
-- ---------------------------------------------------------------------------

alter table categories enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table product_relationships enable row level security;
alter table site_settings enable row level security;

-- categories: public read, admin write
drop policy if exists "categories public read" on categories;
create policy "categories public read" on categories
  for select to anon, authenticated using (true);

drop policy if exists "categories admin write" on categories;
create policy "categories admin write" on categories
  for all to authenticated using (true) with check (true);

-- products: public reads published rows only, admin full access
drop policy if exists "products public read" on products;
create policy "products public read" on products
  for select to anon using (published = true);

drop policy if exists "products admin read" on products;
create policy "products admin read" on products
  for select to authenticated using (true);

drop policy if exists "products admin insert" on products;
create policy "products admin insert" on products
  for insert to authenticated with check (true);

drop policy if exists "products admin update" on products;
create policy "products admin update" on products
  for update to authenticated using (true) with check (true);

drop policy if exists "products admin delete" on products;
create policy "products admin delete" on products
  for delete to authenticated using (true);

-- product_images: public reads images of published products
drop policy if exists "product_images public read" on product_images;
create policy "product_images public read" on product_images
  for select to anon using (
    exists (
      select 1 from products p
      where p.id = product_images.product_id and p.published = true
    )
  );

drop policy if exists "product_images admin read" on product_images;
create policy "product_images admin read" on product_images
  for select to authenticated using (true);

drop policy if exists "product_images admin write" on product_images;
create policy "product_images admin write" on product_images
  for all to authenticated using (true) with check (true);

-- product_relationships
drop policy if exists "product_relationships public read" on product_relationships;
create policy "product_relationships public read" on product_relationships
  for select to anon using (true);

drop policy if exists "product_relationships admin read" on product_relationships;
create policy "product_relationships admin read" on product_relationships
  for select to authenticated using (true);

drop policy if exists "product_relationships admin write" on product_relationships;
create policy "product_relationships admin write" on product_relationships
  for all to authenticated using (true) with check (true);

-- site_settings: public read, admin write
drop policy if exists "site_settings public read" on site_settings;
create policy "site_settings public read" on site_settings
  for select to anon, authenticated using (true);

drop policy if exists "site_settings admin write" on site_settings;
create policy "site_settings admin write" on site_settings
  for all to authenticated using (true) with check (true);

-- ---------------------------------------------------------------------------
-- Storage bucket + policies
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

drop policy if exists "product images public read" on storage.objects;
create policy "product images public read" on storage.objects
  for select to anon, authenticated using (bucket_id = 'product-images');

drop policy if exists "product images admin insert" on storage.objects;
create policy "product images admin insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'product-images');

drop policy if exists "product images admin update" on storage.objects;
create policy "product images admin update" on storage.objects
  for update to authenticated using (bucket_id = 'product-images')
  with check (bucket_id = 'product-images');

drop policy if exists "product images admin delete" on storage.objects;
create policy "product images admin delete" on storage.objects
  for delete to authenticated using (bucket_id = 'product-images');

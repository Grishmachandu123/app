export type CategorySlug = "sarees" | "one-gram-gold";

export type Availability = "available" | "sold_out";

export interface Category {
  id: string;
  slug: CategorySlug;
  name: string;
  description: string | null;
  image_url: string | null;
  display_order: number;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  storage_path: string | null;
  alt_text: string | null;
  is_primary: boolean;
  display_order: number;
}

export interface Product {
  id: string;
  product_code: string;
  name: string;
  slug: string;
  category_id: string;
  subcategory: string | null;
  price: number;
  original_price: number | null;
  description: string | null;
  colour: string | null;
  material: string | null;
  product_type: string | null;
  occasion: string | null;
  availability: Availability;
  featured: boolean;
  new_arrival: boolean;
  published: boolean;
  fabric: string | null;
  saree_type: string | null;
  blouse_information: string | null;
  design: string | null;
  length_meters: number | null;
  jewellery_type: string | null;
  set_contents: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductWithRelations extends Product {
  category: Pick<Category, "id" | "slug" | "name"> | null;
  images: ProductImage[];
}

export interface SiteSettings {
  id: string;
  business_name: string;
  whatsapp_number: string;
  instagram_url: string | null;
  contact_information: string | null;
  about_text: string | null;
  logo_url: string | null;
}

export interface ProductRelationship {
  id: string;
  product_id: string;
  related_product_id: string;
  relationship_type: string;
}

export interface ProductFilters {
  category?: CategorySlug;
  subcategory?: string;
  search?: string;
  colour?: string;
  fabric?: string;
  sareeType?: string;
  jewelleryType?: string;
  design?: string;
  availability?: Availability;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  newArrival?: boolean;
  sort?: "newest" | "price_asc" | "price_desc" | "name_asc";
  page?: number;
  perPage?: number;
}

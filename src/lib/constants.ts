import type { CategorySlug } from "./types";

export const SAREE_SUBCATEGORIES = [
  "Pattu Sarees",
  "Silk Sarees",
  "Designer Sarees",
  "Cotton Sarees",
  "Party Wear",
  "Traditional Sarees",
] as const;

export const JEWELLERY_SUBCATEGORIES = [
  "Necklace Sets",
  "Earrings",
  "Bangles",
  "Chains",
  "Rings",
  "Haram",
  "Vaddanam",
  "Traditional Jewellery",
] as const;

export const SAREE_FABRICS = [
  "Kanchipuram Silk",
  "Banarasi Silk",
  "Soft Silk",
  "Cotton",
  "Georgette",
  "Chiffon",
  "Linen",
  "Organza",
] as const;

export const COLOURS = [
  "Red",
  "Maroon",
  "Pink",
  "Green",
  "Blue",
  "Yellow",
  "Orange",
  "Purple",
  "Black",
  "White",
  "Cream",
  "Gold",
  "Multicolour",
] as const;

export const OCCASIONS = [
  "Wedding",
  "Festival",
  "Party",
  "Daily Wear",
  "Office Wear",
  "Reception",
] as const;

export const JEWELLERY_DESIGNS = [
  "Lakshmi",
  "Temple",
  "Peacock",
  "Antique",
  "Floral",
  "Kundan",
  "Stone Studded",
  "Plain",
] as const;

export const PRODUCTS_PER_PAGE = 12;

export const CATEGORY_PATH: Record<CategorySlug, string> = {
  sarees: "/sarees",
  "one-gram-gold": "/one-gram-gold",
};

export const CATEGORY_LABEL: Record<CategorySlug, string> = {
  sarees: "Sarees",
  "one-gram-gold": "One-Gram Gold Jewellery",
};

import { formatPrice } from "./format";
import type { Product } from "./types";

function sanitiseNumber(whatsappNumber: string): string {
  return whatsappNumber.replace(/\D/g, "");
}

export function whatsappLink(whatsappNumber: string, message: string): string {
  return `https://wa.me/${sanitiseNumber(whatsappNumber)}?text=${encodeURIComponent(message)}`;
}

export function orderMessage(product: Pick<Product, "name" | "product_code" | "price">, url?: string): string {
  const lines = [
    "Hello 👋",
    "",
    "I am interested in this product.",
    "",
    `Product: ${product.name}`,
    `Product ID: ${product.product_code}`,
    `Price: ${formatPrice(product.price)}`,
  ];
  if (url) lines.push(`Link: ${url}`);
  lines.push("", "Please let me know if it is available and provide further details.");
  return lines.join("\n");
}

export function enquiryMessage(product: Pick<Product, "name" | "product_code">): string {
  return [
    "Hello 👋",
    "",
    "I have a question about this product.",
    "",
    `Product: ${product.name}`,
    `Product ID: ${product.product_code}`,
    "",
    "Could you share more details please?",
  ].join("\n");
}

export const GENERAL_MESSAGE =
  "Hello 👋 I would like to know more about your sarees and one-gram gold jewellery.";

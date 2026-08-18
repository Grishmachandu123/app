import ProductCard from "@/components/product/ProductCard";
import type { ProductWithRelations } from "@/lib/types";

export default function ProductGrid({
  products,
  whatsappNumber,
  emptyMessage = "No products found. Try a different filter or search.",
}: {
  products: ProductWithRelations[];
  whatsappNumber: string;
  emptyMessage?: string;
}) {
  if (products.length === 0) {
    return (
      <div className="card p-10 text-center text-sm text-ink-700">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          whatsappNumber={whatsappNumber}
          priority={index < 4}
        />
      ))}
    </div>
  );
}

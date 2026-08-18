"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { deleteProductImages } from "@/lib/admin/images";
import { createClient } from "@/lib/supabase/client";
import type { Availability } from "@/lib/types";

export default function ProductRowActions({
  productId,
  availability,
  featured,
  newArrival,
}: {
  productId: string;
  availability: Availability;
  featured: boolean;
  newArrival: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function patch(values: Record<string, unknown>) {
    setBusy(true);
    setError(null);
    try {
      const { error: updateError } = await createClient()
        .from("products")
        .update(values)
        .eq("id", productId);
      if (updateError) throw new Error(updateError.message);
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Update failed");
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!window.confirm("Delete this product and its photos? This cannot be undone.")) return;
    setBusy(true);
    setError(null);
    try {
      await deleteProductImages(productId);
      const { error: deleteError } = await createClient().from("products").delete().eq("id", productId);
      if (deleteError) throw new Error(deleteError.message);
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Delete failed");
    } finally {
      setBusy(false);
    }
  }

  const buttonClass = "rounded border border-cream-300 px-2.5 py-1 text-xs hover:border-gold-300 disabled:opacity-50";

  return (
    <div className="flex flex-wrap items-center justify-end gap-1.5">
      <Link href={`/admin/products/${productId}`} className={buttonClass}>
        Edit
      </Link>
      <button
        type="button"
        disabled={busy}
        className={buttonClass}
        onClick={() =>
          patch({ availability: availability === "sold_out" ? "available" : "sold_out" })
        }
      >
        {availability === "sold_out" ? "Mark available" : "Mark sold out"}
      </button>
      <button
        type="button"
        disabled={busy}
        className={buttonClass}
        onClick={() => patch({ featured: !featured })}
      >
        {featured ? "Unfeature" : "Feature"}
      </button>
      <button
        type="button"
        disabled={busy}
        className={buttonClass}
        onClick={() => patch({ new_arrival: !newArrival })}
      >
        {newArrival ? "Remove new" : "Mark new"}
      </button>
      <button
        type="button"
        disabled={busy}
        onClick={remove}
        className="rounded border border-maroon-600/40 px-2.5 py-1 text-xs text-maroon-700 hover:bg-maroon-600/10 disabled:opacity-50"
      >
        Delete
      </button>
      {error && <p className="w-full text-right text-xs text-maroon-700">{error}</p>}
    </div>
  );
}

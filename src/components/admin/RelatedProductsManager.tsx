"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { createClient } from "@/lib/supabase/client";

interface Candidate {
  id: string;
  name: string;
  product_code: string;
  category: { slug: string; name: string } | null;
}

interface Relationship {
  id: string;
  product_id: string;
  related_product_id: string;
}

export default function RelatedProductsManager({
  productId,
  relationships,
  candidates,
}: {
  productId: string;
  relationships: Relationship[];
  candidates: Candidate[];
}) {
  const router = useRouter();
  const [selected, setSelected] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const byId = useMemo(() => new Map(candidates.map((candidate) => [candidate.id, candidate])), [candidates]);

  const linked = relationships.map((relationship) => ({
    relationshipId: relationship.id,
    product: byId.get(
      relationship.product_id === productId ? relationship.related_product_id : relationship.product_id,
    ),
  }));

  const linkedIds = new Set(linked.map((entry) => entry.product?.id));
  const available = candidates.filter((candidate) => !linkedIds.has(candidate.id));

  async function add() {
    if (!selected) return;
    setBusy(true);
    setError(null);
    try {
      const { error: insertError } = await createClient().from("product_relationships").insert({
        product_id: productId,
        related_product_id: selected,
        relationship_type: "complete_the_look",
      });
      if (insertError) throw new Error(insertError.message);
      setSelected("");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not link the product.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(relationshipId: string) {
    setBusy(true);
    setError(null);
    try {
      const { error: deleteError } = await createClient()
        .from("product_relationships")
        .delete()
        .eq("id", relationshipId);
      if (deleteError) throw new Error(deleteError.message);
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not remove the link.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="card p-6">
      <h2 className="text-xl">Shop the Look — matching products</h2>
      <p className="mt-1 text-sm text-ink-700">
        Link a saree with matching jewellery. Linked products appear under “Complete the Look” on both
        product pages.
      </p>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <select
          className="input sm:max-w-md"
          value={selected}
          onChange={(event) => setSelected(event.target.value)}
          aria-label="Choose a product to link"
        >
          <option value="">Choose a product…</option>
          {available.map((candidate) => (
            <option key={candidate.id} value={candidate.id}>
              {candidate.name} ({candidate.product_code}) — {candidate.category?.name ?? "Uncategorised"}
            </option>
          ))}
        </select>
        <button type="button" onClick={add} disabled={!selected || busy} className="btn-outline px-5 py-2 text-xs">
          Link product
        </button>
      </div>

      {error && <p className="mt-3 text-sm text-maroon-700">{error}</p>}

      <ul className="mt-5 space-y-2">
        {linked.length === 0 && <li className="text-sm text-ink-700">No matching products linked yet.</li>}
        {linked.map((entry) => (
          <li
            key={entry.relationshipId}
            className="flex items-center justify-between gap-3 rounded-lg border border-cream-200 px-4 py-2.5 text-sm"
          >
            <span>
              {entry.product ? `${entry.product.name} (${entry.product.product_code})` : "Unknown product"}
            </span>
            <button
              type="button"
              onClick={() => remove(entry.relationshipId)}
              disabled={busy}
              className="text-xs text-maroon-700 hover:underline disabled:opacity-50"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

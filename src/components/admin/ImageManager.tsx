"use client";

import Image from "next/image";
import { useState, type ChangeEvent } from "react";

import { compressImage, type GalleryItem } from "@/lib/admin/images";

export default function ImageManager({
  items,
  onChange,
  onRemove,
}: {
  items: GalleryItem[];
  onChange: (items: GalleryItem[]) => void;
  onRemove: (item: GalleryItem) => void;
}) {
  const [busy, setBusy] = useState(false);

  async function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    setBusy(true);
    try {
      const compressed = await Promise.all(
        files.map(async (file) => {
          const optimised = await compressImage(file);
          return {
            key: `pending-${crypto.randomUUID()}`,
            url: URL.createObjectURL(optimised),
            file: optimised,
          } satisfies GalleryItem;
        }),
      );
      onChange([...items, ...compressed]);
    } finally {
      setBusy(false);
      event.target.value = "";
    }
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  function remove(index: number) {
    const item = items[index];
    onChange(items.filter((_, i) => i !== index));
    if (item.existingId) onRemove(item);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <label className="btn-outline cursor-pointer px-4 py-2 text-xs">
          {items.length === 0 ? "Upload main image" : "Upload more images"}
          <input
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={handleFiles}
            disabled={busy}
          />
        </label>
        {busy && <span className="text-xs text-ink-700">Optimising images…</span>}
        <span className="text-xs text-ink-700">
          The first image is the main photo. Images are compressed before upload.
        </span>
      </div>

      {items.length > 0 && (
        <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item, index) => (
            <li key={item.key} className="card overflow-hidden">
              <div className="relative aspect-square bg-cream-200">
                {item.file ? (
                  // Local object URL preview — next/image cannot handle blob: sources.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.url}
                    alt={item.altText || `Product photo ${index + 1}`}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <Image
                    src={item.url}
                    alt={item.altText || `Product photo ${index + 1}`}
                    fill
                    sizes="200px"
                    className="object-cover"
                  />
                )}
                {index === 0 && (
                  <span className="absolute left-2 top-2 rounded-full bg-gold-400 px-2 py-0.5 text-[10px] font-semibold uppercase text-white">
                    Main
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between gap-1 p-2">
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    aria-label="Move image earlier"
                    className="rounded border border-cream-300 px-2 py-1 text-xs disabled:opacity-40"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === items.length - 1}
                    aria-label="Move image later"
                    className="rounded border border-cream-300 px-2 py-1 text-xs disabled:opacity-40"
                  >
                    →
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="rounded px-2 py-1 text-xs text-maroon-600 hover:bg-maroon-600/10"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { CloseIcon } from "@/components/ui/icons";
import type { ProductImage } from "@/lib/types";

export default function ProductGallery({
  images,
  productName,
}: {
  images: ProductImage[];
  productName: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    if (!zoomed) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setZoomed(false);
      if (event.key === "ArrowRight") setActiveIndex((index) => (index + 1) % images.length);
      if (event.key === "ArrowLeft") setActiveIndex((index) => (index - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [zoomed, images.length]);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[3/4] w-full items-center justify-center rounded-2xl bg-gradient-to-br from-cream-200 to-gold-50 text-ink-700">
        Photo coming soon
      </div>
    );
  }

  const active = images[Math.min(activeIndex, images.length - 1)];

  return (
    <div>
      <button
        type="button"
        onClick={() => setZoomed(true)}
        className="relative block aspect-[3/4] w-full overflow-hidden rounded-2xl bg-cream-200"
        aria-label="View larger image"
      >
        <Image
          src={active.image_url}
          alt={active.alt_text || productName}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </button>

      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2 sm:gap-3">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`View image ${index + 1} of ${images.length}`}
              aria-current={index === activeIndex}
              className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                index === activeIndex ? "border-gold-400" : "border-transparent hover:border-gold-200"
              }`}
            >
              <Image
                src={image.image_url}
                alt={image.alt_text || `${productName} photo ${index + 1}`}
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {zoomed && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${productName} enlarged photo`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/90 p-4"
          onClick={() => setZoomed(false)}
        >
          <button
            type="button"
            aria-label="Close"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            onClick={() => setZoomed(false)}
          >
            <CloseIcon />
          </button>
          <div
            className="relative h-[85vh] w-full max-w-3xl"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={active.image_url}
              alt={active.alt_text || productName}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import imageCompression from "browser-image-compression";

import { createClient } from "@/lib/supabase/client";
import { PRODUCT_IMAGE_BUCKET } from "@/lib/supabase/config";
import type { ProductImage } from "@/lib/types";

export interface GalleryItem {
  key: string;
  url: string;
  /** Set for images picked in the browser that are not uploaded yet. */
  file?: File;
  /** Set for images already stored in Supabase. */
  existingId?: string;
  storagePath?: string | null;
  altText?: string | null;
}

const COMPRESSION_OPTIONS = {
  maxSizeMB: 0.35,
  maxWidthOrHeight: 1600,
  useWebWorker: true,
  fileType: "image/webp",
};

/** Compress in the browser so Supabase Free storage lasts as long as possible. */
export async function compressImage(file: File): Promise<File> {
  try {
    const compressed = await imageCompression(file, COMPRESSION_OPTIONS);
    return new File([compressed], `${file.name.replace(/\.[^.]+$/, "")}.webp`, {
      type: "image/webp",
    });
  } catch {
    return file;
  }
}

export function toGalleryItems(images: ProductImage[]): GalleryItem[] {
  return images.map((image) => ({
    key: image.id,
    url: image.image_url,
    existingId: image.id,
    storagePath: image.storage_path,
    altText: image.alt_text,
  }));
}

/**
 * Writes the gallery to Supabase: removes deleted images (row + storage object),
 * uploads pending files and rewrites display_order / is_primary for every image.
 */
export async function persistGallery(
  productId: string,
  items: GalleryItem[],
  removed: GalleryItem[],
): Promise<void> {
  const supabase = createClient();

  const removedIds = removed.map((item) => item.existingId).filter((id): id is string => Boolean(id));
  const removedPaths = removed
    .map((item) => item.storagePath)
    .filter((path): path is string => Boolean(path));

  if (removedIds.length > 0) {
    const { error } = await supabase.from("product_images").delete().in("id", removedIds);
    if (error) throw new Error(`Could not delete images: ${error.message}`);
  }
  if (removedPaths.length > 0) {
    await supabase.storage.from(PRODUCT_IMAGE_BUCKET).remove(removedPaths);
  }

  for (const [index, item] of items.entries()) {
    if (item.file) {
      const extension = item.file.type === "image/webp" ? "webp" : item.file.name.split(".").pop() || "jpg";
      const path = `${productId}/${crypto.randomUUID()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from(PRODUCT_IMAGE_BUCKET)
        .upload(path, item.file, { cacheControl: "31536000", upsert: false });
      if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`);

      const {
        data: { publicUrl },
      } = supabase.storage.from(PRODUCT_IMAGE_BUCKET).getPublicUrl(path);

      const { error: insertError } = await supabase.from("product_images").insert({
        product_id: productId,
        image_url: publicUrl,
        storage_path: path,
        alt_text: item.altText ?? null,
        is_primary: index === 0,
        display_order: index,
      });
      if (insertError) throw new Error(`Could not save image: ${insertError.message}`);
    } else if (item.existingId) {
      const { error } = await supabase
        .from("product_images")
        .update({ display_order: index, is_primary: index === 0 })
        .eq("id", item.existingId);
      if (error) throw new Error(`Could not reorder images: ${error.message}`);
    }
  }
}

/** Deletes every stored object for a product (used before deleting the product row). */
export async function deleteProductImages(productId: string): Promise<void> {
  const supabase = createClient();
  const { data } = await supabase
    .from("product_images")
    .select("storage_path")
    .eq("product_id", productId);

  const paths = ((data as { storage_path: string | null }[] | null) ?? [])
    .map((row) => row.storage_path)
    .filter((path): path is string => Boolean(path));

  if (paths.length > 0) {
    await supabase.storage.from(PRODUCT_IMAGE_BUCKET).remove(paths);
  }
}

import { createClient } from "@supabase/supabase-js";

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "menu-images";
const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export class ImageUploadError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

function storageClient() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new ImageUploadError(
      "Image upload isn't configured yet — SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not set",
      503,
    );
  }
  // Uses the service role key (server-only, never sent to the browser) so this
  // can write to a bucket regardless of its public read policy.
  return createClient(url, serviceRoleKey);
}

/** Uploads a menu item photo to Supabase Storage and returns its public URL. */
export async function uploadMenuItemImage(itemId: string, file: File): Promise<string> {
  const ext = ALLOWED_TYPES[file.type];
  if (!ext) {
    throw new ImageUploadError("Only JPEG, PNG, or WebP images are allowed");
  }
  if (file.size > MAX_FILE_BYTES) {
    throw new ImageUploadError("Image must be smaller than 5MB");
  }

  const supabase = storageClient();
  const path = `items/${itemId}-${Date.now()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, {
    contentType: file.type,
    upsert: true,
  });
  if (error) {
    throw new ImageUploadError(`Upload failed: ${error.message}`, 502);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

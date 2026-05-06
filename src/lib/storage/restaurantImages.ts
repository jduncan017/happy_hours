import type { SupabaseClient } from "@supabase/supabase-js";

const BUCKET = "restaurant-images";

// Bucket allows these (per migration 010). Anything else falls back.
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const FETCH_TIMEOUT_MS = 8000;
const MAX_BYTES = 10 * 1024 * 1024; // matches bucket file_size_limit

interface StoreResult {
  publicUrl: string;
  bytes: number;
  contentType: string;
  storagePath: string;
}

// Slug + short-id-suffix naming: human-readable in the Supabase UI, but a
// trailing 8-char id segment guarantees uniqueness for restaurants that
// share a name.
function slugify(name: string): string {
  const slug = name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/\p{M}/gu, "") // strip combining diacritic marks
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return slug || "restaurant";
}

function shortId(restaurantId: string): string {
  return restaurantId.replace(/-/g, "").slice(0, 8);
}

export function buildRestaurantImagePath(
  restaurantId: string,
  name: string,
  contentType: string,
): string {
  const ext = EXT_BY_MIME[contentType];
  if (!ext) throw new Error(`Unsupported content-type: ${contentType}`);
  return `${slugify(name)}-${shortId(restaurantId)}.${ext}`;
}

/**
 * Pull the path inside the bucket out of a public storage URL. Returns
 * null if the URL doesn't point at our bucket.
 */
export function extractStoragePath(url: string | null | undefined): string | null {
  if (!url) return null;
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return url.slice(idx + marker.length);
}

/**
 * Best-effort removal of a stored image. Swallows errors — caller is
 * usually deleting a restaurant and we don't want a missing object to
 * block that.
 */
export async function deleteRestaurantImage(
  admin: SupabaseClient,
  pathOrUrl: string | null | undefined,
): Promise<{ removed: boolean; error?: string }> {
  if (!pathOrUrl) return { removed: false };
  const path = pathOrUrl.startsWith("http")
    ? extractStoragePath(pathOrUrl)
    : pathOrUrl;
  if (!path) return { removed: false };
  const { error } = await admin.storage.from(BUCKET).remove([path]);
  if (error) {
    return { removed: false, error: error.message };
  }
  return { removed: true };
}

/**
 * Download an image from a remote URL and upload it to the
 * `restaurant-images` bucket, keyed by restaurantId. Returns the public
 * Supabase Storage URL on success, throws on any failure.
 *
 * Caller should handle errors and store the fallback `/photo-missing.webp`
 * URL in the DB if this throws.
 */
export async function downloadAndStoreRestaurantImage(
  admin: SupabaseClient,
  restaurantId: string,
  restaurantName: string,
  sourceUrl: string,
): Promise<StoreResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(sourceUrl, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        // Some sites block default fetch UA
        "User-Agent":
          "Mozilla/5.0 (compatible; HappyHourHuntBot/1.0; +https://happyhourhunt.com)",
        Accept: "image/*,*/*;q=0.8",
      },
    });
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) {
    throw new Error(`Source returned HTTP ${res.status}`);
  }

  const contentType = (res.headers.get("content-type") || "")
    .split(";")[0]
    .trim()
    .toLowerCase();

  if (!ALLOWED_MIME.has(contentType)) {
    throw new Error(`Unsupported content-type: ${contentType || "unknown"}`);
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  if (buffer.byteLength === 0) {
    throw new Error("Empty image body");
  }
  if (buffer.byteLength > MAX_BYTES) {
    throw new Error(
      `Image too large: ${buffer.byteLength} bytes (max ${MAX_BYTES})`,
    );
  }

  const path = buildRestaurantImagePath(restaurantId, restaurantName, contentType);

  const { error: uploadError } = await admin.storage
    .from(BUCKET)
    .upload(path, buffer, {
      contentType,
      cacheControl: "31536000", // 1 year — stable storage URL, content rarely changes
      upsert: true,
    });

  if (uploadError) {
    throw new Error(`Storage upload failed: ${uploadError.message}`);
  }

  const { data } = admin.storage.from(BUCKET).getPublicUrl(path);
  if (!data?.publicUrl) {
    throw new Error("Storage returned no public URL");
  }

  return {
    publicUrl: data.publicUrl,
    bytes: buffer.byteLength,
    contentType,
    storagePath: path,
  };
}

export const RESTAURANT_IMAGE_BUCKET = BUCKET;

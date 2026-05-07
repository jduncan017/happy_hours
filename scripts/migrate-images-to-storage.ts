#!/usr/bin/env tsx
/**
 * Copy each restaurant's hero image into the `restaurant-images` Supabase
 * Storage bucket using a slug-based filename ({slug}-{shortid}.ext) so the
 * Storage UI is human-readable.
 *
 * Idempotent. Three cases per row:
 *   - external URL  → download from source, upload at new path, save URL
 *   - old storage path ({id}/hero.ext) → download from storage, upload at
 *     new slug path, delete old object, save URL
 *   - already at new slug path → skip
 *
 * Usage:
 *   npx tsx scripts/migrate-images-to-storage.ts            # all rows
 *   npx tsx scripts/migrate-images-to-storage.ts --dry-run  # report only
 *   npx tsx scripts/migrate-images-to-storage.ts --limit 5
 */

import { config } from "dotenv";
import { createAdminClient } from "../src/lib/supabase/admin";
import {
  RESTAURANT_IMAGE_BUCKET,
  buildRestaurantImagePath,
  deleteRestaurantImage,
  downloadAndStoreRestaurantImage,
  extractStoragePath,
} from "../src/lib/storage/restaurantImages";
import { normalizeImageUrl } from "../src/utils/image/normalizeImageUrl";

config({ path: ".env.local" });

interface Args {
  dryRun: boolean;
  limit: number | null;
  concurrency: number;
}

function parseArgs(argv: string[]): Args {
  const out: Args = { dryRun: false, limit: null, concurrency: 4 };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--dry-run") out.dryRun = true;
    else if (arg === "--limit") out.limit = parseInt(argv[++i] ?? "0", 10) || null;
    else if (arg === "--concurrency")
      out.concurrency = Math.max(1, parseInt(argv[++i] ?? "4", 10) || 4);
  }
  return out;
}

interface Row {
  id: string;
  name: string;
  hero_image: string | null;
}

interface RowResult {
  id: string;
  name: string;
  status: "skipped" | "migrated" | "renamed" | "fallback" | "error";
  message?: string;
  bytes?: number;
}

const MIME_BY_EXT: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

function expectedNewPathPrefix(id: string, name: string): string {
  // Path without extension — used for "already at new path" detection.
  const stub = buildRestaurantImagePath(id, name, "image/jpeg");
  return stub.replace(/\.jpg$/, "");
}

async function processOne(
  admin: ReturnType<typeof createAdminClient>,
  row: Row,
  dryRun: boolean,
): Promise<RowResult> {
  const url = row.hero_image?.trim() ?? "";

  if (!url) {
    return { id: row.id, name: row.name, status: "skipped", message: "no hero_image" };
  }
  if (url === "/photo-missing.webp") {
    return { id: row.id, name: row.name, status: "skipped", message: "fallback already" };
  }

  const currentStoragePath = extractStoragePath(url);
  const newPathStem = expectedNewPathPrefix(row.id, row.name);

  // Already at the new slug-based path
  if (
    currentStoragePath &&
    currentStoragePath.startsWith(newPathStem + ".")
  ) {
    return { id: row.id, name: row.name, status: "skipped", message: "already at new path" };
  }

  if (dryRun) {
    const action = currentStoragePath ? "rename" : "fetch+upload";
    return {
      id: row.id,
      name: row.name,
      status: "migrated",
      message: `would ${action} → ${newPathStem}.<ext>`,
    };
  }

  // Source URL we'll download from. Normalize protocol-relative URLs first
  // (a few rows had `//cdn/foo` from old OG scrapes).
  const normalized = normalizeImageUrl(url, "");
  const sourceUrl =
    normalized && /^https?:\/\//i.test(normalized) ? normalized : null;
  if (!sourceUrl) {
    return {
      id: row.id,
      name: row.name,
      status: "skipped",
      message: `non-http URL: ${url}`,
    };
  }

  try {
    const result = await downloadAndStoreRestaurantImage(
      admin,
      row.id,
      row.name,
      sourceUrl,
    );

    const { error: updateError } = await admin
      .from("restaurants")
      .update({ hero_image: result.publicUrl })
      .eq("id", row.id);
    if (updateError) {
      return {
        id: row.id,
        name: row.name,
        status: "error",
        message: `db update: ${updateError.message}`,
      };
    }

    // If we just renamed (old storage path → new), purge the old object.
    if (currentStoragePath && currentStoragePath !== result.storagePath) {
      const del = await deleteRestaurantImage(admin, currentStoragePath);
      if (!del.removed && del.error) {
        console.warn(
          `  ⚠ couldn't delete old object ${currentStoragePath}: ${del.error}`,
        );
      }
    }

    return {
      id: row.id,
      name: row.name,
      status: currentStoragePath ? "renamed" : "migrated",
      bytes: result.bytes,
    };
  } catch (err) {
    const message = (err as Error).message;
    // Only sticky-fallback for first-time copy failures, not rename failures
    if (!currentStoragePath) {
      const { error: updateError } = await admin
        .from("restaurants")
        .update({ hero_image: "/photo-missing.webp" })
        .eq("id", row.id);
      return {
        id: row.id,
        name: row.name,
        status: "fallback",
        message: updateError
          ? `${message}; update failed: ${updateError.message}`
          : message,
      };
    }
    return {
      id: row.id,
      name: row.name,
      status: "error",
      message,
    };
  }
}

async function runWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  worker: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;

  async function pump() {
    while (true) {
      const idx = cursor++;
      if (idx >= items.length) return;
      results[idx] = await worker(items[idx]);
    }
  }

  await Promise.all(Array.from({ length: concurrency }, pump));
  return results;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const admin = createAdminClient();

  console.log(
    `🔄 Migrating restaurant hero images → ${RESTAURANT_IMAGE_BUCKET}` +
      (args.dryRun ? " (DRY RUN)" : "") +
      (args.limit ? `, limit=${args.limit}` : "") +
      `, concurrency=${args.concurrency}`,
  );

  const { data: rows, error } = await admin
    .from("restaurants")
    .select("id, name, hero_image")
    .order("name", { ascending: true });

  if (error) {
    console.error("❌ Failed to load restaurants:", error.message);
    process.exit(1);
  }
  if (!rows || rows.length === 0) {
    console.log("No restaurants found.");
    return;
  }

  const slice = args.limit ? rows.slice(0, args.limit) : rows;
  console.log(`📦 Processing ${slice.length} of ${rows.length} restaurants\n`);

  const results = await runWithConcurrency(slice, args.concurrency, (row) => {
    return processOne(admin, row as Row, args.dryRun).then((r) => {
      const tag =
        r.status === "migrated"
          ? "✅"
          : r.status === "renamed"
            ? "🔁"
            : r.status === "skipped"
              ? "⏭"
              : r.status === "fallback"
                ? "🪶"
                : "❌";
      const detail = r.bytes
        ? `${(r.bytes / 1024).toFixed(0)}KB`
        : (r.message ?? "");
      console.log(`${tag} ${r.name} — ${detail}`);
      return r;
    });
  });

  const counts = results.reduce(
    (acc, r) => ({ ...acc, [r.status]: (acc[r.status] ?? 0) + 1 }),
    {} as Record<RowResult["status"], number>,
  );

  console.log("\n— summary —");
  console.log(`  migrated: ${counts.migrated ?? 0}`);
  console.log(`  renamed:  ${counts.renamed ?? 0}`);
  console.log(`  skipped:  ${counts.skipped ?? 0}`);
  console.log(`  fallback: ${counts.fallback ?? 0}`);
  console.log(`  error:    ${counts.error ?? 0}`);

  if ((counts.error ?? 0) > 0) {
    console.log("\nErrors:");
    for (const r of results.filter((r) => r.status === "error")) {
      console.log(`  - ${r.name}: ${r.message}`);
    }
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});

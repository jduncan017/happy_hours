/**
 * Coerce an image URL into something `next/image` accepts. Restaurants'
 * OG tags occasionally serve protocol-relative URLs (`//cdn.foo/img.jpg`),
 * which Next rejects. Convert to https. Pass-through for already-valid URLs.
 *
 * Returns the fallback path if the input is null/empty.
 */
export function normalizeImageUrl(
  url: string | null | undefined,
  fallback = "/photo-missing.webp",
): string {
  if (!url) return fallback;
  const trimmed = url.trim();
  if (!trimmed) return fallback;
  if (trimmed.startsWith("//")) return `https:${trimmed}`;
  return trimmed;
}

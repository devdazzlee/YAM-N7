const PLACEHOLDER_PATHS = new Set(['/Banner-01.jpg', '/banner-01.jpg']);

/** True when the URL is a real remote/local image, not empty or a site placeholder. */
export function isValidImageUrl(url?: string | null): boolean {
  if (!url || !url.trim()) return false;
  const trimmed = url.trim();
  if (PLACEHOLDER_PATHS.has(trimmed)) return false;
  return true;
}

/**
 * Convert broker name to URL-friendly slug
 * Example: "IC Markets Global" -> "ic-markets-global"
 */
export function brokerNameToSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

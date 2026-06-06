/**
 * Sanitize user input to prevent XSS and injection attacks.
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .trim();
}

/**
 * Strip HTML tags from input
 */
export function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, "").trim();
}

/**
 * Validate that a string doesn't contain potential SQL injection patterns
 */
export function isSafeString(input: string): boolean {
  const dangerousPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|EXEC)\b)/i,
    /(--|\/\*|\*\/|;)/,
    /(\bOR\b\s+\b\d+\b\s*=\s*\b\d+\b)/i,
  ];

  return !dangerousPatterns.some((pattern) => pattern.test(input));
}

/**
 * Validate and sanitize a slug
 */
export function sanitizeSlug(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 200);
}

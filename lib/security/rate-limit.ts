import { createServiceRoleClient } from "@/lib/supabase/server";

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number; // milliseconds
}

const RATE_LIMITS: Record<string, RateLimitConfig> = {
  generate: { maxRequests: 10, windowMs: 60 * 1000 }, // 10 per minute
  login: { maxRequests: 5, windowMs: 60 * 1000 }, // 5 per minute
  signup: { maxRequests: 3, windowMs: 60 * 1000 }, // 3 per minute
  api: { maxRequests: 30, windowMs: 60 * 1000 }, // 30 per minute
};

export async function checkRateLimit(
  identifier: string,
  action: keyof typeof RATE_LIMITS
): Promise<{ allowed: boolean; remaining: number; retryAfter?: number }> {
  const config = RATE_LIMITS[action];
  if (!config) return { allowed: true, remaining: 999 };

  const supabase = createServiceRoleClient();
  const windowStart = new Date(Date.now() - config.windowMs).toISOString();

  // Count requests in window
  const { count } = await supabase
    .from("rate_limits")
    .select("id", { count: "exact", head: true })
    .eq("identifier", identifier)
    .eq("action", action)
    .gte("window_start", windowStart);

  const currentCount = count || 0;
  const remaining = Math.max(0, config.maxRequests - currentCount);

  if (currentCount >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      retryAfter: Math.ceil(config.windowMs / 1000),
    };
  }

  // Record this request
  await supabase.from("rate_limits").insert({
    identifier,
    action,
    window_start: new Date().toISOString(),
  });

  return { allowed: true, remaining: remaining - 1 };
}

export function getRateLimitHeaders(result: { remaining: number; retryAfter?: number }) {
  const headers: Record<string, string> = {
    "X-RateLimit-Remaining": result.remaining.toString(),
  };
  if (result.retryAfter) {
    headers["Retry-After"] = result.retryAfter.toString();
  }
  return headers;
}

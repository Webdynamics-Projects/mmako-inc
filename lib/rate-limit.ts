/**
 * Minimal in-memory, per-IP fixed-window rate limiter.
 *
 * Deliberately dependency-free and process-local: it stops casual form abuse
 * from a single client, which is what a firm's contact form needs. On a
 * serverless platform each instance keeps its own counter, so if the site ever
 * needs hard guarantees across instances, swap this for a shared store
 * (Upstash Redis, Vercel KV) behind the same `check()` signature.
 */

type Entry = { count: number; resetAt: number };

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS = 5;
const MAX_ENTRIES = 5_000; // bounds memory if traffic spikes

const hits = new Map<string, Entry>();

function sweep(now: number) {
  for (const [key, entry] of hits) {
    if (entry.resetAt <= now) hits.delete(key);
  }
}

export function checkRateLimit(key: string): {
  allowed: boolean;
  retryAfterSeconds: number;
} {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || entry.resetAt <= now) {
    if (hits.size >= MAX_ENTRIES) sweep(now);
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  entry.count += 1;

  if (entry.count > MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
    };
  }

  return { allowed: true, retryAfterSeconds: 0 };
}

/** Best-effort client IP from the proxy headers Vercel sets. */
export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return headers.get("x-real-ip")?.trim() || "unknown";
}

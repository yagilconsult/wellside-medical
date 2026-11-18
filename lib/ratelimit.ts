import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { headers } from "next/headers";

/**
 * Rate limiting backed by Upstash Redis (works on serverless, unlike in-memory counters).
 *
 * Fails OPEN: if the Upstash env vars aren't set, or Upstash is unreachable, requests are
 * allowed. A rate limiter outage must never lock patients out of care.
 */

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = url && token ? new Redis({ url, token }) : null;

const cache = new Map<string, Ratelimit>();

function getLimiter(name: string, max: number, window: `${number} ${"s" | "m" | "h"}`) {
  if (!redis) return null;
  const id = `${name}:${max}:${window}`;
  let rl = cache.get(id);
  if (!rl) {
    rl = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(max, window),
      prefix: `wellside:${name}`,
    });
    cache.set(id, rl);
  }
  return rl;
}

/** Client IP. On Vercel, x-forwarded-for is set by the platform (the client can't spoof it). */
export function clientIp(h: Headers | Record<string, unknown> | undefined): string {
  const get = (k: string) => {
    if (!h) return undefined;
    if (typeof (h as Headers).get === "function") return (h as Headers).get(k) ?? undefined;
    const v = (h as Record<string, unknown>)[k];
    return Array.isArray(v) ? String(v[0]) : (v as string | undefined);
  };
  const xff = get("x-forwarded-for");
  return (xff?.split(",")[0] || get("x-real-ip") || "unknown").trim();
}

/** IP of the current request, for server actions and route handlers. */
export function currentIp(): string {
  try {
    return clientIp(headers());
  } catch {
    return "unknown";
  }
}

/** Returns true if the request is allowed, false if the limit is exceeded. */
export async function allow(
  name: string,
  key: string,
  max: number,
  window: `${number} ${"s" | "m" | "h"}`
): Promise<boolean> {
  const rl = getLimiter(name, max, window);
  if (!rl) return true;
  try {
    const { success } = await rl.limit(key);
    return success;
  } catch {
    return true;
  }
}

export const TOO_MANY = "Too many attempts. Please wait a few minutes and try again.";

import { notFound } from "next/navigation";

/**
 * Catch-all that hands unmatched URLs to the site's own 404 page.
 *
 * With the editor on a second root layout, an unmatched address no longer
 * belongs to either route group, and Next falls back to its bare built-in 404
 * rather than the branded one. Matching here, at the lowest possible priority,
 * puts the request back inside the site group so `not-found.tsx` renders with
 * the usual navigation and footer. Every real route is more specific than a
 * catch-all, so nothing else is affected.
 */
export default function NotFoundCatchAll(): never {
  notFound();
}

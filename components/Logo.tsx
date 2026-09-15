import Link from "next/link";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";

/**
 * The firm's logo, linked to the homepage.
 *
 * Served as SVG straight from the designer's artwork — crisp at every size, a
 * few KB, and no colour variants to keep in sync. `tone="dark"` means the logo
 * sits on a dark surface, so the reversed artwork is used.
 *
 * Regenerate the files with `npm run logo` after replacing
 * brand/_source/logo/mmako-logo.svg.
 */

/* Aspect ratios of the generated files, from the artwork's own geometry. */
const RATIO = { lockup: 1.337, horizontal: 4.283 } as const;

type LogoProps = {
  tone?: "dark" | "light";
  /**
   * "horizontal" is the monogram beside the wordmark — the only version that
   * stays legible at header height. "lockup" is the full stacked mark.
   */
  variant?: "lockup" | "horizontal";
  /** Rendered height in px; width follows the artwork's ratio. */
  height?: number;
  priority?: boolean;
  className?: string;
};

export function Logo({
  tone = "dark",
  variant = "horizontal",
  height = 34,
  priority = false,
  className,
}: LogoProps) {
  const suffix = tone === "dark" ? "-light" : "";
  const src = variant === "horizontal"
    ? `/logo-mark${suffix}.svg`
    : `/logo${suffix}.svg`;
  const width = Math.round(height * RATIO[variant]);

  return (
    <Link
      href="/"
      className={cn(
        "inline-flex shrink-0 items-center transition-opacity duration-200 hover:opacity-85",
        className,
      )}
      aria-label={`${site.name} — home`}
    >
      {/* A plain <img>: next/image adds no value for SVG, which it passes
          through unoptimised anyway. Width and height are set so the box is
          reserved before load and nothing shifts. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        width={width}
        height={height}
        style={{ height: `${height}px`, width: `${width}px` }}
        fetchPriority={priority ? "high" : undefined}
        className="select-none"
      />
    </Link>
  );
}

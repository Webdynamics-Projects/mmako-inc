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

/* Intrinsic dimensions are set on the <img> so the browser reserves the right
   box before the file loads, whatever CSS height is applied. */
const INTRINSIC_HEIGHT = 100;

type LogoProps = {
  tone?: "dark" | "light";
  /**
   * "lockup" is the full stacked mark — monogram, wordmark, rule. "horizontal"
   * sets the monogram beside the wordmark, for bands too short for the stack.
   */
  variant?: "lockup" | "horizontal";
  /** Fixed rendered height in px. Ignored when `heightClassName` is given. */
  height?: number;
  /** Responsive Tailwind height classes, e.g. "h-[68px] sm:h-[88px]". */
  heightClassName?: string;
  priority?: boolean;
  className?: string;
};

export function Logo({
  tone = "dark",
  variant = "horizontal",
  height = 34,
  heightClassName,
  priority = false,
  className,
}: LogoProps) {
  const suffix = tone === "dark" ? "-light" : "";
  const src = variant === "horizontal"
    ? `/logo-mark${suffix}.svg`
    : `/logo${suffix}.svg`;

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
          through unoptimised anyway. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        width={Math.round(INTRINSIC_HEIGHT * RATIO[variant])}
        height={INTRINSIC_HEIGHT}
        style={heightClassName ? undefined : { height: `${height}px` }}
        fetchPriority={priority ? "high" : undefined}
        className={cn("w-auto select-none", heightClassName)}
      />
    </Link>
  );
}

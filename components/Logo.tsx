import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";

/* Intrinsic sizes of the generated assets. If scripts/make-logo-variants.mjs
   reports different aspect ratios after the logo is replaced, update these. */
const FULL = { width: 458, height: 417 };
const MARK = { width: 380, height: 278 };

type LogoProps = {
  /** Which surface it sits on — picks the original or the reversed artwork. */
  tone?: "dark" | "light";
  /**
   * "lockup" is the supplied stacked logo, for places with vertical room.
   * "horizontal" pairs the monogram with a typeset wordmark, which stays
   * legible at header height where the stacked wordmark does not.
   */
  variant?: "lockup" | "horizontal";
  /** Rendered height of the artwork in px; width follows its aspect ratio. */
  height?: number;
  priority?: boolean;
  className?: string;
};

export function Logo({
  tone = "dark",
  variant = "horizontal",
  height = 36,
  priority = false,
  className,
}: LogoProps) {
  const isMark = variant === "horizontal";
  const size = isMark ? MARK : FULL;
  const suffix = tone === "dark" ? "light" : "dark";
  const src = isMark
    ? `/logo-mark-${suffix}.png`
    : `/logo-${suffix}.png`;

  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex shrink-0 items-center gap-3 transition-opacity duration-200 hover:opacity-85",
        className,
      )}
      aria-label={`${site.name} — home`}
    >
      <Image
        src={src}
        alt=""
        width={size.width}
        height={size.height}
        priority={priority}
        style={{ height: `${height}px`, width: "auto" }}
        className="select-none"
      />

      {isMark && (
        <span className="flex items-baseline gap-1.5">
          <span
            className={cn(
              "font-display text-xl tracking-tight sm:text-[1.35rem]",
              tone === "dark" ? "text-bone" : "text-ink",
            )}
          >
            Mmako
          </span>
          <span className="font-display text-xl tracking-tight text-gold sm:text-[1.35rem]">
            Inc.
          </span>
        </span>
      )}
    </Link>
  );
}

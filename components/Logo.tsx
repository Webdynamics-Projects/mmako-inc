import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * Wordmark. Typographic rather than a graphic file, so it stays crisp at every
 * size and adds no image weight.
 * TODO: replace with the real logo file once brand assets are supplied.
 */
export function Logo({
  tone = "dark",
  className,
}: {
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex items-baseline gap-1.5", className)}
      aria-label="Mmako Inc. — home"
    >
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
    </Link>
  );
}

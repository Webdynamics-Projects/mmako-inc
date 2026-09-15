"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

type RevealProps = {
  children: React.ReactNode;
  /** Stagger helper — multiplied by 60ms, capped so long lists don't crawl. */
  index?: number;
  className?: string;
  /**
   * Element to render. Set to "li" inside a list so the wrapper doesn't break
   * the list's semantics by sitting between <ul> and its items.
   */
  as?: "div" | "li";
};

/**
 * A single, light scroll reveal used site-wide: a short fade and 12px rise,
 * played once.
 *
 * Deliberately not driven by a motion library. The element renders *visible*
 * in the server HTML and is only hidden once JS has confirmed it can animate
 * it back in — so the content is never invisible to a crawler, a user with JS
 * disabled, or anyone on a slow connection waiting for hydration, and it never
 * delays the largest-contentful paint. `prefers-reduced-motion` is honoured in
 * globals.css, which collapses the transition to nothing.
 */
export function Reveal({
  children,
  index = 0,
  className,
  as: Tag = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReduced || typeof IntersectionObserver === "undefined") return;

    // Already on screen at mount (above the fold): show it immediately rather
    // than animating, so the first paint stays stable.
    if (el.getBoundingClientRect().top < window.innerHeight) {
      el.dataset.revealed = "true";
      return;
    }

    el.dataset.reveal = "pending";

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.dataset.revealed = "true";
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -60px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement & HTMLLIElement>}
      className={cn("reveal", className)}
      style={
        { "--reveal-delay": `${Math.min(index, 6) * 60}ms` } as React.CSSProperties
      }
    >
      {children}
    </Tag>
  );
}

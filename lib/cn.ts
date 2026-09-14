/** Tiny className joiner — avoids pulling in a dependency for string concat. */
export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

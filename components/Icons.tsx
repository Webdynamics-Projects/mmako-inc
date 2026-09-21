/**
 * Line icon drawn at 24×24 on a 1.25px stroke. Deliberately geometric rather
 * than illustrative, to sit alongside the gold rule accents.
 */

type IconProps = {
  className?: string;
};

const svgProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.25,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: "false" as const,
};

export function ArrowIcon({ className }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M5 12h13" />
      <path d="m12.5 6.5 5.5 5.5-5.5 5.5" />
    </svg>
  );
}

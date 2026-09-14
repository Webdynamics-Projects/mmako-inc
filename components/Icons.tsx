/**
 * Minimal line-icon set drawn at 24×24 on a 1.25px stroke. Deliberately
 * geometric rather than illustrative, to sit alongside the gold rule accents.
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

export function ClarityIcon({ className }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M15.8 15.8 21 21" />
      <path d="M8.5 11h5" />
    </svg>
  );
}

export function CompassIcon({ className }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5z" />
    </svg>
  );
}

export function SpeedIcon({ className }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M4 18a9 9 0 1 1 16 0" />
      <path d="m12 14 4-4" />
      <path d="M12 18v.01" />
    </svg>
  );
}

export function ShieldIcon({ className }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M12 3 5 6v6c0 4 3 7.5 7 9 4-1.5 7-5 7-9V6z" />
      <path d="m9.5 12 1.8 1.8L15 10" />
    </svg>
  );
}

export function ArrowIcon({ className }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M5 12h13" />
      <path d="m12.5 6.5 5.5 5.5-5.5 5.5" />
    </svg>
  );
}

export const iconMap = {
  clarity: ClarityIcon,
  compass: CompassIcon,
  speed: SpeedIcon,
  shield: ShieldIcon,
} as const;

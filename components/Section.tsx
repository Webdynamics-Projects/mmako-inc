import { cn } from "@/lib/cn";

type SectionProps = {
  children: React.ReactNode;
  /** Visual treatment of the band. */
  tone?: "light" | "muted" | "dark";
  /** Vertical rhythm. */
  size?: "sm" | "md" | "lg";
  id?: string;
  className?: string;
  as?: "section" | "div" | "footer" | "header";
};

const tones = {
  light: "bg-bone text-ink",
  muted: "bg-bone-200 text-ink",
  dark: "surface-dark text-bone",
} as const;

const sizes = {
  sm: "py-14 sm:py-16",
  md: "py-20 sm:py-24",
  lg: "py-24 sm:py-32",
} as const;

export function Section({
  children,
  tone = "light",
  size = "md",
  id,
  className,
  as: Tag = "section",
}: SectionProps) {
  return (
    <Tag id={id} className={cn(tones[tone], sizes[size], className)}>
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">{children}</div>
    </Tag>
  );
}

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  tone?: "light" | "dark";
  /** Asymmetric by default — the spec calls for off-centre layouts. */
  align?: "left" | "center";
  className?: string;
  /** Heading level, so pages keep a correct document outline. */
  as?: "h1" | "h2" | "h3";
};

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  tone = "light",
  align = "left",
  className,
  as: Heading = "h2",
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <div
          className={cn(
            "mb-5 flex items-center gap-3",
            align === "center" && "justify-center",
          )}
        >
          <span className="rule-gold" aria-hidden="true" />
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-gold-dim">
            {eyebrow}
          </span>
        </div>
      )}
      <Heading
        className={cn(
          "text-3xl leading-[1.15] sm:text-4xl lg:text-[2.75rem]",
          tone === "dark" ? "text-bone" : "text-ink",
        )}
      >
        {title}
      </Heading>
      {subtitle && (
        <p
          className={cn(
            "mt-5 text-base leading-relaxed sm:text-lg",
            tone === "dark" ? "text-bone-300/80" : "text-warm-grey",
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

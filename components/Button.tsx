import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "outline" | "ghost" | "outline-dark";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-medium tracking-wide transition-all duration-200 ease-out disabled:opacity-60 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  /* Gold fill on near-black text — the highest-contrast pairing in the palette. */
  primary: "bg-gold text-ink hover:bg-gold-bright hover:-translate-y-px",
  /* For use on dark surfaces. */
  outline:
    "border border-gold/50 text-gold hover:border-gold hover:bg-gold/10 hover:-translate-y-px",
  /* For use on light surfaces. */
  "outline-dark":
    "border border-ink/20 text-ink hover:border-ink hover:bg-ink hover:text-bone hover:-translate-y-px",
  ghost: "text-ink hover:text-gold-dim underline-offset-4 hover:underline",
};

const sizes: Record<Size, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-sm sm:text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsLink = CommonProps & {
  href: string;
  external?: boolean;
};

type ButtonAsButton = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: never };

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonAsLink | ButtonAsButton) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if ("href" in props && props.href) {
    const { href, external, ...rest } = props as ButtonAsLink;

    if (external) {
      return (
        <a
          href={href}
          className={classes}
          target="_blank"
          rel="noopener noreferrer"
          {...rest}
        >
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  const { ...rest } = props as ButtonAsButton;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}

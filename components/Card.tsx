import Link from "next/link";
import { cn } from "@/lib/cn";

type CardProps = {
  children: React.ReactNode;
  tone?: "light" | "dark";
  className?: string;
  /** When set, the whole card becomes a link with a hover lift. */
  href?: string;
  as?: "div" | "li" | "article";
};

export function Card({
  children,
  tone = "light",
  className,
  href,
  as: Tag = "div",
}: CardProps) {
  const classes = cn(
    "group relative h-full border p-6 transition-all duration-300 sm:p-8",
    tone === "light"
      ? "border-ink/10 bg-white hover:border-gold/60"
      : "border-white/10 bg-white/[0.03] hover:border-gold/50 hover:bg-white/[0.06]",
    href && "hover:-translate-y-1",
    className,
  );

  if (href) {
    return (
      <Tag className="h-full">
        <Link href={href} className={cn(classes, "block")}>
          {children}
        </Link>
      </Tag>
    );
  }

  return <Tag className={classes}>{children}</Tag>;
}

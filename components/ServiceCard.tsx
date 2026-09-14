import Link from "next/link";
import { ArrowIcon } from "@/components/Icons";
import { cn } from "@/lib/cn";

type ServiceCardProps = {
  number: string;
  title: string;
  description: string;
  items: readonly string[];
  /** Teaser cards show fewer bullets and link through to /services. */
  maxItems?: number;
  href?: string;
  className?: string;
};

export function ServiceCard({
  number,
  title,
  description,
  items,
  maxItems,
  href,
  className,
}: ServiceCardProps) {
  const shown = maxItems ? items.slice(0, maxItems) : items;

  const body = (
    <>
      <div className="flex items-start justify-between gap-4">
        <span className="font-display text-sm text-gold-dim">{number}</span>
        {href && (
          <ArrowIcon className="h-5 w-5 text-warm-grey transition-all duration-300 group-hover:translate-x-1 group-hover:text-gold" />
        )}
      </div>

      <h3 className="mt-5 text-xl leading-snug text-ink sm:text-[1.35rem]">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-warm-grey">{description}</p>

      <ul className="mt-6 space-y-2.5 border-t border-ink/8 pt-6">
        {shown.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 text-sm text-ink/75"
          >
            <span
              aria-hidden="true"
              className="mt-2 h-px w-3 shrink-0 bg-gold"
            />
            {item}
          </li>
        ))}
      </ul>
    </>
  );

  const classes = cn(
    "group flex h-full flex-col border border-ink/10 bg-white p-6 transition-all duration-300 hover:border-gold/60 sm:p-8",
    href && "hover:-translate-y-1",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {body}
      </Link>
    );
  }

  return <div className={classes}>{body}</div>;
}

import { WhatsAppIcon } from "@/components/Icons";
import { whatsappHref } from "@/lib/site";

/**
 * Floating WhatsApp CTA, present on every page. Sits above the footer content
 * and stays clear of the mobile safe area.
 */
export function WhatsAppButton() {
  return (
    <a
      href={whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed bottom-5 right-5 z-40 flex h-13 w-13 items-center justify-center rounded-full bg-gold text-ink shadow-lg shadow-black/25 transition-all duration-300 hover:bg-gold-bright hover:shadow-xl sm:bottom-7 sm:right-7"
      style={{ height: "3.25rem", width: "3.25rem" }}
    >
      <WhatsAppIcon className="h-6 w-6" />
      <span className="sr-only">Chat with Mmako Inc. on WhatsApp</span>
      <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-sm bg-ink px-3 py-1.5 text-xs text-bone opacity-0 transition-opacity duration-200 group-hover:opacity-100 lg:block">
        WhatsApp us
      </span>
    </a>
  );
}

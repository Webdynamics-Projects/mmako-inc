import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { ContactForm } from "@/components/ContactForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Mmako Inc. We aim to respond within 24 hours. Offices in Irene, Centurion.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact — Mmako Inc.",
    description:
      "We aim to respond within 24 hours. Let's discuss how we can support you.",
    url: "/contact",
  },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Get in touch"
        subtitle="We aim to respond within 24 hours. Let's discuss how we can support you."
      />

      <Section tone="muted">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Direct details ------------------------------------------------ */}
          <div className="lg:col-span-4">
            <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-gold-dim">
              Direct contact
            </h2>

            <dl className="mt-6 space-y-8">
              <div>
                <dt className="text-sm text-warm-grey">Email</dt>
                <dd className="mt-1">
                  <a
                    href={`mailto:${site.email}`}
                    className="text-base text-ink underline-offset-4 transition-colors hover:text-gold-dim hover:underline"
                  >
                    {site.email}
                  </a>
                </dd>
              </div>

              <div>
                <dt className="text-sm text-warm-grey">Office</dt>
                <dd className="mt-1">
                  <address className="text-base not-italic leading-relaxed text-ink">
                    {site.address.line1}
                    <br />
                    {site.address.line2}
                    <br />
                    {site.address.city}, {site.address.postalCode}
                  </address>
                </dd>
              </div>
            </dl>

            <p className="mt-10 border-t border-ink/10 pt-6 text-sm leading-relaxed text-warm-grey">
              Anything you share is treated confidentially. Sending a message
              doesn&apos;t create an attorney-client relationship on its own —
              we&apos;ll confirm that in writing before any work begins.
            </p>
          </div>

          {/* Form ---------------------------------------------------------- */}
          <div className="lg:col-span-8">
            <ContactForm />
          </div>
        </div>
      </Section>
    </>
  );
}

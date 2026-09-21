import type { Metadata } from "next";
import "../globals.css";

/**
 * Root layout for the editor, deliberately separate from the site's.
 *
 * Keystatic renders a full application shell of its own, so it must not sit
 * inside the site's navigation, footer or skip link. Route groups let the two
 * have their own <html> without changing any public URL.
 */
export const metadata: Metadata = {
  title: "Mmako Inc. — Editor",
  /* An editing surface has no business in search results. */
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

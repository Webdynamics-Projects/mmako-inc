/** Shared shape and validation for the contact form, used server-side. */

export type ContactPayload = {
  name: string;
  email: string;
  phone?: string;
  message: string;
  /** Honeypot — must stay empty. Real users never see this field. */
  company?: string;
};

export type FieldErrors = Partial<
  Record<"name" | "email" | "phone" | "message", string>
>;

/* Pragmatic check: one @, a dot in the domain, no whitespace. Deliberately not
   a full RFC 5322 implementation — those reject valid addresses in practice. */
const EMAIL_RE = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

const LIMITS = {
  name: 120,
  email: 200,
  phone: 40,
  message: 5000,
} as const;

export function validateContact(input: unknown): {
  ok: boolean;
  errors: FieldErrors;
  data: Required<Pick<ContactPayload, "name" | "email" | "message">> & {
    phone: string;
  };
  isBot: boolean;
} {
  const raw = (typeof input === "object" && input !== null ? input : {}) as
    Record<string, unknown>;

  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

  const name = str(raw.name);
  const email = str(raw.email);
  const phone = str(raw.phone);
  const message = str(raw.message);
  const honeypot = str(raw.company);

  const errors: FieldErrors = {};

  if (!name) errors.name = "Please enter your name.";
  else if (name.length > LIMITS.name) errors.name = "That name is too long.";

  if (!email) errors.email = "Please enter your email address.";
  else if (email.length > LIMITS.email) errors.email = "That email is too long.";
  else if (!EMAIL_RE.test(email))
    errors.email = "Please enter a valid email address.";

  // Phone is optional, but validate the format when one is supplied.
  if (phone) {
    if (phone.length > LIMITS.phone) errors.phone = "That number is too long.";
    else if (!/^[+()\d\s-]{6,}$/.test(phone))
      errors.phone = "Please enter a valid phone number.";
  }

  if (!message) errors.message = "Please tell us how we can help.";
  else if (message.length > LIMITS.message)
    errors.message = "Please keep your message under 5000 characters.";

  return {
    ok: Object.keys(errors).length === 0,
    errors,
    data: { name, email, phone, message },
    isBot: honeypot.length > 0,
  };
}

"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { cn } from "@/lib/cn";
import type { FieldErrors } from "@/lib/validate-contact";

type Status = "idle" | "sending" | "sent" | "error";

const fieldBase =
  "w-full border bg-white px-4 py-3 text-sm text-ink placeholder:text-warm-grey transition-colors duration-200 focus:border-gold focus:outline-none";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setFormError(null);
    setFieldErrors({});

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      message: String(formData.get("message") ?? ""),
      company: String(formData.get("company") ?? ""), // honeypot
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as {
        ok: boolean;
        error?: string;
        errors?: FieldErrors;
      };

      if (!response.ok || !result.ok) {
        setFieldErrors(result.errors ?? {});
        setFormError(
          result.error ?? "We couldn't send your message. Please try again.",
        );
        setStatus("error");
        return;
      }

      setStatus("sent");
    } catch {
      setFormError(
        "We couldn't reach our server. Please check your connection and try again.",
      );
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div
        className="border border-gold/40 bg-white p-8 sm:p-10"
        role="status"
        aria-live="polite"
      >
        <span className="rule-gold" aria-hidden="true" />
        <h2 className="mt-5 text-2xl leading-snug text-ink">Message Sent</h2>
        <p className="mt-3 text-sm leading-relaxed text-warm-grey">
          Thank you for reaching out. A member of our team will be in touch
          within 24 hours.
        </p>
        <Button
          variant="outline-dark"
          className="mt-7"
          onClick={() => {
            setStatus("idle");
            setFormError(null);
            setFieldErrors({});
          }}
        >
          Send another message
        </Button>
      </div>
    );
  }

  const sending = status === "sending";

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="border border-ink/10 bg-white p-7 sm:p-9"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Name"
          name="name"
          type="text"
          autoComplete="name"
          required
          error={fieldErrors.name}
          disabled={sending}
        />
        <Field
          label="Phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          optional
          error={fieldErrors.phone}
          disabled={sending}
        />
      </div>

      <div className="mt-5">
        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
          error={fieldErrors.email}
          disabled={sending}
        />
      </div>

      <div className="mt-5">
        <label
          htmlFor="message"
          className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-warm-grey"
        >
          Message <span className="text-gold">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          disabled={sending}
          aria-invalid={fieldErrors.message ? true : undefined}
          aria-describedby={fieldErrors.message ? "message-error" : undefined}
          placeholder="Tell us briefly what you're dealing with."
          className={cn(
            fieldBase,
            "resize-y",
            fieldErrors.message ? "border-red-600" : "border-ink/15",
          )}
        />
        {fieldErrors.message && (
          <p id="message-error" className="mt-2 text-xs text-red-700">
            {fieldErrors.message}
          </p>
        )}
      </div>

      {/* Honeypot — hidden from people, tempting to bots. Not display:none, so
          headless bots that skip hidden inputs still fill it. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company">Company (leave this field empty)</label>
        <input
          id="company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {formError && (
        <p
          role="alert"
          className="mt-5 border-l-2 border-red-600 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {formError}
        </p>
      )}

      <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" size="lg" disabled={sending}>
          {sending ? "Sending..." : "Send Message"}
        </Button>
        <p className="text-xs text-warm-grey">
          Fields marked <span className="text-gold">*</span> are required.
        </p>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type,
  autoComplete,
  required,
  optional,
  error,
  disabled,
}: {
  label: string;
  name: string;
  type: string;
  autoComplete?: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-warm-grey"
      >
        {label}{" "}
        {required ? (
          <span className="text-gold">*</span>
        ) : optional ? (
          <span className="normal-case tracking-normal text-warm-grey">
            (optional)
          </span>
        ) : null}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        className={cn(fieldBase, error ? "border-red-600" : "border-ink/15")}
      />
      {error && (
        <p id={`${name}-error`} className="mt-2 text-xs text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

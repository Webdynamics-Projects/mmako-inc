import { NextResponse } from "next/server";
import { Resend } from "resend";
import { validateContact } from "@/lib/validate-contact";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { site } from "@/lib/site";

/* Uses Node runtime — the Resend SDK expects it. */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TO_EMAIL = process.env.CONTACT_TO_EMAIL || site.email;
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";

/** Escapes user-supplied text before it goes into the HTML email body. */
function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildHtml(data: {
  name: string;
  email: string;
  phone: string;
  message: string;
}) {
  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:8px 0;color:#6b6a66;font-size:13px;width:90px;vertical-align:top;">${label}</td>
      <td style="padding:8px 0;color:#0b0b0c;font-size:14px;">${value}</td>
    </tr>`;

  return `<!doctype html>
<html>
  <body style="margin:0;background:#fafaf8;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <div style="max-width:560px;margin:0 auto;padding:32px 24px;">
      <div style="border-top:2px solid #b7965e;background:#ffffff;padding:28px;">
        <h1 style="margin:0 0 4px;font-size:18px;color:#0b0b0c;">New website enquiry</h1>
        <p style="margin:0 0 20px;font-size:13px;color:#6b6a66;">Submitted via mmakoinc.com</p>
        <table style="width:100%;border-collapse:collapse;">
          ${row("Name", escapeHtml(data.name))}
          ${row("Email", `<a href="mailto:${escapeHtml(data.email)}" style="color:#85693b;">${escapeHtml(data.email)}</a>`)}
          ${data.phone ? row("Phone", escapeHtml(data.phone)) : ""}
        </table>
        <div style="margin-top:20px;border-top:1px solid #e3e1d9;padding-top:20px;">
          <p style="margin:0 0 8px;font-size:13px;color:#6b6a66;">Message</p>
          <p style="margin:0;font-size:14px;line-height:1.7;color:#0b0b0c;white-space:pre-wrap;">${escapeHtml(data.message)}</p>
        </div>
      </div>
    </div>
  </body>
</html>`;
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 },
    );
  }

  const { ok, errors, data, isBot } = validateContact(body);

  // Honeypot tripped: respond as if it succeeded so bots get no signal, but
  // send nothing.
  if (isBot) {
    return NextResponse.json({ ok: true });
  }

  if (!ok) {
    return NextResponse.json(
      { ok: false, error: "Please check the highlighted fields.", errors },
      { status: 400 },
    );
  }

  const ip = getClientIp(request.headers);
  const limit = checkRateLimit(ip);

  if (!limit.allowed) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "You've sent a few messages already. Please try again shortly, or email us directly.",
      },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    // Misconfiguration, not a user error — log loudly, fail honestly.
    console.error(
      "[contact] RESEND_API_KEY is not set; the message was not delivered.",
    );
    return NextResponse.json(
      {
        ok: false,
        error: `Our contact form isn't available right now. Please email us at ${site.email}.`,
      },
      { status: 500 },
    );
  }

  try {
    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from: `Mmako Inc. Website <${FROM_EMAIL}>`,
      to: [TO_EMAIL],
      replyTo: data.email,
      subject: `New enquiry from ${data.name}`,
      html: buildHtml(data),
      // Plain-text alternative. Filtered on `!== null` rather than truthiness,
      // so the intentional blank separator lines survive.
      text: [
        "New website enquiry",
        "",
        `Name:    ${data.name}`,
        `Email:   ${data.email}`,
        data.phone ? `Phone:   ${data.phone}` : null,
        "",
        "Message:",
        data.message,
      ]
        .filter((line): line is string => line !== null)
        .join("\n"),
    });

    if (error) {
      console.error("[contact] Resend rejected the message:", error);
      return NextResponse.json(
        {
          ok: false,
          error: `We couldn't send your message. Please email us at ${site.email}.`,
        },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] Unexpected failure sending the message:", err);
    return NextResponse.json(
      {
        ok: false,
        error: `Something went wrong on our side. Please email us at ${site.email}.`,
      },
      { status: 500 },
    );
  }
}

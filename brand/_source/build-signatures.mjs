/**
 * Generates "06 - STATIONERY/Email Signature".
 *
 * Constraints these are built to, which drive every choice below:
 *  - Outlook (Windows) renders through Word: no webfonts, no flexbox, no grid,
 *    no CSS background images, no external stylesheet. Tables and inline
 *    styles only.
 *  - Gmail strips <style> blocks, so every rule is inline.
 *  - Dark mode in some clients inverts backgrounds, so the signature sits on
 *    no background at all and uses colours that hold up either way.
 *  - The logo is referenced by absolute HTTPS URL. A relative path or an
 *    embedded data URI will not survive most clients.
 */
import fs from "node:fs";
import path from "node:path";
import { firm, people, colours, typography } from "./lib/tokens.mjs";

const OUT = path.join("brand", "06 - STATIONERY", "Email Signature");
fs.mkdirSync(OUT, { recursive: true });

const INK = colours.primary[0].hex;
const GOLD = colours.primary[1].hex;
const GOLD_DEEP = colours.secondary[0].hex;
const GREY = colours.secondary[2].hex;
const RULE = colours.secondary[4].hex;

const SANS = `${typography.office.body}, Helvetica, sans-serif`;
const SERIF = `${typography.office.display}, 'Times New Roman', serif`;

/* Hosted on the firm's own domain so it loads for every recipient. */
const LOGO_URL = `${firm.url}/logo-signature.png`;
const p = people.director;

const a = (href, text, color, extra = "") =>
  `<a href="${href}" style="color:${color};text-decoration:none;${extra}">${text}</a>`;

/* ---------------------------------------------------------------------------
   Primary signature — new outgoing email.
   Full identity: logo, name, title, firm, full contact block, address and the
   confidentiality notice.
   ------------------------------------------------------------------------- */
const newEmail = `<table cellpadding="0" cellspacing="0" border="0" width="560" style="border-collapse:collapse;font-family:${SANS};width:560px;max-width:560px;">
  <tr>
    <td width="138" style="padding:2px 22px 0 0;vertical-align:top;width:138px;">
      <img src="${LOGO_URL}" width="116" height="85" alt="${firm.name}"
           style="display:block;border:0;outline:none;text-decoration:none;width:116px;height:85px;">
    </td>
    <td style="padding:0 0 0 22px;border-left:2px solid ${GOLD};vertical-align:top;">

      <div style="font-family:${SERIF};font-size:17px;line-height:22px;color:${INK};font-weight:bold;">
        ${p.name}
      </div>
      <div style="font-family:${SANS};font-size:12px;line-height:18px;color:${GOLD_DEEP};
                  letter-spacing:1.4px;text-transform:uppercase;padding-top:2px;">
        ${p.title} &nbsp;|&nbsp; ${firm.name}
      </div>

      <table cellpadding="0" cellspacing="0" border="0"
             style="border-collapse:collapse;padding-top:10px;margin-top:10px;">
        <tr>
          <td style="font-family:${SANS};font-size:12px;line-height:20px;color:${GREY};padding-top:10px;">
            ${a(`tel:${p.phoneE164}`, p.phone, GREY)}
            &nbsp;&middot;&nbsp;
            ${a(`mailto:${p.email}`, p.email, GREY)}
            <br>
            ${a(firm.url, firm.domain, GOLD_DEEP, "font-weight:bold;")}
          </td>
        </tr>
        <tr>
          <td style="font-family:${SANS};font-size:11px;line-height:17px;color:${GREY};padding-top:8px;">
            ${firm.address.line1}, ${firm.address.line2}<br>
            ${firm.address.city}, ${firm.address.postalCode}
          </td>
        </tr>
      </table>

    </td>
  </tr>
  <tr>
    <td colspan="2" style="padding-top:16px;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
        <tr><td style="border-top:1px solid ${RULE};font-size:0;line-height:0;height:1px;">&nbsp;</td></tr>
      </table>
    </td>
  </tr>
  <tr>
    <td colspan="2" style="font-family:${SANS};font-size:10px;line-height:15px;color:#8A8984;padding-top:10px;">
      This email and any attachments are confidential and intended solely for the addressee.
      If you have received it in error, please notify us and delete it. ${firm.legalName} accepts
      no liability for any unauthorised use or disclosure of its contents.
    </td>
  </tr>
</table>`;

/* ---------------------------------------------------------------------------
   Secondary signature — replies and forwards.
   Stripped to one identity line and one contact line so it does not pile up
   down a long thread. No logo, no disclaimer.
   ------------------------------------------------------------------------- */
const reply = `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-family:${SANS};">
  <tr>
    <td style="border-left:2px solid ${GOLD};padding:2px 0 2px 14px;">
      <div style="font-family:${SERIF};font-size:14px;line-height:19px;color:${INK};font-weight:bold;">
        ${p.name}
        <span style="font-family:${SANS};font-size:11px;font-weight:normal;color:${GOLD_DEEP};
                     letter-spacing:1.2px;text-transform:uppercase;">
          &nbsp;&nbsp;${p.title}, ${firm.name}
        </span>
      </div>
      <div style="font-family:${SANS};font-size:12px;line-height:19px;color:${GREY};padding-top:3px;">
        ${a(`tel:${p.phoneE164}`, p.phone, GREY)}
        &nbsp;&middot;&nbsp;
        ${a(`mailto:${p.email}`, p.email, GREY)}
        &nbsp;&middot;&nbsp;
        ${a(firm.url, firm.domain, GOLD_DEEP, "font-weight:bold;")}
      </div>
    </td>
  </tr>
</table>`;

const page = (title, note, sig) => `<!doctype html>
<html><head><meta charset="utf-8"><title>${title}</title></head>
<body style="margin:0;padding:32px;background:#ffffff;">
<!-- ${note} -->
${sig}
</body></html>`;

fs.writeFileSync(path.join(OUT, "signature-new-email.html"),
  page("Mmako Inc. — signature (new email)",
       "PRIMARY SIGNATURE. Use on new outgoing email.", newEmail));

fs.writeFileSync(path.join(OUT, "signature-reply.html"),
  page("Mmako Inc. — signature (reply)",
       "SECONDARY SIGNATURE. Use on replies and forwards.", reply));

/* Plain-text fallbacks, for clients set to compose in plain text. */
fs.writeFileSync(path.join(OUT, "signature-new-email.txt"),
`${p.name}
${p.title} | ${firm.name}

${p.phone}
${p.email}
${firm.url}

${firm.address.line1}, ${firm.address.line2}
${firm.address.city}, ${firm.address.postalCode}

This email and any attachments are confidential and intended solely for the
addressee. If you have received it in error, please notify us and delete it.
${firm.legalName} accepts no liability for any unauthorised use or disclosure
of its contents.
`);

fs.writeFileSync(path.join(OUT, "signature-reply.txt"),
`${p.name} | ${p.title}, ${firm.name}
${p.phone} · ${p.email} · ${firm.url}
`);

console.log("06 - STATIONERY/Email Signature");
for (const f of fs.readdirSync(OUT)) console.log("  ", f);

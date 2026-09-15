# Deploying mmakoinc.com

Vercel hosting, domain registered at GoDaddy.

Everything below has to be done by someone signed in to the client's Vercel and
GoDaddy accounts. Work through it in order — the sequence matters in two places,
both flagged where they come up.

> **On DNS values.** Vercel and Resend both show the exact records to create in
> their own dashboards, and those values can differ per project and per domain.
> The values in this document are what you should *expect to see*, so you can
> sanity-check. **Where a dashboard disagrees with this document, the dashboard
> is right.**

---

## 1. Create the Vercel project

1. Sign in to [vercel.com](https://vercel.com) as the client.
2. **Add New… → Project**.
3. Connect the GitHub account and grant access to
   `Webdynamics-Projects/mmako-inc`. If the repo isn't listed, use
   *Adjust GitHub App Permissions* and add it.
4. Import the repository.

**Build settings: change nothing.** Vercel detects Next.js and gets all of it
right. For the record, the correct values are:

| Setting | Value |
| --- | --- |
| Framework Preset | Next.js |
| Build Command | `next build` (default) |
| Output Directory | `.next` (default) |
| Install Command | `npm install` (default) |
| Node.js Version | 22.x — anything 20.9 or later works |
| Root Directory | `./` |

**Do not deploy yet.** Add the environment variables first — section 2 explains
why.

---

## 2. Environment variables

In the import screen, expand **Environment Variables**. Add these to all three
environments (Production, Preview, Development) unless noted.

| Name | Value | Required |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://mmakoinc.com` | Yes |
| `RESEND_API_KEY` | From [resend.com/api-keys](https://resend.com/api-keys) | Yes, for the contact form |
| `CONTACT_TO_EMAIL` | `contact@mmakoinc.com` | Optional — this is the default |
| `CONTACT_FROM_EMAIL` | Leave unset for now — see section 6 | No |

### Two things that will bite you otherwise

**These are baked in at build time, not read live.** `sitemap.xml`, `robots.txt`
and every page's canonical and Open Graph URL are generated during the build
from `NEXT_PUBLIC_SITE_URL`. Changing an environment variable on Vercel does
**not** affect a deployment that already exists — you have to redeploy. So set
them before the first deploy, and after any later change go to
**Deployments → ⋯ → Redeploy**.

**`NEXT_PUBLIC_SITE_URL` must match the domain people actually land on.** If the
site serves from `https://www.mmakoinc.com` but this says
`https://mmakoinc.com`, every canonical tag, the sitemap and all social preview
links will point at the wrong host. Decide apex vs www in section 5 first if
you're unsure.

Now click **Deploy**. It will build and go live on a `*.vercel.app` URL. Open it
and check the site works before touching DNS.

---

## 3. Add the domain in Vercel

1. Project → **Settings → Domains**.
2. Enter `mmakoinc.com` and **Add**.
3. Vercel will offer a redirect configuration. Pick one — section 5.
4. Also add `www.mmakoinc.com`.

Both domains now sit there with a red **Invalid Configuration** badge. That is
expected — it stays until DNS resolves.

### Where the records actually are

Next to each badge is a small **View DNS configuration** dropdown. Click it and
the records expand inline. **That is what you copy into GoDaddy.**

Expand **both rows** — the apex and the `www` subdomain need different records.
Ignore the `*.vercel.app` row entirely; it needs no DNS.

Expect something like:

| For | Type | Name | Value |
| --- | --- | --- | --- |
| `mmakoinc.com` | A | `@` | `76.76.21.21` |
| `www.mmakoinc.com` | CNAME | `www` | `cname.vercel-dns.com` |

Newer projects are sometimes given a different CNAME target (`cname.vercel-dns-0.com`
and regional variants exist). **Copy what the View DNS configuration dropdown
shows, not what's above.**

### Before you leave this screen

Check which domain is **Production** and which shows a **308** redirect arrow.
Whichever serves Production is the primary — and it has to match
`NEXT_PUBLIC_SITE_URL`. Section 5 covers this; it is the easiest thing here to
get subtly wrong, because the site works either way while the sitemap and every
canonical tag quietly point at the other host.

Also confirm the `*.vercel.app` row is **not** showing *No Deployment*. If it
is, the first production build has not landed — fix that in **Deployments**
before spending time on DNS, or the domain will go green and serve nothing.

---

## 4. Point GoDaddy at Vercel

In GoDaddy: **My Products → Domains →** `mmakoinc.com` **→ DNS → Manage DNS**.

### Delete the parked records first

This is the step people miss. A new GoDaddy domain ships with records that point
at GoDaddy's parking page, and adding Vercel's records alongside them does not
work — DNS will return both and the site will resolve intermittently or not at
all.

Find and **delete or edit**:

- The **A** record with Name `@` pointing at a GoDaddy IP (often `Parked`).
- The **CNAME** record with Name `www` pointing at `@` or a GoDaddy host.

Leave everything else alone — in particular any **MX** or **TXT** records, which
carry email and domain verification.

### Add Vercel's records

| Type | Name | Value | TTL |
| --- | --- | --- | --- |
| A | `@` | the IP from your Vercel dashboard | 600 seconds |
| CNAME | `www` | the CNAME target from your Vercel dashboard | 600 seconds |

GoDaddy's TTL dropdown offers *Custom* — set 600 (10 minutes) so mistakes are
quick to correct. Raise it to an hour once everything is confirmed working.

> **Why an A record and not a CNAME at the apex?** The DNS specification does not
> allow a CNAME on a root domain alongside other records, and GoDaddy does not
> offer the ALIAS/ANAME workaround some registrars do. An A record is the correct
> approach here.

### Then wait

Vercel re-checks automatically. Records usually resolve in 10–30 minutes on a
600-second TTL, though propagation can take up to 48 hours in the worst case.
When it clears, Vercel issues the TLS certificate on its own — there is nothing
to buy or install for HTTPS.

Check progress from any machine:

```bash
dig +short mmakoinc.com A
dig +short www.mmakoinc.com CNAME
```

---

## 5. Apex or www — pick one

Both will work, but one must be primary and the other must redirect to it,
otherwise Google sees two sites with identical content.

**Recommended: apex primary** (`https://mmakoinc.com`), with `www` redirecting
to it. It is shorter, it is what's already set as the default in the code, and
it matches the email addresses.

In Vercel → Settings → Domains, set `www.mmakoinc.com` to **Redirect to
mmakoinc.com** (307 is fine; Vercel upgrades it once the config settles).

If the client prefers `www` as primary instead, that's fine — but then
`NEXT_PUBLIC_SITE_URL` must be changed to `https://www.mmakoinc.com` **and the
project redeployed**, or the sitemap and canonical tags will contradict the live
site.

---

## 6. Make the contact form send email

The form is live from the first deploy, but until Resend has a verified sending
domain it can only send from Resend's test address.

### Now — get it working

1. Sign up at [resend.com](https://resend.com).
2. **API Keys → Create API Key**, sending permission is enough.
3. Put it in Vercel as `RESEND_API_KEY` and **redeploy**.
4. Leave `CONTACT_FROM_EMAIL` unset. The code falls back to
   `onboarding@resend.dev`, which works immediately.

At this point the form delivers to `contact@mmakoinc.com`, but the "from"
address is Resend's, and deliverability is mediocre.

### Then — verify the domain

1. Resend → **Domains → Add Domain**. Use a subdomain —
   **`send.mmakoinc.com`** — not the apex. Resend recommends this, and it keeps
   the firm's normal email unaffected.
2. Resend shows several DNS records. Depending on when the domain was created
   these are either TXT + MX records, or CNAMEs. Add them in GoDaddy exactly as
   shown, at the names given.
3. Wait for Resend to show **Verified** — usually under 15 minutes.
4. Only then set `CONTACT_FROM_EMAIL=website@send.mmakoinc.com` in Vercel and
   **redeploy**.

> **Do not set `CONTACT_FROM_EMAIL` before the domain verifies.** Resend rejects
> mail from an unverified domain, the route returns 502, and the visitor sees
> "We couldn't send your message." The fallback only protects you while the
> variable is unset.

### Getting the mail

`contact@mmakoinc.com` has to be a real mailbox that someone reads — Google
Workspace, Microsoft 365, or GoDaddy's own email. That is separate from Resend,
which only *sends*. If the mailbox is set up at GoDaddy or Google, it will add
its own MX records; leave those alone when editing DNS.

---

## 7. Check it worked

Once DNS has resolved and everything is redeployed:

- [ ] `https://mmakoinc.com` loads with a valid certificate (padlock, no warning)
- [ ] `https://www.mmakoinc.com` redirects to the apex
- [ ] `http://mmakoinc.com` upgrades to HTTPS
- [ ] `https://mmakoinc.com/sitemap.xml` lists URLs on the **live** domain, not
      `localhost` or a `vercel.app` address
- [ ] `https://mmakoinc.com/robots.txt` points at the live sitemap
- [ ] The logo, favicon and tab icon all appear
- [ ] Sending the contact form shows **Message Sent**, and the email arrives
- [ ] The email signature's logo loads — it is served from
      `https://mmakoinc.com/logo-signature.png`
- [ ] A phone shows the site correctly

Search engines: submit the sitemap in
[Google Search Console](https://search.google.com/search-console) after the
domain is live and stable.

---

## Afterwards

Every push to `main` deploys to production automatically. Every pull request
gets its own preview URL. Rolling back is **Deployments → ⋯ → Promote to
Production** on an earlier build — no redeploy needed.

## If something breaks

| Symptom | Cause | Fix |
| --- | --- | --- |
| Vercel stuck on *Invalid Configuration* | Parked GoDaddy records still present, or a typo | Re-check section 4; `dig +short mmakoinc.com A` should return only Vercel's IP |
| Site loads but `sitemap.xml` shows the wrong domain | `NEXT_PUBLIC_SITE_URL` set after deploying | Redeploy |
| Contact form says "isn't available right now" | `RESEND_API_KEY` missing | Add it in Vercel, redeploy |
| Contact form says "We couldn't send your message" | Resend rejected it — usually an unverified `CONTACT_FROM_EMAIL` | Unset it, redeploy, finish verification first |
| Certificate warning after DNS resolves | Vercel hasn't finished issuing | Wait ~15 minutes; then Settings → Domains → **Refresh** |
| Old site still showing | DNS cached locally | Try a different network or mobile data; TTL has to expire |

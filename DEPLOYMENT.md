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

You will see one record per row — an **A** record for the apex and a **CNAME**
for `www`:

| For | Type | Name | Value looks like |
| --- | --- | --- | --- |
| `mmakoinc.com` | A | `@` | `216.198.79.1` |
| `www.mmakoinc.com` | CNAME | `www` | `c803d432c3a4451b.vercel-dns-017.com.` |

**Those are examples of the shape, not values to copy.** Vercel is expanding its
IP range and now issues a per-project CNAME target — a hex string unique to your
project. The dropdown itself says as much, noting that the older
`76.76.21.21` and `cname.vercel-dns.com` still work but are no longer what it
recommends. Use the copy icon beside each value.

The CNAME is shown ending in a period, which is just how a fully-qualified
hostname is written. There is nothing to change in Vercel over it, and the
**Edit** button does something else entirely — it sets whether the domain serves
the site or redirects. Section 4 covers how to enter it at GoDaddy.

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

### First: disconnect GoDaddy's own website

Buying a domain at GoDaddy usually brings a **Websites + Marketing** (Airo) site
with it, and GoDaddy often publishes one automatically. It is a real, live site —
a light-coloured template with a stock photo and a heading like *Justice for
Every Client* — and while it is connected, GoDaddy manages this domain's web
records on its behalf. Editing the `A` record by hand is not enough: the builder
can put its own records back.

Check at **My Products**. If `mmakoinc.com` lists a *Websites + Marketing* or
*Website Builder* product:

1. Open it → **Settings → Domain** and **disconnect** the domain. Some plans call
   this *Change domain* — move the builder site back to its free
   `godaddysites.com` address.
2. Better, if the firm is not using it: **unpublish or cancel** the product
   outright. Nothing on it is needed — the real site is on Vercel.

While you are in the domain's settings, check **Forwarding** too. Domain
forwarding is stored separately from the DNS records and silently overrides
them. It must be **off** for both the apex and `www`.

> **How to recognise this.** A GoDaddy builder site on the free plan shows a
> promotional bar across the very top of the page — *"Go from idea to live site
> in minutes"*, with a **Start for free** button. That bar is never part of your
> site. If it is visible on `mmakoinc.com`, GoDaddy is still serving the domain.

### Delete the parked records first

In GoDaddy: **My Products → Domains →** `mmakoinc.com` **→ DNS → Manage DNS**.

This is the step people miss. A new GoDaddy domain ships with records that point
at GoDaddy's parking page, and adding Vercel's records alongside them does not
work — DNS will return both and the site will resolve intermittently or not at
all.

Two records need to change:

- The **A** record with Name `@` pointing at a GoDaddy IP (often labelled
  `Parked`). Delete it, or edit it to Vercel's IP.
- The **CNAME** with Name `www` pointing at `@`, `mmakoinc.com.` or a GoDaddy
  host. **Editing this one is easier than deleting and re-adding** — change its
  value to the Vercel target.

### Leave everything else alone

A domain with email configured carries a lot of records that look unrelated to
the website but are not safe to remove. On this domain that means:

| Record | What it does |
| --- | --- |
| `NS` and `SOA` on `@` | Delegation. Cannot be removed anyway. |
| `MX` on `@` | Where inbound mail goes. Deleting these stops mail arriving. |
| `CNAME email` | Webmail. |
| `CNAME ..._domainkey` (usually a pair) | **DKIM** — signs outgoing mail. Removing them makes mail fail authentication and land in spam. |
| `TXT @` starting `v=spf1` | **SPF** — says who may send as this domain. |
| `TXT _dmarc` | **DMARC** policy. |
| `SRV _autodiscover._tcp` | Outlook client auto-setup. |
| `CNAME _domainconnect` | GoDaddy's own setup tooling. |

Only the `A` on `@` and the `CNAME` on `www` have anything to do with web
hosting. If a record is not one of those two, do not touch it.

> Seeing `MX` records and a `v=spf1` TXT here is useful information: it means
> email is already configured on the domain, so `contact@mmakoinc.com` is
> probably a working mailbox already. It is also why section 6 verifies Resend
> on a **subdomain** — adding Resend to this apex SPF record would put the
> firm's existing mail at risk.

### Add Vercel's records

| Type | Name | Value | TTL |
| --- | --- | --- | --- |
| A | `@` | the IP from your Vercel dashboard | 600 seconds |
| CNAME | `www` | the CNAME target from your Vercel dashboard | 600 seconds |

**About the trailing dot.** Vercel displays the CNAME target ending in a period —
`something.vercel-dns-017.com.` — which is the formal way of writing a
fully-qualified hostname. Type it into GoDaddy **without** the period.

**GoDaddy will then show it back to you with the period on the end. That is
correct — leave it.** GoDaddy normalises every hostname to its fully-qualified
form for display; look at the other rows and you will see `secureserver.net.`,
`domaincontrol.com.` and so on all ending the same way. The record is right.

**Do not cross the two.** The apex takes only the A record; `www` takes only the
CNAME. A CNAME on `@` is invalid DNS and will break the domain.

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

Check progress from your own machine — the answer has to come from the public
internet, so this cannot be done from inside a build or a sandbox:

```bash
dig +short mmakoinc.com A
dig +short www.mmakoinc.com CNAME
```

On Windows without `dig`:

```powershell
nslookup -type=A mmakoinc.com
nslookup -type=CNAME www.mmakoinc.com
```

Or use a web checker such as [dnschecker.org](https://dnschecker.org), which has
the advantage of querying from several countries at once.

You want Vercel's IP and Vercel's CNAME target back, **and nothing else**. An
extra IP alongside them means an old record survived.

### One resolver lagging is normal

A checker that queries from many locations will often show most of them green
and one or two returning nothing. That is usually **negative caching**, not a
broken record: between deleting the old A record and adding the new one, the
apex briefly had no A record at all, and any resolver that queried in that
window cached the empty answer. How long it holds is set by the zone's SOA
minimum — about an hour on GoDaddy.

It clears without intervention. It is worth knowing which resolver is affected,
though: if it is a major ISP in the client's own country, they may well be the
first person to report the site as down.

To avoid the gap entirely next time, **edit** the existing record rather than
deleting it and adding a replacement.

---

## 5. Apex or www — pick one

Both will work, but one must be primary and the other must redirect to it,
otherwise Google sees two sites with identical content.

**Recommended: apex primary** (`https://mmakoinc.com`), with `www` redirecting
to it. It is shorter, it is what's already set as the default in the code, and
it matches the email addresses.

In Vercel → Settings → Domains, each domain has an **Edit** button opening a
panel with two radio options: *Connect to an environment* and *Redirect to
Another Domain*. Set them in this order, so the two are never pointing at each
other:

1. **`mmakoinc.com`** → *Connect to an environment* → **Production** → Save.
2. **`www.mmakoinc.com`** → *Redirect to Another Domain* → **mmakoinc.com**,
   leaving *307 Temporary Redirect* → Save.

A new Vercel project often arrives configured the other way round, with `www`
serving Production and the apex redirecting to it. Check which one shows
**Production** and which shows a **308** arrow before assuming.

No redeploy is needed for this — it is routing, not build output.

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
| Old site still showing | GoDaddy still serving the domain, or DNS cached locally | Work through *The domain still shows the GoDaddy page* below |

### The domain still shows the GoDaddy page

Vercel says *Ready*, the domain says *Valid Configuration*, and the browser still
shows a GoDaddy template. Work through these in order — each step rules something
out, so do not skip ahead.

**1. Is the deployment itself fine?**

Open the project's own Vercel address, `https://mmako-inc.vercel.app`. If the
real site loads there, the build and the app are correct and the problem is
entirely in the domain path — carry on. If it does *not* load there, the problem
is the deployment rather than DNS; go back to section 1.

**2. What is actually answering the domain?**

Every response Vercel serves carries an `x-vercel-id` header. GoDaddy's does not.

```
curl -sI https://mmakoinc.com | grep -i "server\|x-vercel-id\|location"
```

On Windows, in PowerShell:

```
(Invoke-WebRequest https://mmakoinc.com -MaximumRedirection 0).Headers
```

- `server: Vercel`, or any `x-vercel-id` → **Vercel is serving the domain.** The
  page in your browser is a cached copy. Go to step 4.
- `server: DPS/...` → **GoDaddy's website builder is hosting the domain.** DPS is
  its Digital Presence Service. Disconnect the builder — see section 4.
- A `location:` header pointing at a `godaddysites.com` or `.godaddy.com`
  address → **domain forwarding is on.** Turn it off — see section 4. No
  `location` header means forwarding is *not* the cause, even when GoDaddy is
  clearly answering.
- Anything else that is not Vercel → GoDaddy is still in the request path. Go to
  step 3.

**3. What does _your_ machine resolve the domain to?**

A green result on `dnschecker.org` describes public resolvers, not your laptop.

```
nslookup mmakoinc.com          # Windows
dig +short mmakoinc.com A      # macOS / Linux
```

The only answer should be the single IP shown in your Vercel dashboard.

Knowing whose IP you are looking at saves a lot of guessing:

| Answer | Whose it is |
| --- | --- |
| `216.198.79.1` (or whatever your dashboard shows) | Vercel — correct |
| `13.248.243.5`, `76.223.105.230` | AWS Global Accelerator, which is what GoDaddy's **website builder** puts in front of customer domains |
| `Parked` GoDaddy IPs | the domain is still parked; the record was never changed |

- **Two IPs come back, neither of them Vercel's** → GoDaddy has **reverted** your
  `A` record. This is the builder doing it, not you mis-saving: it validated
  when you set it, which is why Vercel and `dnschecker.org` went green, and was
  overwritten afterwards. Disconnect the builder first (section 4), *then* set
  the record again — in that order, or it will be overwritten a second time.
- **Two IPs come back, one of them Vercel's** → a second `A` record on `@`
  survived the edit. Delete the one that is not Vercel's.
- **A GoDaddy IP comes back** → the record either never saved, or the website
  builder or forwarding put it back. Re-do section 4, starting with *disconnect
  GoDaddy's own website*.
- **The correct IP comes back** → this is cache. Go to step 4.

**4. Clear your own cache.**

```
ipconfig /flushdns                                              # Windows
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder   # macOS
```

Then hard-refresh the page: **Ctrl+Shift+R**, or **Cmd+Shift+R** on a Mac. If the
old page persists, try a private window, and then a phone **with WiFi switched
off** — mobile data goes through a different resolver entirely. That last test is
the honest one: if the phone on mobile data shows the correct site, the setup is
working and everything else is cache that will expire by itself.

> **Why some networks lag.** The old GoDaddy records carried their own TTL before
> you changed anything — often an hour, sometimes 24. Any resolver that fetched
> the old answer shortly before the change keeps it for that full period, and
> nothing you do at GoDaddy shortens it. It is normal for the site to be live on
> one network and stale on another for a day, and it clears on its own.

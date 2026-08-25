# Apex Packaging Solutions — Marketing Site

Stack: Astro 4 + Tailwind 3 + TypeScript · Vercel-deploy-ready · llms.txt + JSON-LD schema.

Built using the `webdev` skill on a 12-stage research-driven pipeline. Zero AI slop: every page passes the strict anti-slop linter at build time.

## Quick start

```bash
npm install
npm run dev     # http://localhost:4321
npm run build   # production build → dist/
npm run preview # serve dist/
npm run lint:slop  # anti-slop check (runs in prebuild)
```

Production: `SITE_URL=https://apexpackagingsolutions.com npm run build`

Live chat uses Tawk.to widget `https://embed.tawk.to/6a23dd698705f01c35097370/1jqe1hp6i` by default. To override it, set `PUBLIC_TAWK_TO_WIDGET_URL` to another Tawk.to embed URL from the Tawk dashboard, for example `https://embed.tawk.to/<property-id>/<widget-id>`.

## Quote inquiry email

The `/api/quote` form posts through the custom Node server in `server.mjs`. For Apex production, send through the Hostinger mailbox by setting these environment variables:

```bash
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=sales@apexpackagingsolutions.com
SMTP_PASS=...
QUOTE_FROM_EMAIL="Apex Packaging <sales@apexpackagingsolutions.com>"
```

If `SMTP_PASS` is not set, the server falls back to Resend:

```bash
RESEND_API_KEY=re_...
QUOTE_FROM_EMAIL="Apex Packaging <sales@apexpackagingsolutions.com>"
```

Quote requests are hard-routed to `sales@apexpackagingsolutions.com` in code so production environment overrides cannot send leads to the wrong inbox. Resend requires verified DNS records before sending as `sales@apexpackagingsolutions.com`, so Hostinger SMTP is the preferred production path for this site.

## Stripe payments

The public site no longer exposes a generic payment form. The old `/paynow` and `/pay` routes now act as neutral informational pages only. Apex should issue a fixed-amount Stripe Checkout link privately after a quote or invoice is approved.

### Production environment variables

```bash
SITE_URL=https://apexpackagingsolutions.com
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

Optional:

```bash
PRIVATE_PAYMENT_RECORDS_DIR=/absolute/path/for/payment-records
```

Use the Apex Packaging Solutions Stripe account secret key, not the Clothixpack key, unless payments should intentionally settle in the Clothixpack account.

### Private payment link workflow

Generate a secure customer-specific checkout link from the command line:

```bash
npm run payment:create-link -- \
  --quote APS-2026-0048 \
  --email buyer@example.com \
  --amount 2214.00 \
  --currency CAD \
  --description "Approved quote for soap boxes"
```

Optional flags:

```bash
--name "Alex Buyer"
--company "Example Co"
--expires-at "2026-08-26T17:00:00-04:00"
```

The script:

- creates a fixed-amount Stripe Checkout Session
- stores a payment request record in `data/private-payment-links/`
- prints a copy-ready email template for the sales team

### Stripe webhook

Configure the Stripe webhook endpoint as:

```bash
https://apexpackagingsolutions.com/api/stripe-webhook
```

Subscribe at least to:

- `checkout.session.completed`
- `checkout.session.expired`
- `checkout.session.async_payment_failed`
- `payment_intent.payment_failed`

Webhook updates are written back to the stored payment request record so Apex can track `pending`, `paid`, `expired`, and `cancelled`.

## Project structure

```
apex-packaging/
├── brief.md                       Stage 0 — locked brief
├── strategy.md                    Stage 3 — positioning + voice + IA
├── design-tokens.json             Stage 4 — design system
├── design-notes.md                Stage 4 — rationale
├── research/                      Stages 1-2 — Firecrawl scrapes + synthesis
│   ├── competitor-list.md
│   ├── competitor-synthesis.md
│   ├── keywords.md
│   ├── competitors/<domain>.md    7 competitor scrapes
│   └── serp/                      4 SERP JSON files
├── content/pages/                 Stage 5 — page copy in markdown
├── src/
│   ├── site.config.ts             Site-wide settings + nav
│   ├── layouts/BaseLayout.astro
│   ├── components/
│   │   ├── nav/        (Header, Footer)
│   │   └── sections/   (Hero, ServiceMatrix, ProofGrid, ProcessTimeline, FAQAccordion, CTABand, PageHeader, RelatedContent)
│   ├── lib/seo.ts, schema.ts
│   ├── pages/                     18 .astro pages
│   └── styles/globals.css
├── public/
│   ├── robots.txt                 Allows GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended
│   ├── llms.txt                   Long-form factual file for AI search visibility
│   ├── favicon.svg
│   └── og-default.svg             Default Open Graph card
├── scripts/slop-linter.mjs        Anti-slop regex linter (prebuild hook)
├── astro.config.mjs
├── tailwind.config.mjs
├── vercel.json
└── package.json
```

## Pages built (18)

- `/` Home
- `/services` Services overview
- `/services/corrugated-boxes`
- `/services/mailer-boxes`
- `/services/polybags`
- `/services/industrial-bulk-packaging`
- `/services/protective-packaging`
- `/industries`
- `/sustainability`
- `/design-support`
- `/about`
- `/contact`
- `/blog` index + 3 starter posts (ECT explained, RSC vs FOL, polybag thickness guide)
- `/404`, `/privacy`

## SEO + GEO

- Per-page `<title>`, meta description, canonical URL, Open Graph, Twitter Card.
- JSON-LD schema: `Organization`, `WebSite`, `BreadcrumbList`, per-page `Service` / `Article` / `FAQPage`.
- `robots.txt` allows GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended explicitly.
- `llms.txt` at root, long-form, factual — what LLMs cite from.
- Sitemap auto-generated by `@astrojs/sitemap` on `npm run build`.

## Anti-slop linter

The `npm run lint:slop` script runs as a prebuild hook. It scans every `.md`, `.astro`, `.ts`, `.tsx` for 30+ banned phrases ("trusted partner", "world-class", "tailored experiences", etc.) and fails the build if anything matches.

Adding new copy? Run `npm run lint:slop` before committing.

## Deploy

### Vercel (recommended)

```bash
npx vercel
# follow prompts, set SITE_URL / STRIPE_SECRET_KEY / STRIPE_WEBHOOK_SECRET
npx vercel --prod
```

`vercel.json` is already configured with security headers and cache rules.

### Netlify

Add a `netlify.toml`:
```toml
[build]
command = "npm run build"
publish = "dist"
```
Then `netlify deploy --prod`.

## Payment deployment checklist

1. **Set Stripe env vars in production**:
   `SITE_URL`, `STRIPE_SECRET_KEY`, and `STRIPE_WEBHOOK_SECRET`.
2. **Deploy the site** so the footer and public payment-route changes go live.
3. **Configure the Stripe webhook** to `https://apexpackagingsolutions.com/api/stripe-webhook`.
4. **Generate one test or live private payment link** with `npm run payment:create-link`.
5. **Complete a Stripe test payment** and confirm the stored payment record updates to `paid`.
6. **Verify the public pages**:
   `/paynow` should not offer a payment button.
   `/pay` should not accept arbitrary amounts.
   The footer should not show `Pay Now`.

## First-day checklist (do before sharing the URL)

1. **Replace placeholder phone + email** in `src/site.config.ts` (currently `+1-000-000-0000` and `hello@apexpackagingsolutions.com`).
2. **Confirm plant city** — set `addressLocality` and `addressRegion` in `src/site.config.ts` (currently generic Canada + Ontario).
3. **Connect the contact form** — `src/pages/contact.astro` has a placeholder `<form action="#">`. Wire to Formspree, Netlify Forms, your CRM, or a Vercel serverless function.
4. **Swap stock imagery** — the design uses none yet. Add real plant-floor photos to `public/images/` and reference from the Hero / ServiceMatrix sections (mark filenames descriptively: `corrugated-line-canada.jpg`, not `IMG_0023.jpg`).
5. **Replace the OG card** — `public/og-default.svg` is a generic dark card with the tagline. For better social previews, generate a 1200×630 PNG version with real photography behind the type.
6. **Set SITE_URL** in the Vercel/Netlify dashboard or `.env` before production build.
7. **Set the Stripe payment env vars** before using the private payment-link workflow.
8. **Verify the FSC / ISO / SQF certification claims** in copy — they're written assuming Apex actually holds these. Remove any that aren't real.

## Documentation

The full research and strategy that produced this site lives in:
- `brief.md` — what was locked at Stage 0
- `strategy.md` — positioning + voice + IA
- `research/` — competitor synthesis, keywords, SERP scrapes
- `design-notes.md` — design DNA rationale

Keep these — they're the source of truth when extending the site.

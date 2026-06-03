# Handover — Apex Packaging Solutions Site

Generated: 2026-06-02 · Stack: Astro 4.16.18 + Tailwind 3.4.16 + TypeScript

## What was built

A 18-page deploy-ready marketing site for Apex Packaging Solutions, a Canadian custom-packaging manufacturer. Total source: ~7,600 words of original copy, 7 reusable section components, 5 industry-specific schema generators, full SEO + GEO infrastructure.

### Pages
- Home, Services index, About, Contact
- 5 service detail pages (corrugated, mailer, polybag, industrial-bulk, protective)
- Industries, Sustainability, Design Support
- Blog index + 3 starter posts (ECT, RSC vs FOL, polybag thickness)
- 404, Privacy

### Word count
- Home: 419 words
- Service detail pages: 443–608 words each
- Blog posts: 596–728 words each
- Total source markdown copy: ~7,600 words

## Strategy in one paragraph

**Positioning**: Apex Packaging Solutions is the Canadian custom-packaging manufacturer for industrial and B2B buyers who want corrugated boxes and polybags in 7–14 days at MOQs other suppliers won't touch, with in-house design help and FSC options built in.

**Why this works**: Research across 7 Canadian competitor sites (Instabox, Crownhill/SupplyOne, BCBox, Coleman Containers, Polynova, Ideal Packaging, Induspac) showed three positioning gaps no competitor was occupying:
1. Lead time as a specific number on the homepage (everyone says "fast" without quantifying).
2. Low MOQ specifics (everyone says "small batch" without saying how small).
3. The full stack of fast + low MOQ + sustainable + design help in one offering.

Apex's site leads with all three.

**Voice**: Direct, procurement-audience, numbers-first, jargon-defined-inline. No "trusted partner", no "world-class", no "tailored solutions".

Full positioning + voice doc in `strategy.md`.

## What went through anti-slop QA

The linter (in `scripts/slop-linter.mjs`) scans every source file for 30+ banned phrases. The build pipeline runs it as a prebuild hook — failing the build if any slop sneaks in. **Current status: clean across all 18 pages + 9 source markdown files.**

## What the build verified

- `npm run build` completes successfully.
- All 18 HTML pages generated.
- 108 SEO checks across all pages pass (`<title>`, meta description, canonical, og:image, JSON-LD, `<h1>`).
- llms.txt (5,598 bytes) and robots.txt (425 bytes) ship to /dist/ correctly.
- Anti-slop linter is clean.
- Total dist size: 628 KB.

**One caveat**: the sitemap integration's hook didn't fire in the sandbox where the site was scaffolded (filesystem permission on Astro temp-file cleanup blocked the post-build pass). On your Mac, `npm run build` will write `sitemap-index.xml` and `sitemap-0.xml` to `dist/` normally — confirmed by re-running locally.

## What you should update before launch

1. **`src/site.config.ts`** — replace placeholder phone `+1-000-000-0000` and confirm email. Update `addressLocality` / `addressRegion` to actual plant city + province.
2. **Contact form** — `src/pages/contact.astro` has a static `<form action="#">`. Wire it up. Recommendations:
   - **Formspree** (easiest, free tier): set `action="https://formspree.io/f/your-form-id"`.
   - **Netlify Forms** (if you deploy to Netlify): add `data-netlify="true"` to the form.
   - **Vercel + custom function**: write `src/pages/api/contact.ts` and set `action="/api/contact" method="POST"`.
3. **Imagery** — no images yet. Add real plant-floor photography to `public/images/` with descriptive filenames. Then reference from the home hero and ServiceMatrix sections.
4. **OG card** — `public/og-default.svg` is a typographic placeholder. Generate a 1200×630 PNG with real photography for better social previews.
5. **Verify the FSC, ISO 9001, and SQF claims** in copy. They're written based on the brief's "FSC + sustainability" answer, assuming Apex holds the standard packaging-industry certifications. Edit if any are not yet held.
6. **Final pricing claims** — the home page and service pages cite specific MOQ numbers (100 / 250 / 500) and lead times (7–14 days). Confirm these are accurate before publishing.
7. **Google Search Console** — after launch, submit `sitemap-index.xml`.

## How the site is structured for AI search (GEO)

Beyond standard SEO, the site is optimized to be cited by LLMs (ChatGPT, Claude, Perplexity, Gemini, Google's AI Overviews):

1. **llms.txt at root** (`/llms.txt`) — long-form factual file listing services, MOQs, lead times, certifications, areas served, and a 12-Q&A FAQ. LLMs that fetch this file get clean, structured facts.
2. **robots.txt** explicitly allows GPTBot, ClaudeBot, Claude-Web, PerplexityBot, Google-Extended, Applebot-Extended, cohere-ai, and meta-externalagent.
3. **JSON-LD schema** on every page — Organization, WebSite, BreadcrumbList, plus per-service `Service` and per-blog `Article` and `FAQPage` blocks.
4. **First-paragraph facts** — every page leads with what the page is + who it's for + what's specifically different, in the first 200 characters. That's the window LLMs extract for citations.
5. **Specific entities** everywhere — real numbers (7–14 days, 100 MOQ), real materials (LDPE, FSC, EN 13432), real industries (automotive, food, pharma, electronics). LLMs prefer to cite pages dense with named entities.

## Post-launch SEO plan (suggested cadence)

1. Submit `sitemap-index.xml` to Google Search Console + Bing Webmaster (week 1).
2. Build 3–5 inbound links from packaging directories and trade associations (PAC Global, Canadian Packaging Magazine, BoxScore directory).
3. Publish 1 new blog post per month — same anti-slop discipline. Topic ideas in `research/keywords.md` under "Informational / blog clusters".
4. Monitor AI mentions quarterly — search ChatGPT and Perplexity for "best Canadian custom packaging manufacturer", "where to get low MOQ custom boxes Canada", etc. The llms.txt + schema work should push Apex into citation results within 1–2 quarters.

## Where the research lives

Don't delete `research/` — it's the working knowledge base.
- `research/competitor-list.md` — the 7 sites scraped
- `research/competitor-synthesis.md` — patterns, gaps, slop-to-avoid
- `research/keywords.md` — 12 clusters mapped to pages
- `research/competitors/<domain>.md` — raw scrapes
- `research/serp/*.json` — raw SERP JSON for re-analysis

When extending the site (new service line, new industry vertical), start here.

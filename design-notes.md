# Design Notes — Apex Packaging Solutions

## Preset selected

**Hybrid: Home Services / Trades (#7) ⨯ SaaS / B2B Tech (#5).**

The Canadian custom-packaging space is visually dominated by mid-2010s WordPress sites: heavy headers, stock imagery, gradient banners, blue/red corporate palettes. Apex has a chance to look like a 2025 industrial-modern site — workmanlike but precise — and instantly differentiate.

## Palette rationale

- **Neutral base**: warm off-white (`#F7F5F1`) → deep almost-black (`#0F0D0A`). Reads as kraft paper / corrugated material — appropriate for a packaging company. Avoids the cold grey-blue palette every competitor uses.
- **Accent (`#D34A1A`)**: a deep, slightly burnt orange. Reads as industrial / safety / kraft-warm. Not red (legal/corporate), not blue (every competitor), not green (eco-cliché). Stands out in the category.
- **Sub-accent (`#1B3A2F`)**: deep forest green, used sparingly. Pairs with the orange for sustainability-related signaling without going full eco-green.
- **Semantics**: standard four-color (success / warning / error / info) tuned warm.

## Typography rationale

- **Display: Archivo** — geometric workmanlike sans. Wide letterforms read confident and industrial. Used for H1/H2 in heavy weights (600/700).
- **Body: Inter** — the default modern body font. Tight tracking, excellent at 16/18px. Familiar to procurement readers (they see it on every B2B SaaS site).
- **Mono: JetBrains Mono** — used only for spec callouts (ECT-32, dimensions, SKU codes).

Both display and body are free Google Fonts, self-hosted in `public/fonts/` for performance.

## Layout DNA

- **Asymmetric hero** on the home page: oversized H1 left, lead-time stat card right.
- **12-column grid**, copy gets 7 cols, image gets 5 cols on service detail pages.
- **Spec-card pattern**: most service pages use a left "spec" column (sizes, MOQs, lead times, materials) and a right "details" column. Mimics a real product datasheet.
- **Section rhythm**: `py-20 md:py-32` for majors, `py-12 md:py-20` for minors.

## Photography direction

- Plant-floor photography: corrugated stacks, die-cutters, printing presses in operation, hands sealing boxes, pallets being shrink-wrapped.
- Product flat-lays on neutral surfaces (kraft, concrete, wood).
- Avoid: stock office shots, smiling models, conference-room handshakes, generic warehouse-and-forklift.
- For launch: pull from Unsplash with queries like "corrugated boxes factory", "kraft paper", "industrial printing press", "warehouse pallets" — descriptive filenames, attribution comments.

## Motion

- Subtle. Section reveals on scroll (opacity + 4px translate-y, 700ms ease-out, once).
- Hover states 150ms on color/border only.
- No parallax, no cursor tracking, no 3D card tilt. Procurement buyers find that annoying.
- Respects `prefers-reduced-motion`.

## Banned patterns (already on competitors, explicitly avoided)

- Blue + red corporate gradients (Crownhill, Coleman, Atlantic)
- "Made with [heart] in Canada" type lockups (BCBox)
- Stock photos of forklifts and warehouses (everyone)
- Center-aligned hero with floating product render (Pakfactory)
- 4-card "Why Choose Us" with circular icons (every competitor uses it)
- Gradient hero with abstract blob (PackMojo)
- Carousel of "Trusted by" logos that nobody verifies (most competitors)

## Why this preset works for Apex specifically

The buyer is procurement. They don't want to be "delighted" — they want to scan, find the spec they care about, send a quote request. The design optimizes for:
- **Fast scanning**: large type hierarchy, generous whitespace, spec callouts.
- **Trust at-a-glance**: warm-industrial palette signals "real factory", not "marketing agency."
- **Mobile-first procurement**: a buyer reading specs on their phone in a plant should be able to find MOQ + lead time in 2 thumb-scrolls.

The hybrid of #5 + #7 gives us: modernity from SaaS (clean type, restrained color, real metrics) + workmanlike trust from trades (warm palette, plant-floor photography, no fluff).

# Quality review — 2026-09-16

- Based on origin/main `5ab8bc0` in a clean detached worktree. Latest blog source is the September 16 fragile-product-kit guide, published in `19aef68`.
- The article, protective-packaging service and contact pages each returned HTTP 200 during this run. The article response contained its expected title. The web reader could not open the new article, so a direct HTTPS request verified it.
- Five Pinterest pins checked: titles under 100 characters and descriptions under 500 characters. Each includes its own tracked destination.
- LinkedIn, Facebook/Instagram, X/Threads and a timed YouTube Shorts script with shot list are present. X copy is 210 characters using a 23-character URL allowance.
- All 18 destination URLs have the production hostname, valid source routes, and source/medium/campaign/content UTM fields. Instagram and Facebook, and X and Threads, have separate attribution.
- Claims reviewed against the blog and procurement strategy. No guaranteed protection, certification, fixed lead time, price, or MOQ is asserted. Generated visuals are identified as concepts.
- Built-in image generation used with the existing Apex logo reference. Three final images visually reviewed for legible branding, clear packaging subjects and usable composition. The square asset required a correction to its edge background. Actual dimensions are listed below after final file verification.
- Social copy and supporting artifacts only; no application code changes requiring a build. Staged whitespace check performed before commit.
- No connected account-specific social posting tools found. No social posts were published.

## Verified asset dimensions

- `apex-fragile-kit-vertical.png`: 1024 × 1536 pixels.
- `apex-fragile-review-wide.png`: 1536 × 1024 pixels.
- `apex-fragile-rfq-square.png`: 1254 × 1254 pixels.

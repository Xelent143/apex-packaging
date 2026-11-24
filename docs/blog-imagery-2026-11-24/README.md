# Blog artwork refresh — 24 November 2026

The daily generator reused service-level images for unrelated subjects and repeated the hero inside each generated article. This release replaces that imagery in the four newest daily articles (21–24 November): tea, gift boxes, wholesale reorders and printed packaging colour control.

Eight original raster images were created with the built-in image generation tool, inspected, and converted to WebP. They are stored in `public/images/blog/2026-11-24-refresh/`; `generated-assets.json` records the paths, hashes and prompt set. The invented packaging brands are illustrative mockups, not customer work or case studies.

## Future daily articles

Prepare a fresh hero and a different inside image before a new daily article is published. Add `content/blog-artwork/<article-slug>.json` with this structure:

```json
{
  "hero": { "src": "/images/blog/article-specific-hero.webp", "alt": "Describe the banner image" },
  "inside": { "src": "/images/blog/article-specific-detail.webp", "alt": "Describe the different detail image" }
}
```

The daily generator requires this manifest. It rejects a missing pair, missing alt text, non-raster asset, an identical hero/detail pair, or image bytes already referenced by another published blog article, including a renamed copy. It never falls back to a generic service image. If fresh artwork has not been prepared, that day's workflow fails without publishing a recycled-image article. The schedule is unchanged; it does not itself generate artwork.

This safeguard is not a claim that semantic similarity or re-encoded/cropped duplicates can be identified automatically. Editorial visual review is still required. Historical archive reuse outside the four updated articles remains pending the archive-scope decision.

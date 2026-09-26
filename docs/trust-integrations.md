# Approved client logos

`src/components/trust/TrustedClients.astro` accepts an array of approved client-logo records. The homepage currently passes an empty array, so the section is not rendered.

After Apex confirms permission to display a client:

1. Add an optimized WebP or PNG logo to `public/images/client-logos/`.
2. Add the client name, asset path, intrinsic width, intrinsic height, and optional public URL to `approvedClientLogos` in `src/pages/index.astro`.
3. Confirm the accessible name and image rights before deployment.

Do not add prospect logos, fictional brands, unverified customer names, or logos copied from third-party websites.

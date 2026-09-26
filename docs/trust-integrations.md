# Trust integrations

## Trustpilot

`src/components/trust/TrustpilotTrustBox.astro` renders only when all three genuine values are configured:

- `PUBLIC_TRUSTPILOT_BUSINESS_UNIT_ID`
- `PUBLIC_TRUSTPILOT_TEMPLATE_ID`
- `PUBLIC_TRUSTPILOT_REVIEW_URL=https://www.trustpilot.com/evaluate/apexpackagingsolutions.com`

Copy the Business Unit ID and template ID from the official Trustpilot Business TrustBox configuration. The verified Apex review-collection URL is already recorded above. The component loads Trustpilot's official widget bootstrap script only when configured; it does not render fallback stars, ratings, review text, or counts.

## Approved client logos

`src/components/trust/TrustedClients.astro` accepts an array of approved client-logo records. The homepage currently passes an empty array, so the section is not rendered.

After Apex confirms permission to display a client:

1. Add an optimized WebP or PNG logo to `public/images/client-logos/`.
2. Add the client name, asset path, intrinsic width, intrinsic height, and optional public URL to `approvedClientLogos` in `src/pages/index.astro`.
3. Confirm the accessible name and image rights before deployment.

Do not add prospect logos, fictional brands, unverified customer names, or logos copied from third-party websites.

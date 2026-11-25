# Industry and service page audit

Scope: all 44 `/industries/:slug` pages, all nine `/services/:slug` pages, and both directory pages. Requested publication authorized in the chat. Implementation branch: `codex/industry-service-audit-20261125`.

## Findings and changes

45 detail pages had only eight or ten FAQs. Added 164 original, route-specific questions and answers to bring every detail page to exactly 12. Existing complete sets are retained. Supplements cover real product fit, sample approval, repeat-order control, destination-specific artwork, cost comparisons, food-contact documentation and material separation where relevant. They do not assert measured search-frequency rankings or borrow other suppliers' minimum quantities, prices or delivery promises.

Industrial/bulk and protective packaging had no product imagery. Added existing relevant illustrations: pallet film application for industrial/bulk; foam, corrugated and pulp inserts for protective packaging. Industry heroes remain product-specific, including the approved open rigid-box image. Removed unqualified food-safe/low-MOQ feature labels from the industry template. Industrial copy now requests specification-based film selection and food-contact evidence instead of unverified gauge ranges, savings percentages and FDA-grade claims; on-site and release-program scope requires confirmation.

## Research reviewed 25–26 November 2026

- [PackMojo structural samples](https://packmojo.com/samples/structural-sample/): distinguishes fit/structure approval from print approval. Used for sample questions, without adopting the supplier's commercial offer.
- [PackMojo pre-production samples](https://packmojo.com/samples/pre-production-sample/): production-representative sample scope varies by components and finish.
- [UPS Canada packaging tips](https://www.ups.com/ca/en/support/shipping-support/packaging-tips): review outer carton and internal protection together for the actual shipment. No carrier acceptance guarantee is made.
- [Health Canada packaging materials](https://www.canada.ca/en/health-canada/services/food-nutrition/food-safety/packaging-materials.html): food sellers are responsible for packaging suitability; intended-use evidence matters.
- [FDA food-contact material status](https://www.fda.gov/food/packaging-food-contact-substances-fcs/determining-regulatory-status-components-food-contact-material): food-contact suitability depends on the proposed components and intended use. No blanket FDA-approved packaging claim.
- [GS1 US barcode placement](https://www.gs1us.org/upcs-barcodes-prefixes/how-to-use-your-upc-barcodes/place-barcodes-on-products): assess printed barcodes and clear areas in the finished layout.
- [FTC environmental claims guidance](https://www.ftc.gov/business-guidance/resources/environmental-claims-summary-green-guides): qualify disposal claims for the actual materials and available collection systems. Recyclability is distinct from recycled content.

Regulated-product answers remain packaging procurement guidance: destination-specific review and complete-system validation are required; a carton does not authorize product sales or establish child resistance, sterility, ESD performance or battery transport compliance.

## Validation

Build, existing test suite, copy linter, rendered FAQ/schema comparison, local asset existence and directory-link coverage checks; production HTTP checks after deployment. Machine-readable audit reports are generated in `/tmp` during verification. No enquiry forms or customer emails are submitted.

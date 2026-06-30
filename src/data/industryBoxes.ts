export interface IndustryBox {
  slug: string;
  label: string;
  shortLabel?: string;
  image: string;
  heroBanner?: string;
  icon: string;
  alt: string;
  summary: string;
  bestFor: string[];
  materials: string[];
  styles: string[];
  printOptions: string[];
  manufacturerNotes: string[];
}

const defaultPrintOptions = [
  'Flexographic print for economical production runs',
  'Digital print for low-MOQ launches and seasonal artwork',
  'Foil, embossing, matte, soft-touch, and spot UV finishing on request'
];

function categoryBox(
  slug: string,
  label: string,
  summary: string,
  bestFor: string[],
  materials: string[],
  styles: string[]
): IndustryBox {
  return {
    slug,
    label,
    image: `/images/home/categories/${slug}.webp`,
    icon: '/images/industry-icons/product-boxes.png',
    alt: `Apex Packaging branded ${label.toLowerCase()}`,
    summary,
    bestFor,
    materials,
    styles,
    printOptions: defaultPrintOptions,
    manufacturerNotes: [
      'Dielines are built around the product dimensions, retail display needs, and fulfillment method.',
      'Material and finish choices are matched to the product weight, brand position, and reorder quantity.',
      'Digital proofs and samples can confirm artwork placement before the production run is released.'
    ]
  };
}

export const industryBoxes: IndustryBox[] = [
  categoryBox(
    'rigid-boxes',
    'Rigid Boxes',
    'Rigid boxes for premium gift sets, cosmetics, tech kits, launch packaging, and retail products that need a stronger presentation format.',
    ['Premium gift sets', 'Cosmetic kits', 'Launch boxes', 'Retail presentation'],
    ['Rigid board', 'Printed paper wrap', 'Foam or paperboard inserts', 'Specialty laminations'],
    ['Two-piece rigid boxes', 'Magnetic closure boxes', 'Drawer boxes', 'Rigid setup boxes']
  ),
  categoryBox(
    'custom-mylar-bags',
    'Custom Mylar Bags',
    'Custom mylar bags for food, supplements, wellness products, and retail refills that need barrier protection and branded print.',
    ['Coffee and tea refills', 'Supplements', 'Dry food packs', 'Retail refill programs'],
    ['Mylar barrier film', 'Kraft laminate film', 'Resealable zippers', 'Matte or gloss laminate'],
    ['Stand-up pouches', 'Flat pouches', 'Zipper bags', 'Hang-hole retail bags']
  ),
  categoryBox(
    'display-boxes',
    'Display Boxes',
    'Display boxes for counter, shelf, and retail presentation programs where products need organized visibility and brand impact.',
    ['Counter displays', 'Retail shelf programs', 'Sample packs', 'Impulse products'],
    ['Printed corrugated', 'SBS paperboard', 'Kraft board', 'Retail display inserts'],
    ['Counter display boxes', 'Shelf-ready trays', 'PDQ displays', 'Open-top display cartons']
  ),
  categoryBox(
    'pillow-boxes',
    'Pillow Boxes',
    'Pillow boxes for small retail products, gifts, apparel accessories, jewelry, and promotional packaging.',
    ['Small gifts', 'Jewelry and accessories', 'Apparel add-ons', 'Promotional kits'],
    ['SBS paperboard', 'Kraft board', 'Textured paper stock', 'Clear window film'],
    ['Curved pillow cartons', 'Window pillow boxes', 'Sleeved pillow boxes', 'Gift pillow boxes']
  ),
  categoryBox(
    'window-packaging',
    'Window Packaging',
    'Window packaging for products that need visibility on shelf while keeping the carton branded, protective, and retail-ready.',
    ['Food cartons', 'Cosmetic products', 'Retail gifts', 'Bottle and jar packaging'],
    ['SBS paperboard', 'Kraft board', 'PET window film', 'Food-safe window film'],
    ['Window cartons', 'Sleeve window boxes', 'Auto-bottom window boxes', 'Display window cartons']
  ),
  categoryBox(
    'custom-tuck-boxes',
    'Custom Tuck Boxes',
    'Custom tuck boxes for retail products, cosmetics, supplements, and lightweight goods that need efficient folding-carton production.',
    ['Retail cartons', 'Cosmetic items', 'Supplements', 'Small consumer products'],
    ['SBS paperboard', 'Kraft paperboard', 'Recycled-content board', 'Coated folding carton stock'],
    ['Straight tuck boxes', 'Reverse tuck boxes', 'Auto-lock bottom cartons', 'Hang-tab tuck boxes']
  ),
  categoryBox(
    'custom-kraft-soap-boxes',
    'Custom Kraft Soap Boxes',
    'Custom kraft soap boxes for handmade soap, natural skincare, and wellness brands that want recyclable retail packaging.',
    ['Handmade soap', 'Natural skincare', 'Wellness products', 'Retail soap bars'],
    ['Kraft paperboard', 'Recycled kraft stock', 'Window film', 'Soy-based print options'],
    ['Soap sleeves', 'Kraft tuck boxes', 'Window soap boxes', 'Die-cut soap cartons']
  ),
  categoryBox(
    'chocolate-bar-boxes',
    'Chocolate Bar Boxes',
    'Chocolate bar boxes for confectionery brands that need food-aware cartons, premium print, and strong shelf presence.',
    ['Chocolate bars', 'Confectionery launches', 'Gift chocolate', 'Seasonal flavors'],
    ['Food-grade paperboard', 'Kraft sleeves', 'Foil-compatible board', 'Retail folding carton stock'],
    ['Bar sleeves', 'Tuck cartons', 'Window chocolate boxes', 'Gift bar cartons']
  ),
  categoryBox(
    'software-boxes',
    'Software Boxes',
    'Software boxes for tech products, digital kits, manuals, cards, and premium product bundles.',
    ['Software suites', 'Tech bundles', 'Manual and card kits', 'Retail electronics'],
    ['Rigid board', 'Printed paperboard', 'E-flute corrugated', 'Foam or paperboard inserts'],
    ['Rigid tech boxes', 'Sleeve boxes', 'Mailer kits', 'Retail tuck cartons']
  ),
  categoryBox(
    'hair-extension-boxes',
    'Hair Extension Boxes',
    'Hair extension boxes for beauty brands that need long-format protection, premium print, and an elevated unboxing experience.',
    ['Hair extensions', 'Beauty bundles', 'Salon retail', 'Premium launch kits'],
    ['Rigid board', 'SBS paperboard', 'Drawer inserts', 'Soft-touch laminated wraps'],
    ['Drawer boxes', 'Sleeve boxes', 'Rigid presentation boxes', 'Window hair extension boxes']
  ),
  categoryBox(
    'cbd-gift-boxes',
    'CBD Gift Boxes',
    'CBD gift boxes for wellness bundles, tincture sets, jars, and launch kits with custom inserts and premium finishing.',
    ['CBD bundles', 'Tincture sets', 'Wellness launch kits', 'Retail gift packaging'],
    ['Rigid board', 'Printed paperboard', 'Foam inserts', 'Paperboard dividers'],
    ['Magnetic gift boxes', 'Insert kits', 'Drawer boxes', 'Retail bundle cartons']
  ),
  {
    slug: 'apparel-boxes',
    label: 'Apparel Boxes',
    image: '/images/industry-boxes/apparel-boxes.jpg',
    icon: '/images/industry-icons/apparel-boxes.png',
    alt: 'Apex Packaging branded apparel mailer boxes with tissue and garment tag',
    summary: 'Custom apparel boxes for folded garments, subscription drops, boutiques, and ecommerce clothing brands that need a strong unboxing moment.',
    bestFor: ['T-shirts and hoodies', 'Boutique retail', 'Subscription apparel', 'Gift-ready garments'],
    materials: ['E-flute corrugated', 'Kraft or white paperboard', 'Tissue and insert cards', 'Recycled-content board'],
    styles: ['Mailer boxes', 'Rigid apparel boxes', 'Sleeve boxes', 'Fold-flat garment cartons'],
    printOptions: defaultPrintOptions,
    manufacturerNotes: ['Dielines sized around folded garment stacks', 'Interior print and tissue options for branded unboxing', 'Low-MOQ digital samples before full production']
  },
  {
    slug: 'auto-parts',
    label: 'Auto Parts',
    image: '/images/industries/automotive-parts.webp',
    heroBanner: '/images/industries/auto-parts-hero-banner.webp',
    icon: '/images/industry-icons/auto-parts.png',
    alt: 'Apex Packaging branded corrugated packaging for automotive parts and VCI bags',
    summary: 'Automotive packaging for metal parts, fasteners, aftermarket kits, and OEM component shipments where protection and identification matter.',
    bestFor: ['Engine components', 'Fasteners and clips', 'Aftermarket kits', 'OEM plant shipments'],
    materials: ['Single-wall and double-wall corrugated', 'VCI rust-prevention bags', 'Die-cut corrugated inserts', 'Heavy-duty liners'],
    styles: ['RSC cartons', 'Die-cut part trays', 'Telescoping boxes', 'VCI bag and carton kits'],
    printOptions: ['Flexo part numbers and handling icons', 'One to four color brand print', 'Variable labels for SKUs and lot control'],
    manufacturerNotes: ['Corrugated grade selected by part weight and pallet stack', 'Custom inserts keep parts from shifting in transit', 'VCI options for ferrous metal corrosion control']
  },
  {
    slug: 'bakery-boxes',
    label: 'Bakery Boxes',
    image: '/images/home/categories/bakery-boxes.webp',
    icon: '/images/industry-icons/bakery-boxes.png',
    alt: 'Apex Packaging branded bakery window box for cupcakes',
    summary: 'Food-safe bakery boxes for cakes, cupcakes, pastries, cookies, and seasonal bakery programs.',
    bestFor: ['Cupcakes and pastries', 'Cake boxes', 'Cookie assortments', 'Seasonal bakery launches'],
    materials: ['SBS paperboard', 'Kraft board', 'Food-safe window film', 'Grease-resistant liners'],
    styles: ['Window boxes', 'Auto-lock bottom cartons', 'Cake boxes', 'Bakery sleeves'],
    printOptions: defaultPrintOptions,
    manufacturerNotes: ['Food-contact material options available', 'Window placement matched to product height', 'Flat-packed cartons for storage-efficient bakery operations']
  },
  {
    slug: 'bottle-boxes',
    label: 'Bottle Boxes',
    image: '/images/industry-boxes/bottle-boxes.jpg',
    icon: '/images/industry-icons/bottle-boxes.png',
    alt: 'Apex Packaging branded bottle cartons with protective corrugated inserts',
    summary: 'Bottle boxes with inserts and sleeves for glass, plastic, wellness, beverage, and specialty retail bottles.',
    bestFor: ['Glass bottles', 'Cosmetic bottles', 'Wellness products', 'Gift bottle packs'],
    materials: ['Folding carton board', 'Corrugated inserts', 'Rigid board', 'Molded pulp inserts'],
    styles: ['Straight tuck cartons', 'Sleeve and tray boxes', 'Divider shippers', 'Gift carriers'],
    printOptions: defaultPrintOptions,
    manufacturerNotes: ['Neck and base support can be built into the insert', 'Drop protection is matched to bottle weight and fragility', 'Retail graphics and shipper markings can share one production spec']
  },
  {
    slug: 'candle-boxes',
    label: 'Candle Boxes',
    image: '/images/home/categories/candle-boxes.webp',
    icon: '/images/industry-icons/candle-boxes.png',
    alt: 'Apex Packaging branded candle boxes and jar packaging',
    summary: 'Premium candle boxes for jars, tins, votives, and gift sets that need shelf appeal plus glass protection.',
    bestFor: ['Jar candles', 'Votive sets', 'Gift bundles', 'Subscription boxes'],
    materials: ['SBS paperboard', 'Rigid board', 'Corrugated inserts', 'Kraft board'],
    styles: ['Tuck boxes', 'Sleeve boxes', 'Rigid gift boxes', 'Insert-based mailers'],
    printOptions: defaultPrintOptions,
    manufacturerNotes: ['Insert cavities protect glass and lids', 'Premium finishes support retail fragrance lines', 'Mailer and retail carton specs can be paired for ecommerce']
  },
  {
    slug: 'cbd-boxes',
    label: 'CBD Boxes',
    image: '/images/apex-update/styles/cbd-boxes-premium.png',
    heroBanner: '/images/services/cbd-boxes-premium-hero.png',
    icon: '/images/industry-icons/cbd-boxes.png',
    alt: 'Apex Packaging branded CBD gift packaging',
    summary: 'CBD packaging for tinctures, jars, balms, gummies, and retail sets with controlled, brand-ready paperboard production.',
    bestFor: ['Tincture cartons', 'Topical jars', 'Gummy cartons', 'Retail gift sets'],
    materials: ['Paperboard cartons', 'Rigid gift board', 'Kraft board', 'Tamper-evident labels and sleeves'],
    styles: ['Reverse tuck cartons', 'Sleeve boxes', 'Display trays', 'Gift sets'],
    printOptions: defaultPrintOptions,
    manufacturerNotes: ['Artwork panels can reserve space for compliance copy', 'Child-resistant formats can be quoted where required', 'Short-run seasonal SKUs can be produced digitally']
  },
  {
    slug: 'cereal-boxes',
    label: 'Cereal Boxes',
    image: '/images/industry-boxes/cereal-boxes.jpg',
    icon: '/images/industry-icons/cereal-boxes.png',
    alt: 'Apex Packaging branded cereal cartons with inner liner bag and shipper',
    summary: 'Custom cereal boxes and dry-food cartons for retail launches, private-label runs, and sample programs.',
    bestFor: ['Cereal cartons', 'Granola products', 'Dry food refills', 'Private-label retail'],
    materials: ['Food-grade paperboard', 'Inner liner bags', 'Retail folding carton stock', 'Corrugated master cases'],
    styles: ['Auto-bottom cartons', 'Straight tuck cartons', 'Large face-panel cartons', 'Shelf-ready cases'],
    printOptions: defaultPrintOptions,
    manufacturerNotes: ['Carton dimensions are built around fill volume and inner bag clearance', 'Master cases can be specified for retail distribution', 'Proofs check barcode zones, nutrition panels, and shelf blocking']
  },
  {
    slug: 'chocolate-boxes',
    label: 'Chocolate Boxes',
    image: '/images/home/categories/chocolate-boxes.webp',
    icon: '/images/industry-icons/chocolate-boxes.png',
    alt: 'Apex Packaging branded chocolate box packaging',
    summary: 'Chocolate boxes for bars, truffles, assortments, and gifting programs where print finish and insert fit matter.',
    bestFor: ['Truffle trays', 'Chocolate bars', 'Gift assortments', 'Seasonal collections'],
    materials: ['SBS paperboard', 'Rigid board', 'Food-safe trays', 'Kraft sleeves'],
    styles: ['Sleeve boxes', 'Rigid lid boxes', 'Window cartons', 'Tray-and-sleeve sets'],
    printOptions: defaultPrintOptions,
    manufacturerNotes: ['Insert layouts can separate flavors and protect delicate pieces', 'Foil and embossing create premium shelf presence', 'Seasonal graphics can reuse the same structural dieline']
  },
  {
    slug: 'christmas-boxes',
    label: 'Christmas Boxes',
    image: '/images/home/categories/christmas-boxes.webp',
    icon: '/images/industry-icons/christmas-boxes.png',
    alt: 'Apex Packaging branded Christmas gift boxes',
    summary: 'Seasonal Christmas boxes for gifts, retail bundles, confectionery, ornaments, and holiday promotions.',
    bestFor: ['Gift sets', 'Holiday retail kits', 'Seasonal confectionery', 'Corporate gifting'],
    materials: ['Rigid board', 'Printed paperboard', 'Corrugated mailers', 'Specialty wraps'],
    styles: ['Gift boxes', 'Mailer boxes', 'Sleeve boxes', 'Window cartons'],
    printOptions: defaultPrintOptions,
    manufacturerNotes: ['Seasonal runs can use short-run digital print', 'Holiday art can be swapped onto proven dielines', 'Gift inserts keep mixed products presented cleanly']
  },
  {
    slug: 'cigarette-boxes',
    label: 'Cigarette Boxes',
    image: '/images/industry-boxes/cigarette-boxes.jpg',
    icon: '/images/industry-icons/cigarette-boxes.png',
    alt: 'Apex Packaging branded small retail cartons and display tray for cigarette-style packaging',
    summary: 'Small-format retail cartons and display trays for regulated, compliance-aware product packaging programs.',
    bestFor: ['Small retail cartons', 'Display trays', 'Sleeve packs', 'Plain-packaging formats'],
    materials: ['Folding carton board', 'Rigid paperboard', 'Kraft display board', 'Tamper-evident seals'],
    styles: ['Flip-top style cartons', 'Tuck cartons', 'Display trays', 'Sleeve packs'],
    printOptions: ['Plain or controlled-color print programs', 'Batch and SKU marking zones', 'Digital or flexo production by run size'],
    manufacturerNotes: ['Panels can be reserved for required regulatory copy', 'Samples confirm fit before production', 'Packaging-only production support; product compliance remains client supplied']
  },
  {
    slug: 'coffee-packaging',
    label: 'Coffee Packaging',
    image: '/images/home/categories/coffee-packaging.webp',
    icon: '/images/industry-icons/coffee-packaging.png',
    alt: 'Apex Packaging branded coffee packaging',
    summary: 'Coffee packaging for roasters, subscription brands, retail cartons, sample packs, and shipping kits.',
    bestFor: ['Coffee bags', 'Sample packs', 'Subscription boxes', 'Retail display cartons'],
    materials: ['Barrier pouches', 'Kraft cartons', 'Corrugated mailers', 'Valve-ready film structures'],
    styles: ['Stand-up pouches', 'Side-gusset bags', 'Mailer boxes', 'Display trays'],
    printOptions: defaultPrintOptions,
    manufacturerNotes: ['Barrier structures can be matched to roast and shelf-life needs', 'Mailer sizes can fit one, two, or three bags', 'Subscription artwork can vary by roast or month']
  },
  {
    slug: 'cosmetic-boxes',
    label: 'Cosmetic Boxes',
    image: '/images/home/categories/cosmetic-boxes.webp',
    icon: '/images/industry-icons/cosmetic-boxes.png',
    alt: 'Apex Packaging branded cosmetic boxes and bottle packaging',
    summary: 'Cosmetic boxes for skincare, serums, jars, droppers, makeup, and retail beauty launches.',
    bestFor: ['Skincare cartons', 'Serum bottles', 'Makeup boxes', 'Beauty gift sets'],
    materials: ['SBS paperboard', 'Rigid board', 'Soft-touch laminated stock', 'Paperboard inserts'],
    styles: ['Straight tuck cartons', 'Sleeve boxes', 'Rigid gift boxes', 'Display trays'],
    printOptions: defaultPrintOptions,
    manufacturerNotes: ['Premium finishes support beauty shelf appeal', 'Insert cavities secure glass and droppers', 'Dielines are built around label orientation and retail panels']
  },
  {
    slug: 'electronics-boxes',
    label: 'Electronics Boxes',
    image: '/images/industries/electronics-high-tech.webp',
    icon: '/images/industry-icons/electronics-boxes.png',
    alt: 'Apex Packaging branded electronics packaging with anti-static bags and foam inserts',
    summary: 'Electronics packaging for devices, PCBs, instruments, kits, and components that need ESD and impact protection.',
    bestFor: ['PCBs and assemblies', 'Consumer electronics', 'Test instruments', 'Accessory kits'],
    materials: ['Anti-static bags', 'ESD foam', 'Corrugated cartons', 'Die-cut protective inserts'],
    styles: ['Mailer kits', 'Foam-insert boxes', 'RSC shippers', 'Component bag-and-box sets'],
    printOptions: ['Handling icons and ESD markings', 'Flexo shipper print', 'Retail-grade digital print for device launches'],
    manufacturerNotes: ['Packaging can be specified for drop-test targets', 'ESD materials protect sensitive components', 'Insert geometry controls movement inside the carton']
  },
  {
    slug: 'food-boxes',
    label: 'Food Boxes',
    image: '/images/home/categories/food-boxes.webp',
    icon: '/images/industry-icons/food-boxes.png',
    alt: 'Apex Packaging branded custom food boxes',
    summary: 'Food boxes for dry goods, meal kits, retail cartons, bakery products, and food-service operations.',
    bestFor: ['Dry foods', 'Meal kits', 'Retail food cartons', 'Food-service packaging'],
    materials: ['Food-grade paperboard', 'Kraft board', 'Corrugated shippers', 'Food-safe liners'],
    styles: ['Folding cartons', 'Window boxes', 'Shelf-ready cases', 'Mailer boxes'],
    printOptions: defaultPrintOptions,
    manufacturerNotes: ['Food-safe material options available by application', 'Cartons can reserve panels for nutrition and compliance copy', 'Master cases are matched to pallet and retail distribution needs']
  },
  {
    slug: 'gift-boxes',
    label: 'Gift Boxes',
    image: '/images/home/categories/gift-boxes.webp',
    icon: '/images/industry-icons/gift-boxes.png',
    alt: 'Apex Packaging branded gift boxes',
    summary: 'Gift boxes for retail bundles, corporate gifting, seasonal kits, and premium presentation packaging.',
    bestFor: ['Corporate gifts', 'Retail bundles', 'Influencer kits', 'Seasonal programs'],
    materials: ['Rigid board', 'Printed paper wraps', 'Corrugated mailers', 'Foam or paperboard inserts'],
    styles: ['Magnetic rigid boxes', 'Two-piece boxes', 'Mailer gift kits', 'Sleeve and tray boxes'],
    printOptions: defaultPrintOptions,
    manufacturerNotes: ['Insert trays keep mixed items presented cleanly', 'Premium finishing can be matched to brand positioning', 'Mailer-ready gift boxes reduce secondary packaging']
  },
  {
    slug: 'hardware-boxes',
    label: 'Hardware Boxes',
    image: '/images/industry-boxes/hardware-boxes.jpg',
    icon: '/images/industry-icons/hardware-boxes.png',
    alt: 'Apex Packaging branded hardware cartons with fasteners and corrugated dividers',
    summary: 'Hardware packaging for fasteners, fittings, tools, small parts, and retail peg-hook cartons.',
    bestFor: ['Fasteners and anchors', 'Small tools', 'Retail hardware', 'Kitted components'],
    materials: ['Corrugated board', 'Folding carton stock', 'Clear window film', 'Poly part bags'],
    styles: ['Peg-hook boxes', 'Partitioned cartons', 'RSC shippers', 'Shelf-ready trays'],
    printOptions: ['SKU and barcode print zones', 'Flexo handling marks', 'Retail digital graphics for small runs'],
    manufacturerNotes: ['Board weight is chosen around part density', 'Partitions reduce mixing and abrasion', 'Retail cartons can include hang tabs and window panels']
  },
  {
    slug: 'health-boxes',
    label: 'Health Boxes',
    image: '/images/industries/pharma-medical.webp',
    icon: '/images/industry-icons/health-boxes.png',
    alt: 'Apex Packaging branded health and medical packaging cartons',
    summary: 'Health boxes for wellness products, supplements, medical accessories, and controlled retail packaging.',
    bestFor: ['Supplements', 'Wellness kits', 'Medical accessories', 'Health retail cartons'],
    materials: ['SBS paperboard', 'Tamper-evident seals', 'Corrugated shippers', 'Paperboard inserts'],
    styles: ['Straight tuck cartons', 'Mailer kits', 'Display cartons', 'Insert-based retail boxes'],
    printOptions: ['Clean medical-style print systems', 'Batch and lot marking zones', 'Digital sample runs for SKU families'],
    manufacturerNotes: ['Panels can reserve space for supplement facts and warnings', 'Cartons are sized around bottles, blister packs, or kits', 'Material and print specs can be documented for procurement']
  },
  {
    slug: 'hemp-boxes',
    label: 'Hemp Boxes',
    image: '/images/industry-boxes/hemp-boxes.jpg',
    icon: '/images/industry-icons/hemp-boxes.png',
    alt: 'Apex Packaging branded hemp product cartons and display tray',
    summary: 'Hemp boxes for retail cartons, balms, oils, wellness sets, and botanical product lines.',
    bestFor: ['Hemp oils', 'Topicals', 'Botanical sets', 'Retail display'],
    materials: ['Kraft paperboard', 'SBS cartons', 'Rigid board', 'Tamper-evident sleeves'],
    styles: ['Tuck cartons', 'Sleeve boxes', 'Display trays', 'Gift boxes'],
    printOptions: defaultPrintOptions,
    manufacturerNotes: ['Natural kraft stocks support earthy brand systems', 'Compliance copy zones can be built into the dieline', 'Retail trays help multi-SKU displays stay organized']
  },
  {
    slug: 'holiday-boxes',
    label: 'Holiday Boxes',
    image: '/images/home/categories/christmas-boxes.webp',
    icon: '/images/industry-icons/holiday-boxes.png',
    alt: 'Apex Packaging branded holiday gift boxes',
    summary: 'Holiday boxes for seasonal retail, gifting, food, cosmetics, and promotional bundle programs.',
    bestFor: ['Holiday bundles', 'Limited editions', 'Corporate gifting', 'Retail promotions'],
    materials: ['Rigid board', 'Printed paperboard', 'Corrugated mailers', 'Window film'],
    styles: ['Gift boxes', 'Mailer boxes', 'Sleeve cartons', 'Window boxes'],
    printOptions: defaultPrintOptions,
    manufacturerNotes: ['Seasonal artwork can run on repeatable structural dielines', 'Short runs support holiday testing before scale', 'Gift-ready inserts improve presentation and protection']
  },
  {
    slug: 'jewelry-boxes',
    label: 'Jewelry Boxes',
    image: '/images/industry-boxes/jewelry-boxes.jpg',
    icon: '/images/industry-icons/jewelry-boxes.png',
    alt: 'Apex Packaging branded jewelry rigid boxes and drawer packaging',
    summary: 'Jewelry boxes for rings, bracelets, necklaces, accessories, and premium ecommerce presentation.',
    bestFor: ['Ring boxes', 'Necklace packaging', 'Bracelet drawers', 'Luxury mailers'],
    materials: ['Rigid board', 'Soft-touch wraps', 'Velvet or paper inserts', 'Corrugated mailers'],
    styles: ['Drawer boxes', 'Two-piece rigid boxes', 'Mailer kits', 'Sleeve boxes'],
    printOptions: defaultPrintOptions,
    manufacturerNotes: ['Insert geometry is matched to product size and presentation angle', 'Foil stamping and embossing create premium brand cues', 'Outer mailers can protect the finished retail box']
  },
  {
    slug: 'kitchenware-boxes',
    label: 'Kitchenware Boxes',
    image: '/images/industry-boxes/kitchenware-boxes.jpg',
    icon: '/images/industry-icons/kitchenware-boxes.png',
    alt: 'Apex Packaging branded kitchenware boxes with protective inserts',
    summary: 'Kitchenware boxes for mugs, jars, utensils, cookware accessories, glass, ceramic, and fragile home goods.',
    bestFor: ['Ceramic mugs', 'Glass jars', 'Utensil sets', 'Home goods kits'],
    materials: ['Corrugated board', 'Molded pulp', 'Die-cut inserts', 'Retail paperboard'],
    styles: ['Insert-based shippers', 'Retail sleeves', 'Partition cartons', 'Mailer boxes'],
    printOptions: ['Retail digital print', 'Flexo shipper marks', 'Handling icons for fragile goods'],
    manufacturerNotes: ['Protection is built around glass, ceramic, or metal contact points', 'Partitions reduce product collision', 'Retail and shipping needs can be combined in one box system']
  },
  {
    slug: 'pharma-boxes',
    label: 'Pharma Boxes',
    image: '/images/industries/pharma-medical.webp',
    icon: '/images/industry-icons/pharma-boxes.png',
    alt: 'Apex Packaging branded pharmaceutical and medical packaging',
    summary: 'Pharma boxes for medical devices, cartons, kits, cold-chain shippers, and audit-ready packaging specs.',
    bestFor: ['Medical device cartons', 'Pharma kits', 'Cold-chain shippers', 'Tamper-evident packaging'],
    materials: ['Validated corrugated', 'Sterile-barrier compatible films', 'Insulated shippers', 'SBS paperboard'],
    styles: ['Folding cartons', 'Cold-chain kits', 'Device shippers', 'Tamper-evident cartons'],
    printOptions: ['Clean regulated artwork systems', 'Lot and SKU marking panels', 'Controlled color and proof documentation'],
    manufacturerNotes: ['Specs can document board grade, print method, and material requirements', 'Tamper-evident and cold-chain formats can be quoted', 'Samples help validate fit before full production']
  },
  {
    slug: 'pizza-boxes',
    label: 'Pizza Boxes',
    image: '/images/industry-boxes/pizza-boxes.jpg',
    icon: '/images/industry-icons/pizza-boxes.png',
    alt: 'Apex Packaging branded corrugated pizza boxes',
    summary: 'Pizza boxes for restaurants, frozen pizza brands, pop-ups, and food-service programs.',
    bestFor: ['Restaurant takeout', 'Frozen pizza', 'Event catering', 'Food-service programs'],
    materials: ['Food-grade corrugated', 'White or kraft board', 'Grease-resistant liners', 'Vent-ready board'],
    styles: ['Pizza boxes', 'Slice boxes', 'Flat corrugated cartons', 'Food-service sleeves'],
    printOptions: ['One-color kraft print', 'Full-color digital print', 'Seasonal and campaign artwork'],
    manufacturerNotes: ['Vent and lock-tab details are matched to food-service use', 'Flat-packed supply keeps storage efficient', 'Print can include reorder, QR, and promotional panels']
  },
  {
    slug: 'pre-roll-boxes',
    label: 'Pre Roll Boxes',
    image: '/images/industry-boxes/pre-roll-boxes.jpg',
    icon: '/images/industry-icons/pre-roll-boxes.png',
    alt: 'Apex Packaging branded pre-roll cartons and display packaging',
    summary: 'Pre-roll packaging cartons, sleeves, trays, and child-resistant style retail boxes for regulated product lines.',
    bestFor: ['Slim cartons', 'Display trays', 'Multi-pack sleeves', 'Tamper-evident packaging'],
    materials: ['Folding carton board', 'Kraft paperboard', 'Rigid drawer board', 'Tamper-evident seals'],
    styles: ['Slim tuck cartons', 'Drawer boxes', 'Display trays', 'Sleeve packs'],
    printOptions: ['Controlled retail print', 'Batch and compliance panel zones', 'Digital short-run SKU families'],
    manufacturerNotes: ['Packaging-only support with compliance artwork supplied by client', 'Panel layout can reserve mandated copy areas', 'Samples confirm fit before production']
  },
  {
    slug: 'product-boxes',
    label: 'Product Boxes',
    image: '/images/home/categories/custom-tuck-boxes.webp',
    icon: '/images/industry-icons/product-boxes.png',
    alt: 'Apex Packaging branded custom product boxes',
    summary: 'Product boxes for launches, retail SKUs, ecommerce products, and branded consumer goods packaging.',
    bestFor: ['Retail products', 'Launch samples', 'Subscription products', 'Ecommerce goods'],
    materials: ['SBS paperboard', 'Kraft board', 'E-flute corrugated', 'Rigid board'],
    styles: ['Tuck boxes', 'Sleeve boxes', 'Mailer boxes', 'Display cartons'],
    printOptions: defaultPrintOptions,
    manufacturerNotes: ['Apex builds the dieline from product dimensions', 'Proofing confirms artwork position and panel hierarchy', 'Production specs include material, quantity, lead time, and reorder path']
  },
  {
    slug: 'retail-boxes',
    label: 'Retail Boxes',
    image: '/images/home/categories/display-boxes.webp',
    icon: '/images/industry-icons/retail-boxes.png',
    alt: 'Apex Packaging branded retail display boxes',
    summary: 'Retail boxes for shelf-ready packaging, display trays, folding cartons, and high-visibility branded products.',
    bestFor: ['Shelf-ready displays', 'Retail cartons', 'Counter trays', 'Promotional packs'],
    materials: ['Printed paperboard', 'Corrugated display board', 'Window film', 'Rigid board'],
    styles: ['Display boxes', 'Folding cartons', 'Window boxes', 'Tray-and-sleeve packs'],
    printOptions: defaultPrintOptions,
    manufacturerNotes: ['Shelf blocking, barcode position, and display angle are considered in the dieline', 'Retail cartons can be paired with shipper cases', 'Finishes can be specified for premium shelf presence']
  },
  {
    slug: 'shipping-boxes',
    label: 'Shipping Boxes',
    image: '/images/home/corrugated-boxes-branded.webp',
    icon: '/images/industry-icons/shipping-boxes.png',
    alt: 'Apex Packaging branded corrugated shipping boxes',
    summary: 'Shipping boxes for ecommerce, manufacturing, wholesale, and distribution programs that need reliable corrugated specs.',
    bestFor: ['Parcel shipping', 'Wholesale cases', 'D2C orders', 'Industrial distribution'],
    materials: ['Single-wall corrugated', 'Double-wall corrugated', 'Kraft liner', 'Recycled-content board'],
    styles: ['RSC boxes', 'Mailer boxes', 'FOL cartons', 'Die-cut shippers'],
    printOptions: ['Flexo shipper print', 'Handling marks and SKU panels', 'Branded inside and outside mailer print'],
    manufacturerNotes: ['ECT and flute are selected by weight, stack, and freight method', 'Carton dimensions are optimized around product fit and void fill', 'Apex supports repeatable reorder specs for procurement teams']
  },
  {
    slug: 'soap-boxes',
    label: 'Soap Boxes',
    image: '/images/home/categories/soap-boxes.webp',
    icon: '/images/industry-icons/soap-boxes.png',
    alt: 'Apex Packaging branded soap boxes',
    summary: 'Soap boxes for bar soap, handmade soap, skincare sets, and natural product retail programs.',
    bestFor: ['Bar soap', 'Handmade brands', 'Skincare bundles', 'Natural retail'],
    materials: ['Kraft paperboard', 'SBS board', 'Window film', 'Sleeve stock'],
    styles: ['Soap sleeves', 'Window boxes', 'Tuck cartons', 'Gift boxes'],
    printOptions: defaultPrintOptions,
    manufacturerNotes: ['Vent, window, and sleeve details can show product texture', 'Natural kraft stocks pair well with botanical branding', 'Short-run digital print supports artisan SKU variety']
  },
  {
    slug: 'spice-packaging',
    label: 'Spice Packaging',
    image: '/images/industry-boxes/spice-packaging.jpg',
    icon: '/images/industry-icons/spice-packaging.png',
    alt: 'Apex Packaging branded spice cartons, pouches, and shippers',
    summary: 'Spice packaging for jars, pouches, cartons, refill packs, and retail-ready spice collections.',
    bestFor: ['Spice jars', 'Refill pouches', 'Gift sets', 'Retail displays'],
    materials: ['Food-grade paperboard', 'Barrier pouches', 'Corrugated shippers', 'Window film'],
    styles: ['Jar sleeves', 'Folding cartons', 'Stand-up pouches', 'Display trays'],
    printOptions: defaultPrintOptions,
    manufacturerNotes: ['Cartons can fit jar diameters and lid heights precisely', 'Pouches can be quoted by barrier requirement', 'Display trays help organize flavor families on shelf']
  },
  {
    slug: 'sports-boxes',
    label: 'Sports Boxes',
    image: '/images/industry-boxes/sports-boxes.jpg',
    icon: '/images/industry-icons/sports-boxes.png',
    alt: 'Apex Packaging branded sports product boxes and ecommerce mailers',
    summary: 'Sports boxes for athletic accessories, equipment, footwear-style cartons, subscription kits, and team retail products.',
    bestFor: ['Athletic accessories', 'Team retail', 'Equipment kits', 'Shoebox-style cartons'],
    materials: ['Rigid board', 'Corrugated mailers', 'SBS paperboard', 'Die-cut inserts'],
    styles: ['Shoebox-style boxes', 'Mailer boxes', 'Insert kits', 'Retail sleeves'],
    printOptions: defaultPrintOptions,
    manufacturerNotes: ['Box strength is matched to equipment weight and shape', 'Insert layouts keep accessories organized', 'Team or campaign artwork can run on shared structures']
  },
  {
    slug: 'stationery-boxes',
    label: 'Stationery Boxes',
    image: '/images/industry-boxes/stationery-boxes.jpg',
    icon: '/images/industry-icons/stationery-boxes.png',
    alt: 'Apex Packaging branded stationery boxes and paper goods packaging',
    summary: 'Stationery boxes for notebooks, cards, pens, planners, paper sets, and premium desk products.',
    bestFor: ['Notebook sets', 'Greeting cards', 'Pen kits', 'Planner packaging'],
    materials: ['Rigid board', 'Paperboard sleeves', 'Corrugated mailers', 'Divider inserts'],
    styles: ['Drawer boxes', 'Flat mailers', 'Sleeve boxes', 'Rigid lid boxes'],
    printOptions: defaultPrintOptions,
    manufacturerNotes: ['Flat mailers protect paper goods without excess bulk', 'Insert options keep pens and stationery aligned', 'Premium finishes support gifting and retail display']
  },
  {
    slug: 'tea-packaging',
    label: 'Tea Packaging',
    image: '/images/home/categories/tea-packaging.webp',
    icon: '/images/industry-icons/tea-packaging.png',
    alt: 'Apex Packaging branded tea packaging',
    summary: 'Tea packaging for sachets, tins, pouches, gift sets, sample packs, and subscription tea brands.',
    bestFor: ['Tea sachets', 'Loose-leaf pouches', 'Gift sets', 'Sample cartons'],
    materials: ['Barrier pouches', 'Printed paperboard', 'Rigid gift board', 'Corrugated shippers'],
    styles: ['Folding cartons', 'Pouch packaging', 'Gift boxes', 'Subscription mailers'],
    printOptions: defaultPrintOptions,
    manufacturerNotes: ['Barrier structures can be matched to aroma and shelf-life needs', 'Cartons and pouches can share coordinated branding', 'Gift sets can include dividers for flavor assortments']
  },
  {
    slug: 'vape-boxes',
    label: 'Vape Boxes',
    image: '/images/industry-boxes/vape-boxes.jpg',
    icon: '/images/industry-icons/vape-boxes.png',
    alt: 'Apex Packaging branded vape cartons and display packaging',
    summary: 'Vape boxes for small-format cartons, cartridge packs, drawer boxes, and retail display packaging.',
    bestFor: ['Cartridge cartons', 'Display trays', 'Drawer boxes', 'Small retail packs'],
    materials: ['Folding carton board', 'Rigid board', 'Kraft display board', 'Tamper-evident seals'],
    styles: ['Straight tuck cartons', 'Drawer boxes', 'Display trays', 'Sleeve packs'],
    printOptions: ['Controlled retail graphics', 'Batch and compliance panel zones', 'Digital or flexo production by quantity'],
    manufacturerNotes: ['Panel layout can reserve space for required warnings and SKU data', 'Small cartons can be nested in shelf-ready displays', 'Packaging-only support with client-supplied compliance artwork']
  }
];

export const featuredIndustryBoxes = industryBoxes.slice(0, 12);

export function getIndustryBoxBySlug(slug: string) {
  return industryBoxes.find((box) => box.slug === slug);
}

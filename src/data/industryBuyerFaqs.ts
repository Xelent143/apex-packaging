type FAQ = { q: string; a: string };

const productQuestions: Record<string, FAQ[]> = {
  'rigid-boxes': [
    { q: 'Which rigid-box style should I order?', a: 'Choose a magnetic, lift-off-lid or drawer box around your product arrangement, opening experience and budget.' },
    { q: 'Do my rigid boxes need custom inserts?', a: 'Specify inserts when products need separation, secure positioning or a controlled presentation.' },
    { q: 'Can I ship a rigid box without an outer carton?', a: 'Request a protective outer shipper unless the complete rigid-box packout has been validated for your delivery route.' }
  ],
  'custom-tuck-boxes': [
    { q: 'Should I choose straight tuck, reverse tuck or auto-lock bottom boxes?', a: 'Choose the closure around product weight, shelf presentation and how your team will assemble the carton.' },
    { q: 'How do I choose the right tuck-box size?', a: 'Provide the maximum product dimensions, packed weight and insert requirements so a sample can confirm clearance and closure fit.' },
    { q: 'Will my tuck boxes arrive flat or assembled?', a: 'Confirm the delivery format and required assembly steps in the quotation before ordering.' }
  ],
  'cbd-gift-boxes': [
    { q: 'Can one CBD gift box hold bottles, jars and accessories?', a: 'Provide each component’s dimensions and weight so a fitted insert can separate and secure the complete set.' },
    { q: 'Does a CBD gift box automatically qualify as compliant packaging?', a: 'No, have your compliance adviser approve the packaging requirements and artwork for the product and destination before production.' },
    { q: 'Can I request child-resistant packaging for a CBD set?', a: 'Include the required closure and testing documentation in your brief so suitability can be confirmed before ordering.' }
  ],
  'candle-boxes': [
    { q: 'What measurements do you need for candle packaging?', a: 'Send the jar or tin’s maximum dimensions, lid size and filled weight, including any accessories in the set.' },
    { q: 'How can I reduce glass-candle damage during shipping?', a: 'Request a fitted insert and suitable outer shipper, then test the complete packed candle for its intended delivery route.' },
    { q: 'Can different candle scents share the same box design?', a: 'Use a shared structure where jar sizes match and confirm separate artwork, labels and quantities for each scent.' }
  ],
  'cigarette-boxes': [
    { q: 'What cigarette-pack specifications should I provide?', a: 'Provide the product count, dimensions, inner-pack arrangement, closure style and destination-specific artwork requirements.' },
    { q: 'Can I use the same cigarette-box artwork in Canada and the USA?', a: 'Have a qualified compliance reviewer approve separate destination artwork before using one design across both markets.' },
    { q: 'Can you reserve space for required warnings and markings?', a: 'Provide approved copy and placement specifications so the dieline can allocate the required panels before printing.' }
  ],
  'gift-boxes': [
    { q: 'Which gift-box structure is best for my set?', a: 'Select a rigid box for premium presentation or a suitable corrugated mailer when the packaging must also support parcel delivery.' },
    { q: 'Can I include several products in one gift box?', a: 'Send all product dimensions and the preferred arrangement so inserts and removal clearance can be planned together.' },
    { q: 'Can gift boxes include ribbons, sleeves or printed interiors?', a: 'List each accessory and printed surface in your brief so compatibility, assembly and costs can be quoted.' }
  ],
  'jewelry-boxes': [
    { q: 'Can inserts be fitted for rings, necklaces and earrings?', a: 'Provide product measurements and display orientation so slots, hooks or cavities can be specified for each piece.' },
    { q: 'How do I protect jewelry from scratches inside the box?', a: 'Request a suitable lining and secure insert, then check contact surfaces with your actual jewelry sample.' },
    { q: 'Are jewelry boxes automatically tarnish-resistant?', a: 'No, specify any anti-tarnish requirement and request supporting material documentation before approving the packaging.' }
  ],
  'product-boxes': [
    { q: 'Should I order folding cartons, corrugated mailers or rigid boxes?', a: 'Choose the format around product weight, fragility, retail presentation and shipping requirements.' },
    { q: 'What product dimensions should I send for a quotation?', a: 'Send maximum length, width and height for every component, plus the complete packed weight and required clearance.' },
    { q: 'Can one box size work for several product versions?', a: 'Compare every version’s dimensions and protection needs before approving a shared box or interchangeable inserts.' }
  ],
  'sports-boxes': [
    { q: 'Which packaging works for sports equipment and accessories?', a: 'Select the board and structure around equipment dimensions, packed weight, sharp edges and the delivery route.' },
    { q: 'Can a sports box keep several accessories organized?', a: 'Provide the complete kit layout so dividers or fitted inserts can restrain and separate each component.' },
    { q: 'Can I order different team designs on the same box structure?', a: 'Submit each approved team artwork and quantity so shared tooling and separate print-run costs can be reviewed.' }
  ]
};

const additionalProductQuestions: Record<string, FAQ[]> = {
  "rigid-boxes": [
    {
      "q": "What increases the price of a magnetic rigid box?",
      "a": "Board thickness, wrap coverage, magnets, inserts and hand assembly all contribute to the quoted cost."
    },
    {
      "q": "Can rigid boxes fold flat to reduce storage space?",
      "a": "Ask for a collapsible rigid construction if storage volume matters, since conventional setup boxes retain their assembled shape."
    },
    {
      "q": "What should I check before approving a rigid-box sample?",
      "a": "Check wrapped corners, lid alignment, hinge movement and product removal using the complete intended contents."
    },
    {
      "q": "Can foil logos cross the hinge of a rigid box?",
      "a": "Keep critical foil details clear of hinge folds and wrapped edges unless the supplier validates that placement on a sample."
    },
    {
      "q": "How much clearance should a rigid lid have?",
      "a": "Approve lid clearance through a physical sample that accounts for board, wrap and insert thickness."
    },
    {
      "q": "How should rigid boxes be packed for delivery to Canada or the USA?",
      "a": "Specify protective master cartons and surface protection to limit scuffing and corner damage during the quoted freight route."
    },
    {
      "q": "What determines the minimum quantity for wrapped rigid boxes?",
      "a": "The minimum depends on the selected construction, wrap printing, closure components and assembly requirements."
    }
  ],
  "custom-tuck-boxes": [
    {
      "q": "Can a tuck carton support a heavy bottle?",
      "a": "Confirm the filled bottle weight and test the bottom closure before choosing a tuck flap instead of a locking base."
    },
    {
      "q": "What paperboard should I specify for a printed tuck carton?",
      "a": "Request a board grade and thickness suited to the product load, folding behaviour and required print finish."
    },
    {
      "q": "Where should the barcode go on a tuck box?",
      "a": "Place the barcode on a flat panel clear of seams, folds and cut edges, then verify scanning on a printed sample."
    },
    {
      "q": "Can tuck cartons run through my packing equipment?",
      "a": "Share the machine specifications and request trial cartons to confirm feeding, opening and closure performance."
    },
    {
      "q": "Will inside printing affect tuck-carton pricing?",
      "a": "Include interior print coverage in the quotation because it can add print passes and change the production plan."
    },
    {
      "q": "What affects the minimum run for multiple tuck-box designs?",
      "a": "Artwork versions, shared dimensions, board choice and print setup determine the minimum quantity for each design."
    },
    {
      "q": "What delivery details should Canadian and US tuck-box buyers confirm?",
      "a": "Confirm flat-pack case quantities, carton weights, freight charges and the delivery postal or ZIP code before approving the order."
    }
  ],
  "cbd-gift-boxes": [
    {
      "q": "Can the gift carton replace the sealed CBD product container?",
      "a": "Treat the gift carton as secondary packaging unless the proposed material and closure are specifically approved for the intended product contact."
    },
    {
      "q": "How should I separate glass tincture bottles in a gift set?",
      "a": "Specify individual insert cavities with suitable neck and base support to limit bottle-to-bottle contact."
    },
    {
      "q": "Can my CBD gift set include a batch-specific information card?",
      "a": "Provide the card dimensions, insertion position and version-control instructions with the approved packing specification."
    },
    {
      "q": "How can I avoid covering essential CBD product information?",
      "a": "Review the packed set with the approved labels visible or with the required information reproduced in the approved outer artwork."
    },
    {
      "q": "What should I inspect on a CBD gift-box prototype?",
      "a": "Check each filled container’s fit, closure access, insert removal and the visibility of required product information."
    },
    {
      "q": "Can I price small CBD launch sets separately from repeat orders?",
      "a": "Request separate quotations for the pilot quantity and forecast repeat volume using the same approved set specification."
    },
    {
      "q": "What should I confirm before ordering CBD gift boxes for Canada or the USA?",
      "a": "Identify the exact sales destination and obtain approval of its packaging brief before committing to gift-box tooling or printed stock."
    }
  ],
  "candle-boxes": [
    {
      "q": "Can one candle insert accommodate different jar diameters?",
      "a": "Use separate cavities or a validated adjustable design when jar dimensions vary enough to allow movement."
    },
    {
      "q": "Are candle cartons suitable for hot storage conditions?",
      "a": "Share expected storage temperatures so the packaging materials can be reviewed alongside the candle’s own heat limitations."
    },
    {
      "q": "Can a window be added to a candle box?",
      "a": "Request a window sample to assess visibility, carton stiffness and whether the exposed jar needs additional protection."
    },
    {
      "q": "How do I keep candle lids secure inside the carton?",
      "a": "Include the lid profile and retention needs in the insert brief and test the fully packed jar for movement."
    },
    {
      "q": "What changes the cost of a luxury candle carton?",
      "a": "Foil area, embossing, specialty coatings, board selection and the number of fragrance artworks affect the quoted unit cost."
    },
    {
      "q": "Should candle warning copy be supplied before the proof?",
      "a": "Provide all approved safety and product copy before proof approval so panel space and text placement can be checked."
    },
    {
      "q": "How should candle brands plan Canadian and US seasonal deliveries?",
      "a": "Work backward from the retail launch date and confirm separate sample, production and freight milestones for each destination."
    }
  ],
  "cigarette-boxes": [
    {
      "q": "Can cigarette cartons be sized for different stick lengths?",
      "a": "Provide exact stick and inner-bundle dimensions so the carton depth and opening clearance match the intended format."
    },
    {
      "q": "What should I test on a flip-top cigarette carton?",
      "a": "Check hinge durability, lid closure, inner-frame fit and repeated opening with a representative filled pack."
    },
    {
      "q": "Can cigarette packaging include a retail display tray?",
      "a": "Quote the display tray separately with its pack count, shelf footprint and approved presentation requirements."
    },
    {
      "q": "How do I keep cigarette-pack print versions separated?",
      "a": "Assign distinct artwork references and packing labels to every market, product size and approved design revision."
    },
    {
      "q": "Can a printed cigarette carton replace an inner barrier wrap?",
      "a": "Specify inner wrapping independently because a printed outer carton does not establish the required barrier performance."
    },
    {
      "q": "What production tolerances matter for cigarette packing lines?",
      "a": "Confirm carton dimensions, crease positions and feeding tolerances against the actual packing-line specification."
    },
    {
      "q": "What should a cigarette-box quotation state about regulated artwork changes?",
      "a": "Ask the supplier to state revision cutoffs and reprint costs before approving market-specific printed quantities."
    }
  ],
  "gift-boxes": [
    {
      "q": "Can gift packaging be personalized for corporate recipients?",
      "a": "Specify the names, message variations and quantities so variable print or separate cards can be priced accurately."
    },
    {
      "q": "How do I plan gift boxes for a fixed event date?",
      "a": "Confirm proof, sampling, production and delivery milestones with contingency time before accepting the event schedule."
    },
    {
      "q": "Should my supplier pack the gift contents or only supply boxes?",
      "a": "Confirm kitting, product receipt, assembly and dispatch responsibilities explicitly because empty-box supply does not include those services automatically."
    },
    {
      "q": "Can I reduce the storage space needed for gift packaging?",
      "a": "Compare folding gift cartons or collapsible structures with assembled presentation boxes using the quoted packed dimensions."
    },
    {
      "q": "What should I approve for a ribbon closure?",
      "a": "Approve ribbon length, colour, attachment method and tying instructions on a fully assembled gift sample."
    },
    {
      "q": "How do I compare gift-box quotations from Canadian and US suppliers?",
      "a": "Compare identical set contents, accessories, assembly scope, invoice currency and delivered costs before selecting an offer."
    },
    {
      "q": "Can seasonal gift packaging reuse an existing box size?",
      "a": "Keep the base structure where the contents still fit and quote a new sleeve, card or artwork version for the seasonal change."
    }
  ],
  "jewelry-boxes": [
    {
      "q": "How can a necklace insert reduce tangling?",
      "a": "Specify chain retention points and a separate space for excess chain, then test the design with the actual necklace."
    },
    {
      "q": "Can ring boxes fit several band widths?",
      "a": "Provide the widest and narrowest rings so the insert slot can be sampled for secure retention without excessive pressure."
    },
    {
      "q": "What should I check before ordering velvet-style jewelry inserts?",
      "a": "Review fibre shedding, colour transfer, contact softness and fit using the intended jewelry finish."
    },
    {
      "q": "Will a jewelry presentation box protect an ecommerce shipment?",
      "a": "Add a suitable outer mailer and restraint to protect the retail box and jewelry during parcel handling."
    },
    {
      "q": "Can small jewelry logos be foil stamped clearly?",
      "a": "Submit vector artwork and approve a foil sample to confirm fine lines and small lettering remain legible."
    },
    {
      "q": "What drives the minimum order for custom jewelry packaging?",
      "a": "Insert tooling, box construction, lining selection and logo finishing determine the feasible quantity for the chosen design."
    },
    {
      "q": "How should jewelry retailers compare CAD and USD box prices?",
      "a": "Compare costs at the same quantity and specification while accounting for currency, insert tooling and delivery to your store."
    }
  ],
  "product-boxes": [
    {
      "q": "How should I choose packaging for a retail shelf?",
      "a": "Share the shelf footprint, hanging or stacking needs and required information panels before finalizing the box structure."
    },
    {
      "q": "Can product packaging include a tamper-evident seal?",
      "a": "Specify where opening evidence is needed so the seal placement and carton surface can be evaluated together."
    },
    {
      "q": "What should be included in a product-box reorder record?",
      "a": "Retain the approved dieline, board specification, artwork revision, colour reference and packing instructions for consistent reorders."
    },
    {
      "q": "How can I prevent unexpected product-box tooling charges?",
      "a": "Ask the quotation to separate cutting dies, printing plates and insert tooling from recurring unit prices."
    },
    {
      "q": "Can I approve product packaging with a digital proof alone?",
      "a": "Use the digital proof for artwork review and request a physical sample when fit, colour or structural performance needs confirmation."
    },
    {
      "q": "What should Canadian and US retailers supply for bilingual packaging layouts?",
      "a": "Provide the final approved language versions and panel priorities before the artwork proof is prepared."
    },
    {
      "q": "Can a product-box trial order use the final production materials?",
      "a": "Confirm material and print equivalence in the sample quotation before treating a trial pack as representative of the full run."
    }
  ],
  "sports-boxes": [
    {
      "q": "How should I package sports equipment with sharp or projecting parts?",
      "a": "Identify protrusions and contact points so protective guards and internal restraints can be included in the pack design."
    },
    {
      "q": "Can shoe boxes be sized for a full footwear range?",
      "a": "Provide the smallest and largest packed pairs so shared sizes can be compared with dedicated cartons."
    },
    {
      "q": "How do I package sports apparel with equipment in one kit?",
      "a": "Separate soft goods from hard components and sample the complete arrangement to check compression and movement."
    },
    {
      "q": "What should I specify for heavy fitness accessories?",
      "a": "Share the actual weight distribution and handling route so board strength, base support and lifting needs can be assessed."
    },
    {
      "q": "Can sports packaging include a hanging retail display?",
      "a": "Provide the loaded weight and retailer peg specification so the hang-tab structure can be tested."
    },
    {
      "q": "How can bulky sports packaging affect Canada–USA freight costs?",
      "a": "Request packed carton dimensions and weights because freight pricing can be affected by volume as well as actual weight."
    },
    {
      "q": "What should I approve before a tournament merchandise packaging run?",
      "a": "Approve team artwork, size allocations, kit contents and the delivery schedule against the event’s distribution plan."
    }
  ]
};

export function industryBuyerFaqs(slug: string): FAQ[] | undefined {
  const specific = productQuestions[slug];
  return specific ? [...specific, ...additionalProductQuestions[slug]] : undefined;
}

import { buyerFaqSupplements } from './buyerFaqSupplements';
import { remainingBuyerFaqs } from './remainingBuyerFaqs';

type FAQ = { q: string; a: string };

const productQuestions: Record<string, FAQ[]> = {
  'rigid-boxes': [
    { q: 'Which rigid-box style should I order?', a: 'Choose a magnetic, lift-off-lid or drawer box around your product arrangement, opening experience and budget.' },
    { q: 'Do my rigid boxes need custom inserts?', a: 'Specify inserts when products need separation, secure positioning or a controlled presentation.' },
    { q: 'Can I ship a rigid box without an outer carton?', a: 'Request a protective outer shipper unless the complete rigid-box packout has been validated for your delivery route.' }
  ],
  'custom-tuck-boxes': [
  {
    "q": "What is the difference between straight tuck, reverse tuck, snap-lock and auto-bottom boxes?",
    "a": "Straight-tuck cartons have top and bottom tuck flaps closing toward the same side; reverse-tuck cartons close in opposite directions. A snap-lock, or 1-2-3 bottom, is folded and interlocked during packing, while an auto-bottom uses a pre-glued base designed to open into position. Compare presentation, product load, assembly time and filling equipment. Closure names do not establish a safe load: approve the actual structure and board with your filled product before choosing."
  },
  {
    "q": "How do I choose the correct custom tuck-box dimensions?",
    "a": "Measure the finished product at its widest points, including caps, wrappers, labels and any inner tray or insert. Specify length, width and height in consistent units and identify whether they are usable internal or external dimensions. Leave practical clearance for loading and closing without excessive movement. For handmade variations, irregular products or tight fits, provide representative samples and check the assembled carton before finalizing the dieline."
  },
  {
    "q": "Which paperboard and thickness should I use for tuck cartons?",
    "a": "Specify product weight, carton size, display method, handling conditions and print expectations before selecting the board. White paperboard can provide a bright print surface, while kraft gives a brown base that changes colour appearance. Board grade and thickness influence folding, stiffness and closure fit, but a thicker board is not automatically the right solution. Ask Apex to compare appropriate materials and evaluate the crease, glue seam and bottom on a filled sample."
  },
  {
    "q": "Can tuck boxes hold bottles, jars or other heavy and fragile products?",
    "a": "They can be considered when the board, bottom construction and internal support are appropriate for the actual load. A tuck flap should not be assumed to support a dense bottle simply because the carton fits. Review locking or glued-bottom options and any insert with the filled product. Glass and other fragile items may also need cushioning and a corrugated outer shipper for parcel delivery. Agree on relevant packing and handling trials before approving the complete packaging system."
  },
  {
    "q": "What is the minimum order, and can different sizes or designs share a tuck-box run?",
    "a": "Minimums depend on the dimensions, board, print process, cutting tools, finishes and assembly operations. A change in size, material or artwork can create a separate production requirement, even within one order. Send the quantity for each version and identify which products could use a common structure. Apex confirms available quantity tiers, minimums and any shared-production options in a project-specific quotation rather than applying one minimum to every tuck carton."
  },
  {
    "q": "How much do printed tuck boxes cost in Canada or the USA, and what should my quote include?",
    "a": "Pricing depends on material use, board grade, dieline and tooling, print coverage, artwork versions, finishes, windows, inserts and quantity. Provide the packed product dimensions and weight, approved artwork requirements, quantity per version, receiving postal or ZIP code and target arrival date. Ask which artwork preparation, proofs, samples, tooling and freight charges are included. Confirm the quotation currency and responsibility for duties, taxes, customs clearance and final delivery before comparing total delivered cost."
  },
  {
    "q": "Can you print my logo, inside panels, foil, embossing or a window on tuck boxes?",
    "a": "Share your logo, desired printed surfaces, colour references and finish or window requirements. Apex reviews the available options against the board, structure, quantity and production route. A window removes supporting material, and foil, embossing or coatings need suitable space around folds, glue areas and closures. Interior printing can add production steps and requires application review where product contact is involved. Check an assembled proof or appropriate sample so important details are not hidden by the tuck flap."
  },
  {
    "q": "What artwork, barcode and Canadian or US label information should I provide?",
    "a": "Use the current dieline and supply vector logos where available, final copy, colour references and barcode files. Keep essential graphics away from cut edges, folds and glue areas; barcodes need suitable size, contrast and clear space on an appropriate panel. Plan room for destination-specific text before approving the layout. Canadian consumer prepackaged food generally needs mandatory information in English and French, with exceptions. Requirements for other products and US markets vary, so have the responsible reviewer approve the final label copy."
  },
  {
    "q": "Can I approve a structural sample or printed proof before a bulk tuck-box order?",
    "a": "Ask which digital proofs, structural samples and printed samples are available, with their cost and timing. Digital proofs help check text, layout and panel orientation; structural samples help assess clearance, closure engagement, bottom fit and packing steps. A printed or production-representative sample may be needed for colour, board and finish decisions. Check the actual products and any insert, then record the approved specification, artwork revision and sample reference before production release."
  },
  {
    "q": "Will tuck cartons arrive flat, and can they work with my packing equipment?",
    "a": "Confirm the delivery format, pre-gluing, case quantities and assembly steps in the quotation. Many folding cartons are supplied flat, but straight tuck, snap-lock and auto-bottom formats have different erection and closing steps. Share your manual packing process or cartoner specifications, including loading direction and closure requirements. Request suitable trial cartons when equipment compatibility matters, and assess feeding, opening, filling and closing with the proposed board and actual product before committing to a production run."
  },
  {
    "q": "How long do custom tuck boxes take, and can Apex deliver to Canada and the USA?",
    "a": "Apex's Canada-based team coordinates design, proofs, samples, qualified overseas production and delivery for Canadian and US buyers. Timing depends on artwork readiness, material, tooling, finishes, quantity, approvals and freight method. Production and transit are separate stages. Give the receiving postal or ZIP code, delivery requirements and in-hand date before approval. Apex confirms the project schedule and delivery responsibilities in the quotation; a seasonal launch should be planned around the complete process, not printing time alone."
  },
  {
    "q": "Are tuck boxes food-safe or recyclable, and what documentation should I request?",
    "a": "Treat these as separate requirements. For food use, identify direct or indirect contact, the food type and storage or filling conditions, then request appropriate documentation for the board, inks, adhesives, coatings and any window or inner wrap. A printed carton is not automatically suitable for direct food contact. For recycling, assess the complete finished pack and local collection options; kraft appearance does not prove recycled content or recyclability. Request evidence for the specific material and claim before approving it."
  }
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
  return specific ? [...specific, ...(additionalProductQuestions[slug] ?? []), ...(buyerFaqSupplements[`industries/${slug}`] ?? [])] : remainingBuyerFaqs(`industries/${slug}`);
}

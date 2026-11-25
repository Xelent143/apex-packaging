// Product-specific additions from the November 2026 industry and service audit.
// Research and scope: docs/research/industry-service-audit-2026-11-25.md
export const buyerFaqSupplements: Record<string, { q: string; a: string }[]> = {
  "industries/apparel-boxes": [
    {
      "q": "Can I approve the clothing box before committing to a full run?",
      "a": "Request an unprinted fit sample with the actual garment, fold and tissue. A printed sample serves a different purpose: checking colour, inside print and surface finish. Confirm sample cost and availability before ordering."
    },
    {
      "q": "What affects the minimum quantity for printed apparel boxes?",
      "a": "Box size, board, print method, finishes and the number of clothing ranges affect production setup. Request quantity tiers per design and identify whether changing a size sticker could reduce separate artwork runs."
    },
    {
      "q": "How should I plan packaging for a Canadian or US clothing launch?",
      "a": "Work backward from the required in-hand date, allowing for garment fit approval, print approval, production and freight. Provide the postal or ZIP code and receiving restrictions; confirm each milestone in the quotation."
    },
    {
      "q": "Are tissue, ribbons and laminated apparel boxes recyclable together?",
      "a": "Assess each component separately. Request the board and finish specification, make removable accessories easy to separate and check local collection options in the customer's Canadian or US community before printing disposal claims."
    }
  ],
  "industries/auto-parts": [
    {
      "q": "Can an automotive pack be approved for both parcel and pallet delivery?",
      "a": "Validate the packed part for each route: parcel handling and pallet stacking expose it to different loads. Record the carton, restraints, corrosion protection and packed weight used in each trial."
    },
    {
      "q": "How do I package replacement parts with sharp studs or flanges?",
      "a": "Provide photographs and projections in the dimensional drawing. Review fitted blocking and puncture protection so the metal cannot reach the carton wall; test removal as well as shipment with the actual part."
    },
    {
      "q": "What should a returnable automotive pack specification include?",
      "a": "Define the intended number of trips, cleaning method, inspection criteria and replacement components. Agree how damaged inserts or closures will be identified; a reusable appearance alone does not establish a validated service life."
    },
    {
      "q": "What must a parts-packaging reorder preserve?",
      "a": "Retain the approved drawing revision, material grade, cavity dimensions, orientation and label layout. Require review of substitutions before release, particularly where part tolerances or surface coatings have changed."
    }
  ],
  "industries/bottle-boxes": [
    {
      "q": "Can I approve a bottle box using an empty bottle sample?",
      "a": "Use the filled bottle with its final cap, pump and label when checking weight, fit and removal. An empty sample can help establish geometry but cannot reproduce the forces of a filled glass pack."
    },
    {
      "q": "How much does a custom bottle insert add to the order?",
      "a": "Ask for separate costs for the carton, insert, tooling and packing labour. Compare the complete protected pack rather than removing a divider solely to lower unit price; bottle count and fragility affect the design."
    },
    {
      "q": "How should Canadian and US bottle brands plan bilingual artwork?",
      "a": "Supply destination-approved copy before laying out narrow panels. Keep required text and codes clear of folds and window edges, and approve a physical-size proof; the carton supplier does not determine the product's labelling obligations."
    },
    {
      "q": "Can bottle boxes use paper-based inserts instead of foam?",
      "a": "Paperboard, corrugated or moulded pulp may suit some bottle shapes. Compare support at the base and shoulder, abrasion and loaded transit performance; confirm available materials and local disposal instructions for the final pack."
    }
  ],
  "industries/candle-boxes": [
    {
      "q": "Should I approve a printed candle-box sample before a large order?",
      "a": "Test the final filled jar, lid and insert together, then check colour and finish on a representative printed sample where available. Record approved materials and revisions; a screen proof cannot demonstrate glass protection."
    },
    {
      "q": "Can candle cartons use less plastic without increasing breakage?",
      "a": "Compare paperboard dividers, corrugated pads or moulded pulp with the current packout. Test the filled glass candle on the intended Canadian or US delivery route before reducing cushioning, and verify local disposal options for each component."
    }
  ],
  "industries/cbd-boxes": [
    {
      "q": "What should a CBD carton quote include beyond the printed box?",
      "a": "Specify bottle dimensions, insert, quantity per version, approved copy, tooling, samples and destination. Confirm currency and freight responsibilities. Packaging procurement is separate from determining whether the product may legally be marketed in that jurisdiction."
    },
    {
      "q": "Can I reuse a CBD carton dieline for a new formulation?",
      "a": "Recheck container fit and the space required for the new approved label information. Keep separate artwork revisions and obtain destination-specific regulatory approval before printing; an unchanged bottle does not establish unchanged labelling requirements."
    },
    {
      "q": "How should I approve colours and small text on CBD packaging?",
      "a": "Review a full-size proof and a printed sample when colour or fine copy is critical. Keep codes and required text away from creases; confirm the actual board and finish rather than judging only a screen image."
    },
    {
      "q": "How can I document changes to a CBD carton reorder?",
      "a": "Record the approved dieline, copy revision, insert and material specification. Have substitutions or warning changes reviewed before release, and keep Canadian and US versions distinct throughout proofing and receiving."
    }
  ],
  "industries/cbd-gift-boxes": [
    {
      "q": "How should I assess disposal claims on a CBD gift set?",
      "a": "Review the wrapped board, magnets, ribbons, trays and foam separately. Request material information and use disposal guidance supported by the actual set and local facilities; a paper exterior alone does not establish recyclability."
    },
    {
      "q": "What should the CBD gift-box delivery schedule separate?",
      "a": "Separate prototype approval, regulatory artwork approval, production and freight milestones. Provide the receiving postal or ZIP code and launch date, and confirm contingencies if container dimensions or approved copy change after proofing."
    }
  ],
  "industries/cereal-boxes": [
    {
      "q": "Can cereal packaging be tested before a full print run?",
      "a": "Request a structural trial with the filled liner and the intended filling and sealing process. Check closure, bulging, shelf presentation and case packing; use a printed sample separately for colour and small label text."
    },
    {
      "q": "What drives minimum quantities for cereal carton variants?",
      "a": "Different box dimensions, board grades and print versions may require separate setups. Ask for quantity tiers per flavour and size, and identify which changes can be handled through approved coding rather than new carton artwork."
    },
    {
      "q": "What food-contact evidence should accompany a cereal packaging specification?",
      "a": "Identify which layers touch the cereal and the expected storage conditions. Request documentation for the proposed liner and other contact materials for that use; an outer carton or generic material description does not establish food safety."
    },
    {
      "q": "How should Canadian and US cereal labels be approved?",
      "a": "Give the designer destination-approved ingredient, nutrition and other required copy before proofing. Review each market version at actual size and reserve coding space; do not assume a bilingual panel alone meets both countries' requirements."
    }
  ],
  "industries/chocolate-bar-boxes": [
    {
      "q": "What should I test on a chocolate-bar sleeve sample?",
      "a": "Fit the actual wrapped bar at its normal thickness and check insertion, removal, seam position and scuffing. If dimensions vary with inclusions, trial the largest bar; a flat artwork proof cannot verify fit."
    },
    {
      "q": "How can chocolate-bar brands compare small and large print runs?",
      "a": "Request tiers for each bar size and artwork version, with tooling and freight separated. Compare the cost of seasonal sleeves against a shared structural carton, while retaining enough space for each flavour's approved information."
    },
    {
      "q": "Can chocolate-bar cartons help prevent flavour transfer?",
      "a": "The primary wrapper and storage system need review for aroma and barrier performance. Ask for material compatibility evidence and sensory trials where relevant; decorative board and foil stamping alone do not provide a validated barrier."
    },
    {
      "q": "How should chocolate cartons be stored before packing?",
      "a": "Keep them clean, dry and away from strong odours under the agreed storage conditions. Confirm stacking and conditioning instructions with the supplier; protect printed surfaces and food-contact components from contamination during handling."
    }
  ],
  "industries/chocolate-boxes": [
    {
      "q": "Can I see the chocolate gift-box finish before placing a bulk order?",
      "a": "Request samples that distinguish structural fit from final print and finishes. Trial actual chocolates or representative primary packs, then check the lid, tray and protective layer without pressing delicate decorations."
    },
    {
      "q": "What should a chocolate-box quote say about inserts and assembly?",
      "a": "List tray material, cavity count, pads, dividers, sleeves and delivery format. Confirm which pieces arrive assembled and compare packing labour and storage volume as well as the delivered price for Canada or the USA."
    },
    {
      "q": "How should chocolate assortment labels handle allergens and variants?",
      "a": "Reserve space for destination-approved ingredient and allergen information that matches the actual assortment. Review changes to flavours and trays together; a printed flavour key is not a substitute for required product labelling."
    },
    {
      "q": "Are magnetic chocolate gift boxes recyclable?",
      "a": "Assess the finished construction, including magnets, wrap, laminate and trays. Ask which components can be removed and check local collection guidance; do not infer recyclability from the board core or a kraft appearance."
    }
  ],
  "industries/christmas-boxes": [
    {
      "q": "What should I check on a Christmas gift-box prototype?",
      "a": "Pack the final gift combination with tissue and inserts. Check closing pressure, ornament movement, carry points and printed surfaces, then retain the approved configuration so a late product substitution does not compromise fit."
    },
    {
      "q": "Can Christmas packaging arrive flat to save warehouse space?",
      "a": "Ask which structures are supplied flat and which are assembled. Compare storage volume and assembly time using a sample, including any ribbon or insert steps; premium rigid formats may need substantially more space."
    },
    {
      "q": "How should I compare Christmas packaging minimums by design?",
      "a": "List the quantity of each size, artwork and finish. Ask whether a common box with different sleeves is feasible, then compare setup charges and delivery dates without assuming every version can share one minimum."
    },
    {
      "q": "What should be confirmed for cross-border Christmas packaging freight?",
      "a": "Specify the receiving postal or ZIP code, required arrival date and whether an appointment or liftgate is needed. Confirm quote currency, freight terms and responsibility for clearance, duties and taxes before approving the order."
    }
  ],
  "industries/cigarette-boxes": [
    {
      "q": "How should cigarette carton samples be approved for production?",
      "a": "Review a structural sample on the intended packing equipment and approve the final destination-specific artwork separately. Record the board, crease performance and approved revision; a sample is not evidence of regulatory authorization."
    },
    {
      "q": "Can cigarette carton material changes be made on a repeat order?",
      "a": "Require approval of any board, coating, adhesive or dimensional change before manufacture. Recheck packing-line operation and approved markings where affected, keeping the Canadian and US specifications separately controlled."
    }
  ],
  "industries/coffee-packaging": [
    {
      "q": "What should a coffee packaging sample trial include?",
      "a": "Fill with the intended roast and format, then check valve location, sealing, zipper operation and shipping fit. Shelf-life decisions require the actual coffee, barrier specification and storage conditions rather than a sample pouch's appearance."
    },
    {
      "q": "How should I compare the cost of printed coffee pouches?",
      "a": "Quote the same fill volume, laminate, valve, zipper and print versions. Include setup, trial samples, case quantities and freight to the Canadian postal or US ZIP code; quoted capacity alone is insufficient for comparison."
    },
    {
      "q": "Can I use recyclable coffee bags with a valve and zipper?",
      "a": "Ask for the full film structure and component details, including valve and zipper. Confirm the specific recycling route available to customers before making claims; a paper-look pouch may contain multiple materials."
    },
    {
      "q": "What must stay consistent when reordering coffee packaging?",
      "a": "Retain the approved film structure, valve, seal conditions, dimensions and print revision. Request review of substitutions and trial the pouch again if roasting, filling equipment or storage conditions change."
    }
  ],
  "industries/cosmetic-boxes": [
    {
      "q": "What should I approve before ordering a new cosmetic carton?",
      "a": "Test the final filled container, closure and any leaflet in a structural sample. Approve print, finish and small copy separately, recording the exact revision; matching bottle volume does not guarantee matching external dimensions."
    },
    {
      "q": "How do cosmetic carton quantities affect price?",
      "a": "Request tiers per structure, shade artwork and finish, including insert and tooling costs. A shared dieline may reduce structural changes but does not eliminate print setup for every shade or language version."
    },
    {
      "q": "Can a cosmetic box be specified for easier recycling?",
      "a": "Compare unlaminated board and removable inserts where suitable for the product. Request composition information and check local Canadian or US collection guidance before printing environmental claims about the finished carton."
    },
    {
      "q": "How should beauty cartons accommodate retailer labels?",
      "a": "Get the retailer's barcode, price-label and security-tag requirements before layout approval. Reserve a flat, readable area away from folds and foil, then test the completed printed pack with the intended scanners or labels."
    }
  ],
  "industries/custom-mylar-bags": [
    {
      "q": "What does Mylar mean in a custom pouch quotation?",
      "a": "Ask for the exact laminate structure, thickness and barrier data rather than relying on the name. Pouches sold under this description can differ; suitability depends on the contents, sealing process and required storage conditions."
    },
    {
      "q": "How should food pouch materials be approved for Canada and the USA?",
      "a": "State the food type, contact duration, filling temperature and storage conditions. Request appropriate documentation for the complete contact structure and have the responsible reviewer approve the intended use before production."
    },
    {
      "q": "Can Mylar bags be recycled in household collection?",
      "a": "Many barrier pouches combine layers that local programs may not accept. Confirm the actual construction and available collection route, including zipper and window components, before printing recycling or recycled-content claims."
    },
    {
      "q": "What should a pouch reorder specification retain?",
      "a": "Keep the approved dimensions, laminate, zipper, tear notch, sealing requirements and artwork revision. Require review of substitutions and retest if filling equipment or the product changes; appearance alone cannot establish equivalent performance."
    }
  ],
  "industries/electronics-boxes": [
    {
      "q": "How should I choose packaging for electronics with a lithium battery?",
      "a": "Identify the battery configuration, device and delivery route before selecting packaging. Ask the responsible shipping specialist to confirm applicable transport requirements; a printed carton or cushioning insert does not establish battery-shipping compliance."
    },
    {
      "q": "What should an electronics packaging quotation include?",
      "a": "List device and accessory dimensions, packed weight, ESD requirements, insert scope, sample validation and destination. Compare tooling, assembly and freight separately, using the same protection requirement for each supplier."
    },
    {
      "q": "Can I reduce plastic cushioning in an electronics kit?",
      "a": "Compare paper-based restraints against the device's fragility, surface sensitivity and static-control needs. Validate the complete packout before changing materials; recyclable-looking inserts are not automatically substitutes for specified ESD protection."
    },
    {
      "q": "What changes require a new electronics packout trial?",
      "a": "Changes to device weight, connectors, battery, accessories, cushioning or carton grade can affect performance. Record the tested assembly and review changes before reordering, especially when moving from pallet distribution to parcel delivery."
    }
  ],
  "industries/food-boxes": [
    {
      "q": "How should food packaging materials be documented for both markets?",
      "a": "Describe direct contact, food type, temperature and contact time. Request evidence for the specified materials and intended use, with the responsible food-safety reviewer confirming Canadian and US requirements; a generic food-grade description is insufficient."
    },
    {
      "q": "Can food-box samples establish a product's shelf life?",
      "a": "A fit or print sample cannot establish shelf life. Evaluate the actual food, primary barrier, seals, storage and distribution conditions through an appropriate validation plan before making freshness or storage claims."
    },
    {
      "q": "What changes the cost of a custom food carton?",
      "a": "Board, coatings, windows, insert complexity, dimensions and quantity per print version all matter. Request costs for tooling and samples separately and compare delivered cost at the receiving Canadian or US location."
    },
    {
      "q": "Can grease-resistant food boxes be placed in paper recycling?",
      "a": "Acceptance depends on the coating, contamination and local program. Request the finished material specification and verify instructions with the relevant collection provider; grease resistance does not itself establish recyclability or compostability."
    }
  ],
  "industries/gift-boxes": [
    {
      "q": "How should I approve gift-box colours before a corporate order?",
      "a": "Use an agreed colour reference and request a representative printed finish sample where available. Review on the proposed wrap or board, because foil, texture and lamination can change appearance compared with a screen proof."
    },
    {
      "q": "Can a gift-box presentation be designed for easier material separation?",
      "a": "Ask about removable paperboard inserts and detachable ribbons or accessories. Review magnets, foam and laminates as part of the finished pack and confirm local disposal options before describing the entire gift set as recyclable."
    }
  ],
  "industries/hair-extension-boxes": [
    {
      "q": "Can a hair-extension box be tested with the complete retail set?",
      "a": "Use the actual hair bundle, backing card, clips and care leaflet in a prototype. Check removal and repacking without catching fibres, and confirm that the closed lid does not compress or bend the product."
    },
    {
      "q": "What affects minimum orders for different extension colours and lengths?",
      "a": "Separate structural sizes from artwork or sticker changes in the enquiry. Ask for quantity tiers per version and confirm setup charges; one shared external box may still need different inserts for different bundle lengths."
    },
    {
      "q": "How can extension packaging support Canadian and US salon sales?",
      "a": "Supply the destination-approved product and care information plus the salon or retailer's labelling needs. Check language versions, shade identifiers and barcode areas at actual size before approving print."
    },
    {
      "q": "Can I choose paper inserts for hair-extension packaging?",
      "a": "A paperboard card or restraint may suit the bundle and display format. Trial the actual hair for snagging, slippage and presentation, and confirm the composition and local disposal route for all remaining accessories."
    }
  ],
  "industries/hardware-boxes": [
    {
      "q": "How should hardware packaging be trialled before ordering?",
      "a": "Pack the full specified count and weight, including sharp items and instruction sheets. Check puncture resistance, closure and picking access, then assess the intended shelf, peg or shipping route with the completed pack."
    },
    {
      "q": "What should a hardware carton quote include for heavy packs?",
      "a": "Specify total loaded weight, item count, board grade, reinforcement, dividers and shipping method. Compare the complete packout and delivered price, including assembly, rather than carton dimensions alone."
    },
    {
      "q": "Can hardware packs include corrosion protection?",
      "a": "Describe the metal, surface treatment, storage duration and shipping environment. Review suitable protective materials and compatibility documentation; do not assume a printed carton or an unspecified bag provides rust protection."
    },
    {
      "q": "How should hardware carton reorders be controlled?",
      "a": "Retain the approved count, loaded weight, material grade and label version. Review any change in fastener size, finish or supplier before releasing packaging, since a denser or sharper product mix may need redesign."
    }
  ],
  "industries/health-boxes": [
    {
      "q": "What should a supplement or wellness carton sample verify?",
      "a": "Test the final primary pack, leaflet and closure together. Confirm easy removal, space for approved copy and access to batch information; the outer sample does not demonstrate product safety or health claims."
    },
    {
      "q": "What determines minimum quantities for wellness kit boxes?",
      "a": "The number of sizes, insert designs, printed versions and finishes affects setup. Request tiers for each kit configuration and identify which changes can use an approved label or card instead of a new box design."
    },
    {
      "q": "Can health-product cartons be recycled with their inserts?",
      "a": "Review the board, laminate, foam and accessory packaging individually. Ask for material information and check local collection guidance in Canada or the USA before applying a recycling claim to the entire kit."
    },
    {
      "q": "How should a health packaging reorder handle new label copy?",
      "a": "Use controlled artwork revisions and have the responsible regulatory reviewer approve changes for each destination. Confirm whether changed bottle dimensions, dosage information or leaflet size also require a new structural sample."
    }
  ],
  "industries/hemp-boxes": [
    {
      "q": "What should I approve on a hemp-product carton sample?",
      "a": "Check the actual container, label orientation, insert and closure, then review print on the selected board. Keep material and artwork revisions together; botanical styling does not establish product legality or material composition."
    },
    {
      "q": "How do I compare costs for hemp-oil and balm cartons?",
      "a": "List each container's external size, weight, required insert and print quantity separately. Confirm tooling, samples, freight and currency so the Canadian and US delivered prices reflect equivalent specifications."
    },
    {
      "q": "Can a hemp-product carton provide an oil or aroma barrier?",
      "a": "Treat the bottle, jar or other primary pack as the containment system. Review compatibility and barrier performance for the actual contents; decorative board alone should not be relied on for leakage or shelf-life control."
    },
    {
      "q": "How should hemp packaging changes be approved for reorders?",
      "a": "Record the approved board, dimensions and destination-specific artwork. Review new formulations, container changes or regulatory copy before printing, even when the outer carton appears unchanged."
    }
  ],
  "industries/holiday-boxes": [
    {
      "q": "What should I test before committing to holiday gift packaging?",
      "a": "Pack the final seasonal assortment, including inserts and promotional cards. Test closing, carrying and product removal, then approve the printed finish separately so decoration changes do not conceal a structural problem."
    },
    {
      "q": "How can I compare holiday box prices across different quantities?",
      "a": "Request tiers per size and artwork, with tooling, decorative accessories and freight separated. Include packing labour and storage space in the comparison, especially when assembled gift boxes replace flat cartons."
    },
    {
      "q": "Can holiday packaging be made easier to recycle?",
      "a": "Consider removable sleeves and paper-based inserts where they suit the contents. Request composition details for foil, laminate and accessories, and check local Canadian and US disposal routes before making finished-pack claims."
    },
    {
      "q": "What happens if a holiday product changes after box approval?",
      "a": "Pause the affected specification and reassess fit, weight, inserts and artwork. Obtain a revised proof or sample as needed, then reconfirm production and freight milestones rather than assuming the original delivery date still applies."
    }
  ],
  "industries/jewelry-boxes": [
    {
      "q": "What should I approve on a jewelry-box sample?",
      "a": "Use the intended ring, necklace or earrings with the final insert. Check removal, lid clearance, surface marking and logo detail; retain the approved sample reference and do not assume a digital proof verifies fit or material compatibility."
    },
    {
      "q": "Can jewelry packaging use less foam and still present well?",
      "a": "Compare shaped paperboard or other available inserts with the actual jewelry. Check restraint and abrasion during handling, then confirm material composition and local collection guidance before describing the finished box as recyclable."
    }
  ],
  "industries/kitchenware-boxes": [
    {
      "q": "Can I test kitchenware packaging before ordering in bulk?",
      "a": "Trial the heaviest and most fragile item configuration with the final dividers. Check handles, rims, lids and removal, then evaluate the complete parcel or pallet packout; a presentation sample alone cannot establish transit performance."
    },
    {
      "q": "What should a kitchenware packaging quote include?",
      "a": "List the set contents, individual dimensions, packed weight, insert material and delivery format. Separate tooling and sample costs and compare freight to the receiving Canadian postal or US ZIP code."
    },
    {
      "q": "Do kitchenware cartons need food-contact documentation?",
      "a": "Clarify whether food itself will touch the packaging or only the kitchenware. Request appropriate documentation where direct food contact is intended; packaging a utensil does not make every carton material suitable for food."
    },
    {
      "q": "Can kitchenware inserts be designed for easier recycling?",
      "a": "Paperboard, corrugated or moulded pulp may suit some sets. Validate support and surface protection with the actual items, then check local disposal guidance for the finished insert, coatings and outer carton."
    }
  ],
  "industries/pharma-boxes": [
    {
      "q": "How should pharma carton artworks be approved for different markets?",
      "a": "Use destination-approved copy and a controlled artwork revision. Reserve coding and leaflet space before proofing and obtain the responsible quality or regulatory approval; printing a carton does not authorize a medicinal product."
    },
    {
      "q": "What should a pharma carton reorder record contain?",
      "a": "Retain approved dimensions, board, print references, coding area and drawing revision. Agree change-control and acceptance criteria before manufacture, and require approval of substitutions rather than accepting a visually similar carton."
    },
    {
      "q": "Can a pharmaceutical carton be made child-resistant by changing its closure?",
      "a": "Child resistance must be assessed for the complete packaging system under the applicable requirements. A locking flap or difficult-to-open carton is not evidence of tested performance; specify the required validated system before quoting."
    },
    {
      "q": "How should pharma buyers plan packaging delivery dates?",
      "a": "Separate quality review, artwork approval, sample trials, manufacture and freight. Provide the destination, receiving procedures and required release date, then confirm the project schedule and documentation requirements in writing."
    }
  ],
  "industries/pizza-boxes": [
    {
      "q": "Can I trial a pizza carton before a chain-wide order?",
      "a": "Test actual hot pizzas with the intended liner, stacking and delivery-bag routine. Check base strength, condensation, opening and food presentation over the expected journey; an empty flat sample cannot reproduce service conditions."
    },
    {
      "q": "What evidence should I request for direct-contact pizza packaging?",
      "a": "State the hot, fatty food contact and expected duration. Request documentation for the proposed board, coatings, inks and any liner for that use, and have the responsible reviewer approve the complete construction."
    },
    {
      "q": "Are used pizza boxes accepted in Canadian and US paper recycling?",
      "a": "Rules vary by local program and contamination level. Check the receiving community's instructions and the carton coating; do not print a universal recycling or composting promise based only on a paperboard appearance."
    },
    {
      "q": "What affects pricing for several pizza box sizes?",
      "a": "Dimensions, board, print coverage and quantity per size affect setup and freight. Request tiers and case quantities for each size, then include flat-storage space and assembly labour when comparing suppliers."
    }
  ],
  "industries/pre-roll-boxes": [
    {
      "q": "What should a pre-roll packaging quote include?",
      "a": "Provide final tube dimensions, count, insert, required performance criteria and approved destination-specific artwork. Confirm tooling, sampling and freight separately; the packaging quotation does not determine where the product can legally be sold."
    },
    {
      "q": "How should a pre-roll carton prototype be evaluated?",
      "a": "Test the final primary containers for movement, removal and closure without covering required information. Any child-resistant performance must be established through the appropriate complete-system assessment, separately from a fit prototype."
    },
    {
      "q": "Can pre-roll packaging use paperboard inserts instead of foam?",
      "a": "Compare support for the actual tubes and caps, checking movement and access to required markings. Record the approved material and verify local disposal options rather than assuming all components share the carton's recycling route."
    },
    {
      "q": "How should Canadian and US pre-roll carton revisions be managed?",
      "a": "Keep separate approved files and specifications for each destination and product configuration. Have the responsible regulatory reviewer approve changes before release, and recheck physical fit whenever tubes, caps or count change."
    }
  ],
  "industries/product-boxes": [
    {
      "q": "How should I compare the delivered price of product boxes?",
      "a": "Compare identical materials, usable dimensions, finishes, inserts and quantity per version. Separate tooling, samples and freight, and confirm currency and responsibility for customs and taxes for the Canadian or US destination."
    },
    {
      "q": "What evidence supports recycling claims on custom product packaging?",
      "a": "Request the complete material specification, including coatings, windows and inserts. Check local collection options and make claims specific to the actual finished components; recycled content and recyclability are different properties."
    }
  ],
  "industries/retail-boxes": [
    {
      "q": "What should I approve on a retail carton sample?",
      "a": "Place the final product and leaflet inside, check shelf orientation and closure, and scan a representative printed barcode. Review artwork at actual size and retain the approved board and finish specifications for repeat orders."
    },
    {
      "q": "What affects minimum orders for retail carton variants?",
      "a": "Each structural size and artwork version may require its own setup. Request quantity tiers per SKU and ask whether approved variable labels can handle some differences without changing the structural design."
    },
    {
      "q": "Can retail packaging be made ready for customer returns?",
      "a": "Define whether the consumer needs to reopen and reclose the retail pack or ship it back. Trial the closure and any outer shipper with the actual product; tamper seals may need a separate return arrangement."
    },
    {
      "q": "How should retail cartons carry recycling instructions?",
      "a": "Assess windows, laminate, inserts and labels along with the board. Use instructions supported by the actual construction and local Canadian or US collection systems rather than a broad recyclable claim covering every component."
    }
  ],
  "industries/rigid-boxes": [
    {
      "q": "Can a rigid box be specified for easier recycling?",
      "a": "Review the wrap, board core, laminate, magnets and insert separately. Consider removable accessories and paper-based inserts where suitable, and confirm local Canadian or US disposal options before claiming the whole box is recyclable."
    },
    {
      "q": "How can I keep rigid-box colours consistent on repeat orders?",
      "a": "Retain the approved wrap stock, print reference and finish sample with the artwork revision. Review material substitutions and production colour tolerances before release; screen colours and a generic colour name are insufficient reorder references."
    }
  ],
  "industries/shipping-boxes": [
    {
      "q": "How should I test a new shipping carton before a bulk order?",
      "a": "Use the actual contents, cushioning, closure and labels at the final packed weight. Assess the intended parcel or pallet route and record the tested specification; an empty box or board grade alone cannot establish delivery performance."
    },
    {
      "q": "Can custom shipping boxes reduce dimensional-weight charges?",
      "a": "Compare the final external dimensions against the carrier's current billing rules. Right-sizing may help, but allow space for validated cushioning and check actual freight quotations before assuming a saving."
    },
    {
      "q": "What determines minimum orders for custom shipping cartons?",
      "a": "Dimensions, grade, die-cut features and printing affect setup and quantity tiers. List every size and artwork version, asking for tooling and delivery costs separately; a standard-style carton may have different economics from a custom die-cut."
    },
    {
      "q": "Are shipping cartons with tape and labels recyclable?",
      "a": "Local programs and material combinations determine acceptance. Request the carton and coating specification, follow local instructions for tape or cushioning removal, and avoid assuming that wet-strength treatments or laminates are accepted everywhere."
    }
  ],
  "industries/software-boxes": [
    {
      "q": "How should a software-kit box be priced for a limited launch?",
      "a": "Specify the exact media, booklet, insert, print version and quantity. Request tooling and samples separately and compare the complete delivered kit packaging cost rather than just the outer box."
    },
    {
      "q": "Can I approve software packaging without printing live activation codes?",
      "a": "Use clearly marked dummy codes for layout and scan trials. Keep production credentials out of shared proofs and agree who supplies, applies and verifies final variable data before packing."
    },
    {
      "q": "What should I check before reordering software kit boxes?",
      "a": "Confirm the edition, media size, manual thickness, insert and approved artwork revision. Recheck any changed QR destination or instructions before print, even if the external dimensions remain the same."
    },
    {
      "q": "Can premium software kits use paper-based inserts?",
      "a": "A folded paperboard or corrugated insert may suit media and accessories. Trial restraint and removal with the complete kit and review disposal guidance for foam, magnets and laminates before making environmental claims."
    }
  ],
  "industries/spice-packaging": [
    {
      "q": "How should spice packaging samples be evaluated?",
      "a": "Fill the intended jar or pouch, then check closure, dispensing, residue around seals and case fit. Review barrier and shelf-life needs for the actual spice rather than inferring performance from the sample's appearance."
    },
    {
      "q": "What food-contact information should spice buyers request?",
      "a": "Describe the spice, direct-contact surfaces, filling conditions and storage duration. Request documentation for the proposed laminate, liner or other contact material and have the responsible reviewer confirm suitability for Canada or the USA."
    },
    {
      "q": "How should multiple spice blends be priced in one order?",
      "a": "List quantity per size and artwork, including jars, pouches or gift inserts separately. Ask which setups are shared and which are charged per blend, then compare freight and coding costs on the same basis."
    },
    {
      "q": "Can spice packaging use a paper exterior and still need a barrier liner?",
      "a": "Yes; the printed outer carton and the primary barrier perform different jobs. Confirm which component controls moisture and aroma, and assess each layer's local disposal route rather than treating the pack as paper alone."
    }
  ],
  "industries/sports-boxes": [
    {
      "q": "How should a sports-packaging prototype be tested?",
      "a": "Pack the complete equipment or merchandise kit at its final weight. Check restraint, carrying points, removal and surface protection, then evaluate the intended delivery route before committing to a full tournament or retail run."
    },
    {
      "q": "Can sports kits replace foam with paper-based inserts?",
      "a": "Compare shaped paperboard, corrugated or moulded pulp against the equipment's weight and projections. Validate movement control and transit protection first, and verify local disposal guidance for every component of the final pack."
    }
  ],
  "industries/stationery-boxes": [
    {
      "q": "What should I check on a printed stationery-box sample?",
      "a": "Use the final notebook, writing tools and accessories, then inspect corner clearance and surface rubbing. Review fine logos and colour on the proposed board; a digital proof cannot confirm fit around spiral bindings."
    },
    {
      "q": "How should stationery gift-box minimums be compared?",
      "a": "Request tiers per structural size and printed design, including insert and tooling charges. Compare a shared box with variant bands against fully separate versions, allowing for assembly labour and storage space."
    },
    {
      "q": "Can stationery boxes travel through the post without another pack?",
      "a": "Presentation boxes may need an outer shipper to protect corners and printed surfaces. Test the complete kit for the intended Canadian or US postal route and retain space for carrier labels and secure closure."
    },
    {
      "q": "Are laminated stationery gift boxes recyclable?",
      "a": "The laminate, ribbon, foam and magnets can affect how the finished pack is handled. Request material information and check local collection guidance before printing recycling instructions; the paper core alone is not enough evidence."
    }
  ],
  "industries/tea-packaging": [
    {
      "q": "What should a tea packaging sample trial include?",
      "a": "Use the actual sachets, tin or loose-leaf fill, checking fit, dispensing and closure. Review aroma and moisture protection through the primary pack's specification and validation rather than a decorative carton's appearance."
    },
    {
      "q": "What should I request for tea-contact material approval?",
      "a": "Describe the tea, contact duration and storage conditions. Request documentation for the proposed pouch, liner or other contact surface and have the responsible reviewer approve the intended use in Canada or the USA."
    },
    {
      "q": "How should tea sampler artwork quantities be quoted?",
      "a": "List the count of each blend, carton version and internal divider. Ask for print setup, tooling and sample charges separately and check whether a shared carton with approved blend labels is practical."
    },
    {
      "q": "Can a paper-look tea pouch go in paper recycling?",
      "a": "A paper-look exterior may cover barrier layers, adhesive and plastic closures. Request the full structure and verify the relevant collection route before giving disposal instructions or describing the entire pouch as recyclable."
    }
  ],
  "industries/vape-boxes": [
    {
      "q": "What should a vape-carton quote include for several devices?",
      "a": "Provide each device's dimensions, weight, insert, approved artwork version and quantity. Identify the destination and any required performance documentation before pricing; carton supply does not establish authorization to sell the product."
    },
    {
      "q": "How should vape packaging prototypes be approved?",
      "a": "Check the final device or primary pack for fit, connector clearance and safe removal. Approve regulatory artwork separately, and establish any required child-resistant performance through the appropriate complete-system assessment."
    },
    {
      "q": "Can a vape carton use a paper insert?",
      "a": "A paperboard restraint may suit some devices, but must be checked for connector protection and product movement. Battery transport and static-control requirements require separate assessment; material appearance alone cannot establish suitability."
    },
    {
      "q": "How should vape carton reorders handle device revisions?",
      "a": "Record the device model, insert dimensions, board and approved destination-specific artwork. Review changes to battery configuration, mouthpiece or warning copy before release and retest physical fit where affected."
    }
  ],
  "industries/window-packaging": [
    {
      "q": "What should I approve on a window-box sample?",
      "a": "Place the actual product inside and check cutout alignment, film attachment and visibility under store lighting. Handle the loaded pack to assess stiffness and confirm the approved window dimensions and material before ordering."
    },
    {
      "q": "What adds cost to a custom window carton?",
      "a": "Window shape, film type, opening size, gluing and artwork registration affect conversion. Request tooling and samples separately, comparing equivalent board and window specifications at the same delivery destination."
    },
    {
      "q": "Can window cartons be sealed for tamper evidence?",
      "a": "A film-covered window is not itself a tamper-evident closure. Define how the carton must open and which seal or label should indicate access, then check the completed pack with the product and intended retail handling."
    },
    {
      "q": "What should window-carton reorders keep unchanged?",
      "a": "Record the window die, film, adhesive, board and product orientation. Review substitutions before manufacture, especially if chilled storage, food contact or a changed product label affects visibility or material suitability."
    }
  ],
  "services/cardboard-boxes": [
    {
      "q": "What should a cardboard-box sample verify before production?",
      "a": "Check the actual product, flap engagement, glued seam and any insert with the proposed board. Review printing and finish separately; an unprinted fit sample cannot demonstrate final colour or small-text quality."
    },
    {
      "q": "Can cardboard retail boxes be used as parcel shippers?",
      "a": "Paperboard cartons usually need a protective outer pack unless the complete system has been validated for the route. Assess cushioning, closure and label placement with the actual contents before shipping in Canada or the USA."
    },
    {
      "q": "How should cardboard-box artwork be prepared?",
      "a": "Request the approved dieline and printer's file requirements before design. Keep cuts, creases, bleed and safety areas distinct, and review the final proof at actual size with the destination-approved copy."
    },
    {
      "q": "Are all cardboard boxes suitable for direct food contact?",
      "a": "No. Identify the food, temperature, contact time and which surfaces touch it, then request documentation for the proposed board, inks, coatings and adhesives. Have the responsible reviewer approve the intended use before production."
    }
  ],
  "services/corrugated-boxes": [
    {
      "q": "How should I compare custom corrugated carton minimums?",
      "a": "List each internal size, grade, print version and die-cut feature. Request quantity tiers with tooling and freight separated; minimums vary with the manufacturing setup rather than one quantity applying to every corrugated box."
    },
    {
      "q": "Can corrugated boxes reduce dimensional-weight shipping charges?",
      "a": "Right-sizing can reduce empty volume, but preserve the space needed for validated cushioning. Check final external dimensions against the carrier's current billing rules and compare actual Canadian or US freight quotations."
    },
    {
      "q": "How should corrugated cartons be stored before packing?",
      "a": "Keep bundles dry, supported and protected from crushing under the supplier's recommended conditions. Confirm stacking and conditioning practices, especially if the warehouse is humid or the cartons will be stored for an extended period."
    },
    {
      "q": "What recycling information should I request for printed corrugated boxes?",
      "a": "Ask about liners, coatings, laminate and attached inserts, not just the fluted core. Confirm local collection guidance and use claims supported by the finished specification; recycled content and recyclability are separate questions."
    }
  ],
  "services/custom-kraft-boxes": [
    {
      "q": "What should I test on a kraft-box structural sample?",
      "a": "Use the actual contents, insert and intended packing sequence. Check folds, closure and product removal, then review printed colours separately on the chosen kraft stock; an unprinted prototype only establishes part of the approval."
    },
    {
      "q": "What affects minimum quantities for custom kraft boxes?",
      "a": "Board type, structure, size, white ink and finishing affect setup. Request quantity tiers per artwork and compare tooling, samples and delivery costs rather than assuming all brown boxes share a standard minimum."
    },
    {
      "q": "Can kraft boxes be used for direct food contact?",
      "a": "A natural brown appearance does not establish food-contact suitability. Describe the food and conditions of use, request documentation for the complete contact construction and have the responsible reviewer approve it for the destination."
    },
    {
      "q": "How should I schedule a kraft packaging order for Canada or the USA?",
      "a": "Separate artwork and sample approval from production and freight. Supply the required arrival date, postal or ZIP code and receiving requirements; Apex confirms the specification-dependent schedule in the quotation."
    }
  ],
  "services/gable-boxes": [
    {
      "q": "What should I approve on a loaded gable-box sample?",
      "a": "Pack the final contents and lift using the handle as customers will. Check locking tabs, hand clearance, balance and base support, including any insert or liner; an empty sample cannot demonstrate loaded carrying performance."
    },
    {
      "q": "Are gable boxes suitable for direct contact with bakery food?",
      "a": "Identify the food, grease, moisture and contact duration. Request appropriate documentation for the proposed board, window, inks, adhesive and any liner; a carry handle or bakery-style appearance does not establish food-contact suitability."
    },
    {
      "q": "What affects the price of custom gable boxes?",
      "a": "Usable capacity, board, handle reinforcement, windows, printing and quantity per design affect cost. Ask for tooling, sample and freight charges separately, and include assembly time when comparing flat-delivered cartons."
    },
    {
      "q": "Can gable boxes be recycled after an event?",
      "a": "Check the board, coating, window and any ribbon or liner against local collection guidance. Food contamination can also affect acceptance; print disposal instructions supported by the finished pack and intended Canadian or US audience."
    }
  ],
  "services/industrial-bulk-packaging": [
    {
      "q": "Can a pallet pack be selected from the product weight alone?",
      "a": "No; include load geometry, centre of gravity, pallet, stacking, handling equipment and transport route. Evaluate the complete unit load with its film, strapping and edge protection rather than relying on one material rating."
    },
    {
      "q": "What documentation is needed for bulk liners that contact food?",
      "a": "Specify the contents, contact time, temperature and filling process. Request documentation for the proposed liner and its intended use; an unspecified food-grade description is insufficient for Canadian or US food-safety approval."
    },
    {
      "q": "What should a repeat bulk-packaging order keep consistent?",
      "a": "Record container dimensions, board grade, liner construction, film specification and approved wrapping or strapping settings. Require review of substitutions and repeat trials when the load, equipment or delivery route changes."
    },
    {
      "q": "How should industrial packaging deliveries be planned for a warehouse?",
      "a": "State dock access, pallet dimensions, unloading equipment, storage limits and receiving appointments. Confirm release quantities and freight terms in the quotation, including responsibility for cross-border clearance and any extra delivery services."
    }
  ],
  "services/polybags": [
    {
      "q": "Can polybags be specified for direct food contact?",
      "a": "State the food type, filling temperature and contact conditions before selecting film. Request documentation for the complete proposed construction, including inks and additives, and have the responsible reviewer confirm suitability for the destination."
    },
    {
      "q": "What should a polybag sample trial include?",
      "a": "Test the actual product on the intended bagging equipment, checking opening, seal, puncture resistance and removal. Record the approved width, length, gusset, film and closure rather than approving appearance alone."
    },
    {
      "q": "How should warning labels on retail polybags be approved?",
      "a": "Identify the product, bag size, destination and retailer before artwork approval. Have the responsible reviewer confirm any required warnings and their placement; requirements can differ, so do not reuse copy solely because a similar bag used it."
    },
    {
      "q": "How should Canadian and US buyers compare polybag minimum orders?",
      "a": "Request tiers per size, film structure, closure and printed version. Confirm whether pricing is per bag, roll, case or weight, and separate setup and freight charges to compare equivalent delivered quantities."
    }
  ],
  "services/protective-packaging": [
    {
      "q": "Can I approve a protective insert from a drawing alone?",
      "a": "A drawing helps define geometry but cannot demonstrate cushioning, abrasion or packout behaviour. Trial the actual product with the proposed insert and outer carton, recording material grade, density, fit and validation requirements."
    },
    {
      "q": "How should protective packaging be quoted for Canada and the USA?",
      "a": "Provide dimensions, weight, fragile features, surface sensitivity, route and expected quantity. Ask for insert tooling, sample trials, outer cartons and freight separately so quotations cover the same complete protection system."
    },
    {
      "q": "Can protective packaging be made easier for customers to recycle?",
      "a": "Compare paper-based restraints, removable components or reusable options where they meet the protection requirement. Verify performance before substitution and check local collection options for the actual foam, film, paper and mixed components."
    },
    {
      "q": "When should protective packaging be retested?",
      "a": "Review changes to product weight, geometry, fragility, insert material, outer carton or delivery route. Retain the approved packout and test reference so a visually similar replacement does not silently change protection performance."
    }
  ]
};

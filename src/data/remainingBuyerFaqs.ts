type FAQ = { q: string; a: string };
type QuestionPair = readonly [question: string, answer: string];

// Route keys distinguish product categories from related service pages.
const questions: Record<string, QuestionPair[]> = {
  'industries/custom-mylar-bags': [
    ['What information is needed to quote a Mylar pouch?', 'Send the fill weight, product type, pouch dimensions, barrier targets and preferred zipper configuration.'],
    ['How do I choose a Mylar bag barrier structure?', 'Specify the required moisture, oxygen and light protection for your product so the proposed laminate can be reviewed.'],
    ['Should my Mylar pouch have a bottom gusset?', 'Request a filled stand-up sample when the pouch must remain upright on a retail shelf.'],
    ['Can a resealable Mylar zipper replace the initial heat seal?', 'Specify the initial sealing method separately from the zipper used by customers after opening.'],
    ['How much empty space should I leave above a pouch fill?', 'Allow room for filling, zipper access and the sealing jaws, then confirm the allowance on your packing line.'],
    ['Will a clear panel suit my light-sensitive pouch contents?', 'Review the window area against the product’s light-protection needs before choosing a transparent section.'],
    ['What should I check on printed Mylar bag samples?', 'Inspect tear-notch position, seal continuity, zipper operation and artwork alignment on filled pouches.'],
    ['How should Canadian buyers compare imported Mylar bag prices?', 'Compare the same laminate, usable fill capacity, artwork count and delivered CAD cost to your packing facility.']
  ],
  'industries/display-boxes': [
    ["Should I choose a countertop display, PDQ tray or shelf-ready display box?", "Start with where the display will sit, how many products it must hold and how store staff will stock it. Countertop displays suit smaller selling areas; open trays can organize products on shelves; some closed cartons use a tear-away section to become a display. Retailers may use terms such as PDQ, shelf-ready and retail-ready differently. Share the intended placement, retailer brief and product arrangement so Apex can recommend an appropriate structure rather than selecting by the format name alone."],
    ["How do I decide the display size, product count and number of facings?", "Provide the finished dimensions and weight of each saleable unit, the desired front-facing count and the refill depth. Confirm the permitted shelf or counter width, depth, overall height and header height with the retailer. Allow customers to see labels and remove products without catching on the tray. A larger capacity is not always practical if it blocks sightlines or access. Approve a loaded sample using the actual products and intended retail space before finalizing dimensions."],
    ["Will a cardboard display hold my products securely as stock sells through?", "Select the board, base, side walls and dividers around the full load, product shape and display duration. Lightweight paperboard and corrugated structures offer different combinations of print appearance and support; neither a board name nor thickness alone establishes a safe load. Check the display fully loaded and partly emptied, including uneven front, rear and side positions. Confirm that the tray remains stable, products stay upright and small items cannot slip out during normal customer handling."],
    ["Can display boxes include my branding, a header, custom print and retail barcodes?", "Share vector logos where available, colour references, approved messaging and required barcodes. Plan the front lip, sides and header so key branding stays visible when the display is full and as units are removed. Confirm that a folding header erects securely and does not obstruct access or retailer sightlines. Barcode size, contrast, placement and clear space should be reviewed on a printed sample. Provide approved artwork versions for the Canadian or US market and any retailer-specific labels before print approval."],
    ["What must a Canadian or US retailer approve before display production?", "Obtain the current brief for that retailer, department and placement. It may specify footprint, height, unit count, materials, presentation, openings, markings, master cartons or pallet arrangements. A display accepted for one store program is not automatically accepted elsewhere. Send Apex the actual requirements and identify who will approve the design. Have the retailer review the relevant drawings, loaded prototype, artwork and any required testing before production; packaging supply alone does not establish retailer approval."],
    ["What is the minimum order, and can one display design hold several products or seasonal ranges?", "Minimums depend on dimensions, board, print process, cutting tools, inserts and production operations. Different artwork, product mixes or sizes can create separate setups even within one campaign. A common outer tray may work with revised dividers or labels where the product sizes and load allow it. Send the quantity and assortment for each version, including seasonal or store-specific requirements. Apex confirms minimums, quantity tiers and any shared-production options in the quotation rather than applying one minimum to every display."],
    ["How much do custom display boxes cost, and what do I need for an accurate quote?", "Provide product photos, unit dimensions and weight, display count, retailer footprint, material or structural preference, artwork requirements and quantity per version. Include whether the display ships flat, assembled or preloaded, plus the receiving postal or ZIP code and required arrival date. Price depends on board area and grade, tooling, print, finishes, inserts, assembly and packing. Compare quotation currency and the full scope for samples, freight, duties, taxes and delivery responsibilities before comparing total cost per usable display."],
    ["Can I approve a loaded display sample before placing a bulk order?", "Ask which structural prototypes, digital proofs or printed samples are available, what they represent, and their cost and timing. Load the proposed display with the actual products to check capacity, stability, product removal, header position, assembly and refill access. Review printed artwork separately where colour or barcode performance matters. If shipping or retailer acceptance requires testing, agree on the method and acceptance criteria. Record the approved sample, dieline, material, artwork revision and packout before releasing production."],
    ["Should display boxes arrive flat-packed, assembled or already filled with products?", "Compare total logistics and store setup rather than inbound freight alone. Flat-packed displays can reduce storage volume but need assembly and filling; assembled or preloaded displays may simplify setup while requiring more shipping space and protection. Preloading also needs an agreed packing location, assortment, product supply and responsibility for assembly. Confirm the quoted delivery format, cases per shipment, setup instructions and receiving requirements. Trial the assembly and replenishment steps with the people who will perform them."],
    ["How do I protect a display in transit and make a tear-away opening work properly?", "A retail display and its transit packaging should be developed together. Review product restraint, header protection, master cartons, stacking and any pallet requirements for the route. A fold-down header or tear-away top must survive handling and then open cleanly without damaging products or essential artwork. Trial perforation strength, opening access and the finished display with the packed contents. Agree on appropriate transit checks before relying on a display carton as both the shipping pack and the retail presentation."],
    ["How long do custom display boxes take, and can Apex deliver across Canada and the USA?", "Apex's Canada-based team coordinates design, proofs, samples, qualified overseas production and delivery for Canadian and US buyers. The schedule depends on retailer review, artwork readiness, samples, tooling, material, print, quantity and the freight method. Production and transit are separate stages. Provide the receiving postal or ZIP code, delivery access requirements and required in-store or launch date before approval. Apex confirms the project schedule and delivery responsibilities in the quotation rather than promising one turnaround for every retail program."],
    ["Are printed display boxes recyclable, and can they use recycled-content board?", "Ask about the complete display, including coatings, laminates, windows, plastic fittings, adhesives and inserts. Recycled content describes the material used to make the board; recyclability concerns collection and processing after use. The two claims are different, and kraft appearance proves neither. Tell Apex your material requirements and ask for available supporting documentation. Confirm the retailer's back-of-store disposal arrangements and local Canadian or US recycling access, then use environmental claims and separation instructions that match the finished specification."]
  ],
  'industries/pillow-boxes': [
    ["What products are pillow boxes best suited for?", "Pillow boxes are a compact presentation format for many lightweight gifts, jewellery, accessories, small cosmetics, apparel add-ons and promotional items. Their curved ends create the distinctive shape but reduce usable space compared with a rectangular carton. Choose the format around the actual product, weight, opening experience and sales channel. A dense, sharp-edged or fragile item may need an insert or a different structure, so share the complete product brief before selecting the box."],
    ["How do I measure a pillow box so my product fits comfortably?", "Measure the product at its widest points, including any wrap, tag, insert or accessory. Specify usable assembled dimensions and ask how the supplier's length, width and depth are defined; flat dieline dimensions do not describe the usable cavity. The curved ends reduce space near the closures. Test a structural sample with the actual item so it loads easily, the ends close without pressure and the box does not bulge or allow excessive movement."],
    ["Which material and thickness should I choose, and how much weight can a pillow box hold?", "Provide the product weight, shape, contact points and handling conditions before choosing the paperboard. Kraft and white board have different appearances and print characteristics, while stiffness, creasing and closure design affect performance. There is no universal weight rating for every pillow box. Dense products or sharp edges can stress the curved ends even when they fit inside. Check a filled sample for panel distortion, opening ends and product retention, and discuss a suitable insert or alternative format where needed."],
    ["How much do custom pillow boxes cost in Canada or the USA?", "Cost depends on finished size, board grade, cutting tools, print coverage, artwork versions, windows, finishes, accessories and quantity. Send product photos, dimensions and weight, the quantity per version, artwork requirements, receiving postal or ZIP code and required arrival date. Ask whether dieline work, tooling, proofs, samples and any assembly or accessories are included. Confirm quotation currency, freight, duties, taxes and delivery responsibilities so you can compare total delivered cost for the same specification."],
    ["What is the minimum order, and can I combine different pillow-box sizes or designs?", "Minimums depend on the structure, material, printing and production setup. Different dimensions, windows, finishes or artwork versions can have separate costs and minimums even within one order. List the quantity for each gift size or campaign version and identify products that could share a structure. Apex confirms available quantity tiers and any shared-production options in a product-specific quotation. A supplier's stock-box minimum should not be assumed to apply to a fully custom printed design."],
    ["Can pillow boxes have my logo, a window, foil, embossing or ribbon details?", "Share your artwork, colour references and desired features so Apex can review compatibility with the selected board and dimensions. Keep important text and graphics clear of the curved closure folds; windows remove supporting material and should be checked on an assembled sample. Ribbon, sleeves or other accessories need an agreed placement and packing method. Foil, embossing and coatings can affect cost and folding. Review artwork and any barcode at its final size on the actual finished shape before approval."],
    ["Can I approve a sample or printed proof before ordering pillow boxes in bulk?", "Ask which digital proofs, structural samples or printed samples are available, along with their cost, timing and limitations. A digital proof helps check layout and copy; a physical sample helps assess the curved cavity, closures, product fit and assembly. Printed or production-representative samples may be needed for colour, material or finish decisions. Test your actual product and any wrap or insert, then retain the approved specification, artwork revision and sample reference for production and reorders."],
    ["Do pillow boxes arrive flat, and how do I stop the ends from popping open?", "Confirm the quoted delivery format, pre-gluing and case quantities. Pillow cartons are commonly supplied flat for storage and assembled by forming the body and folding the curved end flaps in the intended sequence. Overfilling, incorrect crease formation or an unsuitable board can interfere with closure. Trial assembly with the actual contents and check that the ends stay engaged without crushing the product. If a label, seal or accessory is needed, agree on it as part of the specification rather than relying on an improvised fix."],
    ["Can I mail a pillow box directly, or should I use an outer shipping box?", "Treat a pillow carton as presentation packaging unless the complete packout has been validated for the intended delivery route. Curved ends and decorative surfaces may need protection from crushing, opening, moisture or scuffing. A suitable corrugated outer carton or protective mailing pack can provide that protection, with cushioning or restraint where needed. Fragile items such as jewellery components, glass or small cosmetics should be assessed with the actual product. Confirm the carrier's packing and label requirements before shipping."],
    ["Can pillow boxes be used for sweets, chocolates or other food gifts?", "Identify whether food will touch the box directly or sit inside a separate primary pack. Describe the food, grease or moisture exposure, storage conditions and intended use. Request appropriate documentation for any food-contact board, inks, coatings, adhesives, window film or inner wrap. A decorative pillow carton is not automatically suitable for direct food contact and does not establish freshness or shelf life. Have the responsible food or regulatory reviewer approve the complete packaging and destination-specific label copy before production."],
    ["How long do custom pillow boxes take, and can Apex deliver to Canada and the USA?", "Apex's Canada-based team coordinates design, proofs, samples, qualified overseas production and delivery for Canadian and US buyers. Timing depends on artwork readiness, approvals, material, tools, windows or finishes, quantity and freight method. Production and transit are separate stages. Provide the receiving postal or ZIP code, delivery requirements and required in-hand date, especially for weddings, events or seasonal launches. Apex confirms the project schedule and delivery responsibilities in the quotation rather than promising one turnaround for every order."],
    ["Are pillow boxes recyclable, and can I choose recycled-content board?", "Ask about the complete finished pack, including windows, coatings, laminates, adhesives, ribbons, sleeves and inserts. Recycled content and recyclability are different claims, and a natural kraft appearance proves neither. Some components may need to be separated, and collection or processing options vary by Canadian municipality and US community. Tell Apex the material requirement and request available documentation for the proposed specification. Use environmental claims and disposal instructions that match the actual materials and local recycling access."]
  ],
  'industries/window-packaging': [
    ['Should I order an open cutout or a film-covered window?', 'Choose based on product exposure, handling protection and whether the contents already have a sealed primary pack.'],
    ['How large can a carton window be?', 'Approve the opening size through a structural sample that checks stiffness around corners and load-bearing panels.'],
    ['What details should I supply for food window cartons?', 'Describe the food contact, temperature and storage conditions so the window film and adhesive can be assessed.'],
    ['Can a window reveal the product label consistently?', 'Fix the product orientation with an appropriate insert and align the cutout to the actual label position.'],
    ['Will window film stay clear in chilled display?', 'Request a trial under your expected chilled conditions to evaluate visibility and condensation.'],
    ['How do I avoid visible glue around a window?', 'Approve the film overlap and adhesive area on a sample viewed from both sides of the carton.'],
    ['Can customers separate the window from the paper carton?', 'Check film attachment and local disposal guidance before approving removal instructions for the finished pack.'],
    ['What should I compare in Canadian and US window-box quotes?', 'Match window size, film specification, patching method and packed freight volume before comparing prices.']
  ],
  'industries/custom-kraft-soap-boxes': [
    ['Why choose custom kraft soap boxes for my brand?', 'Kraft soap boxes combine a natural appearance with custom branding to give your soap a professional, shelf-ready presentation.'],
    ['Are kraft boxes suitable for handmade soap and shampoo bars?', 'Kraft boxes can suit handmade soaps and solid shampoo bars, with material and lining choices matched to each product’s moisture and oil content.'],
    ['How much do custom kraft soap boxes cost in Canada?', 'Pricing depends on box size, board thickness, printing, finishes and quantity—request a tailored quote with delivery costs for your location.'],
    ['Can I order small quantities of custom soap boxes?', 'Minimum quantities depend on your box specifications and printing method; share your required quantity to explore suitable options.'],
    ['Can you print my logo and product information on kraft soap boxes?', 'Yes—we can incorporate your logo, artwork and supplied product information into a layout designed around your soap box.'],
    ['Will my brand colours look different on brown kraft packaging?', 'Brown kraft can change how printed colours appear, so review a representative print sample if colour accuracy is important.'],
    ['How do I choose the right box size for my soap bars?', 'Measure your ready-to-pack bars at their widest points and allow for handmade variations so the box closes comfortably without excessive movement.'],
    ['Can kraft soap boxes have a window to show the product?', 'A die-cut window can showcase your soap’s colour and texture, with its size and placement chosen to maintain box strength.'],
    ['Will kraft soap boxes protect against moisture and oil stains?', 'Plain kraft is not waterproof or greaseproof, so test your soap against the board and consider a suitable inner wrap where needed.'],
    ['Are kraft soap boxes recyclable in Canada?', 'Clean, uncoated kraft boxes are generally recyclable where accepted locally, while coatings, windows and product residue can affect acceptance.'],
    ['Can I check a sample before ordering soap boxes in bulk?', 'Digital proofs and optional physical samples help you review artwork, fit and material suitability, with availability and costs confirmed upfront.'],
    ['How long does production and delivery take across Canada?', 'We confirm production time, estimated delivery and shipping costs based on your approved design, order quantity and Canadian destination.']
  ],
  'industries/chocolate-bar-boxes': [
    ['Should I size a chocolate carton around the wrapped bar?', 'Measure the finished wrapper, folded ends and maximum bar thickness before setting the carton cavity.'],
    ['Can a printed chocolate sleeve touch the bar directly?', 'Keep the intended food-contact layer explicit and confirm its suitability before allowing direct chocolate contact.'],
    ['How do I keep thin chocolate bars from bending in their box?', 'Request supporting board or an insert and trial the complete wrapped bar through the intended handling route.'],
    ['Can several chocolate flavours use one bar-carton die?', 'Use a common die only where the wrapped bar dimensions and closure clearances match across flavours.'],
    ['Where should a chocolate-bar batch code be printed?', 'Reserve a flat accessible area that matches your coding equipment and remains visible after sleeve assembly.'],
    ['Will a foil finish affect the fit of a chocolate sleeve?', 'Approve the finished sleeve on a wrapped bar after all coatings and embellishments are applied.'],
    ['Does a chocolate bar box provide temperature control?', 'Plan temperature protection separately from the printed carton when the distribution route requires it.'],
    ['How do I quote bilingual chocolate-bar cartons for Canada?', 'Supply approved English and French artwork with the required panel allocation and quantity per flavour.']
  ],
  'industries/software-boxes': [
    ['What should I include in a boxed software kit brief?', 'List activation cards, manuals, media and accessories with their dimensions and intended unpacking order.'],
    ['How can packaging keep an activation code concealed?', 'Specify a separate sealed or concealed code carrier rather than exposing the credential through the outer carton.'],
    ['Can a software kit hold a manual and USB device separately?', 'Request dedicated paperboard or foam compartments sized around the manual thickness and device profile.'],
    ['How should software edition names appear on the box?', 'Assign clear edition identifiers to the front panel and packing labels so fulfilment teams can distinguish versions.'],
    ['Will my QR activation link work on a matte box?', 'Test a printed code at final size on the chosen finish with the destination link active.'],
    ['Can I update software instructions without replacing the box?', 'Quote a replaceable printed card or booklet when the outer structure can remain unchanged.'],
    ['What should I check on a premium software-kit sample?', 'Confirm media retention, booklet access and that the opening sequence presents activation instructions first.'],
    ['How do I handle Canadian and US software-box versions?', 'Separate the approved language, support-contact and licence insert versions in the packing specification for each market.']
  ],
  'industries/hair-extension-boxes': [
    ['What measurements determine a hair-extension box length?', 'Measure the packaged weft, attachment area and preferred fold pattern without compressing the hair excessively.'],
    ['How can an insert keep hair extensions neatly arranged?', 'Specify retention points at the weft and check that the remaining length lies smoothly in the tray.'],
    ['Can the same extension box fit clip-in and tape-in products?', 'Compare attachment thickness and bundle volume before approving shared packaging for both formats.'],
    ['How should a hair-extension drawer open?', 'Trial the pull tab and drawer clearance with the full bundle so removal does not snag the fibres.'],
    ['Can a window show the hair shade accurately?', 'Review the actual hair through the proposed film under retail lighting before approving window placement.'],
    ['Where can I put extension care instructions?', 'Allocate a separate card slot or readable inner panel that customers can access without disturbing the bundle.'],
    ['How do I avoid mixing hair lengths during packing?', 'Use distinct length and shade references on each artwork file, insert label and master-carton label.'],
    ['What should salons compare in extension-box quotations?', 'Compare usable length, hair restraint, drawer construction and packed delivery cost to the salon or fulfilment centre.']
  ],
  'industries/apparel-boxes': [
    ['How should I measure clothing for an apparel box?', 'Measure the folded garment stack with tissue, tags and any promotional inserts in place.'],
    ['Can one apparel carton fit both shirts and hoodies?', 'Check the bulkiest folded hoodie and smallest shirt pack before choosing shared dimensions or separate sizes.'],
    ['How do I reduce creasing in boxed garments?', 'Set the folding pattern and cavity depth so the closed lid does not press tightly onto the garment.'],
    ['Can apparel packaging accommodate a customer return?', 'Specify a reusable closure or separate return-sealing method and trial it after the first opening.'],
    ['Will dark inside print rub onto light clothing?', 'Test the finished interior and tissue with representative pale fabrics before approving the packout.'],
    ['Should boutique garment boxes arrive assembled?', 'Compare store assembly time with the storage and freight volume of preassembled apparel cartons.'],
    ['Can I combine a size label with a branded apparel sleeve?', 'Reserve an accessible label zone that stays visible when the sleeve is fitted around the garment box.'],
    ['How should I compare apparel-box costs for Canadian online orders?', 'Compare the finished parcel dimensions, garment capacity and total packing materials alongside the box price.']
  ],
  'industries/auto-parts': [
    ['What part details are needed for automotive packaging?', 'Provide part drawings, unit mass, sharp edges, surface treatment and the planned container quantity.'],
    ['How can automotive inserts protect machined surfaces?', 'Identify no-contact zones and approve restraints that support the part without rubbing critical finishes.'],
    ['What should I specify before selecting a VCI bag for parts?', 'Identify the metal types, cleaning process, storage duration and sealing conditions for a compatibility review.'],
    ['Can a carton separate several similar automotive components?', 'Assign a dedicated compartment and part identifier to each component in the kit layout.'],
    ['How should oily parts be packed in corrugated cartons?', 'Specify an appropriate containment liner and test the packed assembly for leaks and board exposure.'],
    ['What should an OEM approve on an automotive pack sample?', 'Obtain approval of part orientation, count, line-side access and the customer’s handling specification.'],
    ['Can automotive carton labels support lot traceability?', 'Reserve readable label panels for the required part, revision and lot identifiers in the receiving format.'],
    ['What affects freight planning for Canada–USA parts shipments?', 'Confirm loaded case weights, pallet arrangement and corrosion-protection duration for the actual cross-border route.']
  ],
  'industries/bakery-boxes': [
    ["How do I choose the right bakery box size for cakes, donuts, cookies or pastries?", "Start with the finished product and the number of pieces per box. Include the cake board, cupcake cups, liners, dividers and tallest decorations in your measurements. Specify usable internal length, width and height rather than relying on outside dimensions. Leave enough clearance to load and remove the treats without smearing icing, while limiting movement. Trial the actual assortment in an assembled sample before approving one size for several products."],
    ["Which is better for my bakery: kraft, white paperboard or corrugated boxes?", "Choose around the filled weight, presentation, grease exposure and handling route. Kraft offers a natural appearance; white paperboard provides a different background for printed artwork. Heavier cakes or demanding transport may need a stronger structure, a suitable cake board or an outer corrugated pack. Thickness alone does not establish food-contact suitability or carrying strength. Have Apex review the complete pack and test a filled sample rather than selecting only by colour or board thickness."],
    ["Are custom bakery boxes suitable for direct food contact in Canada and the USA?", "Specify whether unwrapped food will touch the carton, window, liner or insert, and describe the food, contact duration, temperature and grease or moisture exposure. Request documentation for the proposed food-contact materials and intended use, including relevant coatings, inks and adhesives. A printed bakery carton is not automatically suitable for direct contact. The food business should have its responsible food-safety reviewer approve the complete packaging specification for the destination market before production."],
    ["How can I prevent butter, oil or moisture from staining pastry and donut boxes?", "Describe the recipe's grease and moisture exposure and how long the product will remain packed. Discuss a suitable food-contact liner, tray or barrier specification rather than assuming thicker board will stop staining. Test the proposed combination with your actual donuts, cookies or pastries through the expected holding period. Check the base, corners and seams for marking or softening. Confirm the barrier's intended use and its effect on disposal options before approving it."],
    ["Can bakery boxes have a clear window without damaging icing or weakening the lid?", "Request a window position and size that show the product while leaving adequate supporting board around folds and closures. Allow clearance between the window and the tallest frosting or decoration. The film and adhesive must suit the intended food exposure and storage conditions. Check a filled sample for lid stiffness, visibility, fogging and contact with the product. A display window does not by itself make the pack airtight or establish shelf life."],
    ["How do I keep cupcakes and decorated cakes secure during pickup or delivery?", "Match cupcake insert openings to the actual cups and provide enough height for the frosting. For cakes, check board fit, base support and clearance around decorations. Assorted cookies or pastries may benefit from dividers or trays. Trial the complete filled pack through your normal handling route, including lifting, turning and any planned stacking. Do not assume a handle, insert or closed lid makes every load stackable; agree on the supported weight and packout after assessment."],
    ["Can I use the same bakery box for warm pastries, refrigerated cakes and frozen products?", "Give Apex the actual packing, storage and serving conditions before choosing materials. Warm product, chilling, freezing and transitions to room temperature place different demands on board, windows, adhesives and barriers. Test for condensation, softening, window fogging and closure performance under your process. An ordinary bakery carton does not provide temperature control and should not be assumed oven- or microwave-safe. Follow your validated food-handling procedure; packaging alone does not determine safe storage time or freshness."],
    ["Can I print my bakery logo and include food labels for both Canadian and US sales?", "Share your logo, colour references, artwork and required label panels. Plan space for the information applicable to your product and sales channel, such as ingredients, allergens, net quantity and other required declarations. Canadian and US requirements differ, and Canadian bilingual requirements have specific exemptions and conditions. Have your food-labelling reviewer approve destination-specific copy before print approval. Keep essential text and any barcode clear of folds, windows and closures, and check readability on an assembled proof."],
    ["How much do custom bakery boxes cost, and what is the minimum order?", "Price and minimum quantity depend on dimensions, board, food-contact requirements, windows, inserts, print versions, finishes and production setup. Supply quantities per size and design, product weight, artwork, receiving postal or ZIP code and required arrival date. Ask for quantity tiers and an itemized scope covering tooling, samples, inserts and freight. Confirm currency, duties, taxes and delivery responsibilities. Different sizes or seasonal designs may have separate setup costs and minimums; Apex confirms these in the quotation."],
    ["Can I check a sample before ordering, and will bakery boxes arrive flat or assembled?", "Confirm available digital proofs, structural samples and printed samples, including their costs, timing and limitations. Test the actual food, cake board and inserts for fit, closure and presentation; trial assembly with staff during a realistic packing run. Ask whether the quoted boxes arrive flat, pre-glued or assembled, and whether inserts are supplied separately. Retain the approved artwork revision and specification so reorders reproduce the agreed pack rather than an unconfirmed design change."],
    ["How long do custom bakery boxes take, and can Apex deliver across Canada and the USA?", "Apex's Canada-based team coordinates design, approvals, samples, qualified overseas production and delivery for Canadian and US buyers. The schedule depends on artwork readiness, materials, tooling, windows, inserts, quantity and freight method. Ask for production and transit timing separately, and provide the receiving postal or ZIP code and required in-hand date. Plan holiday and seasonal packaging around the complete approval-to-delivery process. Confirm delivery arrangements and any cross-border responsibilities in the project quotation."],
    ["Are bakery boxes recyclable or compostable, especially with windows or grease barriers?", "Assess the finished pack, including window film, coatings, liners, inserts, adhesives and food residue. Recyclable, recycled-content and compostable describe different properties; kraft colour alone establishes none of them. Ask for evidence supporting the proposed material claims and whether components must be separated. Collection and processing vary by Canadian municipality and US community, and composting programs may reject some packaging. Use disposal instructions that match the actual specification and local acceptance rather than a blanket environmental claim."]
  ],
  'industries/bottle-boxes': [
    ['Which bottle dimensions matter beyond diameter and height?', 'Include the shoulder, cap, neck and any protruding pump in the maximum packed profile.'],
    ['How should an insert support a glass bottle?', 'Plan base and neck restraint around the filled weight while keeping fragile contact points clear.'],
    ['Can two bottles share a gift carrier without touching?', 'Specify a partition layout and trial the filled carrier to check separation during lifting and transport.'],
    ['Will my bottle carton fit a pump with a locking clip?', 'Sample the carton using the final pump position and shipping clip rather than the bottle alone.'],
    ['How can bottle labels face the window consistently?', 'Use an orientation feature in the insert and verify label alignment through repeated packing trials.'],
    ['Should bottle leakage be addressed by the outer box?', 'Validate the primary bottle closure and specify secondary containment separately from the carton’s structure.'],
    ['Can a bottle retail carton also work as a parcel shipper?', 'Approve it for parcel use only after testing the complete bottle, insert and outer packaging arrangement.'],
    ['How do I compare bottle-box quotes from Canada and the USA?', 'Match bottle count, filled weight, insert material and delivery terms before comparing landed prices.']
  ],
  'industries/cbd-boxes': [
    ['What container details should I send for CBD retail cartons?', 'Provide the filled tincture, balm or gummy container dimensions and the intended retail orientation.'],
    ['How can a CBD carton keep a dropper from pressing on the lid?', 'Allow clearance above the dropper and check bottle restraint using the final closed container.'],
    ['Can a CBD jar carton have a removable paperboard platform?', 'Request a platform sample sized to the jar base and test removal without lifting the lid accidentally.'],
    ['Where should CBD product information sit on a small carton?', 'Allocate readable panels using the buyer’s approved copy before adding optional decorative finishes.'],
    ['Will one carton fit several CBD bottle suppliers?', 'Compare supplier drawings and actual bottle tolerances before treating the containers as interchangeable.'],
    ['How can CBD carton variants be identified during fulfilment?', 'Use approved SKU references on both individual carton artwork and bundled packing labels.'],
    ['Does a CBD outer box establish child resistance?', 'Require evidence for the exact proposed closure and pack configuration rather than relying on its appearance.'],
    ['What should I approve for Canadian versus US CBD cartons?', 'Have the destination-specific packaging brief and final artwork reviewed before releasing either market’s print order.']
  ],
  'industries/cereal-boxes': [
    ['How do I size a cereal carton around its liner bag?', 'Measure the filled and sealed liner with space for its top fold and normal product settling.'],
    ['Can a cereal box preserve freshness without an inner bag?', 'Specify the required primary barrier independently and validate it for the cereal’s intended storage life.'],
    ['What should I check on a cereal carton filling trial?', 'Check bag insertion, flap clearance, base stability and closure speed with the actual filled weight.'],
    ['How can a tall cereal box remain upright on shelf?', 'Approve the base footprint and loaded balance using a filled sample at the planned shelf position.'],
    ['Can cereal sample packs use the full-size artwork?', 'Rework text, barcode and panel proportions for the smaller dieline instead of simply shrinking the design.'],
    ['Where should nutrition copy go on a cereal carton?', 'Reserve the required panel area for final approved nutrition and ingredient content before artwork sign-off.'],
    ['How many cereal cartons should fit a master case?', 'Choose the case count around retailer handling, carton orientation and pallet dimensions.'],
    ['What should a Canadian private-label cereal quotation include?', 'Itemize liner scope, carton board, language variants and case packing alongside the delivered price.']
  ],
  'industries/chocolate-boxes': [
    ['How do I plan cavities for a mixed chocolate assortment?', 'Provide the largest dimensions of each piece and a numbered flavour layout for the tray.'],
    ['Can chocolate inserts protect delicate truffle toppings?', 'Set cavity depth and lid clearance around the tallest topping and test the loaded tray for movement.'],
    ['What should I confirm for trays that touch chocolates?', 'Request material suitability documentation for the actual chocolate contact and storage conditions.'],
    ['How can I stop a chocolate assortment shifting when opened?', 'Trial the tray fit and piece retention with the lid removed and the box gently tilted.'],
    ['Can chocolate gift boxes include a flavour key?', 'Match a printed flavour card or lid diagram to the approved cavity numbering and packing sequence.'],
    ['Should I use one large tray or stacked chocolate layers?', 'Compare piece access, layer separators and the risk of loading delicate decorations before selecting a format.'],
    ['How do I price seasonal chocolate assortment changes?', 'Separate artwork revisions from tray-tooling changes when the piece count or chocolate shapes change.'],
    ['What should Canadian chocolate brands check before summer dispatch?', 'Review temperature protection and transit duration separately from the presentation box specification.']
  ],
  'industries/christmas-boxes': [
    ['When should Christmas packaging artwork be finalized?', 'Agree a proof deadline that leaves room for sampling, production and delivery before your Christmas packing period.'],
    ['Can ornament boxes hold fragile hanging decorations?', 'Specify the ornament’s widest shape and hanging loop so a protective cavity can be sampled.'],
    ['How can Christmas boxes suit several gift bundles?', 'Keep the outer size consistent only where interchangeable inserts securely fit each planned bundle.'],
    ['Can Christmas foil patterns continue across box panels?', 'Approve seam and fold alignment on an assembled sample before accepting a continuous pattern.'],
    ['Should Christmas boxes carry the year in their artwork?', 'Use a removable dated sleeve or label if unused stock may need to serve a later season.'],
    ['How should Christmas cartons be stored before gift packing?', 'Confirm flat-pack or assembled storage dimensions and protect the finished surfaces from crushing and moisture.'],
    ['What should a Christmas packaging quote say about late artwork?', 'Ask for the final revision cutoff and its effect on the agreed Christmas delivery schedule.'],
    ['Can I split Christmas packaging deliveries between Canada and the USA?', 'Request separate destination quantities and arrival milestones before approving the seasonal production plan.']
  ],
  'industries/coffee-packaging': [
    ['How do I choose bag size for whole beans versus ground coffee?', 'Trial the actual roast and grind at the intended fill weight because usable volume depends on the product.'],
    ['Does my coffee pouch need a degassing valve?', 'Discuss roast age, packing timing and shelf-life goals before specifying the valve and barrier structure.'],
    ['Can coffee valves interfere with the printed front panel?', 'Approve valve location on the dieline so installation avoids critical graphics and sealing areas.'],
    ['How should I test a resealable coffee bag?', 'Check zipper access and resealing with a filled bag after the initial top seal is removed.'],
    ['Can subscription boxes fit changing coffee bag counts?', 'Sample each planned one-bag or multi-bag arrangement with its restraint before choosing shared mailer dimensions.'],
    ['Where should roast dates be applied on coffee packaging?', 'Reserve a coding area compatible with your printer and accessible after the bag is filled.'],
    ['Can a coffee pouch claim a specific shelf life from its material alone?', 'Validate shelf life with the coffee, seal and storage conditions rather than assuming it from the laminate name.'],
    ['What should Canadian roasters compare in pouch quotations?', 'Match fill format, barrier, valve, zipper and artwork quantities before comparing delivered costs to the roastery.']
  ],
  'industries/cosmetic-boxes': [
    ['How should I size cartons for cosmetic pumps and droppers?', 'Measure the final capped or locked dispenser and include any protective collar in the carton clearance.'],
    ['Can cosmetic shade ranges share a structural carton?', 'Retain a common structure where containers match and assign separate approved shade artwork references.'],
    ['How do I evaluate a soft-touch cosmetic finish?', 'Inspect a finished sample for fingerprints, scuffing and compatibility with any applied retail labels.'],
    ['Can a cosmetic carton hold a jar and applicator together?', 'Plan separate insert positions that keep the applicator away from the jar’s decorated surface.'],
    ['Where should fine ingredient text go on beauty packaging?', 'Use a readable flat panel and approve the final-size print before adding finishes near the text.'],
    ['How can cosmetic foil and embossing stay aligned?', 'Provide separate finishing layers and approve registration on a production-representative sample.'],
    ['Can a beauty counter tester use the same carton as sale stock?', 'Confirm the tester’s access and identification needs before reusing the retail carton structure.'],
    ['What should Canadian beauty brands supply for US carton orders?', 'Submit separately approved destination copy and shade quantities while keeping shared structural specifications explicit.']
  ],
  'industries/electronics-boxes': [
    ['Does ordinary foam protect a static-sensitive circuit board?', 'Specify the required ESD performance and documentation for the exact foam and bag materials.'],
    ['How can electronics inserts avoid loading connectors?', 'Mark connector keep-out areas on the device drawing and support the enclosure at approved contact points.'],
    ['Can one electronics carton organize a device and charging cables?', 'Use separate cavities for the device and accessories so cables cannot rub the screen or controls.'],
    ['What should I supply for a PCB packaging review?', 'Send board dimensions, component heights, handling sensitivity and the proposed bag-and-carton configuration.'],
    ['How should an instrument be oriented in a shipping box?', 'Identify allowed support faces and sensitive projections before approving the foam cavity and opening direction.'],
    ['Can electronics serial labels remain accessible after packing?', 'Reserve an exterior label zone linked to your packing record without exposing protected device surfaces.'],
    ['What does an electronics packaging transit test need to cover?', 'Define the device configuration, accessories, outer carton and route-specific test requirements as one complete pack.'],
    ['How should Canadian buyers compare electronics packaging suppliers?', 'Compare documented protective materials, cavity tooling and validation scope alongside delivery cost to your assembly site.']
  ],
  'industries/food-boxes': [
    ['What food-use details are needed before selecting a carton?', 'State whether contact is direct or indirect and describe the food’s temperature, moisture and oil exposure.'],
    ['Can meal-kit cartons separate dry and chilled components?', 'Specify separate compartments and temperature-control requirements before approving the complete meal-kit packout.'],
    ['Does a printed food box include an inner liner?', 'List the liner as a separate quoted component with its material, size and intended food-contact conditions.'],
    ['How should I approve food-carton odour performance?', 'Review the finished materials with the intended food and storage conditions before production release.'],
    ['Can a food multipack display each product’s information?', 'Check the assembled pack against approved labelling requirements and reserve outer panels where information is obscured.'],
    ['What should I check for food cartons on an automatic line?', 'Trial blank feeding, erection, filling and sealing at the intended line settings.'],
    ['How can food master cases support batch separation?', 'Assign clear batch and product references to the case labels and packing instructions.'],
    ['What should Canadian food buyers request with a packaging quote?', 'Request application-specific material documentation, approved artwork scope and delivery terms for the receiving facility.']
  ],
  'industries/hardware-boxes': [
    ['How can a hardware carton contain sharp screws?', 'Trial suitable inner bags or partitions with the actual screw points and loaded carton weight.'],
    ['Will a peg-hook box carry a heavy fitting?', 'Test the hang tab and board around the retailer’s peg using the fully loaded fitting pack.'],
    ['How do I prevent mixed fasteners becoming jumbled?', 'Use labelled compartments or sealed component bags matched to the assembly kit’s count list.'],
    ['Can a window show metal hardware without weakening the base?', 'Place the cutout away from load-bearing areas and validate the loaded carton structure.'],
    ['What information helps quote dense hardware packs?', 'Provide unit count, total mass, sharp-edge details and the intended stacking arrangement.'],
    ['How should hardware sizes be marked for shelf picking?', 'Give the size and part number prominent readable positions on both display and picking faces.'],
    ['Can hardware cartons accommodate an instruction sheet?', 'Allocate a flat leaflet space that stays separate from pointed parts and does not obstruct closure.'],
    ['What should I check for Canadian hardware-store case deliveries?', 'Confirm retailer case counts, barcode placement and receiving labels before printing the master cartons.']
  ],
  'industries/health-boxes': [
    ['How should I plan a wellness kit with several components?', 'List each sealed item and leaflet so the insert layout supports the intended use sequence.'],
    ['Can supplement bottle cartons leave space for tamper seals?', 'Reserve clean seal landing areas and check that the finished surface accepts the selected adhesive.'],
    ['Where should lot information go on health-product cartons?', 'Keep a coding panel accessible to your equipment and readable after the carton is closed.'],
    ['Can health accessory packs include a folded instruction leaflet?', 'Specify the leaflet’s folded dimensions and insertion direction alongside the product cavity.'],
    ['Does a health-product outer carton provide a sterile barrier?', 'Define any sterile-barrier requirement separately and obtain evidence for the exact proposed packaging system.'],
    ['How can I distinguish similar supplement strengths during packing?', 'Use controlled SKU identifiers and approved strength-specific artwork on cartons and bundle labels.'],
    ['What should I review on a health-kit preproduction sample?', 'Check component count, leaflet retrieval, closure integrity and readability of the approved product information.'],
    ['What should Canadian wellness buyers confirm for cross-border packaging?', 'Confirm destination-approved copy and documentation needs before quoting shared or separate health-carton runs.']
  ],
  'industries/hemp-boxes': [
    ['Are hemp-product cartons necessarily made from hemp fibre?', 'Ask for the actual board composition because the product category does not establish the packaging’s fibre source.'],
    ['How do I choose a carton for hemp oil versus balm?', 'Compare the filled bottle or jar profile and restraint needs before selecting a common structure.'],
    ['Can botanical illustrations remain clear on hemp-product cartons?', 'Approve line detail on the selected board shade and texture at the final printed size.'],
    ['How should a hemp topical sleeve fit a rounded container?', 'Trial the sleeve around the widest jar and lid dimensions to confirm secure retention and removal.'],
    ['Can hemp retail trays separate different botanical formulas?', 'Set dedicated facing positions and approved formula identifiers for each carton in the tray.'],
    ['Where can batch labels go on hemp packaging?', 'Reserve an unembellished label area that remains accessible after the carton or sleeve is assembled.'],
    ['What evidence is needed for environmental claims on hemp boxes?', 'Request documentation for the finished board and coatings before approving specific material or disposal claims.'],
    ['Can hemp packaging artwork be shared between Canada and the USA?', 'Use common artwork only after the buyer’s reviewer approves it for the exact products and sales destinations.']
  ],
  'industries/holiday-boxes': [
    ['How can holiday packaging work across several celebrations?', 'Use a neutral base carton with replaceable event-specific sleeves or labels where the contents remain compatible.'],
    ['Can I test a limited holiday edition before a larger order?', 'Ask for a pilot quantity and repeat-order pricing against the same approved seasonal specification.'],
    ['How do I handle several holiday artwork versions?', 'Create a quantity schedule linking each celebration, artwork revision and delivery destination.'],
    ['Should a holiday promotional pack include a removable sleeve?', 'Choose a sleeve when campaign messaging changes more often than the underlying product assortment.'],
    ['How can a window holiday box display a mixed bundle?', 'Arrange the insert so the featured items face the cutout without pressing against the film.'],
    ['What should I check when reusing last season’s holiday dieline?', 'Reconfirm every component’s dimensions and packed weight before carrying the structure into a new campaign.'],
    ['Can unused holiday packaging be retained for next year?', 'Review dated messages, artwork permissions and storage conditions before planning to reuse leftover cartons.'],
    ['How should Canadian retailers schedule holiday packaging deliveries?', 'Set separate in-store packing and arrival deadlines for each campaign rather than using one seasonal shipping date.']
  ],
  'industries/kitchenware-boxes': [
    ['How should a mug insert protect its handle?', 'Create clearance around the handle and support the mug body and base at suitable contact points.'],
    ['Can one kitchenware box hold glass and metal utensils?', 'Separate the materials with fitted compartments to prevent hard components striking glass surfaces.'],
    ['How do I size a carton for nested bowls?', 'Measure the complete nested stack including separators and any protective rim clearance.'],
    ['What should I specify for sharp kitchen tools?', 'Identify cutting edges and request protective guards and restraint before sampling the outer carton.'],
    ['Can moulded pulp inserts suit a ceramic gift set?', 'Request a sample around the actual ceramic shapes and test fit, removal and transit protection.'],
    ['How can a retail sleeve display cookware without slipping?', 'Trial the sleeve’s retention around the cookware profile and check it after repeated handling.'],
    ['What should I test on packaging for glazed kitchenware?', 'Check contact surfaces for abrasion or marks on the actual glaze after representative handling.'],
    ['How should Canadian homeware stores compare packaging costs?', 'Include breakage-prevention components, assembly labour and delivered carton volume in the kitchenware pack comparison.']
  ],
  'industries/pharma-boxes': [
    ['What controlled specifications are needed for a pharma-carton quote?', 'Provide the approved drawing, material requirements, artwork revision and required inspection documentation.'],
    ['Can pharmaceutical cartons reserve serialization space?', 'Specify the coding area, equipment and verification requirements before approving the panel layout.'],
    ['How should a carton fit a blister pack and leaflet?', 'Sample the stacked blister and folded leaflet together to confirm insertion and closure clearance.'],
    ['Does a pharma carton qualify a cold-chain shipment?', 'Require validation of the complete thermal packaging configuration for the specified product and transport profile.'],
    ['Can tamper-evident labels be added to medical cartons?', 'Review seal placement, surface compatibility and opening evidence on the proposed finished carton.'],
    ['How should pharma packaging substitutions be controlled?', 'Require written approval for changes to board, coatings, adhesives or artwork against the agreed specification.'],
    ['What should I request for medical-device carton samples?', 'Request representative fit samples and the agreed material records for review within your own qualification process.'],
    ['What should Canadian pharma buyers clarify before an overseas order?', 'Confirm documentation responsibilities, inspection milestones and destination delivery requirements before releasing the purchase order.']
  ],
  'industries/pizza-boxes': [
    ['How do I choose a pizza box size for a finished pizza?', 'Measure the largest cooked diameter and topping height rather than relying only on the menu size.'],
    ['How should pizza-box vents be positioned?', 'Trial vent placement with your hot product to balance steam release and the desired delivery condition.'],
    ['Can printing appear inside a pizza box?', 'Confirm the proposed inks, board and contact arrangement are suitable for the intended hot-food use.'],
    ['How do I keep pizza grease from weakening the box?', 'Review a suitable liner or board treatment and test it over your normal holding and delivery time.'],
    ['Will my pizza cartons stack securely in delivery bags?', 'Check the loaded carton footprint, lid locks and stack height in the actual insulated delivery bag.'],
    ['Can a slice box fit deep-dish portions?', 'Provide the largest slice width, crust height and point length for a dedicated fit sample.'],
    ['Are frozen pizza cartons the same as hot takeaway boxes?', 'Specify the frozen storage and distribution conditions separately from hot takeaway requirements.'],
    ['What should a Canadian pizza chain specify for repeat orders?', 'Record approved sizes, board, branch artwork and per-location usage to quote consistent replenishment batches.']
  ],
  'industries/pre-roll-boxes': [
    ['Should pre-roll cartons be measured around a tube or the loose product?', 'Base the cavity on the final primary container and any protective end closures.'],
    ['How can a pre-roll multipack keep tubes separated?', 'Specify individual channels that hold the intended tube count without allowing caps to collide.'],
    ['Does a pre-roll drawer shape demonstrate child resistance?', 'Request applicable evidence for the exact closure system rather than assuming a drawer mechanism is sufficient.'],
    ['Can slim pre-roll cartons leave enough warning space?', 'Lay out the buyer-approved mandatory copy at final size before choosing decorative panel treatments.'],
    ['How do I prevent long pre-roll cartons bending in a display?', 'Sample the board stiffness and tray support with the loaded slim packs in their retail orientation.'],
    ['Where should pre-roll batch codes be accessible?', 'Allocate a flat coding area that remains visible outside the retail tray and clear of sleeve seams.'],
    ['Can one pre-roll carton accommodate different tube caps?', 'Check every cap diameter and total closed length before approving a shared cavity.'],
    ['What should Canadian pre-roll buyers settle before printing?', 'Finalize the exact market, approved artwork and required closure documentation before ordering printed inventory.']
  ],
  'industries/retail-boxes': [
    ['How should I size a retail carton for a shelf planogram?', 'Use the retailer’s allocated width, depth and height together with the product’s packed dimensions.'],
    ['Can retail cases open directly into shelf-ready trays?', 'Request a tear-away or removable-cover sample and check opening without damaging the sale cartons.'],
    ['Where should retail carton barcodes be positioned?', 'Choose a flat accessible panel and verify scanning in the expected shelf and checkout orientations.'],
    ['How do I avoid hiding product names behind a shelf lip?', 'Check the front artwork against the retailer’s shelf-edge height before approving panel hierarchy.'],
    ['Can a retail box support both hanging and shelf display?', 'Trial the loaded hang feature and standing base separately before approving a dual-use carton.'],
    ['How should promotional stickers fit retail cartons?', 'Reserve a sticker zone that does not cover required information, product identifiers or the opening mechanism.'],
    ['What should I confirm about retail carton replenishment?', 'Match inner-case quantities and opening access to the store’s restocking process.'],
    ['Can one retail packaging order serve Canadian and US chains?', 'Separate chain-specific case markings and approved market artwork while identifying any genuinely shared components.']
  ],
  'industries/shipping-boxes': [
    ['Should shipping-box measurements be internal or external?', 'Provide required internal product space and request finished external dimensions for freight planning.'],
    ['How do I reduce empty space in a parcel box?', 'Measure the protected packout and trial a closer-fitting carton without removing necessary cushioning.'],
    ['Can shipping cartons be stacked for long warehouse storage?', 'Specify loaded weight, stack height, storage duration and humidity conditions for the carton review.'],
    ['What closure should I use on a heavy shipping box?', 'Choose tape, adhesive or strapping through a loaded-pack trial matched to the intended handling route.'],
    ['Where should shipping labels sit on branded cartons?', 'Leave an unobstructed flat label panel clear of box seams and prominent handling instructions.'],
    ['Can a shipping box survive a customer return journey?', 'Test the reopened and resealed carton with the intended return packout before claiming reuse suitability.'],
    ['What should I check before changing shipping-box suppliers?', 'Compare actual board specifications, dimensions and loaded performance against the existing approved pack.'],
    ['What affects delivered carton costs between Canada and the USA?', 'Confirm bundle volume, pallet count, delivery access and the quoted allocation of cross-border charges.']
  ],
  'industries/soap-boxes': [
    ["Should I choose a full soap box, a sleeve or a window carton?", "Choose around product exposure, shelf presentation and handling. A full carton covers more of the bar; a sleeve leaves surfaces exposed; a window can show colour or a stamped design. None automatically provides a moisture or fragrance barrier. Share whether the bar has a separate wrap, where it will be sold and how it will travel so Apex can review a suitable structure."],
    ["How do I measure handmade soap for a custom box that fits?", "Measure several sale-ready bars at their widest points, including irregular edges, embossing and any wrap. Supply the range of dimensions and weight rather than one ideal bar. Ask for usable internal dimensions and test a structural sample for easy loading, closure and removal. Allow for expected variation or dimensional change without leaving excessive movement inside the carton."],
    ["Is kraft or white paperboard better for custom soap packaging?", "Kraft and white board offer different print backgrounds and appearances. Select the grade and structure around the bar's weight, desired finish and handling conditions rather than colour alone. Ask for material samples and an artwork proof on the proposed stock. A natural kraft appearance does not establish recycled content, moisture resistance or suitability for direct soap contact."],
    ["Can soap oils or fragrance stain the box, and do I need an inner wrap?", "Tell Apex whether the soap will touch the board directly and describe the formulation, surface oils and expected storage conditions. Trial the proposed carton and any liner or wrap with the actual product over the intended holding period. Check staining, scent changes, adhesion and surface marking. Agree on a compatible primary wrap or barrier where necessary; decorative printing or a coating should not be treated as proof of compatibility."],
    ["Can soap boxes have windows, cut-outs, foil or embossed logos?", "Share the features and artwork you want so Apex can review them against the board and box dimensions. Position windows to display the bar while retaining support around folds and closures. Keep important copy clear of cuts, and check that exposed soap is acceptable for the sales channel. Approve physical samples where finish, window film, product contact or final colour is important."],
    ["What information should I print on soap boxes for Canada and the USA?", "Reserve readable space for product identity, net quantity, business or contact information, ingredients and any warnings required for your product. Canadian and US rules differ, and classification depends on formulation, use and claims. Have a qualified reviewer approve destination-specific copy, including applicable Canadian language and cosmetic ingredient requirements. Do not assume one label or an unsupported claim such as antibacterial is appropriate for both markets."],
    ["How much do custom soap boxes cost, and what is the minimum order?", "Price and minimum quantity depend on dimensions, board, print versions, windows, finishes, inserts and tooling. Send the bar dimensions, weight, wrapping method, quantities per design, artwork and delivery postal or ZIP code. Request quantity tiers and confirm whether proofs, samples, tooling and freight are included. Apex confirms currency, taxes, duties and delivery responsibilities in the quotation; there is no single price or minimum for every custom specification."],
    ["Can I combine different soap scents, sizes or seasonal designs in one order?", "List each version with its dimensions, artwork and quantity. Designs sharing a structure may simplify planning, but separate artwork, colours, finishes or sizes can require separate setups and minimums. Use clearly named files so scent names and approved ingredient panels stay matched. Ask Apex to confirm the available production options and costs before assuming several variants qualify as one quantity tier."],
    ["Can I approve samples before ordering soap boxes in bulk?", "Ask about digital proofs, structural samples and printed samples, including their costs, timing and limitations. Digital artwork approval checks layout and copy; a physical sample checks fit, closure, handling and contact with the actual soap. Use the final wrap and sale-ready bars during assessment. Retain the approved specification, artwork revision and sample reference for production and repeat orders."],
    ["Do soap boxes arrive flat, and can I add inserts for gift sets?", "Confirm the quoted delivery format, assembly method and whether inserts are supplied separately. Trial loading and closing with staff using the actual bars. For multi-bar gifts, discuss dividers or a fitted tray to reduce movement and keep the display aligned. Compartments alone do not prevent scent transfer; any fragrance-separation requirement needs assessment of the individual wrapping and complete pack."],
    ["How long do custom soap boxes take, and can Apex deliver to Canada and the USA?", "Apex's Canada-based team coordinates approvals, samples, qualified overseas production and delivery for Canadian and US buyers. Timing depends on artwork, materials, tooling, finishes, quantity and freight. Provide your receiving postal or ZIP code and required in-hand date, especially for holiday launches. Confirm production and transit separately in the quotation. For direct-to-customer shipping, assess a protective outer pack rather than assuming a retail soap carton is sufficient."],
    ["Are soap boxes recyclable, and can I request recycled-content packaging?", "Ask about the complete specification, including window film, coatings, laminates, adhesives, inserts and any soap residue. Recycled content and recyclability are different properties, and neither follows from kraft colour alone. Request evidence for the proposed material claims and check whether components need separation. Recycling access varies by Canadian municipality and US community, so use disposal instructions that match the finished pack and local acceptance."]
  ],
  'industries/spice-packaging': [
    ['How should I size a spice carton around a shaker lid?', 'Include the widest cap, dispensing feature and jar shoulder in the packed measurements.'],
    ['What barrier details matter for ground-spice refill pouches?', 'Specify aroma, moisture and light-protection targets for the particular spice and intended storage period.'],
    ['Can a spice pouch zipper stay usable after pouring?', 'Trial filling and repeated dispensing with the actual powder to check zipper cleanliness and resealing.'],
    ['How can a spice gift carton hold jars of different heights?', 'Use stepped insert positions that support each jar while keeping the intended label faces visible.'],
    ['Where should spice blend names appear on a display?', 'Align clear blend identifiers with the tray facings so refill staff can return jars to the correct position.'],
    ['Can a window expose spices to unwanted light?', 'Review the window’s size and placement against the product’s required light protection before approval.'],
    ['How should spice packaging accommodate batch labelling?', 'Reserve a coding or label area that remains readable after the pouch or carton is filled.'],
    ['What should Canadian spice brands include in a packaging enquiry?', 'Specify jar or refill format, fill weights, approved language panels and quantities for each blend.']
  ],
  'industries/stationery-boxes': [
    ['How do I size a stationery box for notebooks and pens?', 'Measure the complete arrangement including pen clips, notebook binding and any belly bands.'],
    ['How can a flat mailer protect greeting-card corners?', 'Specify edge clearance and restraint that prevent the card stack from sliding into the mailer corners.'],
    ['Can a stationery insert keep pen clips from scratching a notebook?', 'Separate the pen cavity from the notebook surface and check removal with the actual clip profile.'],
    ['What depth should I allow for a planner with a spiral binding?', 'Use the binding’s maximum thickness rather than the paper-stack thickness when setting the cavity depth.'],
    ['Can a drawer box hold several stationery refills?', 'Specify refill count and divider positions so the drawer stays organized as items are removed.'],
    ['How do I keep printed stationery clean inside its box?', 'Test interior surfaces and separators against the intended paper stock for rubbing and colour transfer.'],
    ['Should stationery gift sets include a paper band or a lid?', 'Choose around display access, component retention and the protection required during distribution.'],
    ['How can Canadian stationery brands compare packaging quantities?', 'Price separate notebook, card and pen-kit formats against forecast sales instead of assuming one shared carton size.']
  ],
  'industries/tea-packaging': [
    ['How do I size a carton for individually wrapped tea sachets?', 'Stack the intended sachet count in its retail orientation and measure the complete bundle before adding clearance.'],
    ['What should I specify for loose-leaf tea pouches?', 'Provide leaf volume, fill weight and aroma-protection targets so the pouch structure can be reviewed.'],
    ['Can a tea sampler keep several blends organized?', 'Assign labelled compartments to each blend and confirm that the intended primary packs prevent unwanted aroma transfer.'],
    ['How should a tea tin fit inside a presentation carton?', 'Measure the lid rim and base, then trial insert support and finger clearance for removal.'],
    ['Can a tear-open tea carton dispense sachets neatly?', 'Request a dispensing sample and check that the opening releases one sachet without spilling the remaining stack.'],
    ['Where should brewing instructions appear on tea packaging?', 'Place the approved steeping guide on a panel customers can read without opening or dismantling the pack.'],
    ['Will a paper tea carton alone retain delicate aromas?', 'Define the primary barrier requirement separately and validate the complete pack with the actual tea.'],
    ['What should Canadian tea importers compare in carton quotations?', 'Compare sachet capacity, insert layout, language versions and packed delivery volume for each blend format.']
  ],
  'industries/vape-boxes': [
    ['How should vape cartridge cartons protect exposed connectors?', 'Specify connector clearance and restraint that supports the cartridge body without loading the contact end.'],
    ['Can a vape carton hold a device and spare pods?', 'Provide the device and pod dimensions for separate cavities that prevent component contact.'],
    ['What should I confirm for a vape drawer closure?', 'Review retention, opening effort and any required closure evidence for the exact assembled pack.'],
    ['How can vape cartons leave enough space for approved warnings?', 'Set the required information panels before arranging optional graphics on the small-format dieline.'],
    ['Can cartridge box inserts fit different mouthpieces?', 'Sample the tallest and widest mouthpiece profiles before approving a shared insert.'],
    ['How should vape display trays identify product variants?', 'Link each facing to the approved variant identifier and keep carton codes visible for stock picking.'],
    ['Does a retail vape carton establish suitability for battery shipping?', 'Review any battery transport packaging requirements separately from the retail carton’s presentation design.'],
    ['What should Canadian vape buyers approve before a US print run?', 'Confirm destination-specific artwork and packaging requirements for the exact device or cartridge before production.']
  ],
  'services/cardboard-boxes': [
    ['Which paperboard specification should a cardboard-box quote state?', 'Ask for the board grade, thickness and surface finish rather than accepting the word cardboard alone.'],
    ['How can I compare white and recycled-content carton stocks?', 'Review printed samples and structural fit against the same product load before selecting the stock.'],
    ['Will my cardboard carton fold cleanly through dark artwork?', 'Approve crease quality on the printed and finished board to check for visible cracking at folds.'],
    ['Can a paperboard sleeve slide over an existing product tray?', 'Provide the final tray dimensions and sample the sleeve after applying the selected print finish.'],
    ['How should I choose between paperboard and fluted cardboard?', 'Compare the required retail appearance and loaded protection using representative samples of both constructions.'],
    ['Can small text stay legible on a cardboard carton?', 'Approve a final-size printed proof on the chosen stock before accepting fine text or reversed lettering.'],
    ['What changes cardboard-box tooling costs?', 'Windows, custom outlines, embossing and separate insert dies can add setup costs beyond a basic carton cut.'],
    ['How should Canadian buyers compare cardboard-box price tiers?', 'Keep board, dimensions and finish identical while comparing unit prices, setup charges and freight at each quantity.']
  ],
  'services/corrugated-boxes': [
    ['What should I send to select a corrugated flute and grade?', 'Send the loaded mass, carton dimensions, stacking conditions and handling route for a board specification review.'],
    ['When should I request full-overlap corrugated flaps?', 'Ask for an overlap construction review when the product needs additional flap coverage or base support.'],
    ['Can telescoping corrugated cartons suit tall products?', 'Provide the height range and required lid overlap so fit and restraint can be checked at each extreme.'],
    ['How do corrugated print methods affect artwork choices?', 'Compare samples of the proposed flexo, digital or laminated process using your actual graphics and liner.'],
    ['What should a corrugated sample confirm before tooling approval?', 'Check score positions, slot clearance, joint alignment and loaded closure on the proposed board construction.'],
    ['Can a corrugated grade alone guarantee my transit performance?', 'Validate the complete packed system because board grade alone does not establish performance on your route.'],
    ['How should corrugated reorders record material consistency?', 'Retain the approved flute, liners, strength specification and converting tolerances with the supplier’s order reference.'],
    ['What delivery details matter for corrugated bundles in Canada?', 'Confirm bundle dimensions, pallet height and receiving equipment so freight can be quoted to the actual warehouse.']
  ],
  'services/custom-kraft-boxes': [
    ['Will kraft board change the appearance of my brand colours?', 'Approve printed colour references on the selected brown stock before accepting the artwork colours.'],
    ['Can white ink improve contrast on a kraft carton?', 'Request a white-ink sample and quote its coverage separately to assess the appearance and added cost.'],
    ['How do I choose kraft paperboard versus kraft corrugated?', 'Match the construction to the retail load and delivery method while comparing samples with the same contents.'],
    ['Does a kraft finish establish that a box is recyclable?', 'Review coatings, windows, adhesives and local collection guidance before approving a recyclability statement.'],
    ['Can kraft boxes keep the same brown shade on reorders?', 'Agree a physical shade reference and acceptable variation with the selected stock specification.'],
    ['What should I check on a minimalist kraft logo proof?', 'Inspect ink spread, fine lettering and contrast on the actual uncoated surface.'],
    ['Can kraft inserts match the outer carton visually?', 'Specify the insert stock and colour reference separately because inner and outer constructions may use different boards.'],
    ['How should Canadian brands compare kraft packaging offers?', 'Match board construction, documented fibre content, ink coverage and delivery scope before selecting a price.']
  ],
  'services/gable-boxes': [
    ['How much weight can a custom gable handle carry?', 'Approve the handle through a loaded sample test using the actual contents and intended carrying duration.'],
    ['How do I measure usable height in a gable box?', 'Measure the rectangular body space below the sloping roof and handle folds.'],
    ['Can gable boxes hold drinks alongside food?', 'Request separate fitted compartments and test balance, leakage containment and carrying comfort with the full set.'],
    ['Will a large window weaken a gable carrier?', 'Keep the cutout clear of handle load paths and validate the loaded carrier before approving the window size.'],
    ['How should a gable top lock for takeaway use?', 'Trial the interlocking tabs with staff and check that the handle remains engaged during normal carrying.'],
    ['Can gable packaging arrive flat for event packing?', 'Confirm the flat bundle size and practise base assembly, filling and handle closure before scheduling labour.'],
    ['Where should event branding sit on a gable carton?', 'Keep key messaging on the body panels and verify visibility when the handle is held.'],
    ['What should Canadian event buyers include in a gable-box enquiry?', 'Supply the loaded contents, event date, artwork versions and venue delivery conditions for a complete quote.']
  ],
  'services/industrial-bulk-packaging': [
    ['What information is needed to specify a bulk Gaylord container?', 'Provide bulk density, fill weight, pallet dimensions, stacking height and loading or discharge method.'],
    ['How should I size a liner for a bulk container?', 'Measure the container interior and required fold-over or sealing allowance against the planned filling process.'],
    ['Can stretch film be selected from gauge alone?', 'Trial film performance with your wrapper settings, pallet profile and required load containment.'],
    ['What should I confirm before ordering shrink film for equipment?', 'Specify the product geometry and sealing or heating equipment so film format and compatibility can be reviewed.'],
    ['How can edge protectors work with pallet strapping?', 'Match corner-board length and bearing area to strap positions and test the loaded pallet for pressure damage.'],
    ['Can a blanket order include scheduled bulk-packaging releases?', 'Agree storage responsibility, release quantities, notice periods and charges in writing before relying on scheduled supply.'],
    ['What should an industrial packaging pilot measure?', 'Record load stability, packing time, material consumption and damage observations under the intended handling conditions.'],
    ['How do Canadian plants compare cross-border bulk packaging bids?', 'Compare delivered cost per usable pallet load with liner scope, release schedule and receiving requirements held constant.']
  ],
  'services/mailer-boxes': [
    ['How should I choose a tuck-top mailer locking design?', 'Trial front and side locks with the packed contents to confirm closure security and easy assembly.'],
    ['Can mailer artwork extend across the opening flap?', 'Check the assembled flap and score positions so essential messaging remains legible during opening.'],
    ['How do I allow for tissue and inserts in a mailer?', 'Measure the complete wrapped arrangement and test closure without compressing the contents or bowing the lid.'],
    ['Should my subscription mailer include an adhesive strip?', 'Compare strip placement, sealing reliability and opening access with the intended packing workflow.'],
    ['Can a tear strip leave a mailer reusable?', 'Specify a second closure method and test the box after the first strip has been removed.'],
    ['How can inside and outside mailer colours be approved?', 'Review both printed surfaces on the selected liners rather than assuming identical colour from different stocks.'],
    ['What should I check during a mailer assembly trial?', 'Time erection, insert placement and closing while checking that locks engage without excessive force.'],
    ['How do Canadian subscription brands compare mailer quotes?', 'Compare the full packout, print surfaces, closure features and finished parcel size at the same monthly quantity.']
  ],
  'services/polybags': [
    ['What measurements are needed for a gusseted polybag?', 'Specify face width, gusset depth and usable length with enough allowance for the chosen closure.'],
    ['How do I choose film thickness for a heavy product bag?', 'Trial the proposed gauge against the actual load, sharp points and sealing method before ordering.'],
    ['What should I provide for wicket-bag compatibility?', 'Supply wicket spacing, lip dimensions, hole positions and the bagging machine’s feeding requirements.'],
    ['Can pre-opened bags run on my automatic bagger?', 'Match roll direction, bag pitch, perforations and opening format to the equipment specification.'],
    ['How should I specify a large furniture protection bag?', 'Measure the widest product profile and projections while identifying any corners needing reinforcement or guards.'],
    ['Does a pink bag establish static-shielding performance?', 'Request the required electrical performance documentation for the exact bag rather than relying on its colour.'],
    ['Can printed polybags use recycled material?', 'Confirm the available resin blend and documented performance for your application before approving recycled-content claims.'],
    ['What should Canadian buyers compare when ordering polybags by the roll?', 'Compare usable bag count, film specification, core size and roll packing rather than roll price alone.']
  ],
  'services/protective-packaging': [
    ['How do I choose between cushioning and simple void fill?', 'Identify whether the product needs impact absorption, movement restraint or both before choosing the internal material.'],
    ['What information is needed to design a custom foam cavity?', 'Provide product geometry, mass, fragile areas and allowed contact surfaces with the planned outer carton.'],
    ['Can protective foam leave marks on a finished surface?', 'Run a contact and abrasion trial using the actual finish and proposed foam grade.'],
    ['How should I compare paper cushioning with air-column film?', 'Test both complete packouts against the same damage risks, assembly workflow and shipping conditions.'],
    ['Can desiccant replace a sealed moisture barrier?', 'Review barrier, seal integrity and desiccant needs together for the expected exposure period.'],
    ['What should a protective-packaging test report identify?', 'Require the tested product, packing configuration, protocol and observed results to match the intended production pack.'],
    ['How do I avoid overpacking a fragile item?', 'Compare validated protection options using total pack volume and assembly effort rather than removing cushioning arbitrarily.'],
    ['What should Canadian exporters specify for corrosion protection?', 'Describe metal compatibility, route duration and expected moisture exposure before selecting the protective system.']
  ],
  'services/cbd-boxes': [
    ["What types of CBD packaging can Apex quote for my product range?", "Share the product format, primary container and destination market so Apex can review cartons, sleeves, inserts, gift structures or display components. Bottle, jar and tube packs need different dimensions and support. Quote each component separately where necessary, and identify which container provides product protection or any required safety closure. A packaging quotation does not establish that a CBD product can legally be sold in a particular market."],
    ["How do I size a CBD box for an oil bottle, dropper, jar or tube?", "Measure the final filled container at its widest points, including cap, dropper, shoulder, pump and any tamper seal. Supply drawings or samples, weight and orientation requirements. Specify usable internal dimensions and include space for the proposed insert. Test a structural sample for loading, closure, removal and movement rather than ordering by bottle volume alone; containers with the same stated capacity can have different shapes."],
    ["Which board and inserts should I choose to protect glass CBD containers?", "Select the structure around filled weight, fragile contact points and handling conditions. A fitted paperboard or other suitable insert can restrain the container without pressing on the dropper or closure. Discuss stock, print requirements and the complete shipping pack with Apex. Validate the assembled pack using the actual container; a retail carton or premium finish alone does not establish drop protection, leak containment or transit performance."],
    ["Does a CBD box need to be child-resistant or tamper-evident?", "Requirements depend on the product, jurisdiction and role of the immediate container and outer pack. Child resistance and evidence of opening are different functions. An ordinary tuck carton or seal is not proof of child resistance. Have your compliance reviewer define the applicable requirement and request relevant testing documentation for the exact proposed system. Do not assume a tested closure, material or similar-looking design validates a different complete package."],
    ["Can I use the same CBD packaging and label in Canada and the USA?", "Do not assume one design works in both markets. Canadian cannabis packaging has specific presentation and labelling requirements, while US obligations depend on the product category, federal rules and destination state. Confirm product eligibility and the applicable packaging rules before finalizing artwork. Have your responsible regulatory reviewer approve each market version; printing a carton or adding a warning does not by itself authorize sale or cross-border distribution."],
    ["What information and space should I plan for on a CBD carton?", "Provide destination-approved copy before layout approval. Depending on the applicable rules, the design may need space for product identity, net contents, ingredients, cannabinoid information, warnings, responsible-business details and batch information. Identify any required symbols, language, type sizes or restricted branding. A QR code or laboratory report link should not be assumed to replace mandatory on-pack information. Keep variable-data panels and essential copy clear of folds, cuts and closures."],
    ["Can CBD boxes have custom printing, foil, embossing or windows?", "Send your artwork and desired features for technical review against the selected stock and structure. Confirm that colours, finishes, windows and graphics are permitted for the specific product and market before requesting production. Where permitted, physical samples can help assess appearance and durability. Promotional design preferences must fit the approved packaging brief; an attractive finish should not obscure required information or interfere with the closure."],
    ["How much do custom CBD boxes cost, and what is the minimum order?", "Cost and minimum quantity depend on dimensions, board, print versions, tooling, finishes, inserts and any separately specified packaging system or testing. Supply quantities per format and artwork, container details and the receiving postal or ZIP code. Request quantity tiers and an itemized scope for samples, tooling, freight and other services. Apex confirms currency, taxes, duties and delivery responsibilities in the quotation rather than offering one universal price or minimum."],
    ["Can I approve a prototype or printed sample before bulk production?", "Ask which digital proofs, structural prototypes and printed samples are available, including cost, timing and limitations. Check fit with the final container, insert and closure, and review finished text at actual size. Distinguish appearance and assembly approval from any required safety or regulatory assessment. Retain the approved specification, artwork revision and sample reference before releasing production; changes to the pack may require further review."],
    ["How should I manage different CBD strengths, product formats and artwork revisions?", "List each SKU with its container dimensions, quantity, approved copy and artwork version. Confirm whether shared structures are practical and whether variants have separate setups or minimums. Use written revision control and a production-release cutoff so superseded files are not printed. Agree on carton bundle identification and variable-data areas, and require fresh approval when the product, destination requirements or packaging specification changes."],
    ["How long does production take, and can Apex deliver empty CBD packaging to Canada and the USA?", "Apex's Canada-based team coordinates approvals, samples, qualified overseas production and delivery. Timing depends on artwork readiness, materials, tooling, finishes, quantity, assessment needs and freight. Provide the receiving postal or ZIP code and required in-hand date, then confirm production and transit separately in the quotation. This concerns empty packaging; shipment of filled CBD products has separate legal and carrier requirements that must be reviewed independently."],
    ["Can CBD cartons use recycled-content board, and are the finished boxes recyclable?", "Ask about the complete specification, including coatings, laminates, windows, adhesives and inserts. Recycled content and recyclability are different properties; kraft colour alone proves neither. Request documentation for proposed claims and check whether components need separation. Recycling access varies across Canadian municipalities and US communities. Any environmental wording must also fit the product's applicable packaging and labelling rules, rather than being added to approved artwork without review."]
  ],
};

export function remainingBuyerFaqs(route: string): FAQ[] | undefined {
  return questions[route]?.map(([q, a]) => ({ q, a }));
}

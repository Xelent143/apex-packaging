#!/usr/bin/env node
import { existsSync } from 'node:fs';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { requireFreshBlogArtwork } from './lib/blog-artwork.mjs';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const blogDir = join(root, 'src', 'pages', 'blog');
const blogIndex = join(blogDir, 'index.astro');
const startDate = '2026-07-14';
const publishFromDate = process.env.APEX_BLOG_PUBLISH_FROM || startDate;
const maxCatchUp = Number(process.env.APEX_BLOG_MAX_CATCHUP || 365);

const topics = [
  ['custom mailer boxes', 'Custom Mailer Boxes for Subscription Brands', 'subscription launches, inserts, and repeat shipments', 'mailer-boxes', 'subscriptions'],
  ['custom kraft boxes', 'Custom Kraft Boxes for Natural Product Brands', 'board colour, print contrast, and retail presentation', 'custom-kraft-boxes', 'kraft packaging'],
  ['corrugated shipping boxes', 'Corrugated Shipping Boxes for Heavy Ecommerce Orders', 'ECT ratings, flute choice, and parcel handling', 'corrugated-boxes', 'shipping'],
  ['poly mailers', 'Poly Mailers for Apparel and Soft Goods', 'film gauge, opacity, closures, and returns', 'polybags', 'poly mailers'],
  ['protective packaging', 'Protective Packaging for Fragile Product Kits', 'foam, void fill, inserts, and carton fit', 'protective-packaging', 'protective packaging'],
  ['retail display boxes', 'Retail Display Boxes for Counter and Shelf Programs', 'load, visibility, artwork panels, and replenishment', 'corrugated-boxes', 'retail displays'],
  ['CBD packaging boxes', 'CBD Packaging Boxes for Compliance and Shelf Impact', 'label space, child resistance, and brand control', 'cbd-boxes', 'CBD packaging'],
  ['food packaging boxes', 'Food Packaging Boxes for Dry Goods and Multipacks', 'board choice, liners, pack counts, and pallet routes', 'corrugated-boxes', 'food packaging'],
  ['cosmetic packaging boxes', 'Cosmetic Packaging Boxes for Retail Launches', 'colour control, inserts, scuff risk, and samples', 'mailer-boxes', 'cosmetic packaging'],
  ['soap boxes', 'Soap Boxes for Handmade and Retail Brands', 'kraft, windows, sleeves, and moisture handling', 'custom-kraft-boxes', 'soap packaging'],
  ['tea packaging boxes', 'Tea Packaging Boxes for Cartons, Tins, and Pouches', 'aroma protection, retail display, and multipack structure', 'corrugated-boxes', 'tea packaging'],
  ['gift boxes', 'Gift Boxes for Premium Product Bundles', 'rigid formats, inserts, wraps, and shipping protection', 'mailer-boxes', 'gift packaging'],
  ['wholesale packaging boxes', 'Wholesale Packaging Boxes and Reorder Planning', 'MOQ tiers, inventory timing, and multi-SKU quoting', 'corrugated-boxes', 'wholesale packaging'],
  ['printed packaging boxes', 'Printed Packaging Boxes and Brand Colour Control', 'ink systems, coatings, proofing, and approval steps', 'mailer-boxes', 'printed packaging'],
  ['low MOQ packaging', 'Low MOQ Custom Packaging for Test Launches', 'sample runs, digital print, tooling, and reorder timing', 'mailer-boxes', 'low MOQ packaging'],
  ['sustainable packaging', 'Sustainable Packaging Choices Buyers Can Verify', 'FSC, recycled content, PCR film, and documentation', 'corrugated-boxes', 'sustainable packaging'],
  ['packaging design services', 'Packaging Design Services Before Production', 'dielines, samples, artwork checks, and structural review', 'mailer-boxes', 'packaging design'],
  ['ecommerce packaging', 'Ecommerce Packaging for Lower Damage and Better Unboxing', 'mailers, shippers, inserts, and returns', 'mailer-boxes', 'ecommerce packaging'],
  ['industrial packaging', 'Industrial Packaging for Bulk and Pallet Shipments', 'Gaylords, liners, stretch film, and edge protection', 'industrial-bulk-packaging', 'industrial packaging'],
  ['VCI packaging', 'VCI Packaging for Metal Parts and Hardware', 'rust prevention, bags, paper, and moisture control', 'protective-packaging', 'VCI packaging'],
  ['custom product boxes', 'Custom Product Boxes for Launch Kits and Reorders', 'structure, artwork, sampling, and reorder control', 'mailer-boxes', 'product boxes'],
  ['apparel packaging', 'Apparel Packaging for Ecommerce and Retail', 'garment bags, mailers, boxes, and return flow', 'polybags', 'apparel packaging'],
  ['bakery packaging boxes', 'Bakery Packaging Boxes for Fresh and Frozen Programs', 'venting, grease resistance, carton count, and shelf setup', 'corrugated-boxes', 'bakery packaging'],
  ['pharmaceutical packaging', 'Pharmaceutical Packaging for Label Control and Clean Specs', 'tamper evidence, clean materials, and shipment control', 'protective-packaging', 'pharmaceutical packaging'],
  ['shipping supplies', 'Shipping Supplies Buyers Should Standardize', 'cartons, tape, void fill, labels, and pallet wrap', 'industrial-bulk-packaging', 'shipping supplies'],
  ['custom box inserts', 'Custom Box Inserts for Safer Product Presentation', 'corrugated, foam, molded pulp, and assembly labour', 'protective-packaging', 'box inserts'],
  ['luxury packaging boxes', 'Luxury Packaging Boxes for Premium Retail Products', 'rigid board, soft-touch finishes, foil, and inserts', 'mailer-boxes', 'luxury packaging'],
  ['moving and storage boxes', 'Moving and Storage Boxes for Warehouses and Offices', 'board grade, hand holes, labels, and stacking', 'corrugated-boxes', 'storage boxes'],
  ['pallet packaging', 'Pallet Packaging for LTL and Warehouse Loads', 'stretch film, corner boards, top sheets, and load stability', 'industrial-bulk-packaging', 'pallet packaging'],
  ['custom packaging Canada', 'Custom Packaging in Canada for Multi-Location Buyers', 'spec control, freight, samples, and reorder timing', 'corrugated-boxes', 'custom packaging Canada']
];

const editions = [
  ['Procurement Checklist', 'specification control, quote comparison, and supplier questions'],
  ['Cost and MOQ Guide', 'cost drivers, minimum orders, tooling, and reorder planning'],
  ['Material Selection Guide', 'material performance, print compatibility, and product fit'],
  ['Shipping and Damage Guide', 'transit risks, packing efficiency, and damage prevention'],
  ['Artwork and Print Guide', 'dielines, colour control, proofs, and production approval'],
  ['Sustainable Buying Guide', 'verified claims, material reduction, and disposal pathways'],
  ['Launch Planning Guide', 'samples, timelines, inventory, and multi-SKU coordination'],
  ['USA and Canada Buyer Guide', 'regional delivery, documentation, and repeat-order control']
];

const today = process.env.APEX_BLOG_TODAY || pakistanDate(new Date());
const indexSource = await readFile(blogIndex, 'utf8');
const existingDates = [...indexSource.matchAll(/date: '(\d{4}-\d{2}-\d{2})'/g)].map((m) => m[1]);
const existingDateSet = new Set(existingDates);
const datesToPublish = datesBetween(publishFromDate, today)
  .filter((date) => !existingDateSet.has(date))
  .slice(0, maxCatchUp);

if (!datesToPublish.length) {
  console.log(`Daily blog is already current through ${today}.`);
  process.exit(0);
}

await mkdir(blogDir, { recursive: true });

let nextIndex = indexSource;
const published = [];
for (const date of datesToPublish) {
  const post = buildPost(date);
  const artwork = await requireFreshBlogArtwork(root, post.slug);
  post.image = artwork.hero.src;
  post.imageAlt = artwork.hero.alt;
  post.insideImage = artwork.inside.src;
  post.insideAlt = artwork.inside.alt;
  const articlePath = join(blogDir, `${post.slug}.astro`);

  if (!existsSync(articlePath)) {
    const articleSource = renderArticle(post);
    await requireFreshBlogCopy(post.slug, articleSource);
    await writeFile(articlePath, articleSource, 'utf8');
  }
  if (!nextIndex.includes(`slug: '${post.slug}'`)) {
    const entry = `  { slug: '${post.slug}', title: '${post.indexTitle}', description: '${post.description}', date: '${post.date}', read: '7 min' },\n`;
    nextIndex = nextIndex.replace('const posts = [\n', `const posts = [\n${entry}`);
  }
  published.push(post.slug);
}

await writeFile(blogIndex, nextIndex, 'utf8');
console.log(`Published ${published.length} daily blog(s): ${published.join(', ')}`);

if (!nextIndex.includes(`date: '${today}'`)) {
  throw new Error(`Daily blog verification failed: ${today} PKT is still missing from the blog index.`);
}

function buildPost(date) {
  const dayNumber = daysSince(startDate, date);
  const [keyword, titleBase, angle, service, category] = topics[dayNumber % topics.length];
  const cycle = Math.floor(dayNumber / topics.length);
  const [edition, editionAngle] = editions[cycle % editions.length];
  const location = dayNumber % 2 === 0 ? 'Canada' : 'the USA and Canada';
  const datedTitleBase = `${titleBase}: ${edition}`;
  const slug = `${slugify(datedTitleBase)}-${date}`;
  const title = `${datedTitleBase}: ${editionAngle[0].toUpperCase()}${editionAngle.slice(1)}`;
  const indexTitle = `${datedTitleBase} - ${editionAngle}`;
  const description = `A practical ${edition.toLowerCase()} for ${keyword} in ${location}: ${angle}, ${editionAngle}, and production checks before ordering.`;
  return {
    date,
    keyword,
    title,
    titleBase: datedTitleBase,
    indexTitle,
    description,
    slug,
    url: `/blog/${slug}`,
    service: `/services/${service}`,
    category,
    edition,
    editionAngle,
    location,
    angle,
    accent: dayNumber % 3 === 0 ? '#d39a00' : dayNumber % 3 === 1 ? '#111111' : '#6f7f73'
  };
}

function renderArticle(post) {
  return `---
import BaseLayout from '../../layouts/BaseLayout.astro';
import PageHeader from '../../components/sections/PageHeader.astro';
import RelatedContent from '../../components/sections/RelatedContent.astro';
import CTABand from '../../components/sections/CTABand.astro';
import { buildBreadcrumbSchema, buildArticleSchema, buildFAQSchema } from '../../lib/schema';

const title = '${escapeJs(post.title)}';
const description = '${escapeJs(post.description)}';
const url = '${post.url}';
const datePublished = '${post.date}';
const image = '${post.image}';
const insideImage = '${post.insideImage}';

const breadcrumb = buildBreadcrumbSchema([
  { name: 'Home', url: '/' },
  { name: 'Blog', url: '/blog' },
  { name: '${escapeJs(post.titleBase)}', url }
]);
const article = buildArticleSchema({ title, description, url, datePublished, author: 'Apex Packaging Solutions', image });
const faq = buildFAQSchema([
  {
    q: 'What should buyers include in a ${escapeJs(post.keyword)} quote request?',
    a: 'Send dimensions, product weight, material preference, print requirements, quantity, delivery location, sample needs, and any compliance or sustainability requirements.'
  },
  {
    q: 'How does Apex Packaging Solutions help with ${escapeJs(post.keyword)}?',
    a: 'Apex reviews the product, route, artwork, material choices, and reorder plan so buyers can compare cost, protection, presentation, and lead time before production.'
  },
  {
    q: 'When should samples be requested?',
    a: 'Samples should be requested when the product is fragile, the fit is tight, artwork is new, the order is a launch, or the packaging will be used for retail display.'
  }
]);
---
<BaseLayout
  title="${escapeAttr(post.title)}"
  description={description}
  image={image}
  schemaBlocks={[breadcrumb, article, faq]}
>
  <PageHeader
    eyebrow="Knowledge base · ${escapeAttr(post.category)}"
    heading="${escapeAttr(post.indexTitle)}."
    lead="A practical procurement guide for buyers comparing materials, print, protection, lead time, and reorder planning before approving production."
    imageSrc={image}
    imageAlt="${escapeAttr(post.imageAlt)}"
  />

  <section class="py-12 md:py-20">
    <div class="container max-w-default prose-apex">
      <p><strong>${escapeHtml(post.keyword)}</strong> for ${escapeHtml(post.angle)} should be specified around the packed product and the evidence this ${escapeHtml(post.edition.toLowerCase())} needs to produce. A quotation is only comparable when size, versions, route, approval stage, and delivery scope are stated on the same basis.</p>
      <p>For this ${escapeHtml(post.date)} guide, the working question is how ${escapeHtml(post.editionAngle)} affect a ${escapeHtml(post.keyword)} program serving buyers in ${escapeHtml(post.location)}. The sections below turn that question into decisions that can be recorded before production.</p>

      <figure class="my-10 overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-card">
        <img src={insideImage} alt="${escapeAttr(post.insideAlt)}" width="1536" height="1024" loading="lazy" decoding="async" class="w-full" />
      </figure>

      <h2>Define the ${escapeHtml(post.keyword)} job before quoting</h2>
      <p>Record the product dimensions, packed weight, contact surfaces, vulnerable areas, sales channel, and handling sequence. For ${escapeHtml(post.titleBase)}, the brief should also explain which part of ${escapeHtml(post.angle)} is fixed and which part is still being evaluated.</p>
      <p>Name the route that ${escapeHtml(post.keyword)} follows from packing bench to customer or retail shelf. Parcel, courier, LTL, pallet and store replenishment expose this pack to different compression, movement, labels and handling; the recommendation is not defensible when that route is implicit.</p>

      <h2>Match material and print to ${escapeHtml(post.angle)}</h2>
      <p>For ${escapeHtml(post.keyword)}, ask the supplier to identify the proposed substrate, grade or gauge, print process, coatings, finishes and performance assumptions. The combination must support ${escapeHtml(post.angle)}; visual finish does not compensate for weak fit, and excess material does not replace a tested specification.</p>
      <p>Send the ${escapeHtml(post.titleBase)} dieline and artwork revision with colour references, barcode zones and finish notes. When those files are not ready, use <a href="/design-support">packaging design support</a> to coordinate structure and graphics before treating this price as final.</p>

      <h2>Approve evidence for ${escapeHtml(post.editionAngle)}</h2>
      <p>Choose ${escapeHtml(post.keyword)} samples and trials that answer how ${escapeHtml(post.editionAngle)} affect this job. Check fit, assembly, closure, label space, visual hierarchy and packed handling; note which attributes the prototype proves and which still depend on production materials or process.</p>
      <p>Retain the approved ${escapeHtml(post.titleBase)} sample with its dimensions, material callout, print method, finish, artwork revision and packing notes. That dated record becomes the comparison point for the next delivery instead of an undocumented assumption.</p>

      <h2>Quote inputs for ${escapeHtml(post.titleBase)}</h2>
      <ul>
        <li>Product dimensions, weight, photos, and any fragile or scuff-sensitive areas.</li>
        <li>Preferred packaging format, or permission for Apex to recommend one.</li>
        <li>Artwork files, colour expectations, label zones, and barcode placement.</li>
        <li>Quantity, launch timing, reorder frequency, and delivery destination.</li>
        <li>Material preferences, sustainability requirements, or compliance notes.</li>
        <li>Shipping route, pallet pattern, carrier method, and whether samples are needed.</li>
      </ul>

      <h2>Compare ${escapeHtml(post.keyword)} offers on one basis</h2>
      <p>Normalize every ${escapeHtml(post.keyword)} offer for size, material, print coverage, artwork versions, tooling, samples, packing, freight scope and approval timing. Record exclusions beside the unit price; a cheaper line is not a saving when it moves a requirement outside the supplier's scope.</p>
      <p>For the ${escapeHtml(post.date)} buying record, use the related <a href="/blog/custom-packaging-rfq-template-12-specs-buyers-include">custom packaging RFQ details</a> to keep supplier responses tied to the same inputs.</p>

      <h2>Release ${escapeHtml(post.keyword)} with a controlled record</h2>
      <p>Close the ${escapeHtml(post.date)} decision by saving the approved specification, sample identity, artwork revision, quoted assumptions and named approver. That record connects ${escapeHtml(post.angle)} to a repeatable order instead of leaving the next buyer to reconstruct the project.</p>
    </div>
  </section>

  <RelatedContent items={[
    { title: 'Relevant packaging service', href: '${post.service}', description: 'Review Apex packaging options connected to this buyer guide.' },
    { title: 'RFQ checklist', href: '/blog/custom-packaging-rfq-template-12-specs-buyers-include', description: 'See the key specs buyers should send before requesting pricing.' },
    { title: 'Request a Quote', href: '/contact', description: 'Send dimensions, artwork, quantity, and delivery details for production pricing.' }
  ]} />

  <CTABand
    heading="Quote the package around the real product."
    lead="Send your dimensions, artwork, quantity, and route. Apex can help compare material, structure, print, and lead time before production."
    primaryCta={{ label: 'Request a packaging quote', href: '/contact' }}
  />
</BaseLayout>
`;
}

function pakistanDate(date) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Karachi',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
}

function daysSince(start, end) {
  return Math.round((Date.parse(`${end}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`)) / 86400000);
}

function datesBetween(start, end) {
  const dates = [];
  let cursor = start;
  while (cursor <= end) {
    dates.push(cursor);
    cursor = nextDay(cursor);
  }
  return dates;
}

function nextDay(date) {
  return shiftDay(date, 1);
}

function previousDay(date) {
  return shiftDay(date, -1);
}

function shiftDay(date, days) {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function escapeJs(value) {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/"/g, '&quot;');
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function requireFreshBlogCopy(slug, source) {
  const normalize = (value) => value
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
  const paragraphs = [...source.matchAll(/<p(?:\s[^>]*)?>([\s\S]*?)<\/p>/gi)]
    .map((match) => normalize(match[1]))
    .filter((text) => text.length >= 140);
  const existing = new Map();
  for (const filename of await readdir(blogDir)) {
    if (!filename.endsWith('.astro') || filename === `${slug}.astro`) continue;
    const other = await readFile(join(blogDir, filename), 'utf8');
    for (const match of other.matchAll(/<p(?:\s[^>]*)?>([\s\S]*?)<\/p>/gi)) {
      const text = normalize(match[1]);
      if (text.length >= 140 && !existing.has(text)) existing.set(text, filename);
    }
  }
  for (const paragraph of paragraphs) {
    if (existing.has(paragraph)) {
      throw new Error(`${slug}: repeats a long paragraph already published in ${existing.get(paragraph)}.`);
    }
  }
}

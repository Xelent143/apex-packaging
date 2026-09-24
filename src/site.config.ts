export const siteConfig = {
  name: 'Apex Packaging Solutions',
  shortName: 'Apex Packaging',
  url: 'https://apexpackagingsolutions.com',
  description:
    'Apex Packaging Solutions is a Canada-based custom packaging company providing custom boxes, rigid packaging, corrugated mailers, flexible pouches, paper bags and retail packaging for businesses across Canada, the United States and selected international markets. Through qualified overseas production facilities, Apex manages each project from structural design, artwork and sampling through production, quality coordination and doorstep delivery.',
  legalName: 'Apex Packaging Solutions',
  email: 'sales@apexpackagingsolutions.com',
  phone: '+1-905-595-1634',
  phoneDisplay: '905 595 1634',
  phoneHref: 'tel:+19055951634',
  streetAddress: '265 Brunswick Ave',
  addressLocality: 'London',
  addressRegion: 'ON',
  geoRegion: 'CA-ON',
  geoPlacename: 'London, Ontario',
  postalCode: 'N6G 5P8',
  addressCountry: 'CA',
  formattedAddress: '265 Brunswick Ave, London ON N6G 5P8, CANADA',
  defaultOgImage: '/images/home/hero-packaging-banner-apex.webp',
  nav: [
    { label: 'Services', href: '/services' },
    { label: 'Industries', href: '/industries' },
    { label: 'Sustainability', href: '/sustainability' },
    { label: 'Design Support', href: '/design-support' },
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' }
  ],
  servicePages: [
    { slug: 'corrugated-boxes', label: 'Corrugated Boxes' },
    { slug: 'mailer-boxes', label: 'Mailer Boxes' },
    { slug: 'polybags', label: 'Polybags' },
    { slug: 'industrial-bulk-packaging', label: 'Industrial & Bulk' },
    { slug: 'protective-packaging', label: 'Protective Packaging' }
  ],
  offerCatalog: [
    'Folding cartons and retail boxes',
    'Corrugated and mailer boxes',
    'Rigid and magnetic-closure boxes',
    'Custom pouches and Mylar bags',
    'Paper shopping bags',
    'Food, bakery, pastry, cake and confectionery boxes',
    'Window boxes, sleeves, trays and inserts',
    'Custom printing and premium finishing options'
  ]
};

export type SiteConfig = typeof siteConfig;

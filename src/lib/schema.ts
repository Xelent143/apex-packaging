import { siteConfig } from '../site.config';

export function buildOrganizationSchema() {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.svg`,
    email: siteConfig.email,
    description: siteConfig.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.streetAddress,
      addressLocality: siteConfig.addressLocality,
      addressRegion: siteConfig.addressRegion,
      postalCode: siteConfig.postalCode,
      addressCountry: siteConfig.addressCountry
    },
    areaServed: { '@type': 'Country', name: 'Canada' },
    contactPoint: [{
      '@type': 'ContactPoint',
      contactType: 'sales',
      areaServed: 'CA',
      availableLanguage: ['English', 'French']
    }],
    makesOffer: {
      '@type': 'OfferCatalog',
      name: 'Custom packaging services',
      itemListElement: siteConfig.servicePages.map((s) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: s.label,
          areaServed: { '@type': 'Country', name: 'Canada' },
          provider: { '@id': `${siteConfig.url}/#organization` }
        }
      }))
    }
  };

  if (siteConfig.phone) {
    schema.telephone = siteConfig.phone;
  }

  return schema;
}

export function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.shortName,
    publisher: { '@id': `${siteConfig.url}/#organization` },
    inLanguage: 'en-CA'
  };
}

export function buildBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: new URL(item.url, siteConfig.url).href
    }))
  };
}

export function buildServiceSchema(opts: { name: string; description: string; url: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: opts.name,
    description: opts.description,
    url: new URL(opts.url, siteConfig.url).href,
    provider: { '@id': `${siteConfig.url}/#organization` },
    areaServed: { '@type': 'Country', name: 'Canada' }
  };
}

export function buildFAQSchema(faqs: Array<{ q: string; a: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a }
    }))
  };
}

export function buildArticleSchema(opts: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  author: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.title,
    description: opts.description,
    url: new URL(opts.url, siteConfig.url).href,
    datePublished: opts.datePublished,
    author: { '@type': 'Organization', name: opts.author },
    publisher: { '@id': `${siteConfig.url}/#organization` }
  };
}

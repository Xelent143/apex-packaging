import { siteConfig } from '../site.config';

interface MetaInput {
  title: string;
  description: string;
  image?: string;
  canonical?: string;
  url: URL;
}

export function buildMeta(input: MetaInput) {
  const hasBrand = input.title.includes(siteConfig.shortName) || input.title.includes(siteConfig.name);
  const title = hasBrand
    ? input.title
    : input.title.length <= 42
      ? `${input.title} | ${siteConfig.shortName}`
      : input.title;
  const image = input.image
    ? new URL(input.image, siteConfig.url).href
    : new URL(siteConfig.defaultOgImage, siteConfig.url).href;
  const canonical = (input.canonical || input.url.href).replace(/\/$/, '') || siteConfig.url;
  return {
    title,
    description: input.description,
    image,
    canonical,
    siteName: siteConfig.shortName
  };
}

import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import { resolve, join } from 'node:path';

const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const raster = /^\/images\/blog\/[a-z0-9][a-z0-9/_.-]*\.(?:webp|png|jpe?g)$/i;

// A new daily post must have prepared, article-specific raster artwork. Never
// substitute a service image when artwork is missing or reuse it under a new name.
export async function requireFreshBlogArtwork(root, slug) {
  const manifest = join(root, 'content', 'blog-artwork', `${slug}.json`);
  let artwork;
  try { artwork = JSON.parse(await readFile(manifest, 'utf8')); }
  catch (error) { throw new Error(`Fresh blog artwork required for ${slug}. Prepare ${manifest}; no shared-image fallback is permitted.`, { cause: error }); }
  for (const role of ['hero', 'inside']) {
    const asset = artwork[role];
    if (!asset || !raster.test(asset.src) || !asset.alt?.trim()) {
      throw new Error(`${slug}: ${role} needs a local raster image under /images/blog/ and descriptive alt text.`);
    }
    asset.digest = hash(await readFile(resolve(root, 'public', `.${asset.src}`)));
  }
  if (artwork.hero.digest === artwork.inside.digest) throw new Error(`${slug}: banner and inside image must be different artwork.`);
  const blogDir = join(root, 'src', 'pages', 'blog');
  const publishedImages = new Set();
  for (const filename of await readdir(blogDir)) {
    if (!filename.endsWith('.astro') || filename === `${slug}.astro`) continue;
    const source = await readFile(join(blogDir, filename), 'utf8');
    for (const match of source.matchAll(/['"](\/images\/[^'"\s]+\.(?:webp|png|jpe?g))['"]/gi)) publishedImages.add(match[1]);
  }
  for (const src of publishedImages) {
    const digest = hash(await readFile(resolve(root, 'public', `.${src}`)));
    for (const role of ['hero', 'inside']) {
      if (digest === artwork[role].digest) throw new Error(`${slug}: ${role} repeats artwork already used by another article (${src}).`);
    }
  }
  return artwork;
}

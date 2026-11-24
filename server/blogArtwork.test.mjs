import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { requireFreshBlogArtwork } from '../scripts/lib/blog-artwork.mjs';

async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'apex-artwork-test-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  for (const directory of ['content/blog-artwork', 'public/images/blog', 'src/pages/blog']) await mkdir(join(root, directory), { recursive: true });
  const artwork = { hero: { src: '/images/blog/new-hero.webp', alt: 'Printed cartons on a proofing desk' }, inside: { src: '/images/blog/new-detail.webp', alt: 'Close-up of a carton fold' } };
  const manifest = () => writeFile(join(root, 'content/blog-artwork/new-post.json'), JSON.stringify(artwork));
  await writeFile(join(root, 'public/images/blog/new-hero.webp'), 'new hero bytes');
  await writeFile(join(root, 'public/images/blog/new-detail.webp'), 'new detail bytes');
  await manifest();
  return { root, artwork, manifest };
}

test('new post accepts a separate unused banner and inside image', async (t) => {
  const { root } = await fixture(t);
  const artwork = await requireFreshBlogArtwork(root, 'new-post');
  assert.notEqual(artwork.hero.digest, artwork.inside.digest);
});
test('missing artwork blocks publishing rather than selecting a fallback', async (t) => {
  const { root } = await fixture(t);
  await assert.rejects(requireFreshBlogArtwork(root, 'unprepared-post'), /Fresh blog artwork required/);
});
test('a renamed copy of the banner cannot become its inside image', async (t) => {
  const { root } = await fixture(t);
  await writeFile(join(root, 'public/images/blog/new-detail.webp'), 'new hero bytes');
  await assert.rejects(requireFreshBlogArtwork(root, 'new-post'), /banner and inside image must be different/);
});
test('a renamed copy of another article image cannot be published as new artwork', async (t) => {
  const { root } = await fixture(t);
  await writeFile(join(root, 'public/images/blog/old-name.webp'), 'new hero bytes');
  await writeFile(join(root, 'src/pages/blog/existing-post.astro'), "const image = '/images/blog/old-name.webp';");
  await assert.rejects(requireFreshBlogArtwork(root, 'new-post'), /already used by another article/);
});

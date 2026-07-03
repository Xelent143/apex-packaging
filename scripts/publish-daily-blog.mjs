#!/usr/bin/env node
import { existsSync } from 'node:fs';
import { readdir, readFile, writeFile, copyFile, mkdir } from 'node:fs/promises';
import { basename, dirname, join, resolve } from 'node:path';

const root = resolve(new URL('..', import.meta.url).pathname);
const draftsDir = join(root, 'content', 'scheduled-blog-posts');
const blogDir = join(root, 'src', 'pages', 'blog');
const blogIndex = join(blogDir, 'index.astro');
const publicBlogDir = join(root, 'public', 'images', 'blog');

const today = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Karachi',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
}).format(new Date());

if (!existsSync(draftsDir)) {
  console.log(`No scheduled blog drafts directory found at ${draftsDir}.`);
  process.exit(0);
}

const draftFiles = (await readdir(draftsDir))
  .filter((file) => file.endsWith('.json'))
  .sort();

const draftPath = draftFiles
  .map((file) => join(draftsDir, file))
  .find((file) => basename(file).startsWith(today));

if (!draftPath) {
  console.log(`No scheduled blog draft found for ${today} Pakistan time.`);
  process.exit(0);
}

const draft = JSON.parse(await readFile(draftPath, 'utf8'));
const required = ['slug', 'title', 'description', 'date', 'read', 'articleFile', 'imageFile'];
const missing = required.filter((key) => !draft[key]);
if (missing.length) {
  throw new Error(`Scheduled blog draft is missing: ${missing.join(', ')}`);
}

const destinationArticle = join(blogDir, `${draft.slug}.astro`);
if (existsSync(destinationArticle)) {
  console.log(`Blog post already exists: ${draft.slug}`);
  process.exit(0);
}

const sourceArticle = join(dirname(draftPath), draft.articleFile);
const sourceImage = join(dirname(draftPath), draft.imageFile);
const destinationImage = join(publicBlogDir, basename(draft.imageFile));

if (!existsSync(sourceArticle)) {
  throw new Error(`Missing scheduled article file: ${sourceArticle}`);
}
if (!existsSync(sourceImage)) {
  throw new Error(`Missing scheduled image file: ${sourceImage}`);
}

await mkdir(blogDir, { recursive: true });
await mkdir(publicBlogDir, { recursive: true });
await copyFile(sourceArticle, destinationArticle);
await copyFile(sourceImage, destinationImage);

let indexSource = await readFile(blogIndex, 'utf8');
if (!indexSource.includes(`slug: '${draft.slug}'`)) {
  const entry = `  { slug: '${draft.slug}', title: '${draft.title}', description: '${draft.description}', date: '${draft.date}', read: '${draft.read}' },\n`;
  indexSource = indexSource.replace('const posts = [\n', `const posts = [\n${entry}`);
  await writeFile(blogIndex, indexSource);
}

console.log(`Published scheduled blog draft for ${today}: ${draft.slug}`);

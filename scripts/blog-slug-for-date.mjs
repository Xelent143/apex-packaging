#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const date = process.argv[2];
if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) {
  console.error('Usage: node scripts/blog-slug-for-date.mjs YYYY-MM-DD');
  process.exit(1);
}

const source = await readFile(resolve('src/pages/blog/index.astro'), 'utf8');
const entries = source.matchAll(
  /slug: '([^']+)'[^\n]*date: '(\d{4}-\d{2}-\d{2})'/g
);
const match = [...entries].find((entry) => entry[2] === date);

if (!match) {
  console.error(`No blog entry found for ${date}.`);
  process.exit(1);
}

process.stdout.write(match[1]);

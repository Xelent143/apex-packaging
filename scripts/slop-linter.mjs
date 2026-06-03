#!/usr/bin/env node
// Anti-slop linter — scans src/ and content/ for banned phrases.
// Run via: npm run lint:slop
// Fails the build on any hit.

import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '..');

const BANNED = [
  /\bwelcome to\b/i,
  /\bdiscover (our|the)\b/i,
  /\bembark on\b/i,
  /\bunleash\b/i,
  /\bempower\b/i,
  /\byour journey (begins|starts) here\b/i,
  /\bwe are passionate about\b/i,
  /\bworld-class\b/i,
  /\bbest-in-class\b/i,
  /\bindustry-leading\b/i,
  /\bcutting-edge\b/i,
  /\bstate-of-the-art\b/i,
  /\binnovative solutions\b/i,
  /\bbespoke solutions\b/i,
  /\btailored experiences\b/i,
  /\bholistic approach\b/i,
  /\bsynerg(y|istic)\b/i,
  /\bgame[- ]chang(er|ing)\b/i,
  /\brevolutioniz(e|ed|ing)\b/i,
  /\byour trusted partner\b/i,
  /\byour go-to\b/i,
  /\bwe pride ourselves\b/i,
  /\bcommitted to excellence\b/i,
  /\bdedicated to quality\b/i,
  /\bcustomer[- ]centric\b/i,
  /\bthousands of (satisfied|happy) (customers|clients)\b/i,
  /\bcountless (projects|clients)\b/i,
  /\bhow can we help you today\??/i,
  /\bgot questions\?\s*we have answers\.?/i
];

const SCAN_DIRS = ['src', 'content'];
const SCAN_EXT = /\.(md|mdx|astro|html|tsx|ts)$/;

const offenders = [];

for (const dir of SCAN_DIRS) {
  await walk(resolve(ROOT, dir));
}

if (offenders.length) {
  console.error(`\n❌ ${offenders.length} slop phrase(s) found:\n`);
  for (const o of offenders) {
    console.error(`  ${o.file}:${o.line} — "${o.match}"`);
  }
  console.error('\nRewrite these passages. See anti-slop-rules.md.\n');
  process.exit(1);
}

console.log('✓ Slop linter: clean.');

async function walk(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      await walk(p);
    } else if (SCAN_EXT.test(e.name)) {
      await scan(p);
    }
  }
}

async function scan(file) {
  const text = await readFile(file, 'utf8');
  const lines = text.split('\n');
  lines.forEach((line, i) => {
    for (const re of BANNED) {
      const m = line.match(re);
      if (m) offenders.push({ file: file.replace(ROOT + '/', ''), line: i + 1, match: m[0] });
    }
  });
}

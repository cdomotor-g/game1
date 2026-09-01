#!/usr/bin/env node
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { verifyPngBuffer } from './lib/verify-png.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
let files = args.filter((arg) => !arg.startsWith('--')).map((arg) => resolve(arg));

if (!files.length || args.includes('--all')) {
  const dirs = [join(ROOT, 'docs/art/renders'), join(ROOT, 'docs/map')];
  files = dirs.flatMap((dir) => readdirSync(dir)
    .filter((name) => name.toLowerCase().endsWith('.png'))
    .map((name) => join(dir, name)));
}

let failures = 0;
for (const file of files) {
  try {
    const result = verifyPngBuffer(readFileSync(file), file);
    console.log(`ok  ${file}  ${result.width}x${result.height}  ${result.bytes} bytes  sha256:${result.sha256}`);
  } catch (error) {
    failures += 1;
    console.error(`ERROR ${error.message}`);
  }
}

console.log(`${files.length - failures}/${files.length} PNG file(s) fully verified`);
process.exit(failures ? 1 : 0);

#!/usr/bin/env node
/**
 * Land one drawn plate, and prove it landed.
 *
 * This is the ONE definition of what "shipped" means for a plate. The landing
 * workflow (.github/workflows/land-plate.yml) calls it, the retired Hugging
 * Face courier (fetch-plate.yml) calls it, and a person with a checkout calls
 * it - so there is exactly one list of what gets checked and one order it
 * happens in, rather than three that were slightly different.
 *
 *   node tools/ship-art.mjs <plate-id> <source.png> [--branch=main]
 *                           [--wording=<file.txt>] [--quiet]
 *
 * In order:
 *   1. the worktree is clean, so nothing unrelated rides along with the plate;
 *   2. the source PNG is validated whole - every chunk CRC, IEND, the inflated
 *      pixel payload - and its SHA-256 recorded;
 *   3. the plate is a subject the mint knows, and it clears that subject's
 *      pixel FLOOR (data/mint.json, derived per subject by tools/lib/mint.mjs).
 *      Pixels never drawn cannot be added later, so this is the one property
 *      that is refused rather than noted;
 *   4. the bytes are copied in, with the frozen wording beside them if any;
 *   5. tools/mint-build.mjs runs - the short chain a landing plate needs;
 *   6. one commit, pushed to the target branch;
 *   7. the committed blob is read back FROM THE REMOTE and its SHA-256 compared
 *      with the source, then validated whole again.
 *
 * A failure at any point means NOT SHIPPED, and the message says which point.
 * A push that succeeded is not proof of anything: the repository once took a
 * truncated PNG that had a perfect signature and IHDR.
 */
import { copyFileSync, existsSync, readFileSync } from 'node:fs';
import { basename, dirname, isAbsolute, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync, execFileSync } from 'node:child_process';
import { verifyPngBuffer } from './lib/verify-png.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const positional = argv.filter((arg) => !arg.startsWith('--'));
const option = (name) => {
  const hit = argv.find((arg) => arg.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : null;
};
const branch = option('branch') ?? 'main';
const wordingArg = option('wording');
const quiet = argv.includes('--quiet');
const [plate, sourceArg] = positional;

function fail(message) {
  console.error(`ship-art: NOT SHIPPED — ${message}`);
  process.exit(1);
}

function git(args, options = {}) {
  return execFileSync('git', args, {
    cwd: ROOT,
    encoding: options.binary ? null : 'utf8',
    maxBuffer: 256 * 1024 * 1024,
    stdio: options.inherit ? 'inherit' : 'pipe',
  });
}

if (!plate || !sourceArg) fail('usage: node tools/ship-art.mjs <plate-id> <source.png> [--branch=main] [--wording=<file.txt>] [--quiet]');
if (!/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(plate)) fail(`unsafe plate id: ${plate}`);
if (!/^[A-Za-z0-9][A-Za-z0-9._/-]*$/.test(branch)) fail(`unsafe branch: ${branch}`);

const abs = (p) => (isAbsolute(p) ? p : resolve(process.cwd(), p));
const source = abs(sourceArg);
const wording = wordingArg ? abs(wordingArg) : null;
const destination = join(ROOT, 'docs/art/renders', `${plate}.png`);
if (!existsSync(source)) fail(`source does not exist: ${source}`);
if (source === destination) fail('source must be outside the destination path so its bytes remain an independent reference');
if (wording && !existsSync(wording)) fail(`frozen wording does not exist: ${wording}`);

/* 1 · clean worktree */
const status = git(['status', '--porcelain=v1']);
if (status.trim()) fail('worktree is not clean; commit or stash unrelated work before shipping one plate');

/* 2 · the bytes, whole */
const sourceBytes = readFileSync(source);
const sourceInfo = verifyPngBuffer(sourceBytes, source);
console.log(`source verified: ${sourceInfo.width}x${sourceInfo.height}, ${sourceInfo.bytes} bytes, sha256:${sourceInfo.sha256}`);

/* 3 · a subject the mint knows, at or above its floor. The floor is derived per
   subject - a portrait page is asked for more than a square one - and printed
   into the brief's own marker by tools/build-prompts.mjs, so the artist was
   told the same figure this refuses on. */
const { survey } = await import('./lib/mint.mjs');
const found = survey(ROOT);
let hit = null;
for (const entry of found.lines) {
  if (entry.shelved) continue;
  const row = entry.rows.find((r) => r.plate === plate);
  if (row) { hit = { line: entry.line, row }; break; }
}
if (!hit) fail(`\`${plate}\` is not a plate the mint knows. Run node tools/mint-queue.mjs; the plate id is the brief's own heading.`);
if (hit.line.plate.dir !== 'docs/art/renders') fail(`\`${plate}\` lands in ${hit.line.plate.dir}/, which this tool does not ship`);
const longSide = Math.max(sourceInfo.width, sourceInfo.height);
const { min, want, from } = hit.row.size ?? {};
if (min && longSide < min) {
  fail(`${sourceInfo.width}x${sourceInfo.height} is under the ${min} px floor on its long side (${from}). ` +
    'Pixels never drawn cannot be added later: redraw it larger rather than upscaling it.');
}
if (min) {
  console.log(`floor cleared: ${longSide} px on the long side against ${min} px (${from})` +
    (want && longSide < want ? `; under the ${want} px this line would want for print, which is an aspiration, not a fault` : ''));
}

/* 4 · in */
copyFileSync(source, destination);
if (wording) copyFileSync(wording, join(ROOT, 'docs/art/renders', `${plate}.txt`));

/* 5 · the short chain */
const build = spawnSync(process.execPath, [join(ROOT, 'tools/mint-build.mjs'), ...(quiet ? ['--quiet'] : [])], { cwd: ROOT, stdio: 'inherit' });
if (build.status !== 0) {
  git(['checkout', '--', '.']);
  git(['clean', '-fdq', '--', 'docs']);
  fail('mint build failed; nothing was committed or pushed, and the worktree is back as it was');
}

/* 6 · one commit, pushed */
git(['add', '-A'], { inherit: true });
if (!git(['diff', '--cached', '--name-only']).trim()) fail('nothing changed - the identical plate is already committed');
git(['commit', '-q', '-m', `The ${plate} plate lands`, '-m',
  `Source PNG verified before commit: ${sourceInfo.width}x${sourceInfo.height}, ${sourceInfo.bytes} bytes, SHA-256 ${sourceInfo.sha256}.` +
  (min ? ` Clears the ${min} px floor (${from}).` : '')],
  { inherit: true });

git(['push', 'origin', `HEAD:${branch}`], { inherit: true });
git(['fetch', '--quiet', 'origin', branch]);

/* 7 · read back from the remote, not from memory */
let committed;
try {
  committed = git(['show', `origin/${branch}:docs/art/renders/${basename(destination)}`], { binary: true });
} catch (error) {
  fail(`could not read the committed blob back from origin/${branch}: ${error.message}`);
}
const committedInfo = verifyPngBuffer(committed, `origin/${branch}:${plate}.png`);
if (committedInfo.sha256 !== sourceInfo.sha256) {
  fail(`read-back hash mismatch: source ${sourceInfo.sha256}, repository ${committedInfo.sha256}`);
}

const commit = git(['rev-parse', 'HEAD']).trim();
console.log(`ship-art: SHIPPED AND VERIFIED ${plate}`);
console.log(`commit ${commit}`);
console.log(`sha256 ${committedInfo.sha256}`);
console.log(`size   ${committedInfo.width}x${committedInfo.height}`);

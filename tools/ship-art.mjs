#!/usr/bin/env node
import { copyFileSync, existsSync, readFileSync } from 'node:fs';
import { basename, dirname, isAbsolute, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync, execFileSync } from 'node:child_process';
import { verifyPngBuffer } from './lib/verify-png.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const positional = argv.filter((arg) => !arg.startsWith('--'));
const branchArg = argv.find((arg) => arg.startsWith('--branch='));
const branch = branchArg ? branchArg.slice('--branch='.length) : 'main';
const [plate, sourceArg] = positional;

function fail(message) {
  console.error(`ship-art: ${message}`);
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

if (!plate || !sourceArg) fail('usage: node tools/ship-art.mjs <plate-id> <source.png> [--branch=main]');
if (!/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(plate)) fail(`unsafe plate id: ${plate}`);
if (!/^[A-Za-z0-9][A-Za-z0-9._/-]*$/.test(branch)) fail(`unsafe branch: ${branch}`);

const source = isAbsolute(sourceArg) ? sourceArg : resolve(process.cwd(), sourceArg);
const destination = join(ROOT, 'docs/art/renders', `${plate}.png`);
if (!existsSync(source)) fail(`source does not exist: ${source}`);
if (source === destination) fail('source must be outside the destination path so its bytes remain an independent reference');

const status = git(['status', '--porcelain=v1']);
if (status.trim()) fail('worktree is not clean; commit or stash unrelated work before shipping one plate');

const sourceBytes = readFileSync(source);
const sourceInfo = verifyPngBuffer(sourceBytes, source);
console.log(`source verified: ${sourceInfo.width}x${sourceInfo.height}, sha256:${sourceInfo.sha256}`);
copyFileSync(source, destination);

const build = spawnSync(process.execPath, [join(ROOT, 'tools/mint-build.mjs')], { cwd: ROOT, stdio: 'inherit' });
if (build.status !== 0) fail('mint build failed; nothing was committed or pushed');

git(['add', '-A'], { inherit: true });
if (!git(['diff', '--cached', '--name-only']).trim()) fail('nothing changed');
git(['commit', '-m', `The ${plate} plate lands`, '-m',
  `Source PNG verified before commit: ${sourceInfo.width}x${sourceInfo.height}, ${sourceInfo.bytes} bytes, SHA-256 ${sourceInfo.sha256}.`],
  { inherit: true });

git(['push', 'origin', `HEAD:${branch}`], { inherit: true });
git(['fetch', '--quiet', 'origin', branch]);

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

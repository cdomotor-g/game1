#!/usr/bin/env node
/**
 * The hf_jobs call for a plate, printed rather than remembered.
 *
 * Three things about that call are easy to get wrong and each has cost a job:
 *
 *   `with_deps`, NOT `with`. The MCP tool takes the dependency list as
 *   `with_deps`; pass `with` and it is silently dropped, the job starts on a
 *   bare image, and it dies on `ModuleNotFoundError: huggingface_hub` after it
 *   has already been scheduled.
 *
 *   `a100-large`, not l40sx1 - for Qwen-Image, which is 20B and needs 48 GB even
 *   with `enable_model_cpu_offload()`; the smaller flavour queues for hardware
 *   and then fails on memory. A 6B model such as Z-Image loads whole and should
 *   not need the large flavour, but that has not been measured yet, so this
 *   still prints a100-large for everything.
 *
 *   The script comes from tools/hf/draw-plate.py, which loads the model once and
 *   draws every candidate from that one load. Retyping it inline is how you end
 *   up with one job per attempt, which is the thing that emptied the quota.
 *
 * It prints the call; it does not make it. Nothing here can reach
 * huggingface.co - see .github/workflows/fetch-plate.yml for why - so the actual
 * submission is an MCP tool call in the session that runs this.
 *
 *   node tools/mint-job.mjs granary            the draft sheet
 *   node tools/mint-job.mjs granary --final 21 the plate, from the seed that won
 *   node tools/mint-job.mjs granary --model Tongyi-MAI/Z-Image   on another model
 *
 * --model picks a SAMPLER PROFILE in draw-plate.py, not just a checkpoint, and a
 * model with no profile is refused before the download rather than after it.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { survey } from './lib/mint.mjs';

const args = process.argv.slice(2);
const targets = args.filter((a) => !a.startsWith('--'));
const finalAt = args.indexOf('--final');
const seed = finalAt >= 0 ? args[finalAt + 1] : null;
const modelAt = args.indexOf('--model');
const model = modelAt >= 0 ? args[modelAt + 1] : null;
const ROOT = process.cwd();

if (!targets.length) {
  console.error('usage: node tools/mint-job.mjs <tile-id|card-code> [--final <seed>]');
  process.exit(1);
}

const found = survey(ROOT);
const all = found.lines.flatMap((e) => (e.shelved ? [] : e.rows.map((row) => ({ line: e.line, row }))));
const hit = all.find(({ row }) => row.plate === targets[0] || row.code?.toLowerCase() === targets[0].toLowerCase() || row.id === targets[0]);
if (!hit) {
  console.error(`mint-job: \`${targets[0]}\` is not a subject the mint knows. Run node tools/mint-queue.mjs.`);
  process.exit(1);
}

const plate = hit.row.plate;
const script = readFileSync(join(ROOT, 'tools', 'hf', 'draw-plate.py'), 'utf8');
const mode = seed ? 'final' : 'draft';
/* Only the building-tile line has a footprint to derive an envelope from; a card
   is a rectangle and its window is handled by windowNote instead. Saying
   otherwise would be telling the next run its prompt carries a constraint it
   does not. */
const tiles = hit.line.id === 'buildingtiles';

const DEPS = [
  'torch',
  'git+https://github.com/huggingface/diffusers.git',
  'transformers',
  'accelerate',
  'safetensors',
  'sentencepiece',
  'huggingface_hub',
  'pillow',
];

console.log(`# ${plate} · ${mode}${seed ? ` · seed ${seed}` : ''}

Before this, both prompt files must be on the Hub:
  hf://datasets/cdomotor-g/game1-plates/render/${plate}.txt        the positive
  hf://datasets/cdomotor-g/game1-plates/prompts/negative-${plate}.txt   the negative

The positive is what \`node tools/mint-request.mjs ${plate} --render\` prints,
written as one flowing depiction.${tiles ? ` It already carries the shape envelope —
see \`node tools/tile-envelope.mjs ${hit.row.id ?? targets[0]}\` for the box it names.` : ''}

Then call hf_jobs with operation "uv" and these args:
`);

console.log(JSON.stringify({
  flavor: 'a100-large',
  timeout: '1h',
  secrets: { HF_TOKEN: '$HF_TOKEN' },
  with_deps: DEPS,
  env: { PLATE: plate, MODE: mode, ...(seed ? { SEED: String(seed) } : {}), ...(model ? { MODEL: model } : {}) },
  script: '<< the contents of tools/hf/draw-plate.py >>',
}, null, 2));

console.log(`
Pass the script verbatim from tools/hf/draw-plate.py (${script.split('\n').length} lines).
If the runner ignores \`env\`, prepend the assignments instead:

  import os
  os.environ["PLATE"] = ${JSON.stringify(plate)}
  os.environ["MODE"]  = ${JSON.stringify(mode)}${seed ? `\n  os.environ["SEED"]  = ${JSON.stringify(String(seed))}` : ''}${model ? `\n  os.environ["MODEL"] = ${JSON.stringify(model)}` : ''}

${mode === 'draft'
    ? `Then fetch draft/${plate}-sheet.jpg — ONE image with every candidate on it —
and judge it against docs/art/07-ai-agent-brief.md. Reject on the sheet, not on a
full render: composition, a horizon that should not be there, a subject too big
for the die, and rendered text are all visible at draft size.

When one earns it:  node tools/mint-job.mjs ${targets[0]} --final <seed>`
    : `Then dispatch the courier to carry it in:

  actions_run_trigger  run_workflow  fetch-plate.yml  ref: main
    inputs: { "plate": "${plate}" }

and record the run in docs/art/renders/${plate}.attempts.md.`}`);

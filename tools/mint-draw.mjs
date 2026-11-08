#!/usr/bin/env node
/**
 * The plate, without a chat in the middle.
 *
 * The mint's split is real and stays: somebody who can write and cannot draw
 * hands over to somebody who can draw and does not know the rules. What this
 * changes is only who carries the paper. The designer still writes the brief and
 * still aims the plate afterwards; the artist is still a different pair of hands
 * with no idea what a summary strip is - OpenAI's image model, the same artist
 * ChatGPT calls when it draws, reached over the wire instead of through a chat
 * window somebody has to sit in front of.
 *
 * This is what lets `/mint <subject>` run from one sentence to a pushed card with
 * nobody driving ChatGPT: the designer calls this, LOOKS at what comes back,
 * checks it against the list this prints, and lands it with ship-art - or writes
 * the rejection into <plate>.attempts.md and calls this again.
 *
 * WHAT IT SENDS. The --render form of the brief (renderPrompt in lib/mint.mjs),
 * never the commission. A commission carries FRAMING, WINDOW and LABEL BAND
 * blocks written for a person, and an image model draws what it is told: the
 * first warehouse plate came back with the brief lettered across the page. The
 * images API has no negative-prompt field, so the deck's negative list goes in
 * as one closing "Leave out:" sentence - the only place a model can be told it.
 *
 * WHERE IT WRITES. Outside the repository - the system temp folder, or --out.
 * Never docs/art/renders/: a plate is only ever landed by tools/ship-art.mjs,
 * which validates the bytes, refuses a plate under its floor or on the wrong
 * page, builds, pushes and reads the blob back. A tool that wrote straight into
 * renders would be a second, unchecked way in. The wording sent goes beside the
 * PNG as <plate>.txt, ready for ship-art --wording.
 *
 * A MAP cannot be drawn this way: its largest sheet wants 4857 px and a
 * coastline generated in quadrants does not meet in the middle. That is why only
 * the cards and building-tile lines have a `draw` block - see tools/draw-map.mjs.
 *
 * IT DEGRADES, IT DOES NOT BLOCK. No key, no route, or any answer that is not a
 * 200, and it prints the commission and exits 0 - or 3 with --strict, so an
 * unattended run can tell "drawn" from "handed over" by the exit code alone.
 * docs/MINT.md's two-agent handover is the version that is definitely going to
 * work; this is a shortcut through it and a shortcut is not allowed to become a
 * dependency.
 *
 * Usage:
 *   node tools/mint-draw.mjs MOD-01               draw one subject
 *   node tools/mint-draw.mjs MOD-01 --out=x.png   draw it to a named file
 *   node tools/mint-draw.mjs MOD-01 --force       draw one that already has a plate
 *   node tools/mint-draw.mjs MOD-01 --strict      exit 3, not 0, when it hands over
 *   node tools/mint-draw.mjs MOD-01 --dry-run     say what it would do, call nothing
 *
 * Environment:
 *   OPENAI_API_KEY       the key (the name is data/mint.json draw.keyEnv). In a Claude
 *                        Code cloud session it can instead be a network secret for
 *                        api.openai.com, which this session never sees
 *   MINT_IMAGE_MODEL     try another model without editing data/mint.json
 *   MINT_IMAGE_QUALITY   low | medium | high (default: draw.quality, else high)
 *   MINT_ARTIST          codex | api - who draws (default: Codex when it is installed
 *                        and signed in with ChatGPT, otherwise the API)
 */
import { writeFileSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { tmpdir, homedir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { assemble, briefFor, checkList, minLongSideFor, platePath, renderPrompt, survey, windowNote } from './lib/mint.mjs';
import { envelopeNote } from './lib/tiles.mjs';
import { verifyPngBuffer } from './lib/verify-png.mjs';

/* Node's own fetch goes round HTTPS_PROXY unless NODE_USE_ENV_PROXY=1 (Node
   22.21 and later). In a cloud session the OpenAI key is a network secret the
   proxy adds on the way out, so a fetch that skips the proxy arrives with no key
   and gets a 401 that reads exactly like "there is no secret" - which is what the
   first paid draw here reported, while curl, through the proxy, was let straight
   in. So the tool restarts itself with the proxy switched on rather than relying
   on whoever runs it to know. */
if ((process.env.HTTPS_PROXY || process.env.https_proxy) && !process.env.NODE_USE_ENV_PROXY) {
  const again = spawnSync(process.execPath, ['--disable-warning=UNDICI-EHPA', ...process.execArgv, ...process.argv.slice(1)],
    { stdio: 'inherit', env: { ...process.env, NODE_USE_ENV_PROXY: '1' } });
  process.exit(again.status ?? 1);
}

const args = process.argv.slice(2);
const flag = (n) => args.includes(`--${n}`);
const valueOf = (n) => args.find((a) => a.startsWith(`--${n}=`))?.slice(n.length + 3) ?? null;
const targets = args.filter((a) => !a.startsWith('--'));
const ROOT = process.cwd();
const HANDED_OVER = flag('strict') ? 3 : 0;

const found = survey(ROOT);
const all = found.lines.flatMap((e) => (e.shelved ? [] : e.rows.map((row) => ({ line: e.line, row }))));

if (!targets.length) {
  console.error('mint-draw: name a card code or a plate id. Run node tools/mint-queue.mjs to see what is waiting.');
  process.exit(1);
}
if (targets.length > 1 && valueOf('out')) {
  console.error('mint-draw: --out names one file, so it takes one subject.');
  process.exit(1);
}

/* The commission, printed where a person can pick it up. Every path out of this
   tool that is not a drawn plate ends here, because the work still has to be
   possible - it just has to be done the long way. */
function handOver(line, row, commission, why) {
  console.error(`\nmint-draw: ${why}`);
  console.error('Falling back to the two-agent handover. Hand this to the artist (or run');
  console.error(`node tools/mint-request.mjs ${row.code} for the full commission with its check);`);
  console.error(`the plate lands through the inbox branch plate/${row.plate} or node tools/ship-art.mjs.\n`);
  console.log(commission);
  console.error(`\nmint-draw: RESULT handed-over ${row.plate}`);
  process.exit(HANDED_OVER);
}

/* WHO DRAWS. Two artists, the same OpenAI image model behind both:

   codex - Codex's built-in image tool, on the ChatGPT plan's own allowance, no
           API key and no per-picture bill. Driven with `codex exec`: Codex is an
           agent, so it is told in plain words to make one image from a prompt
           file, and the PNG is then taken from Codex's own folder of generated
           images, by the tool, untouched. Page SHAPE can only be asked for in
           words, so the size is whatever the tool makes for that shape - so far
           1536 x 1024 for a landscape page.
   api   - the images API with a key (OPENAI_API_KEY or a network secret), billed
           per picture, size and quality set exactly from data/mint.json.

   MINT_ARTIST=codex|api picks one. Unset, Codex is used when it is installed and
   signed in with ChatGPT, because it costs nothing extra; otherwise the API. */
function codexStatus() {
  const r = spawnSync('codex', ['login', 'status'], { encoding: 'utf8', timeout: 30_000 });
  if (r.error) return { ok: false, why: 'Codex is not installed here (npm install -g @openai/codex)' };
  const text = `${r.stdout ?? ''}${r.stderr ?? ''}`;
  if (/logged in using chatgpt/i.test(text)) return { ok: true };
  if (/logged in/i.test(text)) return { ok: false, why: 'Codex is signed in with an API key, not ChatGPT' };
  return { ok: false, why: 'Codex is not signed in (codex login --device-auth, approved on the person\'s phone)' };
}

let picked = null;
let apiUsage = null;
function pickArtist() {
  if (picked) return picked;
  const asked = (process.env.MINT_ARTIST ?? '').toLowerCase();
  if (asked === 'api') return (picked = { id: 'api' });
  const codex = codexStatus();
  if (codex.ok) return (picked = { id: 'codex' });
  if (asked === 'codex') return (picked = { id: 'codex', unavailable: codex.why });
  return (picked = { id: 'api', note: `not Codex: ${codex.why}` });
}

/* The page shape as words, from the declared size - the only way to ask
   Codex's image tool for one. */
function shapeWords(size) {
  const [w, h] = String(size).split('x').map(Number);
  const r = w / h;
  if (r > 1.15) return 'landscape, 3:2 - wider than it is tall';
  if (r < 0.87) return 'portrait, 2:3 - taller than it is wide';
  return 'square, 1:1';
}

function newestPng(dir, since) {
  let best = null;
  const walk = (d) => {
    let entries = [];
    try { entries = readdirSync(d, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      const p = join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (/\.png$/i.test(e.name)) {
        const t = statSync(p).mtimeMs;
        if (t >= since && (!best || t > best.t)) best = { p, t };
      }
    }
  };
  walk(dir);
  return best?.p ?? null;
}

function drawWithCodex(row, prompt, shape) {
  if (picked.unavailable) return { error: `MINT_ARTIST=codex, but ${picked.unavailable}.` };
  const work = mkdtempSync(join(tmpdir(), `mint-codex-${row.plate}-`));
  writeFileSync(join(work, 'image-prompt.txt'), `${prompt}\n`);
  const task = [
    'Use your built-in image generation tool (image_gen) to generate exactly ONE image.',
    'Do not use any script, Python, or the OpenAI API, and do not ask questions.',
    '',
    'The image prompt is the whole content of the file image-prompt.txt in the current folder.',
    'Pass it to the image tool verbatim - unchanged, unshortened, nothing added.',
    '',
    `Page shape: ${shape}, at the largest size the tool offers.`,
    '',
    'Do not copy, move, edit, resize or convert the image afterwards. Reply with one line:',
    'the absolute path of the PNG the tool saved. Do nothing else.',
  ].join('\n');

  const home = process.env.CODEX_HOME || join(homedir(), '.codex');
  const since = Date.now() - 2000;
  console.error(`mint-draw: ${row.code} — Codex image tool, ${shape}. This takes a minute or two…`);
  const r = spawnSync('codex', ['exec', '--skip-git-repo-check', '-s', 'workspace-write', '-C', work, task],
    { encoding: 'utf8', timeout: 15 * 60_000, maxBuffer: 64 * 1024 * 1024 });
  writeFileSync(join(work, 'codex.log'), `${r.stdout ?? ''}\n${r.stderr ?? ''}`);
  const tail = `${r.stdout ?? ''}${r.stderr ?? ''}`.trim().split('\n').slice(-6).join(' | ');
  if (r.error) return { error: `Codex did not finish — ${r.error.message}. Its log is ${join(work, 'codex.log')}.` };

  /* Taken from Codex's own folder, never from a copy Codex made: the master is
     the generator's own output, and an agent asked to copy a file can also
     decide to convert it. */
  const file = newestPng(join(home, 'generated_images'), since);
  if (!file) return { error: `Codex finished (exit ${r.status}) without a new image in ${join(home, 'generated_images')}. Last lines: ${tail}` };
  return { bytes: readFileSync(file) };
}

/* Two places a key can be. An environment variable is one; the other is a
   NETWORK SECRET on a Claude Code cloud environment, which the agent proxy
   attaches to requests for api.openai.com after they leave the session - so
   the key is never inside the session at all, which is the safer of the two
   and the one Claude Code's docs recommend. In a cloud session with no
   variable set, try anyway with no Authorization header and let the proxy
   add it; a 401 back means there is no secret either, and that is said. */
async function drawWithApi(line, row, commission, draw, { model, quality, size, prompt, note }) {
  const key = process.env[draw.keyEnv];
  const viaProxy = !key && process.env.CLAUDE_CODE_REMOTE === 'true';
  const also = note ? ` (${note})` : '';
  if (!key && !viaProxy) handOver(line, row, commission, `${draw.keyEnv} is not set in this environment${also}.`);

  /* Streamed, with draw.partialImages rough previews on the way, so the line is
     never silent: a cloud session's proxy closed a silent high-quality request at
     about thirty seconds with a 502, twice, while a ten-second one went through.
     The previews are thrown away; only the finished picture is kept. */
  const partials = draw.partialImages ?? 0;
  console.error(`mint-draw: ${row.code} — ${model} at ${size}, quality ${quality}, streamed with ${partials} preview(s). This takes a minute or three…`);
  let res;
  try {
    res = await fetch(draw.endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...(key ? { authorization: `Bearer ${key}` } : {}) },
      body: JSON.stringify({ model, prompt, size, quality, n: 1, stream: true, partial_images: partials }),
      signal: AbortSignal.timeout(10 * 60 * 1000),
    });
  } catch (err) {
    handOver(line, row, commission, `could not reach ${draw.endpoint} — ${err.cause?.code ?? err.message}. If this is an egress policy denial, the host has to be allowed rather than worked around.`);
  }

  if (!res.ok) {
    /* Say what the API said. A bare "400" sent the last person to look at this
       guessing between a size the model does not take, a key with no credit and
       a prompt the moderation filter did not like. */
    let detail = '';
    try { detail = (await res.json())?.error?.message ?? ''; } catch { /* not JSON */ }
    if (viaProxy && res.status === 401) {
      handOver(line, row, commission, `there is no OpenAI key: ${draw.keyEnv} is not set, and no network secret for api.openai.com was attached${also}. docs/MINT-SETUP.md §2 says where to add one.`);
    }
    handOver(line, row, commission, `${draw.endpoint} answered ${res.status} ${res.statusText}${detail ? ` — ${detail.replace(/\.$/, '')}` : ''}${also}.`);
  }

  /* A streamed answer is server-sent events: blocks split by a blank line, each
     with a `data:` line of JSON. The last one, image_generation.completed, carries
     the picture and the usage. A plain JSON answer is still read, in case a model
     or a gateway ignores `stream`. */
  let body;
  if (/event-stream/i.test(res.headers.get('content-type') ?? '')) {
    const dec = new TextDecoder();
    let buf = '';
    let seen = 0;
    const take = (block) => {
      const data = block.split('\n').filter((l) => l.startsWith('data:')).map((l) => l.slice(5).trimStart()).join('\n');
      if (!data || data === '[DONE]') return;
      let ev;
      try { ev = JSON.parse(data); } catch { return; }
      if (ev.type === 'image_generation.partial_image') console.error(`mint-draw: preview ${++seen} of ${partials} arrived…`);
      else if (ev.type === 'image_generation.completed') body = { data: [{ b64_json: ev.b64_json }], usage: ev.usage };
      else if (ev.type === 'error' || ev.error) {
        handOver(line, row, commission, `${draw.endpoint} stopped mid-stream — ${ev.error?.message ?? ev.message ?? JSON.stringify(ev).slice(0, 200)}${also}.`);
      }
    };
    try {
      for await (const chunk of res.body) {
        buf += dec.decode(chunk, { stream: true }).replace(/\r\n/g, '\n');
        let cut;
        while ((cut = buf.indexOf('\n\n')) >= 0) { take(buf.slice(0, cut)); buf = buf.slice(cut + 2); }
      }
      if (buf.trim()) take(buf);
    } catch (err) {
      handOver(line, row, commission, `the stream from ${draw.endpoint} broke after ${seen} preview(s) — ${err.cause?.code ?? err.message}${also}.`);
    }
  } else {
    body = await res.json();
  }
  const b64 = body?.data?.[0]?.b64_json;
  if (!b64) handOver(line, row, commission, 'the response carried no image.');
  /* What the picture used, as the API counts it, so the cost of a plate can be
     read off the run rather than guessed. Tokens, not dollars: the price per
     token is OpenAI's to change, and a figure typed here would go stale. */
  const u = body.usage;
  if (u) {
    const img = u.input_tokens_details?.image_tokens ?? 0;
    const txt = u.input_tokens_details?.text_tokens ?? (u.input_tokens ?? 0) - img;
    apiUsage = `${u.output_tokens ?? '?'} image tokens out, ${txt} text${img ? ` + ${img} image` : ''} tokens in`;
  }
  return Buffer.from(b64, 'base64');
}

for (const target of targets) {
  const hit = all.find(({ row }) => row.code.toLowerCase() === target.toLowerCase() || row.plate === target);
  if (!hit) {
    console.error(`mint-draw: \`${target}\` is not a subject the mint knows.`);
    process.exit(1);
  }
  const { line, row } = hit;

  const brief = briefFor(ROOT, line.brief.dir, row.briefFile ?? line.brief.file, row.plate);
  if (!brief) {
    console.error(`mint-draw: ${row.code} has no brief yet — it is at step WRITE. Write \`## ${row.plate}\` into ${line.brief.dir}/${row.briefFile ?? line.brief.file} first.`);
    process.exit(1);
  }
  if (!brief.aimBlock) {
    console.error(`mint-draw: ${row.code} has no ${line.aim.step} block, so the crop would be pot luck. ${line.aim.contract} says what one has to say.`);
    process.exit(1);
  }

  if (existsSync(join(ROOT, platePath(line, row))) && !flag('force')) {
    console.error(`mint-draw: ${platePath(line, row)} already exists. --force to draw it again.`);
    continue;
  }

  /* Two prompts off one brief, exactly as tools/mint-request.mjs builds them:
     the commission for a person if this has to hand over, and the depiction for
     the model if it does not. The tile's envelope is derived from its footprint
     and is the one composition rule that can be said as a thing to draw. */
  const carriesCut = /^(WINDOW|LABEL BAND)\./m.test(brief.subject);
  const commission = assemble(brief, carriesCut ? null : windowNote(ROOT, line, row));
  const corner = line.id === 'buildingtiles' && row.tile?.cells ? envelopeNote(row.tile.cells, 1, { figures: false }) : null;
  const render = renderPrompt(brief, { cornerNote: corner });
  const prompt = render.negative ? `${render.positive}\n\nLeave out: ${render.negative}.` : render.positive;

  const draw = line.draw;
  if (!draw) handOver(line, row, commission, `the ${line.id} line has no \`draw\` block — it is not drawn this way on purpose. See data/mint.json.`);

  const size = draw.sizeByFormat?.[row.format];
  if (!size) {
    handOver(line, row, commission,
      `no size is declared for the \`${row.format}\` format in data/mint.json lines.${line.id}.draw.sizeByFormat, and the plate's proportion is what the framing arithmetic is built on — it will not be guessed.`);
  }

  const model = process.env.MINT_IMAGE_MODEL || draw.model;
  const quality = process.env.MINT_IMAGE_QUALITY || draw.quality || 'high';
  const { min, want } = minLongSideFor(ROOT, line, row);
  const out = resolve(valueOf('out') ?? join(tmpdir(), 'mint-draw', `${row.plate}.png`));
  const wording = out.replace(/\.png$/i, '') + '.txt';
  const artist = pickArtist();

  if (flag('dry-run')) {
    const who = artist.id === 'codex' ? 'Codex image tool (ChatGPT sign-in)' : `${model} at ${size}, quality ${quality}`;
    console.log(`${row.code}  ${row.plate}\n  artist: ${who}${artist.note ? ` - ${artist.note}` : ''}\n  page ${row.format} -> ${out}\n  floor ${min} px, print ${want} px\n  ${prompt.split('\n').length} lines of prompt; moved out of it: ${render.moved.length}`);
    continue;
  }

  let bytes;
  if (artist.id === 'codex') {
    const got = drawWithCodex(row, prompt, shapeWords(size));
    if (got.error) handOver(line, row, commission, got.error);
    bytes = got.bytes;
  } else {
    bytes = await drawWithApi(line, row, commission, draw, { model, quality, size, prompt, note: artist.note });
  }

  /* Checked here, from the bytes, rather than trusted from the size asked for:
     a model is allowed to return a different size than requested, and the
     floor is about what arrived. ship-art checks all of it again. */
  let png;
  try { png = verifyPngBuffer(bytes, row.plate); } catch (err) {
    handOver(line, row, commission, `the image that came back is not a whole PNG — ${err.message}.`);
  }

  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, bytes);
  writeFileSync(wording, `${prompt}\n`);
  /* The artist goes in the report, not the wording file: ship-art commits the
     wording beside the plate as the prompt that made it, and nothing else. */

  const longSide = Math.max(png.width, png.height);
  const sizeNote = longSide < min ? `UNDER the ${min} px floor - ship-art will refuse it`
    : longSide < want ? `clears the ${min} px floor, under the ${want} px print want` : `clears the ${want} px print want`;

  const checks = checkList(brief, { format: row.format ?? line.plate.format ?? null, minLongSide: min || 0, cornerNote: corner });
  console.log(`DRAWN ${row.code} · ${row.plate}
  file      ${out}
  wording   ${wording}
  artist    ${artist.id === 'codex' ? 'Codex image tool, ChatGPT sign-in' : `${model}, quality ${quality}`}
${apiUsage ? `  usage     ${apiUsage}\n` : ''}  size      ${png.width}x${png.height} (${sizeNote}), ${png.bytes} bytes, sha256 ${png.sha256}

LOOK AT IT, then check it against every item. One failure is a rejection: write
the wording and the one reason into docs/art/renders/${row.plate}.attempts.md and
draw again. Fix the brief if two attempts fail the same way.

${checks.map((c, n) => `${String(n + 1).padStart(2)}. ${c}`).join('\n')}

Accepted:  node tools/ship-art.mjs ${row.plate} ${out} --wording=${wording}`);
  console.error(`mint-draw: RESULT drawn ${row.plate}`);
}

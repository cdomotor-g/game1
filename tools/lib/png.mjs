/**
 * A PNG reader with no dependencies.
 *
 * Why this exists rather than `npm i sharp`: the whole repository runs on a bare
 * `node tools/*.mjs` with no install step, and the only thing the map pipeline
 * needs from a PNG is "give me the colour at (x, y)". That is one zlib inflate
 * and one unfilter pass, both of which node already has. A native image library
 * would be the single heaviest dependency in a project that currently has none.
 *
 * Handles the 8-bit non-interlaced truecolour and greyscale forms, with or
 * without alpha, and 16-bit by dropping the low byte. Palette images (colour
 * type 3) are expanded from PLTE. Interlaced (Adam7) images are rejected loudly
 * rather than decoded wrongly.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { inflateSync, deflateSync } from 'node:zlib';

const SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

/** Bytes per complete pixel, for the filter step. Always at least 1. */
function bytesPerPixel(colourType, bitDepth) {
  const channels = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[colourType];
  if (channels === undefined) throw new Error(`unsupported PNG colour type ${colourType}`);
  return Math.max(1, (channels * bitDepth) / 8);
}

function paethPredictor(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

/**
 * Reverses the five PNG scanline filters in place, returning raw scanlines with
 * the leading filter byte stripped.
 */
function unfilter(data, height, scanlineBytes, bpp) {
  const out = Buffer.alloc(height * scanlineBytes);
  let src = 0;
  for (let y = 0; y < height; y++) {
    const filter = data[src++];
    const row = y * scanlineBytes;
    const prev = row - scanlineBytes;
    for (let i = 0; i < scanlineBytes; i++) {
      const raw = data[src + i];
      const a = i >= bpp ? out[row + i - bpp] : 0;
      const b = y > 0 ? out[prev + i] : 0;
      const c = y > 0 && i >= bpp ? out[prev + i - bpp] : 0;
      let value;
      switch (filter) {
        case 0: value = raw; break;
        case 1: value = raw + a; break;
        case 2: value = raw + b; break;
        case 3: value = raw + ((a + b) >> 1); break;
        case 4: value = raw + paethPredictor(a, b, c); break;
        default: throw new Error(`unknown PNG filter type ${filter} on row ${y}`);
      }
      out[row + i] = value & 0xff;
    }
    src += scanlineBytes;
  }
  return out;
}

/**
 * Reads a PNG into `{ width, height, rgb }`, where `rgb` is a flat
 * Uint8Array of three bytes per pixel in row-major order. Alpha is composited
 * onto white, because every input this pipeline sees is an opaque map plate and
 * carrying a fourth channel around would only complicate the samplers.
 */
export function readPng(path) {
  const buf = readFileSync(path);
  if (!buf.subarray(0, 8).equals(SIGNATURE)) throw new Error(`${path} is not a PNG`);

  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colourType = 0;
  let palette = null;
  const idat = [];

  let offset = 8;
  while (offset < buf.length) {
    const length = buf.readUInt32BE(offset);
    const type = buf.toString('ascii', offset + 4, offset + 8);
    const body = buf.subarray(offset + 8, offset + 8 + length);
    offset += 12 + length; // length + type + data + crc

    if (type === 'IHDR') {
      width = body.readUInt32BE(0);
      height = body.readUInt32BE(4);
      bitDepth = body[8];
      colourType = body[9];
      if (body[12] !== 0) throw new Error('interlaced PNGs are not supported');
    } else if (type === 'PLTE') {
      palette = Buffer.from(body);
    } else if (type === 'IDAT') {
      idat.push(Buffer.from(body));
    } else if (type === 'IEND') {
      break;
    }
  }

  if (!width || !height) throw new Error(`${path}: no IHDR`);
  if (bitDepth !== 8 && bitDepth !== 16) {
    throw new Error(`${path}: only 8- and 16-bit PNGs are supported, got ${bitDepth}`);
  }

  const bpp = bytesPerPixel(colourType, bitDepth);
  const channels = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[colourType];
  const scanlineBytes = Math.ceil((channels * bitDepth * width) / 8);
  const raw = unfilter(inflateSync(Buffer.concat(idat)), height, scanlineBytes, bpp);

  const step = bitDepth === 16 ? 2 : 1;
  const rgb = new Uint8Array(width * height * 3);
  for (let y = 0; y < height; y++) {
    const row = y * scanlineBytes;
    for (let x = 0; x < width; x++) {
      const src = row + x * channels * step;
      const dst = (y * width + x) * 3;
      let r;
      let g;
      let b;
      let a = 255;
      if (colourType === 0) {
        r = g = b = raw[src];
      } else if (colourType === 4) {
        r = g = b = raw[src];
        a = raw[src + step];
      } else if (colourType === 3) {
        const index = raw[src] * 3;
        r = palette[index];
        g = palette[index + 1];
        b = palette[index + 2];
      } else {
        r = raw[src];
        g = raw[src + step];
        b = raw[src + 2 * step];
        if (colourType === 6) a = raw[src + 3 * step];
      }
      if (a !== 255) {
        const k = a / 255;
        r = Math.round(r * k + 255 * (1 - k));
        g = Math.round(g * k + 255 * (1 - k));
        b = Math.round(b * k + 255 * (1 - k));
      }
      rgb[dst] = r;
      rgb[dst + 1] = g;
      rgb[dst + 2] = b;
    }
  }

  return { width, height, rgb };
}

/** Colour at a pixel, clamped to the image bounds. */
export function pixel(image, x, y) {
  const px = Math.min(image.width - 1, Math.max(0, Math.round(x)));
  const py = Math.min(image.height - 1, Math.max(0, Math.round(y)));
  const i = (py * image.width + px) * 3;
  return [image.rgb[i], image.rgb[i + 1], image.rgb[i + 2]];
}

/** sRGB to HSL, with hue in degrees and the rest 0..1. */
export function rgbToHsl(r, g, b) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  const d = max - min;
  if (d === 0) return [0, 0, l];
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) * 60;
  else if (max === gn) h = ((bn - rn) / d + 2) * 60;
  else h = ((rn - gn) / d + 4) * 60;
  return [h, s, l];
}

/**
 * Writes `{ width, height, rgb }` back out as an 8-bit truecolour PNG.
 *
 * Only the proof sheets use this — the published map is the artwork as supplied,
 * never a re-encode. Scanlines are filtered adaptively by the minimum-sum-of-
 * absolute-differences heuristic from the PNG spec. On a proof sheet — a painted
 * plate under flat hex tints — that is worth about 10%, which is what filtering
 * buys you on content that is essentially photographic; it is a bigger win on the
 * flat-colour images this writer is likelier to be pointed at next.
 */
export function writePng(path, image) {
  const { width, height, rgb } = image;
  const stride = width * 3;
  const bpp = 3;
  const raw = Buffer.alloc(height * (stride + 1));
  const candidate = Buffer.alloc(stride);
  let prev = Buffer.alloc(stride);

  for (let y = 0; y < height; y++) {
    const line = Buffer.from(rgb.buffer, rgb.byteOffset + y * stride, stride);
    let bestType = 0;
    let bestScore = Infinity;
    let best = null;

    for (let type = 0; type <= 4; type++) {
      let score = 0;
      for (let i = 0; i < stride; i++) {
        const a = i >= bpp ? line[i - bpp] : 0;
        const b = prev[i];
        const c = i >= bpp ? prev[i - bpp] : 0;
        let v;
        switch (type) {
          case 0: v = line[i]; break;
          case 1: v = line[i] - a; break;
          case 2: v = line[i] - b; break;
          case 3: v = line[i] - ((a + b) >> 1); break;
          default: v = line[i] - paethPredictor(a, b, c);
        }
        candidate[i] = v & 0xff;
        /* Signed magnitude, per the spec's filter-selection heuristic. */
        score += candidate[i] < 128 ? candidate[i] : 256 - candidate[i];
      }
      if (score < bestScore) {
        bestScore = score;
        bestType = type;
        best = Buffer.from(candidate);
      }
    }

    const dst = y * (stride + 1);
    raw[dst] = bestType;
    best.copy(raw, dst + 1);
    prev = line;
  }

  const chunk = (type, body) => {
    const out = Buffer.alloc(body.length + 12);
    out.writeUInt32BE(body.length, 0);
    out.write(type, 4, 'ascii');
    body.copy(out, 8);
    out.writeInt32BE(crc32(out.subarray(4, 8 + body.length)) | 0, 8 + body.length);
    return out;
  };

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // truecolour
  writeFileSync(
    path,
    Buffer.concat([
      SIGNATURE,
      chunk('IHDR', ihdr),
      chunk('IDAT', deflateSync(raw, { level: 9 })),
      chunk('IEND', Buffer.alloc(0)),
    ])
  );
}

const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

/** Rec.709 luminance, 0..255. The same measure docs/art/palette.json quotes. */
export function luminance(r, g, b) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

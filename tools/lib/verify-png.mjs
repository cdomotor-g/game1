import { inflateSync } from 'node:zlib';
import { createHash } from 'node:crypto';

const SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const CHANNELS = new Map([[0, 1], [2, 3], [3, 1], [4, 2], [6, 4]]);

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (const byte of buf) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

export function sha256(buf) {
  return createHash('sha256').update(buf).digest('hex');
}

export function verifyPngBuffer(buf, label = 'PNG') {
  if (!Buffer.isBuffer(buf)) throw new TypeError(`${label}: expected a Buffer`);
  if (buf.length < 33) throw new Error(`${label}: only ${buf.length} bytes`);
  if (!buf.subarray(0, 8).equals(SIGNATURE)) throw new Error(`${label}: invalid PNG signature`);

  let offset = 8;
  let chunks = 0;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colourType = -1;
  let interlace = -1;
  let sawIhdr = false;
  let sawIdat = false;
  let sawIend = false;
  const idat = [];

  while (offset < buf.length) {
    if (offset + 12 > buf.length) throw new Error(`${label}: truncated chunk header at byte ${offset}`);
    const length = buf.readUInt32BE(offset);
    const end = offset + 12 + length;
    if (end > buf.length) throw new Error(`${label}: truncated chunk at byte ${offset}`);

    const type = buf.toString('ascii', offset + 4, offset + 8);
    const typedBody = buf.subarray(offset + 4, offset + 8 + length);
    const storedCrc = buf.readUInt32BE(offset + 8 + length);
    const actualCrc = crc32(typedBody);
    if (storedCrc !== actualCrc) throw new Error(`${label}: ${type} CRC mismatch at byte ${offset}`);

    chunks += 1;
    if (chunks === 1 && type !== 'IHDR') throw new Error(`${label}: IHDR is not the first chunk`);
    if (type === 'IHDR') {
      if (sawIhdr || length !== 13) throw new Error(`${label}: invalid IHDR`);
      sawIhdr = true;
      width = buf.readUInt32BE(offset + 8);
      height = buf.readUInt32BE(offset + 12);
      bitDepth = buf[offset + 16];
      colourType = buf[offset + 17];
      interlace = buf[offset + 20];
      if (!width || !height) throw new Error(`${label}: zero image dimension`);
      if (!CHANNELS.has(colourType)) throw new Error(`${label}: unsupported colour type ${colourType}`);
      if (![1, 2, 4, 8, 16].includes(bitDepth)) throw new Error(`${label}: invalid bit depth ${bitDepth}`);
      if (interlace !== 0) throw new Error(`${label}: interlaced PNGs are not supported by the repository`);
    } else if (type === 'IDAT') {
      if (!sawIhdr || sawIend) throw new Error(`${label}: IDAT in an invalid position`);
      sawIdat = true;
      idat.push(buf.subarray(offset + 8, offset + 8 + length));
    } else if (type === 'IEND') {
      if (length !== 0 || sawIend) throw new Error(`${label}: invalid IEND`);
      sawIend = true;
      offset = end;
      break;
    }
    offset = end;
  }

  if (!sawIhdr) throw new Error(`${label}: missing IHDR`);
  if (!sawIdat) throw new Error(`${label}: missing IDAT`);
  if (!sawIend) throw new Error(`${label}: missing IEND`);
  if (offset !== buf.length) throw new Error(`${label}: ${buf.length - offset} trailing byte(s) after IEND`);

  let raw;
  try {
    raw = inflateSync(Buffer.concat(idat));
  } catch (error) {
    throw new Error(`${label}: compressed image data does not fully decode: ${error.message}`);
  }
  const channels = CHANNELS.get(colourType);
  const scanlineBytes = Math.ceil(width * channels * bitDepth / 8);
  const expected = height * (scanlineBytes + 1);
  if (raw.length !== expected) {
    throw new Error(`${label}: decoded image data is ${raw.length} bytes; expected ${expected}`);
  }
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (scanlineBytes + 1)];
    if (filter > 4) throw new Error(`${label}: invalid row filter ${filter} on row ${y}`);
  }

  return { width, height, bytes: buf.length, sha256: sha256(buf) };
}

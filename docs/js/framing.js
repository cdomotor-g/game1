/*
 * Cropping a plate around its subject.
 *
 * The plates in docs/art/renders/ are whole drawn pages — A4 proportions for the
 * figures, square for the talismans, 3:2 for the vehicles — and nothing that
 * shows one is that shape. A card window is nearly square, a deck thumbnail is
 * 5:4. Something is thrown away either way; the only question is what, and "the
 * middle of the file" is the wrong answer. It is what used to put a character's
 * chin at the top edge of their own card.
 *
 * docs/art/framing.json answers it per plate: a `subject` box that must survive.
 * `crop()` grows that box out to the window's shape — never shrinks it, unless
 * the plate itself runs out — and slides the result back onto the page.
 *
 * Rectangles are [x, y, w, h] or {x, y, w, h} in fractions of the plate, 0..1
 * from its top-left. The only pixels involved are the plate's own dimensions,
 * which are what say whether it is a tall page or a wide one.
 *
 * This file is the one copy of that arithmetic. The explorer loads it as a
 * script; tools/lib/framing.mjs loads it through a shim, the way
 * tools/simulate.mjs loads the engine, so that a card and a thumbnail of the
 * same plate can never disagree about where the subject is.
 */
(function (global) {
  'use strict';

  /** The whole page, for a plate nobody has framed yet. */
  const WHOLE_PLATE = [0, 0, 1, 1];

  /** Where a focal point lands in the window when nothing says otherwise:
      a little above centre, which is where a reader looks first and where a
      face belongs on a portrait. Overridable per call and per plate. */
  const FOCAL_TARGET = [0.5, 0.4];

  /**
   * The crop that frames `subject` in a window of `aspect`.
   *
   * Two things decide it, and they do different jobs. `subject` says what may
   * not be cut — the head, the hands, the gear the card names — and it is grown,
   * never shrunk, until it is the window's shape. `focal` then says what the
   * picture is *of*: one point, usually a face, that gets placed at `target`
   * within the window rather than left wherever the growing happened to put it.
   *
   * Without a focal point the crop is centred on the subject box, which is fine
   * for a wagon and wrong for a person: the middle of a standing figure's
   * bounding box is their sternum, and a portrait framed on a sternum is a
   * portrait of a coat. The focal point is what stops that, and it can never
   * push the subject box out of frame - it slides the crop inside the room the
   * subject leaves, and no further.
   *
   * @param {{width: number, height: number}} plate  pixel size of the plate
   * @param {number[]} subject  [x, y, w, h] in fractions of the plate
   * @param {number} aspect     the window's width ÷ height
   * @param {number} pad        breathing room, as a fraction of the subject's shorter side
   * @param {number[]} [focal]  [x, y] in fractions of the plate - the face, usually
   * @param {number[]} [target] [x, y] in fractions of the window - where the focal point should land
   * @returns {{x: number, y: number, w: number, h: number}} in fractions of the plate
   */
  function crop(plate, subject, aspect, pad, focal, target) {
    const pw = plate.width;
    const ph = plate.height;
    const box = subject || WHOLE_PLATE;

    let x = box[0] * pw;
    let y = box[1] * ph;
    let w = box[2] * pw;
    let h = box[3] * ph;

    const room = (pad || 0) * Math.min(w, h);
    x -= room; y -= room; w += 2 * room; h += 2 * room;

    /* The padded subject box. The crop may slide, but never off this. */
    const sx = x, sy = y, sw = w, sh = h;

    /* Grow the short side out to the window's shape, around the subject's centre. */
    if (w / h < aspect) { const grown = h * aspect; x -= (grown - w) / 2; w = grown; }
    else { const grown = w / aspect; y -= (grown - h) / 2; h = grown; }

    /* A subject wider or taller than the whole page is the one case where the
       box has to give: shrink it about its centre until it fits, and lose the
       edges rather than the middle. */
    function shrink(limit, axis) {
      const cx = x + w / 2;
      const cy = y + h / 2;
      if (axis === 'w') { w = limit; h = w / aspect; } else { h = limit; w = h * aspect; }
      x = cx - w / 2;
      y = cy - h / 2;
    }
    if (w > pw) shrink(pw, 'w');
    if (h > ph) shrink(ph, 'h');

    /* Put the focal point where the window wants it, as far as the subject box
       allows. clamp(lo, v, hi) with lo > hi means there is no room at all - the
       subject already fills that axis - and the subject wins. */
    if (focal) {
      const t = target || FOCAL_TARGET;
      const place = (f, span, boxLo, boxSpan, at) => {
        const lo = boxLo + boxSpan - span;   // crop pushed as far right/down as the box allows
        const hi = boxLo;                    // crop pushed as far left/up
        const want = f - at * span;
        return lo > hi ? hi : Math.min(Math.max(want, lo), hi);
      };
      x = place(focal[0] * pw, w, sx, sw, t[0]);
      y = place(focal[1] * ph, h, sy, sh, t[1]);
    }

    /* Slide back onto the page rather than sampling paper that is not there. */
    x = Math.min(Math.max(x, 0), pw - w);
    y = Math.min(Math.max(y, 0), ph - h);

    return { x: x / pw, y: y / ph, w: w / pw, h: h / ph };
  }

  global.Framing = { crop: crop, WHOLE_PLATE: WHOLE_PLATE, FOCAL_TARGET: FOCAL_TARGET };
})(window);

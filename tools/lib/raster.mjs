/**
 * The small amount of drawing the map proof sheets need: alpha blending, filled
 * convex polygons, lines, discs and text, straight onto an RGB byte buffer.
 *
 * Deliberately tiny. The proof sheet is a diagnostic, not a deliverable — its
 * whole job is to let a human or an agent look at 800-odd classified hexes and
 * see which ones are wrong.
 */
import { drawText, textWidth } from './pixelfont.mjs';

export function createCanvas(width, height, fill = [255, 255, 255]) {
  const rgb = new Uint8Array(width * height * 3);
  for (let i = 0; i < rgb.length; i += 3) {
    rgb[i] = fill[0];
    rgb[i + 1] = fill[1];
    rgb[i + 2] = fill[2];
  }
  return { width, height, rgb };
}

export function blend(canvas, x, y, colour, alpha = 1) {
  const px = Math.round(x);
  const py = Math.round(y);
  if (px < 0 || py < 0 || px >= canvas.width || py >= canvas.height) return;
  const d = (py * canvas.width + px) * 3;
  if (alpha >= 1) {
    canvas.rgb[d] = colour[0];
    canvas.rgb[d + 1] = colour[1];
    canvas.rgb[d + 2] = colour[2];
    return;
  }
  for (let i = 0; i < 3; i++) {
    canvas.rgb[d + i] = Math.round(canvas.rgb[d + i] * (1 - alpha) + colour[i] * alpha);
  }
}

/** Scanline fill of any simple polygon given as [[x, y], ...]. */
export function fillPolygon(canvas, points, colour, alpha = 1) {
  const ys = points.map((p) => p[1]);
  const top = Math.max(0, Math.floor(Math.min(...ys)));
  const bottom = Math.min(canvas.height - 1, Math.ceil(Math.max(...ys)));
  for (let y = top; y <= bottom; y++) {
    const crossings = [];
    for (let i = 0; i < points.length; i++) {
      const [x1, y1] = points[i];
      const [x2, y2] = points[(i + 1) % points.length];
      if ((y1 <= y && y2 > y) || (y2 <= y && y1 > y)) {
        crossings.push(x1 + ((y - y1) / (y2 - y1)) * (x2 - x1));
      }
    }
    crossings.sort((a, b) => a - b);
    for (let k = 0; k + 1 < crossings.length; k += 2) {
      for (let x = Math.ceil(crossings[k]); x <= Math.floor(crossings[k + 1]); x++) {
        blend(canvas, x, y, colour, alpha);
      }
    }
  }
}

export function strokePolygon(canvas, points, colour, alpha = 1, closed = true) {
  const last = closed ? points.length : points.length - 1;
  for (let i = 0; i < last; i++) {
    line(canvas, points[i], points[(i + 1) % points.length], colour, alpha);
  }
}

export function line(canvas, [x1, y1], [x2, y2], colour, alpha = 1) {
  const steps = Math.max(1, Math.ceil(Math.hypot(x2 - x1, y2 - y1)));
  for (let s = 0; s <= steps; s++) {
    blend(canvas, x1 + ((x2 - x1) * s) / steps, y1 + ((y2 - y1) * s) / steps, colour, alpha);
  }
}

export function disc(canvas, cx, cy, radius, colour, alpha = 1) {
  for (let y = Math.floor(cy - radius); y <= Math.ceil(cy + radius); y++) {
    for (let x = Math.floor(cx - radius); x <= Math.ceil(cx + radius); x++) {
      if ((x - cx) ** 2 + (y - cy) ** 2 <= radius * radius) blend(canvas, x, y, colour, alpha);
    }
  }
}

/**
 * Text with a knocked-out halo, so a label stays readable over the artwork
 * underneath it without needing a solid plate behind it.
 */
export function text(canvas, string, x, y, scale, colour, halo = null) {
  if (halo) {
    for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      drawText(string, x + dx, y + dy, scale, (px, py) => blend(canvas, px, py, halo, 0.85));
    }
  }
  drawText(string, x, y, scale, (px, py) => blend(canvas, px, py, colour, 1));
}

export function centredText(canvas, string, cx, y, scale, colour, halo = null) {
  text(canvas, string, Math.round(cx - textWidth(string, scale) / 2), y, scale, colour, halo);
}

export { textWidth };

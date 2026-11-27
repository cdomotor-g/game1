#!/usr/bin/env python3
"""Derive one plate from another, as an item's own `plateFrom` block says.

A derived plate is the cheap way to a second card off a first: the wineskin is
the waterskin's plate mirrored, tipped and stained the colour of what it holds.
Everything this tool does is read off the item's `plateFrom` (data/items.json):
which plate, which way to flip it, how far to tip it, and which TINT to stain
the saturated ink with. The tints are named here because they are a recipe for
moving colour, not a colour anybody prints: the paper is never touched - only
pixels saturated enough to be the drawn thing itself are moved.

It writes the PNG OUTSIDE the repository. Landing it is ship-art's job, the one
definition of landing (CLAUDE.md):

    python3 tools/derive-plate.py wineskin /tmp/wineskin.png
    node tools/ship-art.mjs item-wineskin /tmp/wineskin.png
"""
import json, sys, colorsys
from pathlib import Path
from PIL import Image, ImageOps
import numpy as np

ROOT = Path(__file__).resolve().parent.parent

# hue (0-1) the drawn thing is moved TO, and how much its saturation and value
# are scaled. Only saturated pixels move; the mask below decides which.
TINTS = {
    'wine': {'hue': 0.97, 'sat': 0.78, 'val': 0.72},
}

def main():
    if len(sys.argv) < 3:
        sys.exit('usage: derive-plate.py <item-id> <out.png>')
    item_id, out = sys.argv[1], Path(sys.argv[2])
    if ROOT in out.resolve().parents:
        sys.exit('write the derived plate outside the repository; ship-art lands it')
    items = json.loads((ROOT / 'data/items.json').read_text())['items']
    item = next((i for i in items if i['id'] == item_id), None)
    if not item or 'plateFrom' not in item:
        sys.exit(f'{item_id} has no plateFrom block in data/items.json')
    pf = item['plateFrom']
    src = Image.open(ROOT / 'docs/art/renders' / f"{pf['plate']}.png").convert('RGB')
    w, h = src.size

    img = src
    if pf.get('flip') == 'horizontal':
        img = ImageOps.mirror(img)

    tint = TINTS.get(pf.get('tint'))
    if tint:
        a = np.asarray(img).astype(np.float32) / 255.0
        mx, mn = a.max(axis=2), a.min(axis=2)
        sat = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-6), 0)
        r, g, b = a[..., 0], a[..., 1], a[..., 2]
        # hue in 0-1
        d = np.maximum(mx - mn, 1e-6)
        hue = np.where(mx == r, ((g - b) / d) % 6, np.where(mx == g, (b - r) / d + 2, (r - g) / d + 4)) / 6.0
        # the leather: reds and rust browns, saturated well past the paper's ochre
        warm = (hue < 0.085) | (hue > 0.93)
        weight = np.clip((sat - 0.38) / 0.25, 0, 1) * warm
        nh = tint['hue']
        ns = np.clip(sat * tint['sat'], 0, 1)
        nv = mx * tint['val']
        # hsv -> rgb, vectorised
        i = np.floor(nh * 6) % 6
        f = nh * 6 - np.floor(nh * 6)
        p, q, t = nv * (1 - ns), nv * (1 - f * ns), nv * (1 - (1 - f) * ns)
        lut = {0: (nv, t, p), 1: (q, nv, p), 2: (p, nv, t), 3: (p, q, nv), 4: (t, p, nv), 5: (nv, p, q)}
        nr, ng, nb = lut[int(i)]
        moved = np.stack([nr, ng, nb], axis=2)
        out_a = a * (1 - weight[..., None]) + moved * weight[..., None]
        img = Image.fromarray((np.clip(out_a, 0, 1) * 255).astype(np.uint8))

    deg = pf.get('rotateDeg', 0)
    if deg:
        # Tip it about the middle, then grow it back over its own corners so no
        # blank wedge is left: the page is cropped, never padded.
        rot = img.rotate(deg, resample=Image.BICUBIC, expand=False)
        import math
        k = abs(math.cos(math.radians(deg))) + abs(math.sin(math.radians(deg)))
        cw, ch = int(w / k), int(h / k)
        rot = rot.crop(((w - cw) // 2, (h - ch) // 2, (w - cw) // 2 + cw, (h - ch) // 2 + ch))
        img = rot.resize((w, h), Image.LANCZOS)

    img.save(out, 'PNG')
    print(f'wrote {out} - {w}x{h}, from {pf["plate"]}: flip {pf.get("flip")}, tip {deg} deg, tint {pf.get("tint")}')

if __name__ == '__main__':
    main()

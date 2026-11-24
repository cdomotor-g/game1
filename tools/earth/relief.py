#!/usr/bin/env python3
"""Draws a real-Earth map's relief plate - as LAYERS, so anything downstream can take just the part it wants.

  relief.py <map-id> --koppen <Beck_KG_V1_present_0p083.tif> --rivers <ne_10m_rivers_lake_centerlines.geojson>

Like tools/fetch-earth.mjs this is run by a person, never by CI: it needs the network (elevation tiles) and
the two source files. What it writes is committed under docs/map/layers/<map-id>/ and described by
layers.json there. Everything is laid out on the SAME plate pixels as the map's own plate (docs/map/<id>.svg)
and the viewer's hex overlay, so any two layers can be stacked without being registered by eye.

The plate is not edited by hand and not re-encoded by anything else: change data/earth/classify.json or the
commission and run draw-map.mjs, then this.
"""
import json, math, os, subprocess, sys, tempfile
from concurrent.futures import ThreadPoolExecutor
import numpy as np
from PIL import Image, ImageDraw

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
args = sys.argv[1:]
def arg(n):
    return args[args.index('--' + n) + 1] if ('--' + n) in args else None
map_id = next(a for a in args if not a.startswith('--') and args[args.index(a) - 1][:2] != '--')
KOPPEN, RIVERS = arg('koppen'), arg('rivers')
if not (KOPPEN and RIVERS):
    sys.exit('usage: relief.py <map-id> --koppen <tif> --rivers <geojson>')

M = json.load(open(f'{ROOT}/data/maps/{map_id}.json'))
EARTH = M['commission']['earth']
PLATE = M['plate']
GEO = PLATE['geo']
COLS, ROWS = M['grid']['cols'], M['grid']['rows']
W, H = PLATE['width'], PLATE['height']
F = PLATE['field']
PAL = json.load(open(f'{ROOT}/docs/art/palette.json'))
OUT = f'{ROOT}/docs/map/layers/{map_id}'
os.makedirs(OUT, exist_ok=True)
TILES = os.path.join(tempfile.gettempdir(), f'relief-{map_id}-tiles')
os.makedirs(TILES, exist_ok=True)

# ------------------------------------------------------------------- geometry
# The same arithmetic as docs/map/map.js layoutFor(): the viewer's hex overlay and this plate agree by construction.
S3 = math.sqrt(3)
HW = F['width'] / COLS                       # hex flat to flat, in plate pixels
RAD = HW / S3
PITCH = 1.5 * RAD
OX = F['x'] + (F['width'] - HW * (COLS + 0.5)) / 2
OY = F['y'] + (F['height'] - (PITCH * (ROWS - 1) + 2 * RAD)) / 2
SC = HW / 60.0                               # every px figure below was tuned at 60 px a hex


def hex_centre(c, r):
    return OX + HW * (c + 0.5 * (r & 1)) + HW / 2, OY + PITCH * r + RAD


def px_lon(x): return GEO['lon0'] + (x - OX - HW / 2) / HW * GEO['hexLon']
def px_lat(y): return GEO['lat0'] - (y - OY - RAD) / PITCH * GEO['rowLat']
def lon_px(lon): return OX + HW / 2 + (np.asarray(lon) - GEO['lon0']) / GEO['hexLon'] * HW
def lat_px(lat): return OY + RAD + (GEO['lat0'] - np.asarray(lat)) / GEO['rowLat'] * PITCH


YY, XX = np.mgrid[0:H, 0:W].astype(np.float32)
LON = px_lon(XX + 0.5).astype(np.float32)
if GEO.get('wrap'):
    # A board that goes round the whole planet (the Atlas): its odd rows and its frame reach past 180,
    # which is the same ground as the far west, so every lookup folds the longitude back.
    LON = (((LON + 180) % 360) + 360) % 360 - 180
LAT = px_lat(YY + 0.5).astype(np.float32)
del XX, YY

# ------------------------------------------------------------------- helpers
def hexcol(h):
    h = h.lstrip('#'); return np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)], np.float32) / 255


def box(a, r, axis):
    n = a.shape[axis]
    pad = [(0, 0)] * a.ndim; pad[axis] = (r, r)
    c = np.cumsum(np.pad(a, pad, mode='edge'), axis=axis, dtype=np.float64)
    c = np.concatenate([np.zeros_like(np.take(c, [0], axis=axis)), c], axis=axis)
    return ((np.take(c, range(2 * r + 1, 2 * r + 1 + n), axis=axis) - np.take(c, range(0, n), axis=axis)) / (2 * r + 1)).astype(np.float32)


def blur(a, s):
    s *= SC
    r = max(1, int(round((math.sqrt(4 * s * s + 1) - 1) / 2)))
    for _ in range(3):
        a = box(a, r, 0); a = box(a, r, 1)
    return a


def smooth(x, a, b):
    t = np.clip((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t)


def vnoise(scale, seed):
    scale = int(scale * SC)
    rng = np.random.default_rng(seed)
    gh, gw = H // scale + 3, W // scale + 3
    im = Image.fromarray((rng.random((gh, gw)) * 255).astype(np.uint8)).resize((gw * scale, gh * scale), Image.BICUBIC)
    return np.asarray(im, np.float32)[:H, :W] / 255


def fbm(seed, scales=(50, 16, 6), weights=(0.5, 0.3, 0.2)):
    o = sum(w * vnoise(s, seed + i * 17) for i, (s, w) in enumerate(zip(scales, weights)))
    return o - o.mean()


def ramp(e, stops):
    xs = [s[0] for s in stops]; cols = np.array([hexcol(s[1]) for s in stops])
    return np.stack([np.interp(e, xs, cols[:, i]) for i in range(3)], -1).astype(np.float32)


def mix(col, ink, a):
    a = a[..., None] if a.ndim == 2 else a
    return col * (1 - a) + np.asarray(ink, np.float32) * a


# ------------------------------------------------------- real elevation (z7)
Z = EARTH.get('reliefZoom', 7)   # 7 for a Region board; the Atlas asks for 5, which is still finer than its plate
def dem():
    n = 2 ** Z
    fx = ((LON + 180) / 360 * n).astype(np.float32)
    lr = np.radians(np.clip(LAT, -85, 85))
    fy = ((1 - np.log(np.tan(lr) + 1 / np.cos(lr)) / math.pi) / 2 * n).astype(np.float32)
    x0, x1, y0, y1 = int(fx.min()), int(fx.max()), int(fy.min()), int(fy.max())
    need = [(x, y) for x in range(x0, x1 + 1) for y in range(y0, y1 + 1) if not os.path.exists(f'{TILES}/{Z}_{x}_{y}.png')]
    def get(t):
        x, y = t
        for _ in range(3):
            p = f'{TILES}/{Z}_{x}_{y}.png'
            if subprocess.run(['curl', '-sfL', '-m', '60', '-o', p, f'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{Z}/{x}/{y}.png']).returncode == 0:
                try: Image.open(p).convert('RGB').load(); return
                except Exception: pass
        sys.exit(f'could not fetch tile {Z}/{x}/{y}')
    if need:
        print(f'fetching {len(need)} elevation tiles')
        with ThreadPoolExecutor(12) as ex: list(ex.map(get, need))
    mos = np.zeros(((y1 - y0 + 1) * 256, (x1 - x0 + 1) * 256), np.float32)
    for x in range(x0, x1 + 1):
        for y in range(y0, y1 + 1):
            a = np.asarray(Image.open(f'{TILES}/{Z}_{x}_{y}.png').convert('RGB'), np.float32)
            mos[(y - y0) * 256:(y - y0 + 1) * 256, (x - x0) * 256:(x - x0 + 1) * 256] = a[..., 0] * 256 + a[..., 1] + a[..., 2] / 256 - 32768
    ix = np.clip(((fx - x0) * 256).astype(np.int32), 0, mos.shape[1] - 1)
    iy = np.clip(((fy - y0) * 256).astype(np.int32), 0, mos.shape[0] - 1)
    return mos[iy, ix]


print('elevation'); E = blur(dem(), 0.5)


def ocean():
    k = 6
    lo = E[::k, ::k] <= 0
    fl = np.zeros_like(lo)
    for sd in EARTH.get('oceanSeeds', []):
        i, j = int(float(lat_px(sd['lat'])) / k), int(float(lon_px(sd['lon'])) / k)
        if 0 <= i < lo.shape[0] and 0 <= j < lo.shape[1] and lo[i, j]: fl[i, j] = True
    while True:
        n = fl.copy()
        n[1:] |= fl[:-1]; n[:-1] |= fl[1:]; n[:, 1:] |= fl[:, :-1]; n[:, :-1] |= fl[:, 1:]
        n &= lo
        if (n == fl).all(): break
        fl = n
    d = np.kron(fl, np.ones((k, k), bool))[:H, :W]
    for _ in range(k + 2):
        n = d.copy(); n[1:] |= d[:-1]; n[:-1] |= d[1:]; n[:, 1:] |= d[:, :-1]; n[:, :-1] |= d[:, 1:]; d = n
    return d & (E <= 0)


print('ocean'); SEA = ocean(); LAND = ~SEA

# ---------------------------------------------------------------------- climate
KG = np.asarray(Image.open(KOPPEN))
def koppen(seed=71, amt=0.2):
    n1, n2 = fbm(seed, (40, 18, 8), (0.6, 0.3, 0.1)), fbm(seed + 5, (40, 18, 8), (0.6, 0.3, 0.1))
    la, lo = LAT + n1 * amt * 6, LON + n2 * amt * 6
    r = np.clip(((90 - la) / (180 / KG.shape[0])).astype(np.int32), 0, KG.shape[0] - 1)
    c = np.clip(((lo + 180) / (360 / KG.shape[1])).astype(np.int32), 0, KG.shape[1] - 1)
    return KG[r, c]


def hillshade(e, exag=9.0, sigma=1.0):
    z = blur(np.maximum(e, 0), sigma)
    dxm = (GEO['hexLon'] / HW) * 111320 * np.maximum(0.2, np.cos(np.radians(LAT)))
    dym = GEO['rowLat'] / PITCH * 111320
    gx, gy = np.gradient(z, axis=1) / dxm, np.gradient(z, axis=0) / dym
    nx, ny = -exag * gx, -exag * gy
    nrm = np.sqrt(nx * nx + ny * ny + 1)
    L = np.array([-0.55, -0.62, 0.56], np.float32); L /= np.linalg.norm(L)
    return (nx * L[0] + ny * L[1] + L[2]) / nrm / L[2] - 1.0


HUM = [(0, '#6FA374'), (120, '#9BC384'), (350, '#CFDC99'), (700, '#E9DB9C'), (1200, '#DDB982'), (1800, '#C28F63'), (2500, '#A5714F'), (3200, '#8F6B5E'), (4000, '#EEE9E6')]
ARD = [(0, '#EBDCAA'), (300, '#E5CE96'), (700, '#D9B87E'), (1200, '#CC9B67'), (1800, '#B97F55'), (2500, '#A06A4B'), (3200, '#8F6B5E'), (4000, '#EEE9E6')]
BATH = [(-5500, '#2C5584'), (-3000, '#3F6F9A'), (-1500, '#5A8FB5'), (-500, '#7FB2CE'), (-100, '#A9D2DF'), (0, '#CBE7EC')]

print('colour')
e = blur(E, 1.0)
kop = koppen()
arid = blur(np.isin(kop, [4, 5, 6, 7]).astype(np.float32), 5)[..., None]
lcol = ramp(np.maximum(e, 0), HUM) * (1 - arid) + ramp(np.maximum(e, 0), ARD) * arid
wcol = ramp(np.minimum(E, 0), BATH)
FLAT = np.where(SEA[..., None], wcol, lcol).astype(np.float32)
del lcol, wcol, arid, kop

print('shade')
nz = fbm(81)
sh = hillshade(E, 14, 1.1)
shs = hillshade(np.maximum(-E, 0) * 0.5, 4, 2.5)
FACTOR = np.where(SEA, (1 + 0.5 * shs) * (1 + 0.35 * nz), (1 + 1.1 * sh) * (1 + 0.5 * nz)).astype(np.float32)
FACTOR = np.clip(FACTOR, 0.05, 1.99)
del sh, shs, nz

# the coast, as its own transparent layer
lm = blur(LAND.astype(np.float32), 1.0)
gy, gx = np.gradient(lm)
g = np.hypot(gx, gy) + 1e-6
COAST = (np.clip(1 - np.abs(lm - 0.5) / (g * 0.7 * 1.0), 0, 1) * (g > 0.006 / SC)).astype(np.float32) * 0.45
del lm, gy, gx, g

# rivers: lines on the planet -> plate pixels
geojson = json.load(open(RIVERS))
river_lines = []
for ft in geojson['features']:
    p = ft['properties']
    if p.get('featurecla') != 'River' or (p.get('scalerank') or 99) > EARTH.get('riverRank', 5):
        continue
    gm = ft['geometry']
    for ln in ([gm['coordinates']] if gm['type'] == 'LineString' else gm['coordinates']):
        xs = lon_px([c[0] for c in ln]); ys = lat_px([c[1] for c in ln])
        if not (np.any((xs > 0) & (xs < W) & (ys > 0) & (ys < H))): continue
        river_lines.append((p['scalerank'], p.get('name'), [(float(a), float(b)) for a, b in zip(xs, ys)]))
def rwidth(rank): return (3.2 if rank <= 3 else 2.4 if rank <= 4 else 1.8) * SC * 0.5

big = Image.new('L', (W * 2, H * 2), 0)
dr = ImageDraw.Draw(big)
for rank, name, pts in river_lines:
    dr.line([(a * 2, b * 2) for a, b in pts], fill=255, width=max(1, int(round(rwidth(rank) * 2))), joint='curve')
RIVER = np.asarray(big.resize((W, H), Image.LANCZOS), np.float32) / 255 * LAND
del big

# ------------------------------------------------------------------ write layers
def save_rgb(arr, name, q=92):
    Image.fromarray((np.clip(arr, 0, 1) * 255).astype(np.uint8)).save(f'{OUT}/{name}', quality=q, optimize=True)


print('writing layers')
save_rgb(FLAT, 'ground-flat.jpg')
Image.fromarray((np.clip(FACTOR / 2, 0, 1) * 255).astype(np.uint8), 'L').save(f'{OUT}/shade.png', optimize=True)
Image.fromarray((LAND * 255).astype(np.uint8), 'L').save(f'{OUT}/land-mask.png', optimize=True)
coast_rgba = np.zeros((H, W, 4), np.uint8)
coast_rgba[..., :3] = (59, 75, 82)
coast_rgba[..., 3] = (np.clip(COAST / 0.45, 0, 1) * 115).astype(np.uint8)
Image.fromarray(coast_rgba, 'RGBA').save(f'{OUT}/coast.png', optimize=True)

comp = FLAT * FACTOR[..., None]
comp = mix(comp, hexcol('#3B4B52'), COAST)
comp = mix(comp, hexcol('#3E7FA6'), RIVER * 0.95)
save_rgb(comp, 'ground.jpg', 90)
del comp

# ------------------------------------------------------------ the vector layers
def svg_head(extra=''):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" {extra}>\n'

paper = PAL['paper']['tallow']['hex']
KEY_DARK, KEY_PALE = '#1E1A16', '#FFFFFF'
FONT = "Merriweather, 'Liberation Serif', Georgia, serif"

# rivers (vector)
with open(f'{OUT}/rivers.svg', 'w') as fh:
    fh.write(svg_head())
    fh.write('<title>Rivers - Natural Earth 1:10m, scale rank 5 and above</title>\n<g fill="none" stroke="#3E7FA6" stroke-linecap="round" stroke-linejoin="round">\n')
    for rank, name, pts in river_lines:
        d = 'M' + ' L'.join(f'{a:.1f},{b:.1f}' for a, b in pts)
        fh.write(f'<path d="{d}" stroke-width="{rwidth(rank):.2f}"' + (f' data-name="{name}"' if name else '') + '/>\n')
    fh.write('</g></svg>\n')

# hexes: tone shift under, keyline over (the pale line, then the dark one beside it)
def corners(c, r):
    cx, cy = hex_centre(c, r)
    return [(cx + RAD * math.cos(math.radians(60 * i - 90)), cy + RAD * math.sin(math.radians(60 * i - 90))) for i in range(6)]

TONE = [-0.06, 0.0, 0.06]
with open(f'{OUT}/hexes.svg', 'w') as fh:
    fh.write(svg_head())
    fh.write('<title>The hex grid: a gentle three-tone shift, then a pale line with a dark one beside it</title>\n')
    fh.write('<g id="tone">\n')
    for r in range(ROWS):
        for c in range(COLS):
            q = c - (r - (r & 1)) // 2
            t = TONE[(q - r) % 3]
            if t == 0: continue
            pts = ' '.join(f'{x:.1f},{y:.1f}' for x, y in corners(c, r))
            fh.write(f'<polygon points="{pts}" fill="{"#000" if t < 0 else "#fff"}" fill-opacity="{abs(t) * 1.6:.3f}"/>\n')
    fh.write('</g>\n')
    off = max(1.0, SC * 0.8)
    for name, colr, op, dx in (('keyline-pale', KEY_PALE, 0.55, 0.0), ('keyline-dark', KEY_DARK, 0.55, off)):
        fh.write(f'<g id="{name}" fill="none" stroke="{colr}" stroke-opacity="{op}" stroke-width="{max(1.0, SC * 0.9):.2f}" transform="translate({dx:.2f},{dx:.2f})">\n')
        for r in range(ROWS):
            for c in range(COLS):
                fh.write('<polygon points="' + ' '.join(f'{x:.1f},{y:.1f}' for x, y in corners(c, r)) + f'" data-col="{c}" data-row="{r}"/>\n')
        fh.write('</g>\n')
    fh.write('</svg>\n')

# graticule. A Region board rules every 5 degrees, heavier every 10; the Atlas says its own steps in
# commission.atlas.graticule (30 of longitude, 15 of latitude) and adds the circles the climate hangs on.
ATLAS = M['commission'].get('atlas') or {}
GR = ATLAS.get('graticule') or {}
lon_lo, lon_hi = math.floor(px_lon(0)), math.ceil(px_lon(W))
lat_lo, lat_hi = math.floor(px_lat(H)), math.ceil(px_lat(0))
CIRCLES = [(23.44, 'Tropic of Cancer 23.4°N', '#962820'), (-23.44, 'Tropic of Capricorn 23.4°S', '#962820'),
           (66.56, 'Arctic Circle 66.6°N', '#2B4F78'), (-66.56, 'Antarctic Circle 66.6°S', '#2B4F78')]
with open(f'{OUT}/graticule.svg', 'w') as fh:
    fh.write(svg_head())
    def vline(x, op, wd):
        fh.write(f'<line x1="{x:.1f}" y1="{F["y"]}" x2="{x:.1f}" y2="{F["y"] + F["height"]}" stroke-opacity="{op}" stroke-width="{SC * wd:.2f}"/>\n')
    def hline(y, op, wd):
        fh.write(f'<line x1="{F["x"]}" y1="{y:.1f}" x2="{F["x"] + F["width"]}" y2="{y:.1f}" stroke-opacity="{op}" stroke-width="{SC * wd:.2f}"/>\n')
    inside_x = lambda x: F['x'] <= x <= F['x'] + F['width']
    inside_y = lambda y: F['y'] <= y <= F['y'] + F['height']
    if GR:
        ls, as_ = GR['lonStep'], GR['latStep']
        fh.write(f'<title>Lines of longitude every {ls} degrees and latitude every {as_}; the equator heavier; the tropics and the polar circles dashed</title>\n')
        fh.write('<g stroke="#182C54" fill="none">\n')
        for lon in range(lon_lo - lon_lo % ls, lon_hi + 1, ls):
            x = float(lon_px(lon))
            if inside_x(x): vline(x, 0.5 if lon % 180 else 0.75, 1.3 if lon % 180 else 2.0)
        for lat in range(lat_lo - lat_lo % as_, lat_hi + 1, as_):
            y = float(lat_px(lat))
            if inside_y(y): hline(y, 0.85 if lat == 0 else 0.5, 2.4 if lat == 0 else 1.3)
        fh.write('</g>\n')
        circles = CIRCLES if GR.get('circles') else []
    else:
        fh.write('<title>Lines of latitude and longitude every 5 degrees, heavier every 10; the Tropic of Cancer dashed</title>\n')
        fh.write(f'<g stroke="#182C54" fill="none">\n')
        for lon in range(lon_lo - lon_lo % 5, lon_hi + 1, 5):
            x = float(lon_px(lon))
            if inside_x(x): vline(x, 0.6 if lon % 10 == 0 else 0.34, 1.8 if lon % 10 == 0 else 1.0)
        for lat in range(lat_lo - lat_lo % 5, lat_hi + 1, 5):
            y = float(lat_px(lat))
            if inside_y(y): hline(y, 0.6 if lat % 10 == 0 else 0.34, 1.8 if lat % 10 == 0 else 1.0)
        fh.write('</g>\n')
        circles = CIRCLES[:1]
    for lat, label, colr in circles:
        y = float(lat_px(lat))
        if not inside_y(y): continue
        fh.write(f'<line x1="{F["x"]}" y1="{y:.1f}" x2="{F["x"] + F["width"]}" y2="{y:.1f}" stroke="{colr}" stroke-opacity="0.9" stroke-width="{SC * 1.8:.2f}" stroke-dasharray="{SC * 12} {SC * 7}"/>\n')
        fh.write(f'<text x="{F["x"] + 40 * SC}" y="{y - 6 * SC:.1f}" font-family="{FONT}" font-style="italic" font-size="{10 * SC:.1f}" fill="{"#78241C" if colr == "#962820" else colr}" stroke="#fff" stroke-width="{SC * 2}" paint-order="stroke">{label}</text>\n')
    fh.write('</svg>\n')

# frame: the paper band round the field, the neat line, and the degrees
INK = '#2E2822'
with open(f'{OUT}/frame.svg', 'w') as fh:
    fh.write(svg_head())
    fh.write('<title>The frame: a paper band, a neat line and the degrees of latitude and longitude</title>\n')
    fh.write(f'<path fill-rule="evenodd" fill="{paper}" d="M0,0H{W}V{H}H0Z M{F["x"]},{F["y"]}H{F["x"] + F["width"]}V{F["y"] + F["height"]}H{F["x"]}Z"/>\n')
    fh.write(f'<rect x="{F["x"]}" y="{F["y"]}" width="{F["width"]}" height="{F["height"]}" fill="none" stroke="{INK}" stroke-width="{SC * 1.4:.2f}"/>\n')
    fh.write(f'<rect x="{SC * 3:.0f}" y="{SC * 3:.0f}" width="{W - SC * 6:.0f}" height="{H - SC * 6:.0f}" fill="none" stroke="{INK}" stroke-width="{SC * 1.0:.2f}"/>\n')
    fs = 10.5 * SC
    FR = ATLAS.get('frame') or {}
    tick_lon, label_lon = FR.get('tickLon', 1), FR.get('labelLon', 5)
    tick_lat, label_lat = FR.get('tickLat', 1), FR.get('labelLat', 5)
    zones = FR.get('timeZones')
    def wrap_lon(lon): return ((lon + 180) % 360 + 360) % 360 - 180 if GEO.get('wrap') else lon
    for lon in range(lon_lo, lon_hi + 1):
        if lon % tick_lon: continue
        x = float(lon_px(lon))
        if F['x'] < x < F['x'] + F['width']:
            L = SC * (9 if lon % label_lon == 0 else 4)
            for y0, sgn in ((F['y'], -1), (F['y'] + F['height'], 1)):
                if zones and sgn < 0: continue   # the top band carries the time zones instead
                fh.write(f'<line x1="{x:.1f}" y1="{y0}" x2="{x:.1f}" y2="{y0 + sgn * L}" stroke="{INK}" stroke-width="{SC * 0.9:.2f}"/>\n')
            if lon % label_lon == 0:
                wl = wrap_lon(lon)
                t = f"{abs(wl)}°{'E' if 0 < wl < 180 else 'W' if -180 < wl < 0 else ''}"
                for y0, sgn in ((F['y'], -1), (F['y'] + F['height'], 1)):
                    if zones and sgn < 0: continue
                    fh.write(f'<text x="{x:.1f}" y="{y0 + sgn * (L + SC * 3) + (0 if sgn < 0 else fs * 0.75):.1f}" text-anchor="middle" font-family="{FONT}" font-size="{fs:.1f}" fill="{INK}">{t}</text>\n')
    for lat in range(lat_lo, lat_hi + 1):
        if lat % tick_lat: continue
        y = float(lat_px(lat))
        if F['y'] < y < F['y'] + F['height']:
            L = SC * (9 if lat % label_lat == 0 else 4)
            for x0, sgn in ((F['x'], -1), (F['x'] + F['width'], 1)):
                fh.write(f'<line x1="{x0}" y1="{y:.1f}" x2="{x0 + sgn * L}" y2="{y:.1f}" stroke="{INK}" stroke-width="{SC * 0.9:.2f}"/>\n')
            if lat % label_lat == 0:
                t = f"{abs(lat)}°{'N' if lat > 0 else 'S' if lat < 0 else ''}"
                for x0, sgn, anchor in ((F['x'], -1, 'end'), (F['x'] + F['width'], 1, 'start')):
                    fh.write(f'<text x="{x0 + sgn * (L + SC * 3):.1f}" y="{y + fs * 0.35:.1f}" text-anchor="{anchor}" font-family="{FONT}" font-size="{fs:.1f}" fill="{INK}">{t}</text>\n')
    if zones:
        # The time zones across the top: one per column of the even rows, each centred on its own meridian,
        # numbered in hours ahead of Greenwich. Column 0 is the 180th meridian, where the date changes.
        for c in range(COLS):
            x, _ = hex_centre(c, 0)
            hrs = round(wrap_lon(px_lon(x)) / 15)
            t = '±12' if abs(hrs) == 12 else ('0' if hrs == 0 else f'{hrs:+d}'.replace('-', '−'))
            for dx in (-HW / 2, HW / 2):
                fh.write(f'<line x1="{x + dx:.1f}" y1="{F["y"]}" x2="{x + dx:.1f}" y2="{F["y"] - SC * 9}" stroke="{INK}" stroke-width="{SC * 0.9:.2f}"/>\n')
            fh.write(f'<text x="{x:.1f}" y="{F["y"] - SC * 8:.1f}" text-anchor="middle" font-family="{FONT}" font-weight="700" font-size="{fs * 1.15:.1f}" fill="{INK}"><title>{t} hours from Greenwich</title>{t}</text>\n')
        fh.write(f'<text x="{F["x"] - SC * 4:.1f}" y="{F["y"] - SC * 8:.1f}" text-anchor="end" font-family="{FONT}" font-style="italic" font-size="{fs * 0.8:.1f}" fill="{INK}">hours</text>\n')
    fh.write('</svg>\n')

# places and region names. A label that would sit on another is moved (a place) or dropped (a region):
# a layer someone else pulls out on its own must already be readable.
try:
    from PIL import ImageFont
    _F = {k: ImageFont.truetype(f'/usr/share/fonts/truetype/liberation/LiberationSerif-{k}.ttf', 100) for k in ('Regular', 'Italic', 'Bold')}
except Exception:
    _F = None


def text_w(text, size, style='Regular', spacing=0.0):
    base = _F[style].getlength(text) * size / 100 if _F else 0.52 * size * len(text)
    return base + spacing * (len(text) - 1)


ATLAS_PORTS = bool(ATLAS)
taken = []
def free(b):
    return not any(not (b[2] < o[0] or b[0] > o[2] or b[3] < o[1] or b[1] > o[3]) for o in taken)


ORDER = {'seat': 0, 'city': 1, 'town': 2, 'village': 3}
placed = []
for sx in sorted(M['settlements'], key=lambda q: ORDER.get(q['rank'], 4)):
    x, y = hex_centre(sx['col'], sx['row'])
    big = sx['rank'] in ('seat', 'city')
    rad = SC * (5.5 if sx['rank'] == 'seat' else 4.2 if big else 3.2)
    size = SC * 15
    w = text_w(sx['name'], size, 'Regular' if big else 'Italic')
    dot = (x - rad, y - rad, x + rad, y + rad)
    choice = None
    for anchor, tx, ty in (('start', x + rad + SC * 3, y + SC * 5), ('end', x - rad - SC * 3, y + SC * 5), ('middle', x, y - rad - SC * 4)):
        bx0 = tx if anchor == 'start' else tx - w if anchor == 'end' else tx - w / 2
        bb = (bx0, ty - size * 0.8, bx0 + w, ty + size * 0.25)
        if free(bb) and bb[0] > F['x'] and bb[2] < F['x'] + F['width']:
            choice = (anchor, tx, ty, bb); break
    if not choice: choice = ('start', x + rad + SC * 3, y + SC * 5, (x, y - size, x + w, y + size * 0.3))
    if not ATLAS_PORTS: taken.append(dot); taken.append(choice[3])
    placed.append((sx, x, y, rad, size, big, choice))

ATLAS_PORTS = bool(ATLAS)   # (set again here for the reader) the Atlas's ports layer is drawn by tools/build-atlas.mjs, which knows which board each opens onto
if not ATLAS_PORTS:
    with open(f'{OUT}/places.svg', 'w') as fh:
        fh.write(svg_head())
        fh.write('<title>Settlements, at their hex</title>\n<g font-family="' + FONT + '" paint-order="stroke" stroke="#fff" stroke-opacity="0.8" stroke-linejoin="round">\n')
        for sx, x, y, rad, size, big, (anchor, tx, ty, _bb) in placed:
            fh.write(f'<g data-id="{sx["id"]}"><circle cx="{x:.1f}" cy="{y:.1f}" r="{rad:.1f}" fill="#241F1B" stroke="#fff" stroke-width="{SC:.1f}"/>'
                     f'<text x="{tx:.1f}" y="{ty:.1f}" text-anchor="{anchor}" font-size="{size:.1f}" font-style="{"normal" if big else "italic"}" stroke-width="{SC * 2.2:.1f}" fill="#241F1B">{sx["name"]}</text></g>\n')
        fh.write('</g></svg>\n')

with open(f'{OUT}/regions.svg', 'w') as fh:
    fh.write(svg_head())
    fh.write('<title>Region and sea names</title>\n<g font-family="' + FONT + '" text-anchor="middle" paint-order="stroke" stroke="#fff" stroke-opacity="0.75" stroke-linejoin="round">\n')
    dropped = []
    for rg in sorted(M['regions'], key=lambda q: q['terrain'] in ('deep-water', 'shallow-water')):
        c, r = rg['labelAt']
        x, y = hex_centre(c, r)
        sea = rg['terrain'] in ('deep-water', 'shallow-water')
        size, sp = SC * (17 if sea else 19), SC * (4.5 if sea else 3.2)
        w = text_w(rg['name'].upper(), size, 'Italic' if sea else 'Bold', sp)
        bb = (x - w / 2, y + SC * 6 - size * 0.8, x + w / 2, y + SC * 6 + size * 0.25)
        if bb[0] < F['x'] or bb[2] > F['x'] + F['width'] or not free(bb):
            dropped.append(rg['name']); continue
        taken.append(bb)
        fh.write(f'<text x="{x:.1f}" y="{y + SC * 6:.1f}" font-size="{size:.1f}" font-style="{"italic" if sea else "normal"}" font-weight="{"400" if sea else "700"}" '
                 f'letter-spacing="{sp:.1f}" stroke-width="{SC * 2:.1f}" fill="{'#163454' if sea else '#241F1B'}" data-id="{rg["id"]}">{rg["name"].upper()}</text>\n')
    fh.write('</g></svg>\n')
if dropped: print('labels left off (no room):', ', '.join(dropped))

# ------------------------------------------------------------------ the manifest
layers = [
    dict(id='ground', file='ground.jpg', kind='raster', format='jpeg', order=10, role='the finished relief: ground-flat x shade, with the coast and rivers drawn on', blend='normal', default=True,
         uses=['ground-flat', 'shade', 'coast', 'rivers']),
    dict(id='ground-flat', file='ground-flat.jpg', kind='raster', format='jpeg', order=1, role='colour only: height and depth tints, with dry ground where the climate is arid. No shading, nothing else', blend='normal', default=False),
    dict(id='shade', file='shade.png', kind='raster', format='png-grey', order=2, role='relief shading on its own; multiply it over any colour. 8-bit grey: factor = value / 255 x 2, so 128 is no change', blend='multiply', scale=2.0, default=False),
    dict(id='land-mask', file='land-mask.png', kind='raster', format='png-grey', order=0, role='white is land, black is sea. Sea is water joined to the open ocean, so land below sea level is land', blend='mask', default=False),
    dict(id='coast', file='coast.png', kind='raster', format='png-rgba', order=11, role='the shoreline as a transparent line', blend='normal', default=False),
    dict(id='rivers', file='rivers.svg', kind='vector', format='svg', order=12, role=f"river centre lines, Natural Earth scale rank {EARTH.get('riverRank', 5)} and above (more than the board keeps)", blend='normal', default=False),
    dict(id='hexes', file='hexes.svg', kind='vector', format='svg', order=20, role='the game grid: a three-tone shift, then a pale line with a dark one beside it. Groups: tone, keyline-pale, keyline-dark', blend='normal', default=True),
    dict(id='graticule', file='graticule.svg', kind='vector', format='svg', order=30, role=(f"longitude every {GR['lonStep']} degrees, latitude every {GR['latStep']}, the equator heavier, the tropics and polar circles dashed" if GR else 'latitude and longitude every 5 degrees, heavier every 10, and the Tropic of Cancer'), blend='normal', default=True),
    dict(id='places', file='places.svg', kind='vector', format='svg', order=40, role='settlements at their hex, with names', blend='normal', default=True),
    dict(id='regions', file='regions.svg', kind='vector', format='svg', order=41, role='region and sea names', blend='normal', default=True),
    dict(id='frame', file='frame.svg', kind='vector', format='svg', order=50, role='paper band, neat line and degree labels' + (', with the time zones across the top' if (ATLAS.get('frame') or {}).get('timeZones') else ''), blend='normal', default=True),
]
if ATLAS_PORTS:
    layers = [l for l in layers if l['id'] != 'places']
# Layers another tool adds to this set (tools/build-atlas.mjs: winds, lanes, ports...) are kept when this runs again.
try:
    _old = json.load(open(f'{OUT}/layers.json'))
    layers += [l for l in _old.get('layers', []) if l.get('by') and os.path.exists(f'{OUT}/{l["file"]}')]
    _old_recipes = _old.get('recipesBy', {})
except Exception:
    _old_recipes = {}
for l in layers:
    l['bytes'] = os.path.getsize(f'{OUT}/{l["file"]}')
manifest = {
    '$comment': 'GENERATED by tools/earth/relief.py - do not edit. Every layer is on the same plate pixels as docs/map/<map>.svg, so any set of them can be stacked as they are. Order is bottom to top.',
    'map': map_id, 'name': M['name'],
    'plate': {'width': W, 'height': H, 'field': F},
    'grid': {'cols': COLS, 'rows': ROWS, 'hexAcrossPx': HW, 'hexRadiusPx': RAD, 'rowPitchPx': PITCH, 'originX': OX, 'originY': OY,
             'centreOfHex': 'x = originX + hexAcrossPx * (col + 0.5 * (row & 1)) + hexAcrossPx / 2;  y = originY + rowPitchPx * row + hexRadiusPx'},
    'georeference': {**GEO,
                     'pixelToDegrees': 'lon = lon0 + (x - originX - hexAcrossPx / 2) / hexAcrossPx * hexLon;  lat = lat0 - (y - originY - hexRadiusPx) / rowPitchPx * rowLat',
                     'degreesToPixel': 'x = originX + hexAcrossPx / 2 + (lon - lon0) / hexLon * hexAcrossPx;  y = originY + hexRadiusPx + (lat0 - lat) / rowLat * rowPitchPx',
                     'projection': 'equirectangular, true at the standard parallel; ground distances drift from the true figure away from it',
                     'bounds': {'west': px_lon(0), 'east': px_lon(W), 'north': px_lat(0), 'south': px_lat(H)}},
    'layers': sorted(layers, key=lambda l: l['order']),
    'recipes': {
        'just-the-ground': ['ground'],
        'play-board': ['ground', 'hexes', 'places', 'regions'],
        'learning-board': ['ground', 'hexes', 'graticule', 'places', 'regions', 'frame'],
        'recolour-it-yourself': ['ground-flat', 'shade', 'land-mask'],
        'overlay-on-something-else': ['hexes', 'graticule', 'places', 'regions'],
        **_old_recipes,
    },
    **({'recipesBy': _old_recipes} if _old_recipes else {}),
    'data': {'board': f'data/maps/{map_id}.json', 'samples': EARTH['samplesFile'] and 'data/' + EARTH['samplesFile'], 'rules': 'data/earth/classify.json'},
    'sources': [
        {'what': 'elevation and sea depth', 'name': f'Terrain Tiles (terrarium), zoom {Z}', 'credit': 'SRTM, GEBCO, ETOPO1 and national datasets, as credited by Mapzen/Tilezen terrain tiles'},
        {'what': 'climate class (arid ground)', 'name': arg('koppen-name') or 'Beck et al. 2018, present-day Koeppen-Geiger', 'licence': 'CC BY 4.0'},
        {'what': 'rivers', 'name': 'Natural Earth 1:10m rivers and lake centerlines', 'licence': 'public domain'},
    ],
}
json.dump(manifest, open(f'{OUT}/layers.json', 'w'), indent=2)
print('wrote', OUT, ', '.join(f'{l["id"]} {l["bytes"] // 1024}k' for l in manifest['layers']))

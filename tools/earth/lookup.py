#!/usr/bin/env python3
"""Raster lookups for tools/fetch-earth.mjs. Knows no geometry and no game: it is handed
points and answers with the numbers under them.

  lookup.py <job.json> <cache-dir> <out.json>

job.json: {"points": [[lat, lon], ...], "koppen": "<path to Beck_KG_V1_present_0p083.tif>", "zoom": 6}
out.json: {"elev": [metres...], "koppen": [class...], "ocean": [bool...]}

Elevation and sea depth are one raster: the AWS "terrarium" tiles (land from SRTM and its
neighbours, sea from GEBCO/ETOPO), where metres = R*256 + G + B/256 - 32768.
"""
import io, json, math, os, subprocess, sys
import numpy as np
from PIL import Image

Image.MAX_IMAGE_PIXELS = None
job = json.load(open(sys.argv[1]))
cache = sys.argv[2]
os.makedirs(cache, exist_ok=True)
Z = job.get("zoom", 6)
URL = "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png"

def tile_of(lat, lon):
    n = 2 ** Z
    x = min(n - 1e-6, (((lon + 180.0) % 360.0) / 360.0) * n)   # a board that wraps hands in 180 as well as -180
    lat_r = math.radians(max(-85.0511, min(85.0511, lat)))
    y = (1.0 - math.log(math.tan(lat_r) + 1.0 / math.cos(lat_r)) / math.pi) / 2.0 * n
    return x, y

tiles = {}
def tile(x, y):
    k = (x, y)
    if k not in tiles:
        p = os.path.join(cache, f"{Z}_{x}_{y}.png")
        if not os.path.exists(p):
            r = subprocess.run(["curl", "-sfL", "-m", "60", "--retry", "3", "-o", p, URL.format(z=Z, x=x, y=y)])
            if r.returncode != 0:
                raise SystemExit(f"could not fetch tile {Z}/{x}/{y}")
        a = np.array(Image.open(p).convert("RGB"), dtype=np.float64)
        tiles[k] = a[..., 0] * 256 + a[..., 1] + a[..., 2] / 256 - 32768
    return tiles[k]

kg = np.array(Image.open(job["koppen"]))
KH, KW = kg.shape

def ocean_mask(points, seeds):
    """Which points are SEA: water joined to the open ocean. Land that happens to lie below sea level
    (the Qattara depression, the Dead Sea shore) is land, so "elevation <= 0" is not the test - a flood
    fill from known open water is."""
    xs, ys = zip(*[tile_of(la, lo) for la, lo in points])
    x0, x1, y0, y1 = int(min(xs)), int(max(xs)), int(min(ys)), int(max(ys))
    mos = np.zeros(((y1 - y0 + 1) * 256, (x1 - x0 + 1) * 256), np.float32)
    for tx in range(x0, x1 + 1):
        for ty in range(y0, y1 + 1):
            mos[(ty - y0) * 256:(ty - y0 + 1) * 256, (tx - x0) * 256:(tx - x0 + 1) * 256] = tile(tx, ty)
    k = 4
    lo = mos[::k, ::k] <= 0
    fl = np.zeros_like(lo)
    for la, lo_ in seeds:
        fx, fy = tile_of(la, lo_)
        i, j = int((fy - y0) * 256 / k), int((fx - x0) * 256 / k)
        if 0 <= i < lo.shape[0] and 0 <= j < lo.shape[1] and lo[i, j]:
            fl[i, j] = True
    while True:
        n = fl.copy()
        n[1:] |= fl[:-1]; n[:-1] |= fl[1:]; n[:, 1:] |= fl[:, :-1]; n[:, :-1] |= fl[:, 1:]
        n &= lo
        if (n == fl).all():
            break
        fl = n
    d = fl.copy()                       # one cell of slack so a shoreline point is not missed
    d[1:] |= fl[:-1]; d[:-1] |= fl[1:]; d[:, 1:] |= fl[:, :-1]; d[:, :-1] |= fl[:, 1:]
    out = []
    for (la, lo_), fx, fy in zip(points, xs, ys):
        i = min(d.shape[0] - 1, max(0, int((fy - y0) * 256 / k))); j = min(d.shape[1] - 1, max(0, int((fx - x0) * 256 / k)))
        out.append(bool(d[i, j]))
    return out


elev, koppen = [], []
for lat, lon in job["points"]:
    fx, fy = tile_of(lat, lon)
    tx, ty = int(fx), int(fy)
    t = tile(tx, ty)
    px = min(255, int((fx - tx) * 256)); py = min(255, int((fy - ty) * 256))
    elev.append(round(float(t[py, px])))
    r = min(KH - 1, max(0, int((90.0 - lat) / (180.0 / KH))))
    c = min(KW - 1, max(0, int(((lon + 180.0) % 360.0) / (360.0 / KW))))
    koppen.append(int(kg[r, c]))

ocean = ocean_mask(job["points"], job.get("seeds", [])) if job.get("seeds") else [e <= 0 for e in elev]
ocean = [o and e <= 0 for o, e in zip(ocean, elev)]
json.dump({"elev": elev, "koppen": koppen, "ocean": ocean}, open(sys.argv[3], "w"))

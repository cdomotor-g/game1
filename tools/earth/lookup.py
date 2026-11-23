#!/usr/bin/env python3
"""Raster lookups for tools/fetch-earth.mjs. Knows no geometry and no game: it is handed
points and answers with the numbers under them.

  lookup.py <job.json> <cache-dir> <out.json>

job.json: {"points": [[lat, lon], ...], "koppen": "<path to Beck_KG_V1_present_0p083.tif>", "zoom": 6}
out.json: {"elev": [metres...], "koppen": [class...]}

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
    x = (lon + 180.0) / 360.0 * n
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

elev, koppen = [], []
for lat, lon in job["points"]:
    fx, fy = tile_of(lat, lon)
    tx, ty = int(fx), int(fy)
    t = tile(tx, ty)
    px = min(255, int((fx - tx) * 256)); py = min(255, int((fy - ty) * 256))
    elev.append(round(float(t[py, px])))
    r = min(KH - 1, max(0, int((90.0 - lat) / (180.0 / KH))))
    c = min(KW - 1, max(0, int((lon + 180.0) / (360.0 / KW))))
    koppen.append(int(kg[r, c]))

json.dump({"elev": elev, "koppen": koppen}, open(sys.argv[3], "w"))

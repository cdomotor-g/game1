"""A small sculpting kit for printable miniatures.

A figure is a signed distance field: a function that says, for any point in
millimetres, how far it is from the surface (negative inside). Primitives here
are smooth-unioned into a body, meshed with marching cubes, decimated, proved
watertight with manifold3d, and photographed from five sides.

Nothing in this file belongs to any one figure. A figure is a script beside it
(`corin-vale.py`) that calls these and nothing else.

Needs: numpy, scipy, scikit-image, trimesh, fast-simplification, manifold3d,
pillow (`pip install numpy scipy scikit-image trimesh fast-simplification
manifold3d pillow`).
"""

import math
import numpy as np

F = np.float32


# ---------------------------------------------------------------- vectors

def v(*a):
    return np.array(a, dtype=F)


def norm(a):
    a = np.asarray(a, dtype=F)
    return a / np.linalg.norm(a)


def rot(axis, deg):
    """Rotation matrix about an axis, degrees."""
    x, y, z = norm(axis)
    t = math.radians(deg)
    c, s, C = math.cos(t), math.sin(t), 1 - math.cos(t)
    return np.array([
        [c + x * x * C, x * y * C - z * s, x * z * C + y * s],
        [y * x * C + z * s, c + y * y * C, y * z * C - x * s],
        [z * x * C - y * s, z * y * C + x * s, c + z * z * C],
    ], dtype=F)


def frame(z_axis, hint=(0, -1, 0)):
    """Rows: an orthonormal frame whose third axis is z_axis."""
    zz = norm(z_axis)
    h = norm(hint)
    if abs(float(np.dot(h, zz))) > 0.95:
        h = norm((1, 0, 0))
    xx = norm(np.cross(h, zz))
    yy = np.cross(zz, xx)
    return np.stack([xx, yy, zz]).astype(F)


def L(p):
    return np.sqrt(np.sum(p * p, axis=-1))


# ---------------------------------------------------------------- shapes
# Every shape is a closure P(N,3) -> d(N). Each carries a bounding box (lo, hi)
# so a union only evaluates it near where it can matter.

class Shape:
    def __init__(self, f, lo, hi):
        self.f, self.lo, self.hi = f, np.asarray(lo, F), np.asarray(hi, F)

    def __call__(self, P):
        return self.f(P)


def _box_of(points, pad):
    pts = np.asarray(points, F).reshape(-1, 3)
    return pts.min(0) - pad, pts.max(0) + pad


def sphere(c, r):
    c = np.asarray(c, F)
    return Shape(lambda P: L(P - c) - r, *_box_of([c], r))


def ellipsoid(c, radii, R=None):
    """Ellipsoid at c with semi-axes radii, optionally turned by rows R."""
    c, r = np.asarray(c, F), np.asarray(radii, F)
    Rm = np.eye(3, dtype=F) if R is None else np.asarray(R, F)

    def f(P):
        q = (P - c) @ Rm.T
        k0 = L(q / r)
        k1 = L(q / (r * r))
        return k0 * (k0 - 1.0) / np.maximum(k1, 1e-6)
    return Shape(f, *_box_of([c], float(r.max())))


def cone(a, b, ra, rb):
    """Round cone: a capsule from a (radius ra) to b (radius rb)."""
    a, b = np.asarray(a, F), np.asarray(b, F)
    ba = b - a
    l2 = float(np.dot(ba, ba))
    rr = ra - rb
    a2 = l2 - rr * rr
    il2 = 1.0 / l2

    def f(P):
        pa = P - a
        y = pa @ ba
        z = y - l2
        x2 = np.sum((pa * l2 - y[:, None] * ba) ** 2, axis=1)
        y2 = y * y * l2
        z2 = z * z * l2
        k = math.copysign(1, rr) * rr * rr * x2
        d3 = (np.sqrt(np.maximum(x2 * a2 * il2, 0)) + y * rr) * il2 - ra
        d1 = np.sqrt(x2 + z2) * il2 - rb
        d2 = np.sqrt(x2 + y2) * il2 - ra
        out = np.where(np.sign(y) * a2 * y2 < k, d2, d3)
        return np.where(np.sign(z) * a2 * z2 > k, d1, out)
    return Shape(f, *_box_of([a, b], max(ra, rb)))


def capsule(a, b, r):
    return cone(a, b, r, r * 0.999)


def chain(points, radii):
    """A bent tube through several points, tapering radius to radius."""
    parts = [cone(points[i], points[i + 1], radii[i], radii[i + 1])
             for i in range(len(points) - 1)]
    return union(*parts)


def rbox(c, half, r, R=None):
    """Rounded box at c, half-extents half, edge radius r, turned by rows R."""
    c, b = np.asarray(c, F), np.asarray(half, F) - r
    Rm = np.eye(3, dtype=F) if R is None else np.asarray(R, F)

    def f(P):
        q = np.abs((P - c) @ Rm.T) - b
        return L(np.maximum(q, 0)) + np.minimum(q.max(axis=1), 0) - r
    return Shape(f, *_box_of([c], float(np.linalg.norm(half))))


def cylinder(c, axis, r, h, edge=0.0):
    """Capped cylinder centred on c along axis, radius r, half-height h."""
    c = np.asarray(c, F)
    Rm = frame(axis)

    def f(P):
        q = (P - c) @ Rm.T
        d = np.stack([L(q[:, :2]) - (r - edge), np.abs(q[:, 2]) - (h - edge)], 1)
        return np.minimum(d.max(1), 0) + L(np.maximum(d, 0)) - edge
    return Shape(f, *_box_of([c], math.hypot(r, h)))


def torus(c, axis, R, r, squash=1.0):
    """Ring round axis at c: big radius R, tube radius r (squash < 1 flattens it)."""
    c = np.asarray(c, F)
    Rm = frame(axis)

    def f(P):
        q = (P - c) @ Rm.T
        a = L(q[:, :2]) - R
        return np.sqrt(a * a + (q[:, 2] / squash) ** 2) * min(1, squash) - r
    return Shape(f, *_box_of([c], R + r))


def plane_cut(shape, point, normal):
    """Keep the side of shape the normal points away from."""
    p, n = np.asarray(point, F), norm(normal)
    return Shape(lambda P: np.maximum(shape(P), (P - p) @ n), shape.lo, shape.hi)


# ---------------------------------------------------------------- combining

def smin(a, b, k):
    if k <= 0:
        return np.minimum(a, b)
    h = np.clip(0.5 + 0.5 * (b - a) / k, 0, 1)
    return b + (a - b) * h - k * h * (1 - h)


def smax(a, b, k):
    return -smin(-a, -b, k)


def _evaluate(shape, P, far):
    """shape(P), but only where P is inside its box; elsewhere 'far'."""
    inside = np.all((P >= shape.lo - far) & (P <= shape.hi + far), axis=1)
    out = np.full(len(P), far, F)
    if inside.any():
        out[inside] = shape(P[inside])
    return out


def union(*shapes, k=0.0):
    shapes = [s for s in shapes if s is not None]
    lo = np.min([s.lo for s in shapes], 0)
    hi = np.max([s.hi for s in shapes], 0)
    far = F(max(2.0, 3 * k))

    def f(P):
        d = np.full(len(P), 1e3, F)
        for s in shapes:
            d = smin(d, _evaluate(s, P, far), k)
        return d
    return Shape(f, lo - k, hi + k)


def carve(shape, *tools, k=0.0):
    """shape minus tools, the cut blended over k."""
    far = F(2.0)

    def f(P):
        d = shape(P)
        for t in tools:
            d = smax(d, -_evaluate(t, P, far), k)
        return d
    return Shape(f, shape.lo, shape.hi)


def intersect(a, b, k=0.0):
    return Shape(lambda P: smax(a(P), b(P), k), np.maximum(a.lo, b.lo), np.minimum(a.hi, b.hi))


def displace(shape, fn, amp):
    """Add a small surface texture fn(P) * amp (keep amp well under a mm)."""
    return Shape(lambda P: shape(P) + amp * fn(P), shape.lo - amp, shape.hi + amp)


# ---------------------------------------------------------------- texture

def noise(P, scale, octaves=3, seed=0):
    """Cheap smooth noise in [-1,1]: summed sines along fixed random directions."""
    rng = np.random.default_rng(seed)
    out = np.zeros(len(P), F)
    amp, tot = 1.0, 0.0
    for o in range(octaves):
        for _ in range(3):
            d = rng.normal(size=3).astype(F)
            d /= np.linalg.norm(d)
            ph = F(rng.uniform(0, 6.283))
            out += amp * np.sin((P @ d) * (2 ** o) / scale + ph)
            tot += amp
        amp *= 0.5
    return out / tot


# ---------------------------------------------------------------- lettering

FONTS = ["/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf", "DejaVuSerif-Bold.ttf"]


def lettering(text, height, px_per_mm=40, spacing=0.22):
    """Signed 2D distance (mm, negative inside a letter) for a line of capitals
    `height` mm tall, centred on (0, 0). Returns g(u, v) -> d."""
    from PIL import Image, ImageDraw, ImageFont
    from scipy.ndimage import distance_transform_edt, map_coordinates
    font = None
    for f in FONTS:
        try:
            font = ImageFont.truetype(f, int(height * px_per_mm * 1.36))
            break
        except OSError:
            continue
    font = font or ImageFont.load_default()
    probe = ImageDraw.Draw(Image.new("L", (1, 1)))
    widths = [probe.textlength(ch, font=font) for ch in text]
    gap = spacing * height * px_per_mm
    W = int(sum(widths) + gap * (len(text) - 1) + 4 * height * px_per_mm)
    H = int(3 * height * px_per_mm)
    im = Image.new("L", (W, H), 0)
    d = ImageDraw.Draw(im)
    x = 2 * height * px_per_mm
    for ch, w in zip(text, widths):
        d.text((x, H / 2), ch, fill=255, font=font, anchor="lm")
        x += w + gap
    m = np.asarray(im) > 127
    ys, xs = np.nonzero(m)
    cy, cx = (ys.min() + ys.max()) / 2, (xs.min() + xs.max()) / 2
    sd = (distance_transform_edt(~m) - distance_transform_edt(m)).astype(F) / px_per_mm

    def g(u, v):
        col = cx + u * px_per_mm
        row = cy - v * px_per_mm
        return map_coordinates(sd, [row, col], order=1, mode="constant", cval=5.0).astype(F)
    g.width = (xs.max() - xs.min()) / px_per_mm
    return g


def engrave_plane(shape, text, height, origin, u_axis, normal, depth=0.3):
    """Cut text into a flat face: origin is the middle of the line ON the face,
    u_axis runs along the line, normal points out of the face."""
    o, uu, n = np.asarray(origin, F), norm(u_axis), norm(normal)
    vv = np.cross(n, uu)
    g = lettering(text, height)

    def tool(P):
        q = P - o
        return np.maximum(g(q @ uu, q @ vv), -(q @ n) - depth)
    lo, hi = _box_of([o], g.width / 2 + height)
    return carve(shape, Shape(tool, lo, hi))


def engrave_wall(shape, text, height, radius_at, z_mid, depth=0.3, centre_deg=0):
    """Cut text round a vertical cylindrical wall facing the viewer (-y).
    radius_at(z) gives the wall's radius at that height."""
    g = lettering(text, height)

    def tool(P):
        r = np.sqrt(P[:, 0] ** 2 + P[:, 1] ** 2)
        R = radius_at(P[:, 2])
        ang = np.arctan2(P[:, 0], -P[:, 1]) - math.radians(centre_deg)
        return np.maximum(g(ang * R, P[:, 2] - z_mid), (R - depth) - r)
    span = g.width / 2 + height
    R0 = radius_at(np.asarray([z_mid], F))[0]
    lo = (-span - 1, -R0 - 1, z_mid - height)
    hi = (span + 1, -R0 + depth + 3, z_mid + height)
    return carve(shape, Shape(tool, lo, hi))


# ---------------------------------------------------------------- meshing

def field(shape, lo, hi, step, coarse=0.5, band=1.3, chunk=1_500_000, log=print):
    """Sample shape on a grid of `step` mm, exactly near the surface only."""
    from scipy.ndimage import map_coordinates
    lo, hi = np.asarray(lo, F), np.asarray(hi, F)
    n = np.ceil((hi - lo) / step).astype(int) + 1
    nc = np.ceil((hi - lo) / coarse).astype(int) + 2
    gc = [lo[i] + np.arange(nc[i], dtype=F) * coarse for i in range(3)]
    C = np.stack(np.meshgrid(*gc, indexing="ij"), -1).reshape(-1, 3)
    dc = np.concatenate([shape(C[i:i + chunk]) for i in range(0, len(C), chunk)])
    dc = dc.reshape(nc)
    log(f"  coarse grid {tuple(nc)} done")
    out = np.empty(tuple(n), F)
    ratio = step / coarse
    xs = np.arange(n[0], dtype=F) * ratio
    ys = np.arange(n[1], dtype=F) * ratio
    exact = 0
    for k in range(n[2]):
        z = lo[2] + k * step
        zi = np.full((n[0], n[1]), k * ratio, F)
        X, Y = np.meshgrid(xs, ys, indexing="ij")
        approx = map_coordinates(dc, [X.ravel(), Y.ravel(), zi.ravel()], order=1).astype(F)
        near = np.abs(approx) < band
        if near.any():
            ix = np.nonzero(near)[0]
            P = np.stack([lo[0] + (ix // n[1]) * step, lo[1] + (ix % n[1]) * step,
                          np.full(len(ix), z, F)], 1).astype(F)
            approx[ix] = shape(P)
            exact += len(ix)
        out[:, :, k] = approx.reshape(n[0], n[1])
    log(f"  fine grid {tuple(n)} at {step} mm, {exact / 1e6:.1f} M points evaluated exactly")
    return out


def mesh(grid, lo, step):
    """Marching cubes over a grid that is positive on every face of the box."""
    from skimage.measure import marching_cubes
    g = grid.copy()
    g[0, :, :] = g[-1, :, :] = g[:, 0, :] = g[:, -1, :] = g[:, :, 0] = g[:, :, -1] = 1.0
    verts, faces, normals, _ = marching_cubes(g, level=0.0, spacing=(step, step, step),
                                              gradient_direction="descent")  # outward-wound for a field negative inside
    verts = verts.astype(F) + np.asarray(lo, F)
    return verts, faces.astype(np.int64), normals.astype(F)


# ---------------------------------------------------------------- photographs

PALETTE = {"bg": (241, 234, 219), "ink": (43, 33, 24), "clay": (196, 184, 166)}


def surface_points(verts, faces, vnormals, px):
    """Points over every triangle, no further apart than px, with smooth normals:
    enough to photograph a mesh of any density by splatting."""
    A, B, C = verts[faces[:, 0]], verts[faces[:, 1]], verts[faces[:, 2]]
    e = np.maximum(np.maximum(L(B - A), L(C - B)), L(A - C))
    k = np.clip(np.ceil(e / px), 1, 60).astype(int)
    P, N = [], []
    for kk in np.unique(k):
        sel = np.nonzero(k == kk)[0]
        ij = [(i, j) for i in range(kk + 1) for j in range(kk + 1 - i)]
        w = np.array([(i / kk, j / kk, 1 - (i + j) / kk) for i, j in ij], F)
        for wa, wb, wc in w:
            P.append(A[sel] * wa + B[sel] * wb + C[sel] * wc)
            N.append(vnormals[faces[sel, 0]] * wa + vnormals[faces[sel, 1]] * wb
                     + vnormals[faces[sel, 2]] * wc)
    return np.concatenate(P).astype(F), np.concatenate(N).astype(F)


def render(points, normals, view, px=0.06, light=(-0.45, 0.55, 0.75)):
    """Orthographic photo of surface points (see surface_points). view = rows of
    a camera frame: screen right, screen up, toward the viewer. Returns RGB."""
    R = np.asarray(view, F)
    q = points @ R.T
    n = normals @ R.T
    n /= np.maximum(L(n)[:, None], 1e-6)
    u0, v0 = q[:, 0].min() - 1, q[:, 1].min() - 1
    W = int((q[:, 0].max() + 1 - u0) / px) + 1
    H = int((q[:, 1].max() + 1 - v0) / px) + 1
    u = ((q[:, 0] - u0) / px).astype(int)
    vv = (H - 1 - (q[:, 1] - v0) / px).astype(int)
    depth = np.full(H * W, -1e9, F)
    shade = np.zeros(H * W, F)
    lam = np.clip(n @ norm(light), 0, 1)  # light is in camera space
    fill = np.clip(n @ norm((0.7, 0.1, 0.5)), 0, 1)
    rim = np.clip(1 - np.abs(n[:, 2]), 0, 1) ** 3
    s = 0.2 + 0.66 * lam + 0.16 * fill + 0.1 * rim
    idx = vv * W + u
    np.maximum.at(depth, idx, q[:, 2])
    win = q[:, 2] >= depth[idx] - 1e-5
    shade[idx[win]] = s[win]
    D = depth.reshape(H, W)
    hit = D > -1e8
    # cavity shading: darken a pixel sitting below the mean depth around it
    from scipy.ndimage import uniform_filter
    Dm = np.where(hit, D, np.nan)
    filled = np.where(hit, D, np.nanmin(Dm) if hit.any() else 0)
    local = uniform_filter(filled, size=9)
    cav = np.clip((local - filled) / 0.25, 0, 1)
    S = shade.reshape(H, W) * (1 - 0.35 * cav)
    img = np.zeros((H, W, 3), F)
    img[:] = PALETTE["bg"]
    clay = np.asarray(PALETTE["clay"], F)
    img[hit] = np.clip(S[hit, None] * clay * 1.25, 0, 255)
    edge = np.zeros((H, W), bool)
    for ax in (0, 1):
        for sh in (1, -1):
            nb = np.roll(D, sh, axis=ax)
            edge |= hit & ((nb < -1e8) | (nb < D - 0.8))
    img[edge] = PALETTE["ink"]
    return img.astype(np.uint8)


VIEWS = {
    # rows: screen right, screen up, toward the viewer. Figure faces -y.
    "front": [(1, 0, 0), (0, 0, 1), (0, -1, 0)],
    "right": [(0, -1, 0), (0, 0, 1), (1, 0, 0)],
    "back": [(-1, 0, 0), (0, 0, 1), (0, 1, 0)],
    "left": [(0, 1, 0), (0, 0, 1), (-1, 0, 0)],
    "top": [(1, 0, 0), (0, 1, 0), (0, 0, 1)],
}


def three_quarter(yaw=-35, pitch=18):
    base = np.asarray(VIEWS["front"], F)
    Ry = rot((0, 0, 1), yaw)
    Rp = rot((1, 0, 0), -pitch)
    return (base @ Ry.T) @ Rp.T  # turn the world, then tilt the camera


def proof_sheet(verts, faces, vnormals, title, path, px=0.06):
    """Five sides and a three-quarter view on one sheet, with a 10 mm ruler."""
    from PIL import Image, ImageDraw, ImageFont
    shots = [("front", VIEWS["front"]), ("three-quarter", three_quarter()),
             ("right side", VIEWS["right"]), ("back", VIEWS["back"]),
             ("left side", VIEWS["left"]), ("top", VIEWS["top"])]
    pts, nrm = surface_points(verts, faces, vnormals, px * 0.7)
    imgs = [(name, Image.fromarray(render(pts, nrm, R, px))) for name, R in shots]
    cw = max(i.width for _, i in imgs)
    ch = max(i.height for _, i in imgs)
    pad, head = 30, 70
    cols = 3
    rows = 2
    sheet = Image.new("RGB", (cols * (cw + pad) + pad, head + rows * (ch + pad + 30) + 70), PALETTE["bg"])
    d = ImageDraw.Draw(sheet)
    try:
        font = ImageFont.truetype("DejaVuSans.ttf", 26)
        small = ImageFont.truetype("DejaVuSans.ttf", 18)
    except OSError:
        font = small = ImageFont.load_default()
    d.text((pad, 20), title, fill=PALETTE["ink"], font=font)
    for i, (name, im) in enumerate(imgs):
        x = pad + (i % cols) * (cw + pad) + (cw - im.width) // 2
        y = head + (i // cols) * (ch + pad + 30) + (ch - im.height)
        sheet.paste(im, (x, y))
        d.text((pad + (i % cols) * (cw + pad), head + (i // cols) * (ch + pad + 30) + ch + 4),
               name, fill=PALETTE["ink"], font=small)
    # ruler: 10 mm at the sheet's scale
    y = sheet.height - 40
    mm = 1 / px
    d.line((pad, y, pad + 10 * mm, y), fill=PALETTE["ink"], width=3)
    for t in range(11):
        h = 12 if t % 5 == 0 else 6
        d.line((pad + t * mm, y - h, pad + t * mm, y), fill=PALETTE["ink"], width=2)
    d.text((pad + 10 * mm + 12, y - 16), "10 mm", fill=PALETTE["ink"], font=small)
    sheet.save(path)
    return path


# ---------------------------------------------------------------- printability

def thin_parts(grid, step, min_wall):
    """Parts of the solid thinner than min_wall that stand clear of the bulk:
    the fragile bits (a blade of grass, a thin hem). A ball of diameter min_wall
    rolled through the solid cannot reach them, and they are more than min_wall
    from anywhere it can - which leaves out the sharp edges and corners that an
    opening also shaves off a perfectly sturdy body. Returns (mm3, clusters)."""
    from scipy import ndimage
    solid = grid < 0
    r = max(1, int(round(min_wall / 2 / step)))
    zz, yy, xx = np.mgrid[-r:r + 1, -r:r + 1, -r:r + 1]
    ball = (xx * xx + yy * yy + zz * zz) <= r * r
    opened = ndimage.binary_opening(solid, structure=ball)
    away = ndimage.distance_transform_edt(~opened) * step > min_wall
    thin = solid & ~opened & away
    lab, nlab = ndimage.label(thin)
    clusters = []
    if nlab:
        sizes = ndimage.sum(thin, lab, range(1, nlab + 1))
        coms = ndimage.center_of_mass(thin, lab, range(1, nlab + 1))
        for s, c in sorted(zip(sizes, coms), key=lambda t: -t[0])[:8]:
            clusters.append((float(s) * step ** 3, [float(x) * step for x in c]))
    return float(thin.sum()) * step ** 3, clusters


def overhang_report(mesh_tm, tilts, base_z_tol=0.05):
    """For each (name, rotation) orientation: area facing down steeper than 45
    degrees, and islands - vertices lower than every neighbour, which is where a
    resin print starts in mid-air and needs a support."""
    out = []
    neighbours = mesh_tm.vertex_neighbors
    for name, R in tilts:
        V = mesh_tm.vertices @ np.asarray(R).T
        N = mesh_tm.face_normals @ np.asarray(R).T
        zmin = V[:, 2].min()
        fz = V[mesh_tm.faces][:, :, 2].mean(1)
        steep = (N[:, 2] < -0.7071) & (fz > zmin + base_z_tol)
        area = float(mesh_tm.area_faces[steep].sum())
        z = V[:, 2]
        islands = 0
        for i, nb in enumerate(neighbours):
            if z[i] > zmin + base_z_tol and nb and z[i] < z[nb].min():
                islands += 1
        out.append((name, area, islands))
    return out

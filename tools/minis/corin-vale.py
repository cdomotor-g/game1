"""Corin Vale (CHR-01) as a 32 mm miniature, in two poses.

    python3 tools/minis/corin-vale.py              # both poses
    python3 tools/minis/corin-vale.py milestone    # one pose
    python3 tools/minis/corin-vale.py --draft      # coarse and quick, for posing

Writes docs/minis/corin-vale-<pose>.stl and a proof sheet of each beside it
under docs/minis/proof/ (git-ignored: a proof is a photograph, not the piece).

The figure is read off his card plate, docs/art/renders/character-chr-01.png:
a green travelling cloak with the hood down, a scarf, a waistcoat over a shirt
with the sleeves rolled, a satchel on the right hip, a long walking staff,
patched trousers, rag-bound shins and laced boots. The card shows him with
one boot up on a milestone, lacing it; that is pose one. Pose two is the
same man on the road.

Units are millimetres. The figure faces -y; his right is -x. z = 0 is the
underside of the base.
"""

import sys
import time
import numpy as np
import sdf
from sdf import (v, norm, rot, sphere, ellipsoid, cone, capsule, chain, rbox, cylinder,
                 Shape, union, carve, smin, smax, displace, noise, F, L, plane_cut)

BASE_R, BASE_H = 12.5, 3.0      # a 25 mm round base, 3 mm tall
UP = v(0, 0, 1)


# ---------------------------------------------------------------- joints

def bend(a, c, l1, l2, pole):
    """The middle joint (knee, elbow) of a two-bone limb from a to c."""
    a, c, pole = np.asarray(a, F), np.asarray(c, F), norm(pole)
    d = c - a
    dist = float(np.linalg.norm(d))
    dist = min(dist, l1 + l2 - 0.02)
    dirn = d / np.linalg.norm(d)
    along = (l1 * l1 - l2 * l2 + dist * dist) / (2 * dist)
    h = max(l1 * l1 - along * along, 0) ** 0.5
    p = pole - dirn * float(np.dot(pole, dirn))
    p = p / np.linalg.norm(p)
    return a + dirn * along + p * h


def lift(p):
    """Pose coordinates are above the base top; the model's are above its underside."""
    return np.asarray(p, F) + v(0, 0, BASE_H)


# ---------------------------------------------------------------- the man

THIGH, SHIN = 7.0, 6.9
UPPER, FORE = 5.6, 5.0


def leg(hip, knee, ankle, toe_dir, sole_z, wraps=False, patch=None):
    shin_dir = norm(knee - ankle)
    trouser = union(cone(hip, knee, 1.9, 1.42), cone(knee, ankle, 1.42, 1.08), k=0.5)
    trouser = displace(trouser, lambda P: noise(P, 0.45, 2, seed=3), 0.11)
    parts = [trouser]
    if wraps:   # rag bindings round the shin, as on the card
        for t, r in ((0.55, 1.32), (0.72, 1.36)):
            c = ankle + (knee - ankle) * t
            parts.append(band(trouser, c, shin_dir, 0.32, 0.22))
    if patch is not None:   # a knee patch
        n = norm(patch)
        parts.append(ellipsoid(knee + n * 1.15, (0.95, 0.85, 0.2), sdf.frame(n)))
    # boot
    top = ankle + (knee - ankle) * 0.38
    shaft = cone(ankle - UP * 0.3, top, 1.12, 1.24)
    cuff = band(shaft, top - shin_dir * 0.25, shin_dir, 0.33, 0.3)
    t = norm((toe_dir[0], toe_dir[1], 0))
    heel = v(ankle[0], ankle[1], sole_z + 0.85) - t * 0.75
    toe = v(ankle[0], ankle[1], sole_z + 0.7) + t * 3.2
    foot = union(cone(heel, toe, 0.98, 0.8), shaft, k=0.6)
    boot = union(foot, cuff, k=0.15)
    # laces: three little crossings down the front of the shaft
    front = norm(np.cross(shin_dir, np.cross(t, shin_dir)))
    for i in range(3):
        c = ankle + shin_dir * (0.3 + 0.55 * i) + front * 1.12
        boot = union(boot, ellipsoid(c, (0.55, 0.16, 0.16),
                                     sdf.frame(front, hint=np.cross(shin_dir, front))), k=0.1)
    boot = plane_cut(union(boot, k=0), v(0, 0, sole_z), v(0, 0, -1))
    parts.append(boot)
    return union(*parts, k=0.25)


def band(shape, centre, axis, half, thick):
    """A ring of cloth laid on a shape: its surface pushed out by `thick` over a
    slab `half` either side of centre along axis."""
    c, a = np.asarray(centre, F), norm(axis)

    def f(P):
        return np.maximum(shape(P) - thick, np.abs((P - c) @ a) - half)
    return Shape(f, shape.lo - thick, shape.hi + thick)


def arm(shoulder, elbow, wrist, hand_dir, grip=None):
    up_dir, fore_dir = norm(elbow - shoulder), norm(wrist - elbow)
    sleeve = cone(shoulder, elbow + up_dir * 0.2, 1.35, 1.15)
    sleeve = displace(sleeve, lambda P: noise(P, 0.4, 2, seed=5), 0.13)
    cuff = cone(elbow - up_dir * 0.1, elbow + fore_dir * 1.0, 1.18, 1.08)
    forearm = cone(elbow, wrist, 0.9, 0.64)
    if grip is not None:   # a fist closed round a staff
        hand = ellipsoid(grip, (0.82, 0.82, 0.95), sdf.frame(hand_dir))
    else:
        h = norm(hand_dir)
        hand = union(ellipsoid(wrist + h * 0.75, (0.72, 0.42, 0.95),
                               sdf.frame(h, hint=np.cross(h, fore_dir) + v(0, 0, 0.01))),
                     capsule(wrist + h * 0.25, wrist + h * 0.9 + norm(np.cross(h, UP) + 1e-3) * 0.45, 0.25),
                     k=0.2)
    return union(sleeve, cuff, forearm, hand, k=0.3)


def head(c, fwd, smile=True):
    fwd = norm(fwd)
    up = norm(UP - fwd * float(np.dot(UP, fwd)))
    side = np.cross(fwd, up)          # the figure's right, as seen from behind
    R = np.stack([side, fwd, up])
    skull = ellipsoid(c, (1.82, 2.05, 2.25), R)
    jaw = ellipsoid(c + fwd * 0.65 - up * 1.05, (1.38, 1.35, 1.15), R)
    nose = cone(c + fwd * 1.85 + up * 0.15, c + fwd * 2.35 - up * 0.5, 0.26, 0.33)
    brow = capsule(c + fwd * 1.68 + up * 0.5 + side * 0.85, c + fwd * 1.68 + up * 0.5 - side * 0.85, 0.32)
    cheeks = [sphere(c + fwd * 1.45 + s * side * 0.92 - up * 0.45, 0.5) for s in (1, -1)]
    ears = [ellipsoid(c + s * side * 1.75 - up * 0.15, (0.28, 0.45, 0.62), R) for s in (1, -1)]
    chin = sphere(c + fwd * 1.55 - up * 1.7, 0.5)
    face = union(skull, jaw, nose, brow, chin, *cheeks, *ears, k=0.45)
    eyes = [sphere(c + fwd * 2.02 + s * side * 0.66 + up * 0.08, 0.32) for s in (1, -1)]
    mouth = chain([c + fwd * 1.98 - up * 0.95 + side * 0.55,
                   c + fwd * 2.08 - up * 1.12,
                   c + fwd * 1.98 - up * 0.95 - side * 0.55], [0.11, 0.12, 0.11])
    face = carve(face, *eyes, k=0.18)
    if smile:
        face = carve(face, mouth, k=0.08)
    # hair: a tousled cap, swept back, curling over the collar
    cap = ellipsoid(c + up * 0.35 - fwd * 0.3, (2.05, 2.25, 2.3), R)
    hairline = Shape(lambda P: ((P - c) @ fwd) - 0.75 - 0.9 * ((P - c) @ up), cap.lo, cap.hi)
    cap = sdf.intersect(cap, hairline, k=0.4)
    locks = []
    rng = np.random.default_rng(11)
    for i in range(9):
        a = np.radians(-105 + i * 26)
        out = side * np.sin(a) - fwd * np.cos(a)
        p0 = c + up * 1.6 + out * 0.8
        p1 = c + up * 0.4 + out * 2.05 + v(*rng.normal(0, 0.15, 3))
        p2 = c - up * 1.4 + out * 2.2 - fwd * 0.3
        p3 = c - up * 2.5 + out * 1.9 - fwd * 0.8 + up * rng.uniform(-0.3, 0.3)
        locks.append(chain([p0, p1, p2, p3], [0.62, 0.62, 0.5, 0.3]))
    for s in (1, -1):     # two locks fallen over the forehead
        locks.append(chain([c + up * 2.0 + fwd * 0.6, c + up * 1.4 + fwd * 1.75 + s * side * 0.8,
                            c + up * 0.85 + fwd * 1.8 + s * side * 1.35], [0.45, 0.32, 0.22]))
    hair = union(cap, *locks, k=0.35)
    hair = displace(hair, lambda P: noise(P, 0.3, 2, seed=9), 0.1)
    return union(face, hair, k=0.2)


def body(J, pose):
    """Everything but the props and the base, from a dict of joints."""
    up_t = norm(J["neck"] - J["pelvis"])
    fwd_t = norm(J["facing"] - up_t * float(np.dot(J["facing"], up_t)))
    left = np.cross(up_t, fwd_t)
    R = np.stack([left, fwd_t, up_t])
    pelvis = ellipsoid(J["pelvis"] + up_t * 0.3, (2.55, 1.85, 1.95), R)
    belly = ellipsoid(J["waist"], (2.5, 1.85, 2.0), R)
    chest = ellipsoid(J["chest"], (3.0, 2.05, 2.45), R)
    yoke = capsule(J["sh_r"], J["sh_l"], 1.15)
    neck = cone(J["neck"] - up_t * 0.5, J["head"] - J["head_up"] * 1.3, 0.95, 0.82)
    torso = union(pelvis, belly, chest, yoke, k=1.0)
    torso = displace(torso, lambda P: noise(P, 0.6, 2, seed=1), 0.06)
    belt_c = J["pelvis"] + up_t * 1.6
    belt = band(torso, belt_c, up_t, 0.38, 0.22)
    buckle = rbox(belt_c + fwd_t * 1.95, (0.42, 0.18, 0.42), 0.1, R)
    # the shirt's tail below the belt, hanging in folds to the top of the thigh
    skirt = cone(J["pelvis"] + up_t * 1.2, J["pelvis"] - up_t * 3.9, 2.75, 3.6)
    skirt = plane_cut(skirt, J["pelvis"] - up_t * 3.2, -up_t)
    skirt = displace(skirt, lambda P: np.sin(np.arctan2((P - J["pelvis"]) @ left,
                                                        (P - J["pelvis"]) @ fwd_t) * 9) * 0.5
                     + 0.5 * noise(P, 0.5, 1, seed=13), 0.14)
    # the waistcoat: a layer over chest and belly, open down the front
    wc_lo, wc_hi = J["pelvis"] + up_t * 1.3, J["neck"] - up_t * 1.2

    def waistcoat(P):
        q = P - J["waist"]
        ang = np.arctan2(q @ left, q @ fwd_t)
        r = np.sqrt((q @ left) ** 2 + (q @ fwd_t) ** 2)
        d = torso(P) - 0.3
        d = np.maximum(d, np.maximum((wc_lo - P) @ up_t, (P - wc_hi) @ up_t))
        return np.maximum(d, (0.32 - np.abs(ang)) * r)
    lapels = [Shape(waistcoat, torso.lo, torso.hi)]
    scarf = band(neck, J["neck"] + up_t * 0.25, up_t, 0.55, 0.5)
    knot = ellipsoid(J["neck"] + fwd_t * 1.25 - up_t * 0.2, (0.7, 0.5, 0.6), R)
    tails = [chain([J["neck"] + fwd_t * 1.3 - up_t * 0.4,
                    J["neck"] + fwd_t * 1.7 + s * left * 0.5 - up_t * 1.6,
                    J["neck"] + fwd_t * 1.85 + s * left * 0.8 - up_t * 2.6], [0.42, 0.34, 0.26])
             for s in (0.4, -0.7)]
    legs = [leg(J["hip_r"], J["knee_r"], J["ankle_r"], J["toe_r"], J["sole_r"],
                wraps=True, patch=J.get("patch_r")),
            leg(J["hip_l"], J["knee_l"], J["ankle_l"], J["toe_l"], J["sole_l"],
                patch=J.get("patch_l"))]
    arms = [arm(J["sh_r"], J["el_r"], J["wr_r"], J["hand_r"], J.get("grip_r")),
            arm(J["sh_l"], J["el_l"], J["wr_l"], J["hand_l"], J.get("grip_l"))]
    man = union(torso, belt, buckle, skirt, *lapels, neck, scarf, knot, *tails, *legs, *arms,
                head(J["head"], J["head_fwd"]), k=0.3)
    return man, (up_t, fwd_t, left)


# ---------------------------------------------------------------- the cloak

def cloak(J, frame_t, rings, open_deg, hem, seed=4):
    """The travelling cloak: a cowl laid over the shoulders, the hood fallen
    behind the neck, and a skirt of cloth hung through horizontal rings.

    rings: (z, centre_x, centre_y, half_depth, half_width, fold_amp) from the
    shoulders down; open_deg: how far round from the back the cloth reaches;
    hem(theta) -> z of the bottom edge."""
    up_t, fwd_t, left = frame_t
    back = norm(v(-fwd_t[0], -fwd_t[1], 0))
    side = np.cross(UP, back)
    zs = np.array([r[0] for r in rings], F)[::-1]
    cols = [np.array([r[i] for r in rings], F)[::-1] for i in range(1, 6)]
    th = 0.9
    rng = np.random.default_rng(seed)
    phases = rng.uniform(0, 6.28, 3)
    lim = np.radians(open_deg)

    def hang(P):
        z = P[:, 2]
        cx, cy, ab, aw, amp = (np.interp(z, zs, c) for c in cols)
        dx, dy = P[:, 0] - cx, P[:, 1] - cy
        r = np.sqrt(dx * dx + dy * dy) + 1e-6
        bx = dx * back[0] + dy * back[1]
        sx = dx * side[0] + dy * side[1]
        ang = np.arctan2(sx, bx)
        Re = 1.0 / np.sqrt((np.cos(ang) / ab) ** 2 + (np.sin(ang) / aw) ** 2)
        fold = (np.sin(7 * ang + phases[0] + 0.15 * z) * 0.65
                + np.sin(11 * ang + phases[1] - 0.1 * z) * 0.35)
        slope = amp * (7 * 0.65 * np.cos(7 * ang + phases[0] + 0.15 * z)
                       + 11 * 0.35 * np.cos(11 * ang + phases[1] - 0.1 * z)) / Re
        R = Re + amp * fold
        # divide by the slope of the folds so the cloth is th thick everywhere,
        # not only where it happens to face straight out
        d = np.abs(r - R) / np.sqrt(1 + slope * slope) - th / 2
        d = np.maximum(d, (np.abs(ang) - lim) * r)
        d = np.maximum(d, hem(ang) - z)
        d = np.maximum(d, z - zs[-1])
        return d
    lo = v(min(cols[0] - cols[3] - 2), min(cols[1] - cols[3] - 2), 0)
    hi = v(max(cols[0] + cols[3] + 2), max(cols[1] + cols[3] + 2), zs[-1] + 1)
    skirt = Shape(hang, lo, hi)
    skirt = displace(skirt, lambda P: noise(P, 0.9, 2, seed=seed), 0.06)

    # the cowl: a shell laid over chest and shoulders, open at the throat
    chest = ellipsoid(J["chest"], (2.85, 1.9, 2.4), np.stack([left, fwd_t, up_t]))
    yoke = capsule(J["sh_r"], J["sh_l"], 1.15)
    under = union(chest, yoke, k=1.0)
    n0 = J["neck"]

    def cowl_f(P):
        s = under(P)
        d = s - 1.05
        q = P - n0
        ang = np.arctan2(q @ left, -(q @ fwd_t))
        d = np.maximum(d, (np.abs(ang) - np.radians(150)) * 2.0)
        edge = -2.9 + 0.35 * np.sin(6 * ang + 1.0)
        d = np.maximum(d, edge - (q @ up_t))
        d = smax(d, np.abs(q @ left) - 3.3, 0.5)
        return d
    cowl = Shape(cowl_f, under.lo - 2, under.hi + 2)
    hood = ellipsoid(n0 - fwd_t * 2.0 + up_t * 0.1, (2.2, 1.15, 1.55), np.stack([left, fwd_t, up_t]))
    hood = displace(hood, lambda P: noise(P, 0.5, 2, seed=seed + 1), 0.18)
    clasp = sphere(n0 + fwd_t * 1.0 + left * 1.1 - up_t * 0.45, 0.42)
    return union(skirt, cowl, hood, clasp, k=0.35)


# ---------------------------------------------------------------- his things

def satchel(J, frame_t):
    up_t, fwd_t, left = frame_t
    hip_side = -left       # his right hip
    fh = norm(v(fwd_t[0], fwd_t[1], 0))
    sh = norm(v(hip_side[0], hip_side[1], 0))
    out = norm(sh * 0.85 + fh * J.get("bag_fwd", 0.55))
    c = J["pelvis"] + out * 2.75 - UP * 1.1
    across = norm(np.cross(UP, out))
    Rb = np.stack([across, np.cross(out, across), out])   # rows: along, up, out
    bag = rbox(c, (2.0, 1.45, 0.85), 0.5, Rb)
    flap = rbox(c + out * 0.75 + UP * 0.35, (2.05, 1.0, 0.18), 0.15, Rb)
    buckle = rbox(c + out * 0.98 - UP * 0.15, (0.35, 0.3, 0.12), 0.06, Rb)
    seam = capsule(c + out * 0.85 + UP * 1.3 + across * 1.9, c + out * 0.85 + UP * 1.3 - across * 1.9, 0.14)
    bag = union(bag, flap, buckle, seam, k=0.12)
    bag = displace(bag, lambda P: noise(P, 0.6, 2, seed=21), 0.06)
    # the strap over his left shoulder, across the chest and back
    top = J["sh_l"] + up_t * 1.55 - left * 0.2
    front = [top, J["sh_l"] + fwd_t * 1.6 + up_t * 0.6 - left * 0.4,
             J["chest"] + fwd_t * 2.25, J["waist"] + fwd_t * 1.95 - left * 1.6,
             c + UP * 1.3 + across * 1.2]
    behind = [top, J["chest"] - fwd_t * 2.3 + up_t * 0.6,
              J["waist"] - fwd_t * 2.1 - left * 1.6, J["pelvis"] - fwd_t * 1.2 - left * 2.6 + UP * 0.6,
              c + UP * 1.3 - across * 1.6]
    strap = union(chain(front, [0.26] * len(front)), chain(behind, [0.26] * len(behind)))
    return union(bag, strap, k=0.15)


def staff(foot, top):
    """A long, knotted walking staff, thick enough to survive the printer."""
    foot, top = np.asarray(foot, F), np.asarray(top, F)
    d = top - foot
    pts = [foot + d * t + v(0.08 * np.sin(9 * t), 0.08 * np.cos(7 * t), 0) for t in np.linspace(0, 1, 7)]
    shaft = chain(pts, [0.72, 0.72, 0.7, 0.7, 0.68, 0.7, 0.8])
    knots = [sphere(foot + d * t, 0.9) for t in (0.31, 0.58, 0.83)]
    cap = sphere(top - norm(d) * 0.2, 0.95)
    return union(shaft, *knots, cap, k=0.3)


def milestone(c, half, top_z):
    """The roadside milestone his boot is up on, a mile figure cut in its face."""
    c = np.asarray(c, F)
    hx, hy = half
    arch_r = hx
    block = rbox(v(c[0], c[1], (BASE_H + top_z) / 2 - 0.5), (hx, hy, (top_z - BASE_H) / 2 + 0.5), 0.45)
    arch = cylinder(v(c[0], c[1], top_z - arch_r), (0, 1, 0), arch_r, hy, edge=0.45)
    keep = Shape(lambda P: np.minimum(arch(P), (P[:, 2] - (top_z - arch_r))), block.lo, block.hi)
    stone = Shape(lambda P: smax(block(P), keep(P), 0.3), block.lo, block.hi)
    stone = displace(stone, lambda P: noise(P, 0.5, 3, seed=31), 0.12)
    chips = [sphere(v(c[0] + hx * 0.9, c[1] - hy, top_z - 3.5), 0.45),
             sphere(v(c[0] - hx, c[1] - hy * 0.4, BASE_H + 2.0), 0.4)]
    stone = carve(stone, *chips, k=0.15)
    return sdf.engrave_plane(stone, "XII", 1.5, v(c[0], c[1] - hy, top_z - 3.6),
                             (1, 0, 0), (0, -1, 0), depth=0.28)


def tuft(at, n=5, h=1.4, seed=0):
    rng = np.random.default_rng(seed)
    at = lift(at)
    blades = []
    for i in range(n):
        a = rng.uniform(0, 6.28)
        lean = rng.uniform(0.25, 0.55)
        tip = at + v(np.cos(a) * lean * h, np.sin(a) * lean * h, h * rng.uniform(0.7, 1.0))
        blades.append(cone(at + v(np.cos(a) * 0.2, np.sin(a) * 0.2, -0.1), tip, 0.38, 0.17))
    return union(*blades, k=0.15)


def base(name, extras=()):
    """A 25 mm round base, bevelled, with earth on top and his name round the front."""
    def radius_at(z):
        return BASE_R - 0.4 * (np.asarray(z, F) / BASE_H)

    def disc(P):
        r = np.sqrt(P[:, 0] ** 2 + P[:, 1] ** 2)
        z = P[:, 2]
        d = np.maximum(r - radius_at(z), np.maximum(-z, z - BASE_H))
        top_round = np.sqrt(np.maximum(r - (radius_at(z) - 0.5), 0) ** 2
                            + np.maximum(z - (BASE_H - 0.5), 0) ** 2) - 0.5
        return np.where((r > radius_at(z) - 0.5) & (z > BASE_H - 0.5), top_round, d)
    plinth = Shape(disc, v(-BASE_R, -BASE_R, 0), v(BASE_R, BASE_R, BASE_H))

    def earth(P):
        r = np.sqrt(P[:, 0] ** 2 + P[:, 1] ** 2)
        surf = BASE_H + 0.22 + 0.18 * noise(P * v(1, 1, 0), 1.6, 3, seed=41)
        return np.maximum(r - (BASE_R - 1.0), np.maximum(P[:, 2] - surf, BASE_H - 0.5 - P[:, 2]))
    ground = Shape(earth, v(-BASE_R, -BASE_R, BASE_H - 1), v(BASE_R, BASE_R, BASE_H + 1))
    rng = np.random.default_rng(51)
    pebbles = []
    for _ in range(9):
        a, rr = rng.uniform(0, 6.28), rng.uniform(4.5, 10.5)
        s = rng.uniform(0.35, 0.75)
        pebbles.append(ellipsoid(v(rr * np.cos(a), rr * np.sin(a), BASE_H + 0.15),
                                 (s * 1.3, s, s * 0.6), rot((0, 0, 1), rng.uniform(0, 180))))
    b = union(plinth, ground, *pebbles, *extras, k=0.2)
    return sdf.engrave_wall(b, name, 1.6, radius_at, BASE_H / 2 - 0.1, depth=0.3)


# ---------------------------------------------------------------- poses

def finish(J):
    """Fill in elbows, knees and shoulders from what a pose states."""
    J = {k: (np.asarray(val, F) if isinstance(val, (tuple, list, np.ndarray)) else val)
         for k, val in J.items()}
    for k in ("pelvis", "waist", "chest", "neck", "head", "hip_r", "hip_l", "ankle_r", "ankle_l",
              "wr_r", "wr_l"):
        J[k] = lift(J[k])
    for k in ("grip_r", "grip_l"):
        if k in J:
            J[k] = lift(J[k])
    J["sole_r"] += BASE_H
    J["sole_l"] += BASE_H
    up_t = norm(J["neck"] - J["pelvis"])
    fwd_t = norm(J["facing"] - up_t * float(np.dot(J["facing"], up_t)))
    left = np.cross(up_t, fwd_t)
    J["sh_r"] = J["neck"] - left * 3.0 - up_t * 0.85
    J["sh_l"] = J["neck"] + left * 3.0 - up_t * 0.85
    J["knee_r"] = bend(J["hip_r"], J["ankle_r"], THIGH, SHIN, J["knee_pole_r"])
    J["knee_l"] = bend(J["hip_l"], J["ankle_l"], THIGH, SHIN, J["knee_pole_l"])
    J["el_r"] = bend(J["sh_r"], J["wr_r"], UPPER, FORE, J["elbow_pole_r"])
    J["el_l"] = bend(J["sh_l"], J["wr_l"], UPPER, FORE, J["elbow_pole_l"])
    hf = norm(J["head_fwd"])
    J["head_up"] = norm(UP - hf * float(np.dot(UP, hf)))
    return J


def pose_milestone():
    """As on the card: right foot planted, left boot up on the milestone,
    both hands at the laces, staff leant against his left shoulder."""
    stone_c, stone_top = (6.6, -0.7), 9.6
    J = finish(dict(
        pelvis=(0.0, 0.5, 15.4), waist=(0.3, -0.3, 18.0), chest=(1.0, -1.6, 20.9),
        neck=(1.8, -3.0, 23.4), facing=(0.57, -0.82, -0.1),
        head=(1.7, -4.0, 26.3), head_fwd=(0.12, -1.0, -0.22),
        hip_r=(-1.6, 0.6, 14.8), ankle_r=(-2.2, 0.9, 1.35), toe_r=(-0.2, -1, 0), sole_r=0.0,
        knee_pole_r=(0, -1, 0.1), patch_r=(0, -1, 0.15),
        hip_l=(1.7, 0.3, 14.8), ankle_l=(stone_c[0], 0.2, stone_top + 1.35), toe_l=(0.05, -1, 0),
        sole_l=stone_top, knee_pole_l=(1.0, -0.45, 0.6), patch_l=(0.9, -0.5, 0.4),
        wr_r=(5.35, -2.7, 14.6), hand_r=(0.45, 0.35, -1), elbow_pole_r=(-0.6, -0.6, 0.2),
        wr_l=(8.1, -1.7, 14.3), hand_l=(-0.4, 0.25, -1), elbow_pole_l=(0.9, 0.3, 0.2),
    ))
    man, frame_t = body(J, "milestone")
    rings = [(23.6 + BASE_H, 1.6, -2.4, 2.4, 3.75, 0.08),
             (19.0 + BASE_H, 0.8, -0.9, 2.85, 3.9, 0.35),
             (14.0 + BASE_H, 0.1, 0.2, 3.35, 4.25, 0.55),
             (5.0 + BASE_H, -0.1, 0.9, 4.2, 4.75, 0.72)]
    cape = cloak(J, frame_t, rings, 118,
                 lambda a: BASE_H + 5.4 + 0.8 * np.sin(3 * a + 1.0) + 0.35 * np.sin(8 * a))
    stick = staff(lift((5.4, 3.4, 0.2)), lift((3.1, -2.3, 33.0)))
    stone = milestone(lift((stone_c[0], stone_c[1], 0)), (2.55, 2.35), stone_top + BASE_H)
    grass = [tuft((stone_c[0] + 2.9, stone_c[1] - 1.8, 0), 6, 1.5, 1),
             tuft((stone_c[0] - 2.6, stone_c[1] + 2.6, 0), 5, 1.3, 2),
             tuft((-6.5, -5.5, 0), 6, 1.4, 3), tuft((-7.5, 4.0, 0), 5, 1.2, 4)]
    figure = union(man, cape, satchel(J, frame_t), stick, k=0.2)
    return union(figure, base("CORIN VALE", [stone, *grass]), k=0.3)


def pose_road():
    """On the road: mid-stride, staff planted ahead in his right hand, left hand
    on the satchel strap, the cloak blowing back."""
    J = finish(dict(
        pelvis=(0.0, 0.2, 15.0), waist=(0.0, -0.1, 17.9), chest=(0.0, -0.5, 21.0),
        neck=(0.0, -0.9, 23.7), facing=(0.05, -1, 0),
        head=(-0.1, -1.4, 26.7), head_fwd=(-0.25, -1.0, -0.05),
        hip_r=(-1.6, 0.4, 14.4), ankle_r=(-1.8, 3.6, 1.35), toe_r=(-0.1, -1, 0), sole_r=0.0,
        knee_pole_r=(0, -1, 0), patch_r=(0, -1, 0.1),
        hip_l=(1.6, 0.0, 14.4), ankle_l=(1.9, -3.4, 1.35), toe_l=(0.1, -1, 0), sole_l=0.0,
        knee_pole_l=(0, -1, 0), patch_l=(0, -1, 0.1),
        wr_r=(-3.95, -3.55, 16.0), hand_r=(0, -0.2, -1), grip_r=(-3.8, -4.3, 16.2),
        elbow_pole_r=(-0.45, 0.5, -1.0), bag_fwd=0.35,
        wr_l=(0.9, -2.75, 19.6), hand_l=(-0.6, 0, 0.8), elbow_pole_l=(1, 0.2, -0.3),
    ))
    man, frame_t = body(J, "road")
    rings = [(23.8 + BASE_H, 0.0, 0.0, 2.4, 3.75, 0.1),
             (19.0 + BASE_H, 0.0, 1.0, 2.95, 3.95, 0.45),
             (13.0 + BASE_H, 0.0, 2.4, 3.8, 4.3, 0.8),
             (6.5 + BASE_H, 0.0, 3.6, 4.6, 4.75, 0.95)]
    cape = cloak(J, frame_t, rings, 118,
                 lambda a: BASE_H + 6.2 + 1.3 * np.cos(a) * 0 + 0.9 * np.sin(3 * a + 0.4)
                 + 0.4 * np.sin(9 * a), seed=6)
    stick = staff(lift((-4.0, -5.2, 0.25)), lift((-3.6, -3.4, 32.5)))
    grass = [tuft((6.5, 5.5, 0), 6, 1.4, 5), tuft((-7.0, 5.0, 0), 5, 1.3, 6),
             tuft((7.5, -4.5, 0), 5, 1.2, 7)]
    figure = union(man, cape, satchel(J, frame_t), stick, k=0.2)
    return union(figure, base("CORIN VALE", grass), k=0.3)


POSES = {"milestone": pose_milestone, "road": pose_road}


# ---------------------------------------------------------------- build

def build(name, step, faces_target, out_dir, proof_dir):
    import trimesh
    import fast_simplification
    import manifold3d
    t0 = time.time()
    print(f"{name}: sculpting")
    shape = POSES[name]()
    lo, hi = v(-BASE_R - 1, -BASE_R - 1, -0.6), v(BASE_R + 1, BASE_R + 1, 37.5)
    grid = sdf.field(shape, lo, hi, step)
    verts, faces, normals = sdf.mesh(grid, lo, step)
    print(f"  marching cubes: {len(faces):,} triangles ({time.time() - t0:.0f}s)")
    dense = trimesh.Trimesh(verts, faces, vertex_normals=normals, process=False)
    # A shell wound inward is a sealed pocket of air inside the solid (under the
    # hair, mostly): leaving it out fills it, so resin cannot be trapped there.
    # A shell wound outward that is not the figure is a loose speck or, if it is
    # big, a part that has come off - which the build refuses.
    parts = dense.split(only_watertight=False)
    parts.sort(key=lambda p: -p.volume)
    pockets = [p for p in parts[1:] if p.volume < 0]
    loose = [p for p in parts[1:] if p.volume >= 0]
    big = [p for p in loose if p.volume >= 0.05]
    if big:
        raise SystemExit(f"  {len(big)} loose part(s) would fall off: " +
                         ", ".join(f"{p.volume:.2f} mm3 at {np.round(p.centroid, 1)}" for p in big))
    print(f"  filled {len(pockets)} sealed air pocket(s) ({-sum(p.volume for p in pockets):.2f} mm3); "
          f"dropped {len(loose)} speck(s) under 0.05 mm3")
    dense = parts[0]
    # photograph the dense surface; the shipped one is decimated
    proof = proof_dir / f"corin-vale-{name}.png"
    sdf.proof_sheet(np.asarray(dense.vertices, F), np.asarray(dense.faces), np.asarray(dense.vertex_normals, F),
                    f"Corin Vale (CHR-01) - {name} - 32 mm scale, 25 mm base", proof)
    print(f"  proof sheet {proof}")
    pts, tri = fast_simplification.simplify(dense.vertices.astype(np.float32), dense.faces.astype(np.int32),
                                            target_reduction=max(0.0, 1 - faces_target / len(dense.faces)))
    # manifold3d is the judge: it refuses a mesh that is not a closed solid,
    # and what it hands back is what ships
    man = manifold3d.Manifold(manifold3d.Mesh(pts.astype(np.float32), tri.astype(np.uint32)))
    status = man.status()
    # the decimated solid must still be one piece; anything else is reported
    bits = sorted(man.decompose(), key=lambda b: -b.volume())
    if len(bits) > 1:
        print(f"  after decimation: {len(bits)} shells, keeping the figure; others "
              f"{[round(b.volume(), 3) for b in bits[1:]]} mm3")
        if any(b.volume() >= 0.05 for b in bits[1:]):
            raise SystemExit("  decimation split a real part off")
        man = bits[0]
    out = man.to_mesh()
    m = trimesh.Trimesh(np.asarray(out.vert_properties)[:, :3], np.asarray(out.tri_verts), process=False)
    stl = out_dir / f"corin-vale-{name}.stl"
    m.export(stl)
    thin, clusters = sdf.thin_parts(grid, step, 0.6)
    tilts = [("upright, base flat on the plate", np.eye(3)),
             ("tilted back 30 degrees", sdf.rot((1, 0, 0), -30)),
             ("tilted back 45 degrees", sdf.rot((1, 0, 0), -45))]
    over = sdf.overhang_report(m, tilts)
    ext = m.bounds[1] - m.bounds[0]
    report = {
        "stl": str(stl), "triangles": len(m.faces), "size_mm": [round(float(x), 1) for x in ext],
        "watertight": bool(m.is_watertight), "winding_consistent": bool(m.is_winding_consistent),
        "manifold3d": str(status), "pieces": len(m.split(only_watertight=False)),
        "volume_ml": round(float(m.volume) / 1000, 2), "thin_mm3_under_0.6mm": round(thin, 2),
        "thin_clusters": [(round(s, 3), [round(x, 1) for x in (np.asarray(c) + lo)]) for s, c in clusters[:5]],
        "orientation": [(n, round(a, 1), i) for n, a, i in over],
        "seconds": round(time.time() - t0),
    }
    for k, val in report.items():
        print(f"  {k}: {val}")
    return report


if __name__ == "__main__":
    import json
    from pathlib import Path
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    draft = "--draft" in sys.argv
    root = Path(__file__).resolve().parents[2]
    out_dir = root / "docs" / "minis"
    proof_dir = out_dir / "proof"
    proof_dir.mkdir(parents=True, exist_ok=True)
    reports = {}
    for name in (args or list(POSES)):
        reports[name] = build(name, 0.13 if draft else 0.075, 60_000 if draft else 300_000,
                              proof_dir if draft else out_dir, proof_dir)
    (proof_dir / "report.json").write_text(json.dumps(reports, indent=1))

# Miniatures

3D-printable figures of the characters on the cards. Each one comes as an STL
file (the standard 3D-print file: a closed surface made of triangles). Open it
in your printer's slicer, the program that cuts a model into printable layers.

| File | Who | Pose | Size | Resin |
|---|---|---|---|---|
| `corin-vale-milestone.stl` | Corin Vale, CHR-01 | Boot up on a milestone, lacing it, as on his card | 25 × 25 × 37 mm | about 2.7 ml |
| `corin-vale-road.stl` | Corin Vale, CHR-01 | Mid-stride on the road, staff in hand, cloak blowing back | 25 × 25 × 36 mm | about 2.5 ml |

Both are at **32 mm scale**: he stands about 32 mm from his soles to the top
of his head, on a **25 mm round base** with his name cut round the front. The
staff rises above his head. The figure is solid, with no hollow inside, so
no resin gets trapped.

## Printing

- **A resin printer is best.** The face, the laces and the lettering are
  between 0.1 and 0.3 mm deep, which a resin printer holds and a filament
  printer mostly smooths over.
- **Stand it upright, with the base flat on the build plate.** That was the
  best of the three ways checked (upright, tipped back 30°, and tipped back
  45°): it has the least surface hanging over thin air.
- **Supports:** let the slicer auto-support it on a light setting. The places
  that need them are under the arms, under the cloak's hem, under the satchel
  and under the chin. On the milestone pose, add a few under the raised knee.
- **Filament (FDM) printers:** use a 0.2 mm nozzle if you have one, with
  0.08 mm layers and tree supports. With a 0.4 mm nozzle it still prints, but
  softly, and the staff (1.4 mm thick) needs a slow outer wall.
- **Scaling:** for 28 mm scale, print at 88%. For a 54 mm display piece,
  print at 170%. Nothing gets too thin to print at 88%.

Checked on every build: each file is one closed, watertight solid (manifold3d
accepts it) with no loose pieces, nothing thinner than 0.6 mm sticks out from
the body, and it has about 300,000 triangles.

## How they are made

They are not hand-sculpted. Each figure is a short script in
`tools/minis/` that builds the body out of rounded shapes (bones, cloth,
boots, hair) blended together. The script is read off the card's plate in
`docs/art/renders/`. `tools/minis/sdf.py` is the shared kit: the shapes, the
meshing, the print checks and the proof photographs.

```bash
pip install numpy scipy scikit-image trimesh fast-simplification manifold3d pillow
python3 tools/minis/corin-vale.py            # both poses, about 3 minutes
python3 tools/minis/corin-vale.py --draft    # quick and coarse, for posing
```

A build writes the STLs here and a proof sheet of each, photographed from six
sides with a 10 mm ruler, to `docs/minis/proof/`. That folder is git-ignored,
because a proof is a photograph of the piece, not the piece. To change a pose,
move a joint in `pose_milestone()` or `pose_road()`. Elbows and knees are
worked out from the hand and foot positions.

# 07 — Brief for AI agents generating visual content

**If you are a model generating art for this game, this is your document.** Read
[01-two-plate-system.md](01-two-plate-system.md) as well; everything here depends on it.

The other documents in this folder explain the reasoning. This one is operational.

---

## The five rules

1. **The ink plate carries every piece of information.** Colour may repeat information. It
   may never introduce it. Delete the colour: if a rule became unreadable, the work is not
   finished.
2. **One line colour: `#1A1714`.** Paper is `#EDE4D1`. Never pure black, never pure white.
3. **Five wash colours only**, from [`palette.json`](palette.json). No sixth. Violet
   (`bruise #6B4C7D`) is for arcane subjects only.
4. **No gradients, glows, drop shadows, blur, or soft shading.** Volume comes from
   hatching. This is the rule most often broken by image models — check it explicitly
   every time.
5. **Never name a studio, franchise, artist or game in a prompt.** See
   [the banned list](#never-put-these-in-a-prompt).

---

## Prompt preamble

Paste this ahead of any image prompt. It is written to survive the compression that image
models apply to long prompts — the load-bearing terms are front-loaded.

```text
Black ink line art on warm unbleached paper, in the style of a worn 1600s printed
almanac: heavy uneven woodcut-style outlines, interior shading built only from
hand-drawn hatching and cross-hatching, over-inked pooling where lines meet at
sharp angles, bare paper for the lit surfaces.

Flat muted spot colour sits UNDER the black line like a mis-registered letterpress
run — solid areas of colour with no blending. Restricted palette: warm ochre,
rust red, dusty grey-green, cold slate blue. Paper is warm oatmeal, never white.
Ink is warm near-black, never pure black.

Everything is hand-made from timber, hammered iron, fired clay, rough cloth and
rope, with visible rivets, straps, stitching and lashings. Objects are worn from
daily use and carefully repaired, not ruined or abandoned. Chunky exaggerated
proportions with a bold readable silhouette.

Strictly no gradients, no glow, no drop shadows, no soft airbrushed shading, no
lens effects, no neon. Single subject, centred, on a plain ground line.
```

## Negative prompt

```text
gradient, glow, bloom, lens flare, drop shadow, soft shading, airbrush, blur,
depth of field, neon, saturated colours, pure white background, pure black,
photorealistic, 3d render, octane, unreal engine, digital painting, oil painting,
concept art, anime, chibi, cute, cel shaded, comic book colouring, sparkles,
magic particles, glowing runes, watermark, signature, text, letters, logo, UI,
frame border, multiple objects, cluttered scene, grimdark, ruined, apocalyptic
```

`text, letters, logo` is in there deliberately. All type is set separately on the ink
plate at print time — never generated. Generated lettering is unreadable, unlicensable and
usually accidentally copies a real wordmark.

---

## Per-asset templates

Substitute the bracketed parts. Keep the preamble above all of them.

### Commodity icon

```text
[PREAMBLE]

A single [COMMODITY], drawn as one countable unit — [e.g. "a stack of three split
logs", "two fish laid side by side", "a slumped hessian sack of flour with a wooden
scoop"]. Three-quarter view. Bold silhouette readable at 18mm. Signature material
marks: [see 03-line-and-texture.md material vocabulary]. One chip or repair showing
daily use. Sits on a short ground line. Wash colour: [CATEGORY WASH HEX], flat, one
tone, underneath the line only.
```

Chain relatives (`grain → flour → bread`, `iron-ore → pig-iron → steel`) must share a base
drawing. Generate them in **one batch, in one prompt**, or the family resemblance will not
survive.

### Building

```text
[PREAMBLE]

A [BUILDING] — [one-line description from data/buildings.json]. Squat, functional,
heavier at the base than the top. Built from [MATERIALS] with visible structural
joinery, iron strapping and square rivets. Three-quarter view from slightly above.
Working, in use, well maintained but weathered. Small stamped maker's mark, lower
right. Exaggerate the one feature that identifies it: [e.g. "an oversized chimney
throat", "a waterwheel far too large for the building"]. Wash colour: [HEX], flat.
```

### Terrain tile

```text
[PREAMBLE]

A [TERRAIN] ground texture filling a hexagonal tile, seen from above at a low
oblique. Repeating hand-drawn ground marks: [e.g. "short tussock strokes and
scattered field stones"]. No single focal object, no buildings, no figures. Texture
runs off all six edges so tiles butt together continuously. Flat wash tint
[HEX] beneath, ink texture above.
```

### Event card scene

```text
[PREAMBLE]

A landscape scene, 63×34mm proportion: [EVENT DESCRIPTION]. Told through objects and
consequences rather than faces — [e.g. "an overturned cart, scattered grain, cart
tracks veering off the road"]. Mid-distance, no close-up portraits. One clear
readable silhouette dominates. Dry and matter-of-fact in tone, not melodramatic.
Wash: [HEX], flat, two tones maximum.
```

### Arcane subject — the only one with the slip

```text
[PREAMBLE]

A [ARCANE SUBJECT]. Drawn in exactly the same worn ink style as everything else —
no glow, no sparkle, no light source, no particles. Its ONLY unusual quality is
that the violet colour is printed out of register: the flat violet wash (#6B4C7D)
is offset about 1mm from the black line and bleeds past the edge of the object,
like a misprint on a cheap press. The black line itself is perfectly normal.
```

If the model adds a glow anyway, it has ignored the brief. Regenerate; do not accept it
and paint the glow out, because the glow will have changed the lighting of the whole
drawing.

---

## Working in SVG instead

**Preferred for icons, frames, chits and anything that goes to print.** It is resolution
independent, it separates perfectly by construction, and it is diffable in code review.

Required structure — layer ids exactly as written:

```xml
<svg viewBox="0 0 W H" xmlns="http://www.w3.org/2000/svg">
  <g id="wash">  <!-- flat fills, NO strokes, palette hex only --></g>
  <g id="slip">  <!-- arcane only; omit the group entirely otherwise --></g>
  <g id="ink">   <!-- all line work; fill and stroke #1A1714 only --></g>
  <g id="grime"> <!-- press artefacts, #1A1714 at 4-8% opacity --></g>
</svg>
```

Rendering the black-and-white edition must be exactly this and nothing more:

```js
doc.querySelectorAll('#wash, #slip').forEach(g => g.remove());
```

If producing the mono version needs any other change, the file is wrong.

Line weights at final print size — [full table](03-line-and-texture.md#line-weights):
contour 0.5mm, structure 0.3mm, detail 0.2mm, hatch 0.15mm. Hatching goes in `<pattern>`
definitions; the eleven category hatches are specified in `palette.json` under `hatches`.

The two files in [`examples/`](examples/) are built to this contract and are the reference
implementation. Read them before writing a new one.

---

## Separating a raster image

When a model returns one flat picture, it must be separated before it can be used.

1. **Extract the ink plate.** Threshold the luminance channel. Everything below ~45% goes
   to `#1A1714`; everything above goes transparent. Clean up stray speckle.
2. **Check the ink plate alone.** This is the black-and-white edition. If the subject is
   not fully readable — if shading was carrying an edge that the line does not — the
   generation failed. Do not repair by hand at this stage; reprompt with more explicit
   linework instructions.
3. **Build the wash plate by hand.** Do not extract it from the generation. Trace flat
   regions and fill them with **exact palette hex values**. A model's colours are never in
   palette, and sampling them imports gradients that the spec forbids.
4. **Verify the wash carries nothing.** Two regions that differ only in wash colour must
   also differ in hatch or in drawing.
5. **Apply grime last**, as its own layer, at one strength across the whole component.

---

## Acceptance checklist

Every asset, every time. This is a gate, not a suggestion.

**The two-plate laws**
- [ ] Wash layer deleted — every rule still readable?
- [ ] Ink plate contains exactly one colour, `#1A1714`
- [ ] Every wash value appears in `palette.json`
- [ ] Wash shifted 0.3mm in any direction — still looks intentional?

**Print**
- [ ] Printed at 100% on a mono laser printer — survives?
- [ ] Photocopied once from that print — still survives?
- [ ] Reduced to 18mm and filled solid — still identifiable next to five siblings?
- [ ] No line thinner than 0.15mm, no tint lighter than 12%
- [ ] Dark wash under linework dropped to its `underInk` tint

**Style**
- [ ] No gradient, glow, drop shadow, blur or soft shading anywhere
- [ ] Grime is on the paper, not painted onto the object
- [ ] Object reads as worn-and-repaired, not ruined
- [ ] Light comes from the upper left
- [ ] No generated text, letterforms or wordmarks
- [ ] Violet used only if the subject is arcane; slip used only if the subject is arcane

**Clearance**
- [ ] No franchise, studio, artist or game named anywhere in the prompt
- [ ] Does not resemble any specific existing character, logo, mascot or UI
- [ ] Passes the tests in [08-influences-and-distance.md](08-influences-and-distance.md)

---

## Never put these in a prompt

Not as style references, not as "in the style of", not as "inspired by", not in a negative
prompt — naming a franchise in a negative prompt still pulls its features into the
generation.

**Franchises and studios:** Borderlands, Fallout, World of Warcraft, Warcraft, Warhammer,
Gearbox, Bethesda, Blizzard, Games Workshop, Elder Scrolls, Skyrim, Dungeons & Dragons,
D&D, Magic: The Gathering, Wizards of the Coast, Diablo, Hearthstone, Zelda, Minecraft,
Terraria, Dark Souls, Elden Ring, Witcher, Dragon Age, Path of Exile, RuneScape, Catan,
Agricola, Everdell, Scythe, Arkham Horror.

**Living artists by name.** Any of them. This is both a legal exposure and, increasingly, a
platform terms-of-service violation.

**Franchise-specific visual shorthand**, even without the name attached: "vault boy",
"pip-boy", "cel-shaded looter shooter", "vault dweller", "power armour", "space marine",
"the blue and yellow vault suit", "retro-futuristic 1950s wasteland".

**Instead, name the technique.** Every one of these is public-domain, centuries old, and
gets you closer to what we actually want:

> woodcut · wood engraving · letterpress · linocut · scraperboard · heraldic hatching ·
> Petra Sancta · Dürer · Bewick · chiaroscuro woodcut · broadside · chapbook · almanac ·
> hornbook · trade catalogue engraving · botanical plate · patent drawing · risograph ·
> spot colour · mis-registration

---

## Common failures

| What comes back | Why | Fix |
|---|---|---|
| Soft glow on anything magical | Models have a hard prior that magic glows | Say "printed out of register, like a misprint" and put glow/sparkle/particles in the negative |
| Gradient shading | Default rendering style for almost every model | Demand "hatching and cross-hatching only, bare paper for lit surfaces" |
| Colour doing the identifying | The model composes for a colour image | Generate the ink plate **alone first**, approve it, then add wash |
| Pure white background | Overwhelmingly common training default | State the paper hex, and say "warm oatmeal paper, never white" |
| Grime painted on the object | "Dirty" reads as an object property | Say "the paper and the press are dirty, the object is clean and merely worn" |
| Ruined and post-apocalyptic | "Rustic + dirty + fantasy" trends that way | Say "in daily use, well maintained, carefully repaired" |
| Generated gibberish text | Models cannot set type | `text, letters, logo` in the negative; set all type separately |
| Too much detail to read at 18mm | Models optimise for a large canvas | Prompt at target size: "must read at 18mm as a solid silhouette" |
| Sixth and seventh colours | Palette instructions are compressed away | Put the hex values in the prompt, and correct in post — do not accept |

---

## Batch generation

For sets — the 63 commodities, the 12 terrains, the 58 event scenes — **the set is the
unit of work, not the asset.**

- Generate **one reference asset first** and get it accepted. Everything else is matched
  to it, not to this document.
- Generate **chain relatives in a single prompt** so the family resemblance is real.
- Work in **categories**, so one hatch, one wash and one material vocabulary is loaded at a
  time.
- Re-check the reference asset every 10–15 assets. Style drifts, and it drifts slowly
  enough that you will not notice within a session.
- Keep the accepted prompt in `docs/art/prompts/{id}.txt` next to the asset. When the style
  is revised, the assets get regenerated, and an undocumented prompt means redoing the
  work from scratch.

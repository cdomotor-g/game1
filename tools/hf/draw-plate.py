"""
THE ONE JOB THAT DRAWS A PLATE. Run it on Hugging Face; never retype it.

    hf_jobs uv  flavor=a100-large  with_deps=[...]  secrets={"HF_TOKEN": "$HF_TOKEN"}
    args: PLATE=tile-granary MODE=draft   -> one contact sheet of candidates
          PLATE=tile-granary MODE=final SEED=21  -> the plate itself

WHY THIS FILE EXISTS, in one number: the granary cost about twenty-two minutes of
a100-large across five separate jobs and produced eight images, one of which
shipped. Roughly half that time drew nothing at all. Every job re-downloads
Qwen-Image - fifty gigabytes - and reinstalls sixty-three packages before it can
make a single pixel, so the setup is two to three minutes whether the job then
draws one picture or twelve. Five jobs meant paying that five times.

Two rules follow from that, and they are the whole design here:

ONE JOB PER SUBJECT, NOT ONE JOB PER ATTEMPT. The model is loaded once and every
candidate is drawn from that one load. If you want to try six seeds, that is one
job, not six.

JUDGE COMPOSITION CHEAPLY, THEN DRAW ONCE PROPERLY. A draft at 640px and eight
steps costs about a tenth of a full plate, and it is enough to see the thing that
actually goes wrong - a horizon that should not be there, a building drawn too
big for the die, text rendered onto the page. Five of the granary's six rejects
were visible at draft size. So MODE=draft returns all the candidates tiled on ONE
contact sheet - one image to fetch and one to look at - and only the seed that
survives that gets MODE=final.

The seeds are fixed and ordered, so "seed 21" means the same picture tomorrow.
"""
import io
import os

import torch
from diffusers import DiffusionPipeline
from huggingface_hub import HfApi, hf_hub_download
from PIL import Image

DATASET = os.environ.get("DATASET", "cdomotor-g/game1-plates")
PLATE = os.environ["PLATE"]
MODE = os.environ.get("MODE", "draft")
MODEL = os.environ.get("MODEL", "Qwen/Qwen-Image")

# Candidates per draft sheet. Six fits a 3x2 sheet that is still readable when
# the whole thing comes back as one attachment; more than that and each cell is
# too small to see a horizon in.
SEEDS = [int(s) for s in os.environ.get("SEEDS", "21,34,55,101,202,303").split(",")]
SEED = int(os.environ.get("SEED", "0"))

# Draft: enough to judge composition, colour cast and stray text. Nothing else.
DRAFT = dict(width=640, height=640, num_inference_steps=8, true_cfg_scale=4.0)
# Final: the plate. 1328 is Qwen's native 1:1 and is over the print target.
FINAL = dict(width=1328, height=1328, num_inference_steps=34, true_cfg_scale=5.5)

tok = os.environ["HF_TOKEN"]
api = HfApi(token=tok)


def read(path):
    return open(hf_hub_download(DATASET, path, repo_type="dataset", token=tok)).read().strip()


positive = read(f"render/{PLATE}.txt")
negative = read(f"prompts/negative-{PLATE}.txt").replace("\n", " ")

print(f"{PLATE} · {MODE} · {len(positive.split())} words", flush=True)

pipe = DiffusionPipeline.from_pretrained(MODEL, torch_dtype=torch.bfloat16)
pipe.enable_model_cpu_offload()


def draw(seed, settings):
    return pipe(
        prompt=positive,
        negative_prompt=negative,
        generator=torch.Generator(device="cuda").manual_seed(seed),
        **settings,
    ).images[0]


def put(img, path, fmt="PNG", **kw):
    buf = io.BytesIO()
    img.save(buf, format=fmt, **kw)
    api.upload_file(
        path_or_fileobj=buf.getvalue(), path_in_repo=path,
        repo_id=DATASET, repo_type="dataset",
    )
    print(f"  -> {path} ({len(buf.getvalue()) // 1024} kB)", flush=True)


if MODE == "draft":
    # Every candidate on ONE sheet. Fetching six images to look at six images is
    # six round trips through a chat window; a contact sheet is one.
    shots = []
    for seed in SEEDS:
        shots.append((seed, draw(seed, DRAFT)))
        print(f"  seed {seed} drawn", flush=True)

    cols = 3
    rows = (len(shots) + cols - 1) // cols
    cell = DRAFT["width"]
    pad = 8
    sheet = Image.new(
        "RGB",
        (cols * cell + (cols + 1) * pad, rows * cell + (rows + 1) * pad),
        (237, 228, 209),
    )
    for i, (_, img) in enumerate(shots):
        x = pad + (i % cols) * (cell + pad)
        y = pad + (i // cols) * (cell + pad)
        sheet.paste(img, (x, y))

    put(sheet, f"draft/{PLATE}-sheet.jpg", fmt="JPEG", quality=80)
    print("seeds, left to right, top to bottom: " + ", ".join(str(s) for s, _ in shots), flush=True)
    print("Look at the sheet. Pick a seed. Then MODE=final SEED=<n>.", flush=True)

elif MODE == "final":
    if not SEED:
        raise SystemExit("MODE=final needs SEED=<n> - the one the draft sheet earned")
    img = draw(SEED, FINAL)
    put(img, f"{PLATE}.png")
    prev = img.copy()
    prev.thumbnail((640, 640))
    put(prev, f"{PLATE}-preview.jpg", fmt="JPEG", quality=82)
    print(f"{PLATE} drawn at {img.size} from seed {SEED}", flush=True)

else:
    raise SystemExit(f"MODE must be draft or final, not {MODE!r}")

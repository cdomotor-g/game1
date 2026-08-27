"""
The artist end of the game1 mint.

This app draws a plate from a commission and knows nothing else. It does not hold
the house style, it does not know what a summary strip is, and no card or tile is
named in it - the repository assembles the whole prompt itself with
`node tools/mint-request.mjs <id>` and hands it over complete. That split is the
whole point of docs/MINT.md and it is kept here rather than quietly closed.

Two things it does owe the repository, because they are properties of the PLATE
rather than of any one subject:

  - the three formats are the ones data/mint.json declares under draw.sizeByFormat,
    so a new deck picks up a page without this file learning anything about it;
  - the seed is exposed and reported, because every tile is drawn twice and the two
    sides have to turn over onto each other.
"""

import random

import gradio as gr
import numpy as np
import spaces
import torch
from diffusers import QwenImagePipeline

MODEL = "Qwen/Qwen-Image"
DTYPE = torch.bfloat16
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
MAX_SEED = int(np.iinfo(np.int32).max)

pipe = QwenImagePipeline.from_pretrained(MODEL, torch_dtype=DTYPE).to(DEVICE)

# Keyed by data/mint.json lines.*.draw.sizeByFormat, mapped to the nearest size this
# model draws natively. A format with no entry here is not drawable, and the mint
# says so rather than guessing a shape - the plate's proportion is what the framing
# arithmetic is built on.
FORMATS = {
    "square": (1328, 1328),
    "A4 portrait": (1104, 1568),
    "A4 landscape, 3:2": (1584, 1056),
}

DEFAULT_NEGATIVE = "text, letters, numerals, signage, watermark, signature, blurry, low resolution"


@spaces.GPU(duration=60)
def draw_plate(
    commission,
    negative_prompt=DEFAULT_NEGATIVE,
    plate_format="square",
    seed=0,
    randomise=True,
    steps=30,
    guidance=4.0,
    progress=gr.Progress(track_tqdm=True),
):
    """
    Draws one plate for the game1 mint from a complete commission.

    Args:
        commission (str): The whole prompt, as printed by `node tools/mint-request.mjs <id>` -
            preamble, subject paragraph, FRAMING block, and the computed WINDOW and LABEL BAND
            notes. Paste it verbatim; a brief edited here and not in the repository is a brief
            that has started lying.
        negative_prompt (str): The line's negative prompt, the second half of what mint-request
            printed.
        plate_format (str): One of "square", "A4 portrait", "A4 landscape, 3:2" - the formats
            data/mint.json declares. Building tiles are square; a two-cell tile is the landscape.
        seed (int): Reuse a face's seed to draw its -site back, so the two sides of a tile turn
            over onto each other instead of being two unrelated pictures.
        randomise (bool): Ignore the seed and pick a new one. Turn this OFF to match a back to
            its face.
        steps (int): Inference steps.
        guidance (float): True CFG scale.

    Returns:
        The plate, and the seed it was drawn on.
    """
    if not commission or not commission.strip():
        raise gr.Error(
            "No commission. Run `node tools/mint-request.mjs <id>` in the game1 repository "
            "and paste what it prints."
        )

    if plate_format not in FORMATS:
        raise gr.Error(
            f"`{plate_format}` is not a format this line can draw. "
            f"data/mint.json declares: {', '.join(FORMATS)}."
        )

    if randomise:
        seed = random.randint(0, MAX_SEED)
    seed = int(seed)

    width, height = FORMATS[plate_format]
    generator = torch.Generator(device=DEVICE).manual_seed(seed)

    image = pipe(
        prompt=commission,
        negative_prompt=negative_prompt or "",
        width=width,
        height=height,
        num_inference_steps=int(steps),
        generator=generator,
        true_cfg_scale=float(guidance),
        guidance_scale=1.0,
    ).images[0]

    return image, f"{width} x {height} · seed {seed} · {plate_format}"


with gr.Blocks(title="Game1 Plates") as demo:
    gr.Markdown(
        "## The plate press\n"
        "The artist end of the [game1](https://github.com/cdomotor-g/game1) mint. It holds no "
        "content: run `node tools/mint-request.mjs <id>` in the repository and paste what it "
        "prints, positive half on the left, negative prompt below it.\n\n"
        "**Drawing the back of a tile?** Keep the face's seed and turn *Randomise* off, so the "
        "two sides turn over onto each other."
    )

    with gr.Row():
        with gr.Column(scale=3):
            commission = gr.Textbox(
                label="Commission",
                lines=18,
                placeholder="Paste the whole prompt from `node tools/mint-request.mjs <id>` …",
            )
            negative_prompt = gr.Textbox(
                label="Negative prompt",
                lines=4,
                value=DEFAULT_NEGATIVE,
            )
        with gr.Column(scale=2):
            plate_format = gr.Radio(
                label="Plate format",
                choices=list(FORMATS),
                value="square",
                info="The formats data/mint.json declares. Tiles are square; a two-cell tile is the landscape.",
            )
            with gr.Row():
                seed = gr.Number(label="Seed", value=0, precision=0)
                randomise = gr.Checkbox(label="Randomise", value=True)
            steps = gr.Slider(label="Steps", minimum=8, maximum=50, step=1, value=30)
            guidance = gr.Slider(label="Guidance", minimum=1.0, maximum=10.0, step=0.1, value=4.0)
            draw = gr.Button("Draw the plate", variant="primary")

    plate = gr.Image(label="Plate", type="pil", format="png", height=520)
    drawn_as = gr.Textbox(label="Drawn as", interactive=False)

    gr.Markdown(
        "Save it at the path the commission's **save to** line names, then run "
        "`node tools/mint-queue.mjs` — the subject moves to AIM by itself."
    )

    draw.click(
        draw_plate,
        inputs=[commission, negative_prompt, plate_format, seed, randomise, steps, guidance],
        outputs=[plate, drawn_as],
    )

if __name__ == "__main__":
    demo.launch(mcp_server=True)

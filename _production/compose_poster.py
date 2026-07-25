from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "_production" / "poster-source-v5.webp"
OUTPUT = ROOT / "public" / "poster.png"
THUMB = ROOT / "_production" / "poster-thumb.png"

image = (
    Image.open(SOURCE)
    .convert("RGB")
    .crop((50, 50, 974, 974))
    .resize((1024, 1024), Image.Resampling.LANCZOS)
)

veil = Image.new("RGBA", image.size, (0, 0, 0, 0))
pixels = veil.load()
for y in range(300):
    alpha = round(180 * (1 - y / 300) ** 1.65)
    for x in range(1024):
        pixels[x, y] = (0, 5, 10, alpha)
image = Image.alpha_composite(image.convert("RGBA"), veil)

draw = ImageDraw.Draw(image)
title = ImageFont.truetype(
    "/System/Library/Fonts/Supplemental/Bodoni 72.ttc",
    100,
    index=0,
)
small = ImageFont.truetype(
    "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
    15,
)
draw.text(
    (62, 40),
    "VISUAL STUDY / 06",
    font=small,
    fill=(235, 246, 255, 178),
)
draw.multiline_text(
    (56, 61),
    "RUNIC\nNAME",
    font=title,
    fill=(235, 246, 255, 255),
    spacing=-28,
)

rgb = image.convert("RGB")
rgb.quantize(
    colors=256,
    method=Image.Quantize.MEDIANCUT,
    dither=Image.Dither.FLOYDSTEINBERG,
).save(OUTPUT, "PNG", optimize=True)
rgb.resize((160, 160), Image.Resampling.LANCZOS).save(
    THUMB,
    "PNG",
    optimize=True,
)

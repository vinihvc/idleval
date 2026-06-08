#!/usr/bin/env python3
"""Remove chroma-key backgrounds from pixel art and export centered transparent WebP.

Implements a chromacut-style pipeline (color key + despill + optional erosion)
optimized for AI-generated game sprites. No ML — deterministic output.

Chroma key choice:
  - magenta (#FF00FF): default for most sprites
  - green (#00FF00): subjects with purple/violet (capes, robes) — magenta key
    treats purple like background and removes or washes it out
  - --auto-key: pick green when purple subject pixels are detected

Despill crushes saturated reds on magenta edges (e.g. ruby gems). Subject-color
protection is on by default; use --no-despill to disable fringe despill entirely.

Usage:
  remove-bg.py input.png output.webp
  remove-bg.py input.png output.webp --size 400 --key magenta
  remove-bg.py input.png output.webp --size 400 --key green
  remove-bg.py input.png output.webp --auto-key --size 400
  remove-bg.py --batch ./raw ./out --size 400 --key green
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

import numpy as np
from PIL import Image

KEYS = ("magenta", "green")
DEFAULT_SIZE = 400
DEFAULT_PADDING = 0.92


def chroma_excess(r: np.ndarray, g: np.ndarray, b: np.ndarray, key: str) -> np.ndarray:
    """Per-pixel chroma excess vs neutral (higher = more background)."""
    if key == "green":
        return g.astype(np.int16) - np.maximum(r, b).astype(np.int16)
    # magenta: high R+B, low G
    return np.minimum(r, b).astype(np.int16) - g.astype(np.int16)


def subject_color_mask(
    r: np.ndarray,
    g: np.ndarray,
    b: np.ndarray,
) -> np.ndarray:
    """Saturated subject hues that must not be keyed away or despilled."""
    rf = r.astype(np.float32)
    gf = g.astype(np.float32)
    bf = b.astype(np.float32)

    # Rubies, hearts, red accents — magenta despill sets r = min(r, g).
    red = (r >= 80) & (rf > gf * 1.55) & (rf > bf * 1.15)

    # Purple/violet robes, capes — chromatically similar to magenta key.
    # Exclude pure key magenta (r≈b≈255); keep dark/mid purple subject pixels.
    purple = (
        (r >= 45)
        & (b >= 45)
        & (g <= np.minimum(r, b) * 0.58)
        & (np.maximum(r, b) < 248)
    )

    return red | purple


def detect_recommended_key(img: Image.Image) -> tuple[str, str | None]:
    """Suggest green when subject contains purple; magenta otherwise."""
    arr = np.array(img.convert("RGBA"))
    r, g, b, a = (arr[:, :, i] for i in range(4))

    visible = a > 200
    rf = r.astype(np.float32)
    gf = g.astype(np.float32)
    bf = b.astype(np.float32)

    # Ignore likely background: corners + high-chroma key colors.
    bg_magenta = visible & (r >= 230) & (b >= 230) & (g <= 25)
    bg_green = visible & (g >= 230) & (r <= 25) & (b <= 25)
    subject = visible & ~bg_magenta & ~bg_green

    if not np.any(subject):
        return "magenta", None

    purple = subject & subject_color_mask(r, g, b)
    purple_count = int(np.sum(purple))
    subject_count = int(np.sum(subject))
    purple_ratio = purple_count / subject_count

    if purple_count >= 40 and purple_ratio >= 0.004:
        return (
            "green",
            f"detected {purple_count} purple subject pixels "
            f"({purple_ratio * 100:.1f}% of sprite) — magenta key would wash them out",
        )

    return "magenta", None


def apply_chroma_key(
    img: Image.Image,
    *,
    key: str,
    tolerance: int,
    softness: int,
    pixel_art: bool,
    despill: bool,
) -> Image.Image:
    """Color-key + optional despill + alpha ramp (+ optional 1px halo erosion)."""
    arr = np.array(img.convert("RGBA"))
    r, g, b, a = (arr[:, :, i].astype(np.int16) for i in range(4))

    excess = chroma_excess(r, g, b, key)
    protected = subject_color_mask(r, g, b)
    tol = max(softness + 1, tolerance)
    soft = max(0, softness)

    # Alpha ramp: fully transparent at tol+, opaque at soft-
    alpha = a.astype(np.float32)
    if tol > soft:
        ramp = (tol - excess.astype(np.float32)) / (tol - soft)
        keyed_alpha = np.clip(ramp, 0.0, 1.0) * 255.0
        alpha = np.where(protected, alpha, np.minimum(alpha, keyed_alpha))
    else:
        alpha = np.where(
            protected,
            alpha.astype(np.float32),
            np.where(excess >= tol, 0.0, alpha.astype(np.float32)),
        )

    # Despill fringe pixels (partial key contamination on edges).
    if despill:
        fringe = (excess > 0) & (alpha > 0) & ~protected
        if key == "green":
            g = np.where(fringe, np.minimum(g, np.maximum(r, b)), g)
        else:
            r = np.where(fringe, np.minimum(r, g), r)
            b = np.where(fringe, np.minimum(b, g), b)

    out = np.stack(
        [
            np.clip(r, 0, 255).astype(np.uint8),
            np.clip(g, 0, 255).astype(np.uint8),
            np.clip(b, 0, 255).astype(np.uint8),
            np.clip(alpha, 0, 255).astype(np.uint8),
        ],
        axis=-1,
    )

    if pixel_art:
        out = _erode_halos(out)

    out = _remove_checkerboard_flood(out, key)
    return Image.fromarray(out)


def _erode_halos(arr: np.ndarray) -> np.ndarray:
    """Drop single-pixel semi-transparent halos (chromacut-style erosion)."""
    alpha = arr[:, :, 3]
    h, w = alpha.shape
    out_a = alpha.copy()

    for y in range(h):
        for x in range(w):
            if alpha[y, x] == 0 or alpha[y, x] == 255:
                continue
            neighbors = 0
            transparent_neighbors = 0
            for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                if 0 <= nx < w and 0 <= ny < h:
                    neighbors += 1
                    if alpha[ny, nx] < 32:
                        transparent_neighbors += 1
            if neighbors > 0 and transparent_neighbors >= 2:
                out_a[y, x] = 0

    result = arr.copy()
    result[:, :, 3] = out_a
    return result


def _is_magenta(r: int, g: int, b: int, tol: int = 80) -> bool:
    return r >= 255 - tol and g <= tol and b >= 255 - tol


def _is_dark_outline(r: int, g: int, b: int) -> bool:
    return max(r, g, b) < 88


def _remove_checkerboard_flood(arr: np.ndarray, key: str) -> np.ndarray:
    """Flood-remove magenta/green residue and fake transparency checkerboard."""
    h, w = arr.shape[:2]
    remove = arr[:, :, 3] <= 10
    stack: list[tuple[int, int]] = [
        (x, y) for y in range(h) for x in range(w) if remove[y, x]
    ]

    while stack:
        x, y = stack.pop()
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if not (0 <= nx < w and 0 <= ny < h) or remove[ny, nx]:
                continue
            r, g, b = map(int, arr[ny, nx, :3])
            if _is_dark_outline(r, g, b):
                continue
            mx, mn = max(r, g, b), min(r, g, b)
            is_key = _is_magenta(r, g, b, tol=100) if key == "magenta" else (
                g >= 255 - 100 and r <= 100 and b <= 100
            )
            is_checker = mx - mn <= 55 and mn >= 175
            if is_key or is_checker:
                remove[ny, nx] = True
                stack.append((nx, ny))

    result = arr.copy()
    result[remove, 3] = 0
    return result


def center_on_canvas(
    img: Image.Image,
    size: int,
    padding: float = DEFAULT_PADDING,
) -> Image.Image:
    """Crop to content, scale with nearest-neighbor, center on square canvas."""
    rgba = img.convert("RGBA")
    bbox = rgba.getbbox()
    if bbox is None:
        return Image.new("RGBA", (size, size), (0, 0, 0, 0))

    cropped = rgba.crop(bbox)
    cw, ch = cropped.size
    scale = min(size / cw, size / ch) * padding
    nw = max(1, int(cw * scale))
    nh = max(1, int(ch * scale))
    resized = cropped.resize((nw, nh), Image.Resampling.NEAREST)

    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    ox = (size - nw) // 2
    oy = (size - nh) // 2
    canvas.paste(resized, (ox, oy), resized)
    return canvas


def resolve_key(img: Image.Image, key: str, auto_key: bool) -> tuple[str, list[str]]:
    """Return effective key and any warnings to print."""
    warnings: list[str] = []
    if auto_key:
        recommended, reason = detect_recommended_key(img)
        if reason:
            warnings.append(f"auto-key: {reason}; using --key {recommended}")
        return recommended, warnings

    if key == "magenta":
        recommended, reason = detect_recommended_key(img)
        if recommended == "green" and reason:
            warnings.append(f"warning: {reason}; prefer --key green or --auto-key")

    return key, warnings


def process_file(
    src: Path,
    dst: Path,
    *,
    key: str,
    auto_key: bool,
    size: int,
    tolerance: int,
    softness: int,
    pixel_art: bool,
    padding: float,
    despill: bool,
) -> None:
    img = Image.open(src)
    effective_key, warnings = resolve_key(img, key, auto_key)
    for message in warnings:
        print(f"{src.name}: {message}", file=sys.stderr)

    cleaned = apply_chroma_key(
        img,
        key=effective_key,
        tolerance=tolerance,
        softness=softness,
        pixel_art=pixel_art,
        despill=despill,
    )
    centered = center_on_canvas(cleaned, size=size, padding=padding)
    dst.parent.mkdir(parents=True, exist_ok=True)
    centered.save(dst, "WEBP", lossless=True, method=6)
    opaque = sum(1 for px in centered.getdata() if px[3] > 10)
    print(f"{dst}: opaque={opaque} size={size}")


def iter_images(folder: Path) -> list[Path]:
    exts = {".png", ".webp", ".jpg", ".jpeg"}
    return sorted(p for p in folder.rglob("*") if p.suffix.lower() in exts)


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Remove chroma-key background from pixel art sprites.",
    )
    parser.add_argument("input", nargs="?", help="Source image path")
    parser.add_argument("output", nargs="?", help="Destination .webp path")
    parser.add_argument(
        "--batch",
        nargs=2,
        metavar=("INPUT_DIR", "OUTPUT_DIR"),
        help="Process all images under INPUT_DIR",
    )
    parser.add_argument(
        "--key",
        choices=KEYS,
        default="magenta",
        help="Chroma key color (default: magenta). Use green for purple subjects.",
    )
    parser.add_argument(
        "--auto-key",
        action="store_true",
        help="Pick green when purple subject pixels are detected, else magenta",
    )
    parser.add_argument(
        "--no-despill",
        action="store_true",
        help="Skip fringe despill (red gems on magenta edges stay vivid)",
    )
    parser.add_argument(
        "--size",
        type=int,
        default=DEFAULT_SIZE,
        help=f"Output canvas size in px (default: {DEFAULT_SIZE})",
    )
    parser.add_argument(
        "--tolerance",
        type=int,
        default=80,
        help="Chroma tolerance — higher removes more background (default: 80)",
    )
    parser.add_argument(
        "--softness",
        type=int,
        default=25,
        help="Inner softness for anti-aliased edges (default: 25)",
    )
    parser.add_argument(
        "--padding",
        type=float,
        default=DEFAULT_PADDING,
        help=f"Content scale factor on canvas (default: {DEFAULT_PADDING})",
    )
    parser.add_argument(
        "--pixel-art",
        action="store_true",
        default=True,
        help="Enable pixel-art halo erosion (default: on)",
    )
    parser.add_argument(
        "--no-pixel-art",
        action="store_false",
        dest="pixel_art",
        help="Disable halo erosion",
    )
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv or sys.argv[1:])

    opts = {
        "key": args.key,
        "auto_key": args.auto_key,
        "size": args.size,
        "tolerance": args.tolerance,
        "softness": args.softness,
        "pixel_art": args.pixel_art,
        "padding": args.padding,
        "despill": not args.no_despill,
    }

    if args.batch:
        src_dir, dst_dir = Path(args.batch[0]), Path(args.batch[1])
        if not src_dir.is_dir():
            print(f"error: not a directory: {src_dir}", file=sys.stderr)
            return 1
        files = iter_images(src_dir)
        if not files:
            print(f"error: no images in {src_dir}", file=sys.stderr)
            return 1
        for src in files:
            rel = src.relative_to(src_dir)
            dst = (dst_dir / rel).with_suffix(".webp")
            process_file(src, dst, **opts)
        return 0

    if not args.input or not args.output:
        print(
            "usage: remove-bg.py <input> <output.webp> [options]\n"
            "       remove-bg.py --batch <input-dir> <output-dir> [options]",
            file=sys.stderr,
        )
        return 1

    src, dst = Path(args.input), Path(args.output)
    if not src.is_file():
        print(f"error: file not found: {src}", file=sys.stderr)
        return 1

    process_file(src, dst, **opts)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

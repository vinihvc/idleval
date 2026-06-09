#!/usr/bin/env python3
"""Resize and compress game sprites to WebP (nearest-neighbor, transparent canvas)."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

_SCRIPT_DIR = Path(__file__).resolve().parent
if str(_SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(_SCRIPT_DIR))

from deps import ensure_imports

ensure_imports("PIL")

from PIL import Image

ROOT = _SCRIPT_DIR.parent
DEFAULT_SIZE = 400
DEFAULT_QUALITY = 70
IMAGE_EXT = {".png", ".webp", ".jpg", ".jpeg"}


def format_bytes(size: int) -> str:
    if size < 1024:
        return f"{size} B"
    return f"{size / 1024:.1f} KB"


def resize_contain(img: Image.Image, size: int) -> Image.Image:
    rgba = img.convert("RGBA")
    width, height = rgba.size
    scale = min(size / width, size / height)
    new_w = max(1, int(width * scale))
    new_h = max(1, int(height * scale))
    resized = rgba.resize((new_w, new_h), Image.Resampling.NEAREST)
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    offset = ((size - new_w) // 2, (size - new_h) // 2)
    canvas.paste(resized, offset)
    return canvas


def compress_file(input_path: Path, output_path: Path, *, size: int, quality: int) -> None:
    input_stat = input_path.stat()
    with Image.open(input_path) as img:
        out = resize_contain(img, size)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        out.save(output_path, format="WEBP", quality=quality, method=6)

    output_stat = output_path.stat()
    with Image.open(output_path) as saved:
        width, height = saved.size
    rel = output_path.relative_to(ROOT)
    print(
        f"{rel}: {width}x{height} q={quality} "
        f"{format_bytes(input_stat.st_size)} → {format_bytes(output_stat.st_size)}"
    )


def list_images(directory: Path) -> list[Path]:
    files: list[Path] = []

    def walk(current: Path) -> None:
        for entry in sorted(current.iterdir()):
            if entry.is_dir():
                walk(entry)
            elif entry.suffix.lower() in IMAGE_EXT:
                files.append(entry)

    walk(directory)
    return files


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input", nargs="?", help="Input image path")
    parser.add_argument("output", nargs="?", help="Output .webp path")
    parser.add_argument("--batch", nargs=2, metavar=("INPUT_DIR", "OUTPUT_DIR"))
    parser.add_argument("--in-place", action="store_true")
    parser.add_argument("--size", type=int, default=DEFAULT_SIZE)
    parser.add_argument("--quality", type=int, default=DEFAULT_QUALITY)
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv or sys.argv[1:])

    if args.quality < 1 or args.quality > 100:
        print("[compress-image] --quality must be between 1 and 100", file=sys.stderr)
        return 1

    if args.size < 1:
        print("[compress-image] --size must be a positive integer", file=sys.stderr)
        return 1

    if args.batch:
        input_dir = Path(args.batch[0]).resolve()
        output_dir = Path(args.batch[1]).resolve()
        if not input_dir.is_dir():
            print(f"[compress-image] Directory not found: {input_dir}", file=sys.stderr)
            return 1

        files = list_images(input_dir)
        if not files:
            print(f"[compress-image] No images in {input_dir}", file=sys.stderr)
            return 1

        for input_path in files:
            rel = input_path.relative_to(input_dir)
            if args.in_place:
                output_path = input_path
                temp_path = input_path.with_suffix(f"{input_path.suffix}.tmp.webp")
            else:
                output_path = (output_dir / rel).with_suffix(".webp")
                temp_path = output_path

            compress_file(input_path, temp_path, size=args.size, quality=args.quality)
            if args.in_place:
                temp_path.replace(input_path)
        return 0

    if not args.input:
        print(
            "usage: compress-image.py <input> <output.webp> [options]\n"
            "       compress-image.py --batch <input-dir> <output-dir> [options]",
            file=sys.stderr,
        )
        return 1

    input_path = Path(args.input).resolve()
    if not input_path.is_file():
        print(f"[compress-image] File not found: {input_path}", file=sys.stderr)
        return 1

    if args.in_place:
        output_path = input_path
        temp_path = input_path.with_suffix(f"{input_path.suffix}.tmp.webp")
    else:
        if not args.output:
            print(
                "[compress-image] Output path required unless --in-place is set",
                file=sys.stderr,
            )
            return 1
        output_path = Path(args.output).resolve()
        temp_path = output_path

    compress_file(input_path, temp_path, size=args.size, quality=args.quality)
    if args.in_place:
        temp_path.replace(input_path)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

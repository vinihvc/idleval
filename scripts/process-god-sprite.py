#!/usr/bin/env python3
"""Backward-compatible wrapper — use remove-bg.py or `pnpm remove-bg` instead."""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path


def main() -> None:
    if len(sys.argv) != 3:
        print("Usage: process-god-sprite.py <src.png> <dst.webp>")
        print("Prefer: pnpm remove-bg <src> <dst>")
        sys.exit(1)

    script = Path(__file__).with_name("remove-bg.py")
    result = subprocess.run(
        [
            sys.executable,
            str(script),
            sys.argv[1],
            sys.argv[2],
            "--size",
            "400",
            "--auto-key",
        ],
        check=False,
    )
    raise SystemExit(result.returncode)


if __name__ == "__main__":
    main()

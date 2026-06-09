"""Install script dependencies on first run."""

from __future__ import annotations

import importlib
import subprocess
import sys
from pathlib import Path

REQUIREMENTS = Path(__file__).resolve().parent / "requirements.txt"


def ensure_imports(*modules: str) -> None:
    missing: list[str] = []
    for module in modules:
        try:
            importlib.import_module(module)
        except ImportError:
            missing.append(module)

    if not missing:
        return

    print(f"[deps] Installing Python packages for: {', '.join(missing)}")
    result = subprocess.run(
        [sys.executable, "-m", "pip", "install", "-r", str(REQUIREMENTS)],
        check=False,
    )
    if result.returncode != 0:
        print(
            "[deps] Install failed. Run manually:\n"
            f"  {sys.executable} -m pip install -r scripts/requirements.txt",
            file=sys.stderr,
        )
        raise SystemExit(result.returncode)

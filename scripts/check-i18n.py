#!/usr/bin/env python3
"""Validate that all locale message files share the same keys."""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MESSAGES_DIR = ROOT / "src" / "i18n" / "messages"
LOCALES = ("en", "es", "pt")
REFERENCE_LOCALE = "en"


def load_keys(locale: str) -> list[str]:
    file_path = MESSAGES_DIR / f"{locale}.json"
    if not file_path.is_file():
        print(f"[i18n] Missing message file: {file_path}", file=sys.stderr)
        raise SystemExit(1)

    with file_path.open(encoding="utf-8") as handle:
        data = json.load(handle)

    if not isinstance(data, dict):
        print(f"[i18n] {file_path} must be a flat JSON object.", file=sys.stderr)
        raise SystemExit(1)

    return sorted(data.keys())


def main() -> int:
    key_sets = {locale: set(load_keys(locale)) for locale in LOCALES}
    reference_keys = key_sets[REFERENCE_LOCALE]
    failed = False

    for locale in LOCALES:
        if locale == REFERENCE_LOCALE:
            continue

        keys = key_sets[locale]
        missing = sorted(reference_keys - keys)
        extra = sorted(keys - reference_keys)

        if missing:
            failed = True
            print(f"\n[i18n] {locale} is missing {len(missing)} key(s):", file=sys.stderr)
            for key in missing:
                print(f"  - {key}", file=sys.stderr)

        if extra:
            failed = True
            print(f"\n[i18n] {locale} has {len(extra)} extra key(s):", file=sys.stderr)
            for key in extra:
                print(f"  - {key}", file=sys.stderr)

    if failed:
        return 1

    print(
        f"[i18n] {len(reference_keys)} keys × {len(LOCALES)} locales OK "
        f"({', '.join(LOCALES)})."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

#!/usr/bin/env python3
"""Normalize WAV files in public/sounds/ to consistent loudness."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

_SCRIPT_DIR = Path(__file__).resolve().parent
if str(_SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(_SCRIPT_DIR))

from deps import ensure_imports

ensure_imports("numpy", "pyloudnorm", "soundfile")

import numpy as np
import pyloudnorm as pyln
import soundfile as sf

TARGET_LUFS = -16.0
TARGET_RMS_DB = -18.0
PEAK_LIMIT_DB = -1.0
MIN_LUFS_DURATION_S = 0.4


def peak_limit_db(data: np.ndarray, limit_db: float = PEAK_LIMIT_DB) -> np.ndarray:
    limit = 10 ** (limit_db / 20)
    peak = np.max(np.abs(data))
    if peak <= limit:
        return data
    return data * (limit / peak)


def rms_db(data: np.ndarray) -> float:
    rms = np.sqrt(np.mean(np.square(data)))
    return 20 * np.log10(rms + 1e-12)


def normalize_lufs(data: np.ndarray, rate: int, target_lufs: float) -> np.ndarray:
    meter = pyln.Meter(rate)
    loudness = meter.integrated_loudness(data)
    if loudness == float("-inf"):
        raise ValueError("Audio is silent")
    return pyln.normalize.loudness(data, loudness, target_lufs)


def normalize_rms(data: np.ndarray, target_rms_db: float) -> np.ndarray:
    current = rms_db(data)
    gain = 10 ** ((target_rms_db - current) / 20)
    return data * gain


def normalize_file(path: Path, target_lufs: float, target_rms_db: float) -> dict[str, float]:
    data, rate = sf.read(path, always_2d=True)
    duration_s = data.shape[0] / rate

    before_lufs = None
    meter = pyln.Meter(rate)
    try:
        before_lufs = meter.integrated_loudness(data)
    except ValueError:
        before_lufs = float("-inf")

    before_rms = rms_db(data)
    before_peak = 20 * np.log10(np.max(np.abs(data)) + 1e-12)

    if duration_s >= MIN_LUFS_DURATION_S:
        normalized = normalize_lufs(data, rate, target_lufs)
        method = "lufs"
    else:
        normalized = normalize_rms(data, target_rms_db)
        method = "rms"

    normalized = peak_limit_db(normalized)

    try:
        after_lufs = meter.integrated_loudness(normalized)
    except ValueError:
        after_lufs = float("-inf")

    after_rms = rms_db(normalized)
    after_peak = 20 * np.log10(np.max(np.abs(normalized)) + 1e-12)

    sf.write(path, normalized, rate, subtype="PCM_16")

    return {
        "method": method,
        "duration_s": duration_s,
        "before_lufs": before_lufs,
        "after_lufs": after_lufs,
        "before_rms": before_rms,
        "after_rms": after_rms,
        "before_peak": before_peak,
        "after_peak": after_peak,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--dir",
        type=Path,
        default=Path(__file__).resolve().parents[1] / "public" / "sounds",
    )
    parser.add_argument("--target-lufs", type=float, default=TARGET_LUFS)
    parser.add_argument("--target-rms-db", type=float, default=TARGET_RMS_DB)
    args = parser.parse_args()

    wav_files = sorted(args.dir.glob("*.wav"))
    if not wav_files:
        raise SystemExit(f"No WAV files found in {args.dir}")

    print(f"Normalizing {len(wav_files)} files in {args.dir}\n")
    print(f"{'file':<14} {'method':<6} {'LUFS before':>12} {'LUFS after':>11} {'RMS after':>10} {'peak after':>11}")
    print("-" * 72)

    for path in wav_files:
        stats = normalize_file(path, args.target_lufs, args.target_rms_db)
        before_lufs = (
            f"{stats['before_lufs']:>8.2f}"
            if stats["before_lufs"] != float("-inf")
            else "     n/a"
        )
        after_lufs = (
            f"{stats['after_lufs']:>8.2f}"
            if stats["after_lufs"] != float("-inf")
            else "     n/a"
        )
        print(
            f"{path.name:<14} {stats['method']:<6} {before_lufs:>12} {after_lufs:>11} "
            f"{stats['after_rms']:>9.2f}dB {stats['after_peak']:>9.2f}dB"
        )


if __name__ == "__main__":
    main()

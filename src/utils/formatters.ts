import type Decimal from "break_infinity.js";
import { D, INFINITY_THRESHOLD, toDisplayNumber } from "@/utils/decimal";

const buildRepeatedLetterSuffixes = (length: number, startExponent: number) =>
  Array.from({ length: 26 }, (_, index) => {
    const letter = String.fromCharCode(65 + index);

    return {
      value: D(`1e${startExponent + index * 3}`),
      symbol: letter.repeat(length),
    };
  });

const VALUE_RANGE = [
  { value: D(1), symbol: "" },
  { value: D(1e3), symbol: "K" },
  { value: D(1e6), symbol: "M" },
  { value: D(1e9), symbol: "B" },
  { value: D(1e12), symbol: "T" },
  ...buildRepeatedLetterSuffixes(2, 15),
  ...buildRepeatedLetterSuffixes(3, 93),
];

const TRAILING_DECIMAL_ZEROS_RE = /\.0+$|(\.[0-9]*[1-9])0+$/;

const findRange = (amount: Decimal) =>
  VALUE_RANGE.slice()
    .reverse()
    .find((item) => amount.gte(item.value));

const formatScaledValue = (amount: Decimal, rangeValue: Decimal) => {
  const scaled = amount.div(rangeValue);
  const displayValue = toDisplayNumber(scaled);

  return displayValue.toFixed(2).replace(TRAILING_DECIMAL_ZEROS_RE, "$1");
};

/**
 * Abbreviates a number with K, M, B, T and extended letter suffixes.
 *
 * @example
 * amountFormatter(999) // "999"
 * amountFormatter(1500) // "1.5 K"
 * amountFormatter(D("2500000")) // "2.5 M"
 * amountFormatter(D("1e200")) // "∞"
 */
export const amountFormatter = (amount: number | Decimal) => {
  const value = D(amount);

  if (value.gte(INFINITY_THRESHOLD)) {
    return "∞";
  }

  if (value.lte(0)) {
    return "0";
  }

  const item = findRange(value);

  if (item) {
    const scaled = formatScaledValue(value, item.value);

    return item.symbol ? `${scaled} ${item.symbol}` : scaled;
  }

  return "0";
};

/**
 * Same as amountFormatter, prefixed with a dollar sign.
 *
 * @example
 * amountFormatterWithDolarSign(1500) // "$1.5 K"
 */
export const amountFormatterWithDolarSign = (amount: number | Decimal) =>
  `$${amountFormatter(amount)}`;

/**
 * Returns only the magnitude suffix for a value, without the numeric part.
 *
 * @example
 * suffixAmountFormatter(1500) // "K"
 * suffixAmountFormatter(500) // ""
 */
export const suffixAmountFormatter = (amount: number | Decimal) => {
  const value = D(amount);
  const item = findRange(value);

  if (item) {
    return `${item.symbol}`;
  }

  return "";
};

/**
 * Capitalizes the first letter of a string.
 *
 * @example
 * capitalize("hello") // "Hello"
 */
export const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

/**
 * Format seconds to minutes and seconds
 *
 * @example
 * timeFormatter(120) // "2:00"
 */
export const timeFormatter = (seconds: number) => {
  const totalSeconds = Math.max(0, Math.ceil(seconds));
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

/**
 * Format milliseconds as hours, minutes, and seconds (H:MM:SS).
 *
 * @example
 * countdownFormatter(45_000) // "0:00:45"
 * countdownFormatter(125_000) // "0:02:05"
 * countdownFormatter(3_600_000) // "1:00:00"
 */
export const countdownFormatter = (ms: number) => {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

/**
 * Formats elapsed milliseconds as a human-readable duration.
 *
 * @example
 * formatElapsedDuration(45_000) // "45s"
 * formatElapsedDuration(125_000) // "2m 5s"
 * formatElapsedDuration(3_600_000) // "1h"
 * formatElapsedDuration(86_400_000) // "1d"
 */
export const formatElapsedDuration = (elapsedMs: number) => {
  const totalSeconds = Math.floor(elapsedMs / 1000);

  if (totalSeconds < 60) {
    return `${totalSeconds}s`;
  }

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes < 60) {
    return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours < 24) {
    return remainingMinutes > 0
      ? `${hours}h ${remainingMinutes}m`
      : `${hours}h`;
  }

  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;

  return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
};

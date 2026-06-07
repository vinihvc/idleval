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
 * Minify number to show as K, M, B, T
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
    return `${formatScaledValue(value, item.value)}${item.symbol}`;
  }

  return "0";
};

export const amountFormatterWithDolarSign = (amount: number | Decimal) =>
  `$${amountFormatter(amount)}`;

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
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

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

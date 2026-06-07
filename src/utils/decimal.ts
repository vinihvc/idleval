import Decimal from "break_infinity.js";

/** Decimal wrapper used for all in-game currency and production values. */
export type GameValue = Decimal;

/**
 * Coerces a value into a Decimal instance.
 *
 * @example
 * D(10).toNumber() // 10
 * D("1e12").toString() // "1e12"
 * D(D(5)) === D(5) // true (returns same instance)
 */
export const D = (value: number | string | Decimal): Decimal => {
  if (value instanceof Decimal) {
    return value;
  }

  return new Decimal(value);
};

export const ZERO = D(0);
export const ONE = D(1);

export const INFINITY_THRESHOLD = D("1e171");

/**
 * Serializes a Decimal to a string for persistence.
 *
 * @example
 * serializeDecimal(D("123456789.5")) // "123456789.5"
 */
export const serializeDecimal = (value: Decimal): string => value.toString();

/**
 * Deserializes a stored value back into a Decimal.
 *
 * @example
 * deserializeDecimal("1e12").toString() // "1e12"
 * deserializeDecimal(42).toNumber() // 42
 */
export const deserializeDecimal = (value: string | number): Decimal => D(value);

/**
 * Converts a Decimal to a finite number for UI formatting.
 *
 * @example
 * toDisplayNumber(D(123)) // 123
 * toDisplayNumber(D("1e400")) // Infinity
 */
export const toDisplayNumber = (value: Decimal): number => {
  const parsed = Number.parseFloat(value.toString());

  if (Number.isFinite(parsed)) {
    return parsed;
  }

  return Number.POSITIVE_INFINITY;
};

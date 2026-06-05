import Decimal from "break_infinity.js";

export type GameValue = Decimal;

export const D = (value: number | string | Decimal): Decimal => {
  if (value instanceof Decimal) {
    return value;
  }

  return new Decimal(value);
};

export const ZERO = D(0);
export const ONE = D(1);

export const INFINITY_THRESHOLD = D("1e171");

export const canAfford = (gold: Decimal, price: Decimal): boolean =>
  gold.gte(price);

export const serializeDecimal = (value: Decimal): string => value.toString();

export const deserializeDecimal = (value: string | number): Decimal => D(value);

export const toDisplayNumber = (value: Decimal): number => {
  const parsed = Number.parseFloat(value.toString());

  if (Number.isFinite(parsed)) {
    return parsed;
  }

  return Number.POSITIVE_INFINITY;
};

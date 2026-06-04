/**
 * Calculate the percentage of a value
 *
 * @param partialValue - The partial value
 * @param totalValue - The total value
 * @returns The percentage of the value
 */
export const percentage = (partialValue: number, totalValue: number) =>
  (100 * partialValue) / totalValue;

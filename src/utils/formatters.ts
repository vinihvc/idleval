const VALUE_RANGE = [
  { value: 1, symbol: "" },
  { value: 1e3, symbol: "K" },
  { value: 1e6, symbol: "M" },
  { value: 1e9, symbol: "B" },
  { value: 1e12, symbol: "T" },
  { value: 1e15, symbol: "AA" },
  { value: 1e18, symbol: "BB" },
  { value: 1e21, symbol: "CC" },
  { value: 1e24, symbol: "DD" },
  { value: 1e27, symbol: "EE" },
  { value: 1e30, symbol: "FF" },
  { value: 1e33, symbol: "GG" },
  { value: 1e36, symbol: "HH" },
  { value: 1e39, symbol: "II" },
  { value: 1e42, symbol: "JJ" },
  { value: 1e45, symbol: "KK" },
  { value: 1e48, symbol: "LL" },
  { value: 1e51, symbol: "MM" },
  { value: 1e54, symbol: "NN" },
  { value: 1e57, symbol: "OO" },
  { value: 1e60, symbol: "PP" },
  { value: 1e63, symbol: "QQ" },
  { value: 1e66, symbol: "RR" },
  { value: 1e69, symbol: "SS" },
  { value: 1e72, symbol: "TT" },
  { value: 1e75, symbol: "UU" },
  { value: 1e78, symbol: "VV" },
  { value: 1e81, symbol: "WW" },
  { value: 1e84, symbol: "XX" },
  { value: 1e87, symbol: "YY" },
  { value: 1e90, symbol: "ZZ" },
];

/**
 * Minify number to show as K, M, B, T
 */
export const amountFormatter = (amount: number) => {
  const regex = /\.0+$|(\.[0-9]*[1-9])0+$/;

  const item = VALUE_RANGE.slice()
    .reverse()
    .find((item) => amount >= item.value);

  if (amount >= 1e93) {
    return "∞";
  }

  if (item) {
    const formattedValue = amount / item.value;
    return `${formattedValue.toFixed(2).replace(regex, "$1")}${item.symbol}`;
  }

  return "0";
};

export const amountFormatterWithDolarSign = (amount: number) =>
  `$${amountFormatter(amount)}`;

export const suffixAmountFormatter = (amount: number) => {
  const item = VALUE_RANGE.slice()
    .reverse()
    .find((item) => amount >= item.value);

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

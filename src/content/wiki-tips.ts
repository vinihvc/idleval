export const WIKI_TIP_IDS = [
  "gettingStarted",
  "managers",
  "upgrades",
  "gods",
  "offline",
  "purchaseModes",
  "difficulty",
] as const;

export type WikiTipId = (typeof WIKI_TIP_IDS)[number];

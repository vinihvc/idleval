import { translate } from "@/i18n/localize";

export const GOD_DATA = [
  {
    id: "huangdi",
    goldRequired: "1e12",
    productionMultiplier: 2,
    productionSpeedMultiplier: 1.15,
    confettiColor: "#f8c808",
    image: "/images/gods/huangdi.webp",
    icon: "/images/gods/icons/huangdi.webp",
  },
  {
    id: "dagda",
    goldRequired: "1e18",
    productionMultiplier: 3,
    productionSpeedMultiplier: 1.25,
    confettiColor: "#46820a",
    image: "/images/gods/dagda.webp",
    icon: "/images/gods/icons/dagda.webp",
  },
  {
    id: "shango",
    goldRequired: "1e24",
    productionMultiplier: 4,
    productionSpeedMultiplier: 1.35,
    confettiColor: "#d82808",
    image: "/images/gods/shango.webp",
    icon: "/images/gods/icons/shango.webp",
  },
  {
    id: "indra",
    goldRequired: "1e30",
    productionMultiplier: 5,
    productionSpeedMultiplier: 1.5,
    confettiColor: "#f8a838",
    image: "/images/gods/indra.webp",
    icon: "/images/gods/icons/indra.webp",
  },
  {
    id: "tangaroa",
    goldRequired: "1e36",
    productionMultiplier: 8,
    productionSpeedMultiplier: 1.65,
    confettiColor: "#c87828",
    image: "/images/gods/tangaroa.webp",
    icon: "/images/gods/icons/tangaroa.webp",
  },
  {
    id: "inti",
    goldRequired: "1e42",
    productionMultiplier: 10,
    productionSpeedMultiplier: 1.8,
    confettiColor: "#d89808",
    image: "/images/gods/inti.webp",
    icon: "/images/gods/icons/inti.webp",
  },
] as const;

export const GOD_COUNT = GOD_DATA.length;

export type GodType = (typeof GOD_DATA)[number];

export type GodId = (typeof GOD_DATA)[number]["id"];

export const getGodIndex = (god: Pick<GodType, "id">): number =>
  GOD_DATA.findIndex((entry) => entry.id === god.id);

export const getGodConfettiColor = (godId: GodId): string =>
  GOD_DATA.find((entry) => entry.id === godId)?.confettiColor ?? "#f8c808";

export const getLocalizedGod = (godId: GodId) => ({
  name: translate(`god.${godId}.name`),
  description: translate(`god.${godId}.description`),
});

export type LocalizedGod = ReturnType<typeof getLocalizedGod>;

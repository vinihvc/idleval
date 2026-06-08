import { translate } from "@/i18n/localize";

export const GOD_DATA = [
  {
    id: "huangdi",
    goldRequired: "1e12",
    productionMultiplier: 2,
    image: "/images/gods/huangdi.webp",
    icon: "/images/gods/icons/huangdi.webp",
  },
  {
    id: "dagda",
    goldRequired: "1e18",
    productionMultiplier: 3,
    image: "/images/gods/dagda.webp",
    icon: "/images/gods/icons/dagda.webp",
  },
  {
    id: "shango",
    goldRequired: "1e24",
    productionMultiplier: 4,
    image: "/images/gods/shango.webp",
    icon: "/images/gods/icons/shango.webp",
  },
  {
    id: "indra",
    goldRequired: "1e30",
    productionMultiplier: 5,
    image: "/images/gods/indra.webp",
    icon: "/images/gods/icons/indra.webp",
  },
  {
    id: "tangaroa",
    goldRequired: "1e36",
    productionMultiplier: 8,
    image: "/images/gods/tangaroa.webp",
    icon: "/images/gods/icons/tangaroa.webp",
  },
  {
    id: "inti",
    goldRequired: "1e42",
    productionMultiplier: 10,
    image: "/images/gods/inti.webp",
    icon: "/images/gods/icons/inti.webp",
  },
] as const;

export const GOD_COUNT = GOD_DATA.length;

export type GodType = (typeof GOD_DATA)[number];

export type GodId = (typeof GOD_DATA)[number]["id"];

export const getGod = (god: Pick<GodType, "id">): number =>
  GOD_DATA.findIndex((entry) => entry.id === god.id);

export const getLocalizedGod = (godId: GodId) => ({
  name: translate(`god.${godId}.name`),
  description: translate(`god.${godId}.description`),
});

export type LocalizedGod = ReturnType<typeof getLocalizedGod>;

import type { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/core/macro";

export const GOD_IDS = [
  "huangdi",
  "dagda",
  "shango",
  "indra",
  "tangaroa",
  "inti",
] as const;

export type GodId = (typeof GOD_IDS)[number];

export interface GodData {
  goldRequired: string;
  icon: string;
  id: GodId;
  image: string;
  productionMultiplier: number;
}

export const GOD_DATA: GodData[] = [
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
];

export const GOD_MESSAGES: Record<
  GodId,
  { description: MessageDescriptor; name: MessageDescriptor }
> = {
  huangdi: {
    name: msg({ id: "god.huangdi.name", message: "Huangdi" }),
    description: msg({ id: "god.huangdi.description", message: "Invoke the Yellow Emperor of China; the Mandate roots harvest and dynasty in your soil." }),
  },
  dagda: {
    name: msg({ id: "god.dagda.name", message: "The Dagda" }),
    description: msg({ id: "god.dagda.description", message: "Call the Dagda of Ireland; his cauldron and harp fatten every wheel along the river." }),
  },
  shango: {
    name: msg({ id: "god.shango.name", message: "Shango" }),
    description: msg({ id: "god.shango.description", message: "Bind your forges to Shango of Yoruba thunder; iron rings when the double axe falls." }),
  },
  indra: {
    name: msg({ id: "god.indra.name", message: "Indra" }),
    description: msg({ id: "god.indra.description", message: "Stand beneath Indra of the Vedas; the thousand-eyed king sends bolts where arrows fail." }),
  },
  tangaroa: {
    name: msg({ id: "god.tangaroa.name", message: "Tangaroa" }),
    description: msg({ id: "god.tangaroa.description", message: "Sail with Tangaroa of Polynesia; the sea-father claims harbors and hulls for your crown." }),
  },
  inti: {
    name: msg({ id: "god.inti.name", message: "Inti" }),
    description: msg({ id: "god.inti.description", message: "Bow to Inti of the Andes; sun-temples blaze and pilgrim silver flows to your shrine." }),
  },
};

export const GOD_COUNT = GOD_DATA.length;

export const getGodIndex = (god: Pick<GodData, "id">): number =>
  GOD_DATA.findIndex((entry) => entry.id === god.id);

export type God = GodData;

export const GODS = GOD_DATA;

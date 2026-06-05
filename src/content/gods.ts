/** Divine favor per tier — deities from the same peoples as each manager, not the same figures. */
export const GODS = [
  {
    id: "huangdi",
    name: "Huangdi",
    description:
      "Invoke the Yellow Emperor of China; the Mandate roots harvest and dynasty in your soil.",
    goldRequired: "1e12",
    productionMultiplier: 2,
    image: "/images/gods/huangdi.webp",
    icon: "/images/gods/icons/huangdi.webp",
  },
  {
    id: "dagda",
    name: "The Dagda",
    description:
      "Call the Dagda of Ireland; his cauldron and harp fatten every wheel along the river.",
    goldRequired: "1e18",
    productionMultiplier: 3,
    image: "/images/gods/dagda.webp",
    icon: "/images/gods/icons/dagda.webp",
  },
  {
    id: "shango",
    name: "Shango",
    description:
      "Bind your forges to Shango of Yoruba thunder; iron rings when the double axe falls.",
    goldRequired: "1e24",
    productionMultiplier: 4,
    image: "/images/gods/shango.webp",
    icon: "/images/gods/icons/shango.webp",
  },
  {
    id: "indra",
    name: "Indra",
    description:
      "Stand beneath Indra of the Vedas; the thousand-eyed king sends bolts where arrows fail.",
    goldRequired: "1e30",
    productionMultiplier: 5,
    image: "/images/gods/indra.webp",
    icon: "/images/gods/icons/indra.webp",
  },
  {
    id: "tangaroa",
    name: "Tangaroa",
    description:
      "Sail with Tangaroa of Polynesia; the sea-father claims harbors and hulls for your crown.",
    goldRequired: "1e36",
    productionMultiplier: 8,
    image: "/images/gods/tangaroa.webp",
    icon: "/images/gods/icons/tangaroa.webp",
  },
  {
    id: "inti",
    name: "Inti",
    description:
      "Bow to Inti of the Andes; sun-temples blaze and pilgrim silver flows to your shrine.",
    goldRequired: "1e42",
    productionMultiplier: 10,
    image: "/images/gods/inti.webp",
    icon: "/images/gods/icons/inti.webp",
  },
] as const;

export type God = (typeof GODS)[number];

export const GOD_COUNT = GODS.length;

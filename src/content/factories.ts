export const FACTORY_TYPES = [
  "grain",
  "mill",
  "iron",
  "crossbow",
  "longship",
  "reliquary",
] as const;

export type FactoryType = (typeof FACTORY_TYPES)[number];

interface Lore {
  description: string;
  name: string;
}

interface FactoryDefinition extends Lore {
  baseBuyCost: number;
  manager: Lore;
  productionTime: number;
  productionValue: number;
  unlockPrice: number;
  upgrade: Lore;
}

export const FACTORIES = {
  grain: {
    name: "Grain",
    description:
      "Fill the granaries; a hungry realm has neither law nor lance.",
    upgrade: {
      name: "Irrigation",
      description:
        "Channels and royal silos tied to the river; famine rarely returns.",
    },
    manager: {
      name: "Shennong",
      description:
        "The divine farmer of Chinese lore; he tastes every herb so the people know what to sow.",
    },
    productionTime: 2,
    productionValue: 20,
    baseBuyCost: 75,
    unlockPrice: 0,
  },
  mill: {
    name: "Watermill",
    description:
      "Wheels turned by the stream; grist pays the crown faster than the sickle alone.",
    upgrade: {
      name: "Bakehouses",
      description:
        "Mill wheels feed crown bakehouses; bread for armies and cities leaves the ovens faster than grain ever could.",
    },
    manager: {
      name: "Brigid",
      description:
        "The Irish keeper of the flame and the wheel; mills turn wherever her feast is kept.",
    },
    productionTime: 5,
    productionValue: 160,
    baseBuyCost: 1125,
    unlockPrice: 55_000,
  },
  iron: {
    name: "Iron",
    description:
      "Ingots for plough, nail, and blade; iron is the sinew of the realm.",
    upgrade: {
      name: "Armories",
      description:
        "Smiths turn ingot into blade, mail, buckle, and ploughshare; every levy marches equipped and every field is shod in iron.",
    },
    manager: {
      name: "Ogun",
      description:
        "The Yoruba lord of iron and the road; forges answer when his machete strikes stone.",
    },
    productionTime: 10,
    productionValue: 1280,
    baseBuyCost: 16_875,
    unlockPrice: 825_000,
  },
  crossbow: {
    name: "Crossbow",
    description:
      "Steel prods and windlasses; walls mean less when bolts fly true.",
    upgrade: {
      name: "Trebuchets",
      description:
        "Counterweight engines and siege crews; walls crumble before the charge, and ransom follows every breach.",
    },
    manager: {
      name: "Arjuna",
      description:
        "The peerless archer of the Mahabharata; his guild drills until the bolt finds the mark.",
    },
    productionTime: 20,
    productionValue: 10_240,
    baseBuyCost: 253_125,
    unlockPrice: 12_500_000,
  },
  longship: {
    name: "Longship",
    description:
      "Keels for raid, trade, and tax; whoever rules the water widens the crown.",
    upgrade: {
      name: "Colonial Trade",
      description:
        "Chartered companies plant colonies and carry spice, wool, and silver; every voyage widens the crown's purse.",
    },
    manager: {
      name: "Maui",
      description:
        "The Polynesian fisher of islands; he hauls coastlines closer and sends hulls to sea.",
    },
    productionTime: 40,
    productionValue: 81_920,
    baseBuyCost: 3_796_875,
    unlockPrice: 187_500_000,
  },
  reliquary: {
    name: "Reliquary",
    description:
      "Bones under glass and wax-sealed gifts; pilgrims pay in silver and awe.",
    upgrade: {
      name: "Tithes",
      description:
        "Every hearth pays the tithe, every child learns the creed, and pilgrim offerings swell the treasury—faith becomes coin by law.",
    },
    manager: {
      name: "Pachacamac",
      description:
        "The Andean creator and oracle god; offerings at his shrine draw pilgrims from every road.",
    },
    productionTime: 80,
    productionValue: 655_360,
    baseBuyCost: 56_953_125,
    unlockPrice: 2_812_500_000,
  },
} satisfies Record<FactoryType, FactoryDefinition>;

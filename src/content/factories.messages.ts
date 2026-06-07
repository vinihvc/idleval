import type { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/core/macro";
import type { FactoryType } from "@/content/factories.types";

interface FactoryLoreMessages {
  description: MessageDescriptor;
  name: MessageDescriptor;
}

interface FactoryMessages extends FactoryLoreMessages {
  manager: FactoryLoreMessages;
  upgrade: FactoryLoreMessages;
}

export const FACTORY_MESSAGES: Record<FactoryType, FactoryMessages> = {
  grain: {
    name: msg({ id: "factory.grain.name", message: "Grain" }),
    description: msg({ id: "factory.grain.description", message: "Fill the granaries; a hungry realm has neither law nor lance." }),
    upgrade: {
      name: msg({ id: "factory.grain.upgrade.name", message: "Irrigation" }),
      description: msg({ id: "factory.grain.upgrade.description", message: "Channels and royal silos tied to the river; famine rarely returns." }),
    },
    manager: {
      name: msg({ id: "factory.grain.manager.name", message: "Shennong" }),
      description: msg({ id: "factory.grain.manager.description", message: "The divine farmer of Chinese lore; he tastes every herb so the people know what to sow." }),
    },
  },
  mill: {
    name: msg({ id: "factory.mill.name", message: "Watermill" }),
    description: msg({ id: "factory.mill.description", message: "Wheels turned by the stream; grist pays the crown faster than the sickle alone." }),
    upgrade: {
      name: msg({ id: "factory.mill.upgrade.name", message: "Bakehouses" }),
      description: msg({ id: "factory.mill.upgrade.description", message: "Mill wheels feed crown bakehouses; bread for armies and cities leaves the ovens faster than grain ever could." }),
    },
    manager: {
      name: msg({ id: "factory.mill.manager.name", message: "Brigid" }),
      description: msg({ id: "factory.mill.manager.description", message: "The Irish keeper of the flame and the wheel; mills turn wherever her feast is kept." }),
    },
  },
  iron: {
    name: msg({ id: "factory.iron.name", message: "Iron" }),
    description: msg({ id: "factory.iron.description", message: "Ingots for plough, nail, and blade; iron is the sinew of the realm." }),
    upgrade: {
      name: msg({ id: "factory.iron.upgrade.name", message: "Armories" }),
      description: msg({ id: "factory.iron.upgrade.description", message: "Smiths turn ingot into blade, mail, buckle, and ploughshare; every levy marches equipped and every field is shod in iron." }),
    },
    manager: {
      name: msg({ id: "factory.iron.manager.name", message: "Ogun" }),
      description: msg({ id: "factory.iron.manager.description", message: "The Yoruba lord of iron and the road; forges answer when his machete strikes stone." }),
    },
  },
  crossbow: {
    name: msg({ id: "factory.crossbow.name", message: "Crossbow" }),
    description: msg({ id: "factory.crossbow.description", message: "Steel prods and windlasses; walls mean less when bolts fly true." }),
    upgrade: {
      name: msg({ id: "factory.crossbow.upgrade.name", message: "Trebuchets" }),
      description: msg({ id: "factory.crossbow.upgrade.description", message: "Counterweight engines and siege crews; walls crumble before the charge, and ransom follows every breach." }),
    },
    manager: {
      name: msg({ id: "factory.crossbow.manager.name", message: "Arjuna" }),
      description: msg({ id: "factory.crossbow.manager.description", message: "The peerless archer of the Mahabharata; his guild drills until the bolt finds the mark." }),
    },
  },
  longship: {
    name: msg({ id: "factory.longship.name", message: "Longship" }),
    description: msg({ id: "factory.longship.description", message: "Keels for raid, trade, and tax; whoever rules the water widens the crown." }),
    upgrade: {
      name: msg({ id: "factory.longship.upgrade.name", message: "Colonial Trade" }),
      description: msg({ id: "factory.longship.upgrade.description", message: "Chartered companies plant colonies and carry spice, wool, and silver; every voyage widens the crown's purse." }),
    },
    manager: {
      name: msg({ id: "factory.longship.manager.name", message: "Maui" }),
      description: msg({ id: "factory.longship.manager.description", message: "The Polynesian fisher of islands; he hauls coastlines closer and sends hulls to sea." }),
    },
  },
  reliquary: {
    name: msg({ id: "factory.reliquary.name", message: "Reliquary" }),
    description: msg({ id: "factory.reliquary.description", message: "Bones under glass and wax-sealed gifts; pilgrims pay in silver and awe." }),
    upgrade: {
      name: msg({ id: "factory.reliquary.upgrade.name", message: "Tithes" }),
      description: msg({ id: "factory.reliquary.upgrade.description", message: "Every hearth pays the tithe, every child learns the creed, and pilgrim offerings swell the treasury—faith becomes coin by law." }),
    },
    manager: {
      name: msg({ id: "factory.reliquary.manager.name", message: "Pachacamac" }),
      description: msg({ id: "factory.reliquary.manager.description", message: "The Andean creator and oracle god; offerings at his shrine draw pilgrims from every road." }),
    },
  },
};

export interface LocalizedLore {
  description: string;
  name: string;
}

export interface LocalizedFactory extends LocalizedLore {
  manager: LocalizedLore;
  upgrade: LocalizedLore;
}

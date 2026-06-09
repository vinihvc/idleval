import { ChevronLeft } from "pixelarticons/react/ChevronLeft";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  UpgradeCard,
  UpgradeCardArt,
  UpgradeCardPanel,
} from "@/components/ui/upgrade-card";
import { m } from "@/i18n/messages";
import { WikiEntry } from "./wiki.entry";

export interface WikiCatalogItem {
  flavor: string;
  icon?: string;
  id: string;
  image: string;
  lore: string;
  mechanics: string;
  title: string;
}

interface WikiCatalogTabProps {
  items: WikiCatalogItem[];
}

export const WikiCatalogTab = (props: WikiCatalogTabProps) => {
  const { items } = props;
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const selectedItem = items.find((item) => item.id === selectedId);

  if (selectedItem) {
    return (
      <div className="grid gap-3">
        <Button
          className="w-fit gap-1.5"
          onClick={() => setSelectedId(null)}
          variant="brown"
        >
          <ChevronLeft />
          {m["ui.wiki.back"]()}
        </Button>

        <WikiEntry
          flavor={selectedItem.flavor}
          icon={selectedItem.icon}
          image={selectedItem.image}
          lore={selectedItem.lore}
          mechanics={selectedItem.mechanics}
          title={selectedItem.title}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <UpgradeCard
          aria-label={item.title}
          greenFrame={false}
          interactive
          key={item.id}
          onClick={() => setSelectedId(item.id)}
        >
          <UpgradeCardPanel>
            <UpgradeCardArt showImage src={item.image} />
          </UpgradeCardPanel>
        </UpgradeCard>
      ))}
    </div>
  );
};

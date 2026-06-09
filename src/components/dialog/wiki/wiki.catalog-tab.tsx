import { ChevronLeft } from "pixelarticons/react/ChevronLeft";
import React from "react";
import { Button } from "@/components/ui/button";
import { UpgradeCard } from "@/components/ui/upgrade-card";
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
  unlocked: boolean;
}

interface WikiCatalogTabProps {
  items: WikiCatalogItem[];
}

export const WikiCatalogTab = (props: WikiCatalogTabProps) => {
  const { items } = props;
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const selectedItem = items.find((item) => item.id === selectedId);

  if (selectedItem?.unlocked) {
    return (
      <div className="grid gap-3">
        <Button
          className="w-fit justify-center gap-1.5"
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
          aria-label={
            item.unlocked
              ? item.title
              : m["ui.wiki.lockedEntry"]({ 0: item.title })
          }
          disabled={!item.unlocked}
          icon={item.icon}
          image={item.image}
          key={item.id}
          locked={!item.unlocked}
          onClick={item.unlocked ? () => setSelectedId(item.id) : undefined}
          title={item.title}
        />
      ))}
    </div>
  );
};

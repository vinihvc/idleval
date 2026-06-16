import {
  UpgradeCard,
  UpgradeCardArt,
  UpgradeCardPanel,
} from "@/components/ui/upgrade-card";
import { useWikiCatalogSelection } from "./wiki.catalog-selection";
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
  const { selectedId, setSelectedId } = useWikiCatalogSelection();

  const selectedItem = items.find((item) => item.id === selectedId);

  if (selectedItem) {
    return (
      <WikiEntry
        flavor={selectedItem.flavor}
        icon={selectedItem.icon}
        image={selectedItem.image}
        lore={selectedItem.lore}
        mechanics={selectedItem.mechanics}
        title={selectedItem.title}
      />
    );
  }

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3">
      {items.map((item) => (
        <UpgradeCard
          aria-label={item.title}
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

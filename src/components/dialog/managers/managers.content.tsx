import { FACTORY_TYPES } from "@/content/factories";
import { LiveAnnouncer, useLiveAnnouncer } from "@/hooks/use-live-announcer";
import { m } from "@/i18n/messages";
import { ManagersCard } from "./managers.card";

export const ManagersContent = () => {
  const { announce, message } = useLiveAnnouncer();

  return (
    <>
      <LiveAnnouncer message={message} />
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {FACTORY_TYPES.map((factoryType) => (
          <ManagersCard
            factoryType={factoryType}
            key={factoryType}
            onPurchase={(name) => {
              announce(m["ui.a11y.purchased"]({ name }));
            }}
          />
        ))}
      </div>
    </>
  );
};

import { GOD_DATA } from "@/content/gods";
import { LiveAnnouncer, useLiveAnnouncer } from "@/hooks/use-live-announcer";
import { m } from "@/i18n/messages";
import { GodsCard } from "./gods.card";

interface GodsContentProps {
  onInvoke: () => void;
}

export const GodsContent = (props: GodsContentProps) => {
  const { onInvoke } = props;

  const { announce, message } = useLiveAnnouncer();

  return (
    <>
      <LiveAnnouncer message={message} />
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {GOD_DATA.map((god) => (
          <GodsCard
            god={god}
            key={god.id}
            onInvoke={(name) => {
              announce(m["ui.a11y.invoked"]({ name }));
              onInvoke();
            }}
          />
        ))}
      </div>
    </>
  );
};

import { CircleOff, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogImage,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog";
import { DialogNavTrigger } from "./dialog-nav-trigger";

interface AllianceDialogProps {
  variant?: "bottom" | "header";
}

export const AllianceDialog = (props: AllianceDialogProps) => {
  const { variant = "header" } = props;

  // const { count } = useAlliance()
  // const { money } = useWallet()

  // const _canJoinAlliance = React.useMemo(() => {
  //   return money >= 1e36
  // }, [money])

  // const _missingMoney = React.useMemo(() => {
  //   return 1e36 - money
  // }, [money])

  return (
    <ResponsiveDialog>
      <DialogNavTrigger
        icon={Handshake}
        label="Alliances"
        value="alliances"
        variant={variant}
      />

      <ResponsiveDialogContent>
        <ResponsiveDialogImage
          alt="Alliances"
          src="/images/alliances/alliance.webp"
        />

        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Alliances</ResponsiveDialogTitle>

          <ResponsiveDialogDescription>
            Create an alliance with other kingdoms to increase the trade
            partnership between you.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody>
          <div className="flex flex-col items-center justify-center gap-2 py-6 font-medium">
            <CircleOff className="size-8" />
            <p>There's no alliances available right now.</p>
          </div>

          {/* <div className="flex flex-col gap-2 py-6 font-medium">
          <div className="flex items-center justify-between">
            <span className="font-semibold capitalize">Total</span>

            <AnimatedNumber value={count} />
          </div>

          <div className="flex items-center justify-between">
            <span className="font-semibold capitalize">
              {canJoinAlliance
                ? "You're able to join an alliance"
                : 'Missing to join alliance'}
            </span>

            {canJoinAlliance ? (
              <Button size="xs" onClick={joinAlliance}>
                Join Alliance
              </Button>
            ) : (
              <AnimatedNumber value={missingMoney} />
            )}
          </div>
          </div> */}
        </ResponsiveDialogBody>

        <ResponsiveDialogFooter>
          <ResponsiveDialogClose asChild>
            <Button size="xl">Close Alliances</Button>
          </ResponsiveDialogClose>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};

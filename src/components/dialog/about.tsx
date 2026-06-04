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
  ResponsiveDialogTrigger,
} from "@/components/ui/responsive-dialog";

export const AboutDialog = () => (
  <ResponsiveDialog>
    <ResponsiveDialogTrigger className="underline-offset-4 outline-hidden hover:underline focus-visible:underline">
      About
    </ResponsiveDialogTrigger>

    <ResponsiveDialogContent>
      <ResponsiveDialogImage alt="About" src="/images/msc/about.webp" />

      <ResponsiveDialogHeader>
        <ResponsiveDialogTitle>About this game</ResponsiveDialogTitle>

        <ResponsiveDialogDescription>
          Idleval (Idle + Medieval) is a idle game where you can build your own
          town, generate resources and upgrade your buildings.
        </ResponsiveDialogDescription>
      </ResponsiveDialogHeader>

      <ResponsiveDialogBody>
        <div className="grid gap-2">
          <p className="font-semibold">Tecnologies</p>

          <ul className="list-disc pl-4">
            <li>
              Made with{" "}
              <a
                className="font-medium underline hover:text-blue-600"
                href="https://react.dev/"
                rel="noopener noreferrer nofollow"
                target="_blank"
              >
                React
              </a>
            </li>
            <li>
              Styling with{" "}
              <a
                className="font-medium underline hover:text-blue-600"
                href="https://tailwindcss.com/"
                rel="noopener noreferrer nofollow"
                target="_blank"
              >
                Tailwind
              </a>{" "}
            </li>
            <li>
              Components with{" "}
              <a
                className="font-medium underline hover:text-blue-600"
                href="https://shark.vini.one/"
                rel="noopener noreferrer nofollow"
                target="_blank"
              >
                Shark UI
              </a>{" "}
            </li>
            <li>
              Icons by{" "}
              <a
                className="font-medium underline hover:text-blue-600"
                href="https://lucide.dev/"
                rel="noopener noreferrer nofollow"
                target="_blank"
              >
                Lucide
              </a>{" "}
            </li>
            <li>
              State management with{" "}
              <a
                className="font-medium underline hover:text-blue-600"
                href="https://jotai.org/"
                rel="noopener noreferrer nofollow"
                target="_blank"
              >
                Jotai
              </a>{" "}
            </li>
            <li>
              Images by{" "}
              <a
                className="font-medium underline hover:text-blue-600"
                href="https://chatgpt.com"
                rel="noopener noreferrer nofollow"
                target="_blank"
              >
                ChatGPT
              </a>{" "}
            </li>
          </ul>
        </div>
      </ResponsiveDialogBody>

      <ResponsiveDialogFooter>
        <ResponsiveDialogClose asChild>
          <Button size="xl">Close About</Button>
        </ResponsiveDialogClose>
      </ResponsiveDialogFooter>
    </ResponsiveDialogContent>
  </ResponsiveDialog>
);

import { m } from "@/i18n/messages";

export const WelcomeContent = () => (
  <div className="grid gap-4 text-muted/90 leading-relaxed">
    <p>{m["ui.welcome.disclaimer"]()}</p>
  </div>
);

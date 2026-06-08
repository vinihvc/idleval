import "@/i18n/paraglide-init";
import { HomePage } from "@/app/page";
import "@/styles/globals.css";
import React from "react";
import { createRoot } from "react-dom/client";
import { syncParaglideLocale } from "@/i18n/paraglide-init";
import { resolveInitialLocale } from "@/store/atoms/settings";

syncParaglideLocale(resolveInitialLocale());

createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <HomePage />
  </React.StrictMode>
);

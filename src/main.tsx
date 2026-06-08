import "@/i18n/paraglide-init";
import { HomePage } from "@/app/page";
import "@/styles/globals.css";
import React from "react";
import { createRoot } from "react-dom/client";
import { syncParaglideLocale } from "@/i18n/paraglide-init";
import { resolveInitialLocale } from "@/store/atoms/settings";

syncParaglideLocale(resolveInitialLocale());

// biome-ignore lint/style/noNonNullAssertion: always exists
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HomePage />
  </React.StrictMode>
);

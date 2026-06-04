import { HomePage } from "@/app/page";
import "@/styles/globals.css";
import React from "react";
import { createRoot } from "react-dom/client";

// biome-ignore lint/style/noNonNullAssertion: always exists
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HomePage />
  </React.StrictMode>
);

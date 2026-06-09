export const PARAGLIDE_PROJECT = "./project.inlang";
export const PARAGLIDE_OUTDIR = "./src/i18n/paraglide";

export const paraglidePluginOptions = {
  project: PARAGLIDE_PROJECT,
  outdir: PARAGLIDE_OUTDIR,
  strategy: ["custom-settings", "preferredLanguage", "baseLocale"] as (
    | "preferredLanguage"
    | "baseLocale"
    | `custom-${string}`
  )[],
};

export const PARAGLIDE_COMPILE_ARGS = [
  "--project",
  PARAGLIDE_PROJECT,
  "--outdir",
  PARAGLIDE_OUTDIR,
  "--emit-ts-declarations",
] as const;

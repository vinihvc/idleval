/// <reference types="vite/client" />

declare module "*.po?lingui" {
  export const messages: Record<string, string>;
}

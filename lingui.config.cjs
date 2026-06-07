"use strict";
const { formatter } = require("@lingui/format-po");

/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
  sourceLocale: "en",
  locales: ["en", "es-MX", "pt-BR"],
  fallbackLocales: {
    "pt-BR": "en",
    "es-MX": "en",
    default: "en",
  },
  catalogs: [
    {
      path: "<rootDir>/locales/{locale}/messages",
      include: ["src"],
    },
  ],
  format: formatter(),
};

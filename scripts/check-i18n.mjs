import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const messagesDir = path.join(root, "src/i18n/messages");
const locales = ["en", "es", "pt"];

const loadKeys = (locale) => {
  const filePath = path.join(messagesDir, `${locale}.json`);

  if (!fs.existsSync(filePath)) {
    console.error(`[i18n] Missing message file: ${filePath}`);
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    console.error(`[i18n] ${filePath} must be a flat JSON object.`);
    process.exit(1);
  }

  return Object.keys(data).sort();
};

const keySets = Object.fromEntries(
  locales.map((locale) => [locale, loadKeys(locale)])
);
const referenceLocale = "en";
const referenceKeys = new Set(keySets[referenceLocale]);
let failed = false;

for (const locale of locales) {
  if (locale === referenceLocale) {
    continue;
  }

  const keys = new Set(keySets[locale]);
  const missing = [...referenceKeys].filter((key) => !keys.has(key));
  const extra = [...keys].filter((key) => !referenceKeys.has(key));

  if (missing.length > 0) {
    failed = true;
    console.error(`\n[i18n] ${locale} is missing ${missing.length} key(s):`);
    for (const key of missing) {
      console.error(`  - ${key}`);
    }
  }

  if (extra.length > 0) {
    failed = true;
    console.error(`\n[i18n] ${locale} has ${extra.length} extra key(s):`);
    for (const key of extra) {
      console.error(`  - ${key}`);
    }
  }
}

if (failed) {
  process.exit(1);
}

console.log(
  `[i18n] ${referenceKeys.size} keys × ${locales.length} locales OK (${locales.join(", ")}).`
);

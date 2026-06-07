import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const output = execSync("./node_modules/.bin/lingui extract", {
  cwd: root,
  encoding: "utf8",
  stdio: ["pipe", "pipe", "pipe"],
});

console.log(output);

const missingPattern = /│\s+(pt-BR|es-MX)\s+│\s+\d+\s+│\s+(\d+)\s+│/g;
let match = missingPattern.exec(output);

while (match !== null) {
  const locale = match[1];
  const missing = Number.parseInt(match[2], 10);

  if (missing > 0) {
    console.error(`\n[i18n] ${locale} has ${missing} missing translation(s).`);
    process.exit(1);
  }

  match = missingPattern.exec(output);
}

console.log("\n[i18n] All locales fully translated.");

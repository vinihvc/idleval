import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const scriptDir = path.join(root, "scripts");
const pythonScript = path.join(scriptDir, "remove-bg.py");
const requirements = path.join(scriptDir, "requirements.txt");

const python = process.env.PYTHON ?? "python3";

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    ...options,
  });
  if (result.error) {
    console.error(`[remove-bg] Failed to run ${command}: ${result.error.message}`);
    process.exit(1);
  }
  return result.status ?? 1;
}

function ensurePythonDeps() {
  const check = spawnSync(
    python,
    ["-c", "import numpy, PIL"],
    { stdio: "pipe" }
  );
  if (check.status === 0) {
    return;
  }

  console.log("[remove-bg] Installing Python deps (numpy, Pillow)...");
  const install = run(python, ["-m", "pip", "install", "-r", requirements]);
  if (install !== 0) {
    console.error(
      "[remove-bg] Install failed. Run manually:\n" +
        `  ${python} -m pip install -r scripts/requirements.txt`
    );
    process.exit(install);
  }
}

function printHelp() {
  console.log(`Usage:
  pnpm remove-bg <input> <output.webp> [options]
  pnpm remove-bg -- --batch <input-dir> <output-dir> [options]

Options (forwarded to remove-bg.py):
  --key magenta|green     Chroma key (default: magenta; green for purple subjects)
  --auto-key              Pick green when purple subject pixels are detected
  --no-despill            Skip fringe despill (keeps red gems vivid on magenta)
  --size <px>             Canvas size (default: 400)
  --tolerance <n>         Key tolerance (default: 80)
  --softness <n>          Edge softness (default: 25)
  --padding <0-1>         Content scale on canvas (default: 0.92)
  --no-pixel-art          Disable halo erosion

Examples:
  pnpm remove-bg sprite.png public/images/msc/about.webp --size 400 --auto-key
  pnpm remove-bg sprite.png public/images/msc/statistic.webp --size 400 --key green
  pnpm remove-bg -- --batch ./raw ./out --auto-key --size 400
`);
}

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes("-h") || args.includes("--help")) {
    printHelp();
    process.exit(0);
  }

  if (!fs.existsSync(pythonScript)) {
    console.error(`[remove-bg] Missing script: ${pythonScript}`);
    process.exit(1);
  }

  ensurePythonDeps();
  process.exit(run(python, [pythonScript, ...args]));
}

main();

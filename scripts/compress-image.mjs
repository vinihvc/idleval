import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const DEFAULT_SIZE = 400;
const DEFAULT_QUALITY = 70;
const IMAGE_EXT = new Set([".png", ".webp", ".jpg", ".jpeg"]);

function printHelp() {
  console.log(`Usage:
  pnpm compress-image <input> <output.webp> [options]
  pnpm compress-image -- --batch <input-dir> <output-dir> [options]

Options:
  --size <px>       Output canvas size (default: ${DEFAULT_SIZE})
  --quality <n>     WebP quality 1-100 (default: ${DEFAULT_QUALITY})
  --in-place        Overwrite input file (output path optional)

Examples:
  pnpm compress-image public/images/msc/about.webp public/images/msc/about.webp --in-place
  pnpm compress-image sprite.webp out.webp --quality 70 --size 400
  pnpm compress-image -- --batch public/images/gods public/images/gods --in-place
`);
}

function parseArgs(argv) {
  const options = {
    batch: null,
    inPlace: false,
    size: DEFAULT_SIZE,
    quality: DEFAULT_QUALITY,
    positional: [],
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--batch") {
      options.batch = [argv[i + 1], argv[i + 2]];
      i += 2;
      continue;
    }
    if (arg === "--in-place") {
      options.inPlace = true;
      continue;
    }
    if (arg === "--size") {
      options.size = Number(argv[i + 1]);
      i += 1;
      continue;
    }
    if (arg === "--quality") {
      options.quality = Number(argv[i + 1]);
      i += 1;
      continue;
    }
    if (arg.startsWith("-")) {
      console.error(`[compress-image] Unknown option: ${arg}`);
      process.exit(1);
    }
    options.positional.push(arg);
  }

  return options;
}

function formatBytes(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  return `${(bytes / 1024).toFixed(1)} KB`;
}

async function compressFile(inputPath, outputPath, { size, quality }) {
  const inputStat = fs.statSync(inputPath);
  const inputBuffer = fs.readFileSync(inputPath);

  await sharp(inputBuffer)
    .resize(size, size, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
      kernel: sharp.kernel.nearest,
    })
    .webp({ quality, effort: 6 })
    .toFile(outputPath);

  const outputStat = fs.statSync(outputPath);
  const meta = await sharp(outputPath).metadata();
  console.log(
    `${path.relative(root, outputPath)}: ${meta.width}x${meta.height} q=${quality} ` +
      `${formatBytes(inputStat.size)} → ${formatBytes(outputStat.size)}`
  );
}

function listImages(dir) {
  const files = [];
  const walk = (current) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        walk(full);
        continue;
      }
      if (IMAGE_EXT.has(path.extname(entry.name).toLowerCase())) {
        files.push(full);
      }
    }
  };
  walk(dir);
  return files.sort();
}

async function main() {
  const argv = process.argv.slice(2);
  if (argv.length === 0 || argv.includes("-h") || argv.includes("--help")) {
    printHelp();
    return;
  }

  const options = parseArgs(argv);

  if (options.quality < 1 || options.quality > 100) {
    console.error("[compress-image] --quality must be between 1 and 100");
    process.exit(1);
  }

  if (options.size < 1) {
    console.error("[compress-image] --size must be a positive integer");
    process.exit(1);
  }

  if (options.batch) {
    const [inputDir, outputDir] = options.batch.map((p) => path.resolve(p));
    if (!fs.existsSync(inputDir)) {
      console.error(`[compress-image] Directory not found: ${inputDir}`);
      process.exit(1);
    }

    const files = listImages(inputDir);
    if (files.length === 0) {
      console.error(`[compress-image] No images in ${inputDir}`);
      process.exit(1);
    }

    for (const inputPath of files) {
      const rel = path.relative(inputDir, inputPath);
      const outputPath = options.inPlace
        ? inputPath
        : path.join(outputDir, rel).replace(/\.(png|jpe?g)$/i, ".webp");

      if (!options.inPlace) {
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      }

      const tempPath = options.inPlace
        ? `${inputPath}.tmp.webp`
        : outputPath;

      await compressFile(inputPath, tempPath, options);

      if (options.inPlace) {
        fs.renameSync(tempPath, inputPath);
      }
    }
    return;
  }

  const [inputArg, outputArg] = options.positional;
  if (!inputArg) {
    printHelp();
    process.exit(1);
  }

  const inputPath = path.resolve(inputArg);
  if (!fs.existsSync(inputPath)) {
    console.error(`[compress-image] File not found: ${inputPath}`);
    process.exit(1);
  }

  const outputPath = options.inPlace
    ? inputPath
    : path.resolve(outputArg ?? inputPath);

  if (!options.inPlace && !outputArg) {
    console.error("[compress-image] Output path required unless --in-place is set");
    process.exit(1);
  }

  const tempPath = options.inPlace ? `${inputPath}.tmp.webp` : outputPath;
  fs.mkdirSync(path.dirname(tempPath), { recursive: true });

  await compressFile(inputPath, tempPath, options);

  if (options.inPlace) {
    fs.renameSync(tempPath, inputPath);
  }
}

main().catch((error) => {
  console.error(`[compress-image] ${error.message}`);
  process.exit(1);
});

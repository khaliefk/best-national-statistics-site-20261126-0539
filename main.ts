// Entry point for the Arunika by the Numbers site. Node 22, standard
// library only, no outside dependencies.
//
// The grader runs this program twice in a fresh container with no
// network. Its only job is to stage the hand-in: copy app/ and
// screenshots/ from the repository into the output folder, then write
// dossier.json there with the make.fun library vendored in this repo.
// Run it locally with MAKEFUN_OUTPUT_DIR standing in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

// Which folders are staged, and which one the entry cannot do without.
// app/ holds the site and must be there; screenshots/ is created empty
// when it is missing so the dossier still builds.
const STAGED = [
  { folder: "app", required: true },
  { folder: "screenshots", required: false },
];

// Caps the sealed scorer enforces, kept in one place. text_max_bytes
// bounds the dossier text. The other three reject entries the scorer
// would reject too: more than 4 screenshots, one screenshot over
// 256 KiB, or app/ past 993 files and folders or 16 MiB. The 993
// counts against /output's own 1,000-entry cap, so leave it alone.
const DOSSIER_LIMITS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
};

function outputDir(): string {
  return process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
}

function stage(repoDir: string, outDir: string): void {
  for (const entry of STAGED) {
    const from = join(repoDir, entry.folder);
    const to = join(outDir, entry.folder);
    mkdirSync(to, { recursive: true });
    if (existsSync(from)) {
      cpSync(from, to, { recursive: true });
    } else if (entry.required) {
      throw new Error(`required folder missing: ${from}`);
    }
  }
}

const repoDir = fileURLToPath(new URL(".", import.meta.url));
const outDir = outputDir();

mkdirSync(outDir, { recursive: true });
stage(repoDir, outDir);
writeFileSync(join(outDir, "dossier.json"), buildDossier(outDir, DOSSIER_LIMITS));

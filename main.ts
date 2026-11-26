// Titik masuk situs Arunika in Numbers. Node 22, pustaka standar saja,
// tidak ada dependensi luar.
//
// Kerja program ini cuma menyiapkan folder keluaran untuk grader. Isi
// repo disalin ke sana, lalu dossier.json ditulis. Dossier itu yang
// dibaca grader, jadi isinya dibuat lewat pustaka make.fun yang sudah
// di-vendor di repo ini. Buat jalanin lokal, MAKEFUN_OUTPUT_DIR
// menggantikan /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

type SourceFolder = {
  name: string;
  mustExist: boolean;
};

// Folder mana saja yang ikut disalin, dan mana yang wajib ada. app/
// harus ada, kalau tidak ada berarti repo-nya rusak. screenshots/
// boleh tidak ada, nanti dibuatkan folder kosong.
const SOURCES: SourceFolder[] = [
  { name: "app", mustExist: true },
  { name: "screenshots", mustExist: false },
];

function resolveOutputDir(): string {
  return process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
}

function stageSources(repoDir: string, outputDir: string): void {
  for (const source of SOURCES) {
    const from = join(repoDir, source.name);
    const to = join(outputDir, source.name);
    mkdirSync(to, { recursive: true });
    if (existsSync(from)) {
      cpSync(from, to, { recursive: true });
    } else if (source.mustExist) {
      throw new Error(`folder wajib tidak ketemu: ${from}`);
    }
  }
}

// Angka-angka batas dari scorer, dikumpulkan di satu tempat supaya gampang
// dicek. text_max_bytes yang menentukan ukuran berkas teks di dossier.
// Tiga batas lain menolak entri yang scorer juga akan tolak: lebih dari
// 4 screenshot, satu screenshot di atas 256 KiB, app/ di atas 993 berkas
// dan folder, atau app/ di atas 16 MiB. Angka 993 dihitung bareng batas
// 1000 entri milik /output, jadi jangan diubah sembarangan.
function dossierOptions() {
  return {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  };
}

const repoDir = fileURLToPath(new URL(".", import.meta.url));
const outputDir = resolveOutputDir();

mkdirSync(outputDir, { recursive: true });
stageSources(repoDir, outputDir);
writeFileSync(
  join(outputDir, "dossier.json"),
  buildDossier(outputDir, dossierOptions()),
);

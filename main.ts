// Leonida Platinum — GTA VI trophy guide & tracker (gta6-trophy-guide-01).
//
// Entry program (Node 22, standard library only). It hands the guide in: it
// copies this repository's app/ (the offline static guide) and screenshots/
// (real renders of the guide) into the output directory and writes
// dossier.json there with the vendored make.fun library, which is the summary
// the judge reads. vendor/makefun-frontend.ts must stay byte-for-byte the
// kit's copy: the sealed scorer rebuilds the dossier with its own copy and
// compares the two.
//
// Run locally:  mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// In the grader MAKEFUN_OUTPUT_DIR is unset and /output is used instead.

import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Fail loudly instead of handing in a half-built entry: the guide and at
// least one screenshot must exist before anything is copied.
function requireDir(path: string, label: string): void {
  if (!existsSync(path) || !statSync(path).isDirectory()) {
    throw new Error(`missing ${label} directory: ${path}`);
  }
}

function requireFile(path: string, label: string): void {
  if (!existsSync(path) || !statSync(path).isFile()) {
    throw new Error(`missing ${label} file: ${path}`);
  }
}

const appDir = join(repoRoot, 'app');
const shotsDir = join(repoRoot, 'screenshots');
requireDir(appDir, 'app');
requireFile(join(appDir, 'index.html'), 'app/index.html');
requireFile(join(appDir, 'data', 'trophies.json'), 'app/data/trophies.json');
requireDir(shotsDir, 'screenshots');
const shotFiles = readdirSync(shotsDir).filter((name) => !name.startsWith('.'));
if (shotFiles.length < 3 || shotFiles.length > 4) {
  throw new Error(`expected 3 or 4 screenshots, found ${shotFiles.length}`);
}

mkdirSync(outputDir, { recursive: true });
cpSync(appDir, join(outputDir, 'app'), { recursive: true });
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
cpSync(shotsDir, join(outputDir, 'screenshots'), { recursive: true });

// The scorer's own caps (kit reference/gate.json): text_max_bytes shapes the
// dossier text; the other limits refuse an entry the scorer would refuse
// (more than 4 screenshots or one over 256 KiB; app/ over 993 files and
// directories or 48 MiB — app/ shares /output's own 1000-entry cap with
// screenshots/ and dossier.json, so keep room).
const dossier = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
});
writeFileSync(join(outputDir, 'dossier.json'), dossier);
console.log(`handed in ${shotFiles.length} screenshots + app/ to ${outputDir}`);

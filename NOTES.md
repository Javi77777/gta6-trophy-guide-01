# Build notes — gta6-trophy-guide-01 (Leonida Platinum)

## What was built

Offline static guide + tracker for all 55 GTA VI PS5 trophies, in
`~/workspace/makefun/entries/gta6-trophy-guide-01/`:

- `app/index.html`, `app/style.css`, `app/js/main.js`, `app/js/store.js`,
  `app/js/render.js` — tracker UI (checklist, filters, search, spoiler
  setting, export/import, roadmap, missables, sources views).
- `app/data/trophies.json` — all 55 trophies with official name, description,
  grade, hidden flag, kind, missable flag, count target, original guide,
  steps, and per-trophy sources.
- `main.ts`, `serve.ts`, `LICENSE` (MIT), `README.md`, `shots.json`.
- `vendor/makefun-frontend.ts` — kit copy, byte-identical (sha256 verified).
- `screenshots/` — 4 real Chromium renders at 1280x800, JPEG, each < 256 KiB.

## Facts used (all cited in the app)

- 55 trophies: 1 platinum, 2 gold, 6 silver, 46 bronze; 28 hidden; 0 online
  (Exophase / PSNProfiles, 18 Nov 2026).
- Platinum ~200 hours, difficulty 4/10, 1 playthrough, no mission replay,
  cheats disable trophies + saving (PowerPyx).
- Only possibly missable trophy: Positive Mental Attitude — first meditation
  spot at home in Chapter 1; 18 spots in 10 locations (PowerPyx, GTA Zone).
- 100% checklist: 70/80 challenges, 200/277 vehicles, 100/255 animals,
  50/66 weapons, 300 stunts; Strangers & Freaks NOT needed for 100%
  (PowerPyx).
- Stunts: 250 of 397 total; Shooting Range: 42 challenges gold
  (PowerPyx / PSNProfiles).
- Actions Speak Louder: 500 Criminal Profile actions (GTA Scoop).

## Judgement calls / known limits

- Hidden flags on side trophies are reconstructed from PSN listings; the
  total (28 hidden) matches Exophase/PSNProfiles. The Sources page says so.
- Five trophies had no confirmed unlock method at launch (In The Beginning…,
  Capital Offense, Bad Luck, I Guess, The Truth Is Out There, Ten Pin) plus
  Personal Best — their guides say "not yet confirmed" and give the best
  reading of the official description instead of inventing a method.
- No AF claim codes are involved in this entry.

## Checks

- `node main.ts` output + kit check verdict recorded in the final report.
- Screenshots are real renders of this app's own code (headless Chromium
  1255, `--virtual-time-budget=8000`, 1280x800), seeded with `?demo=1`.

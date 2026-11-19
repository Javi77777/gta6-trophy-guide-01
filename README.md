# Leonida Platinum — GTA VI Trophy Guide & Tracker

An offline, open-source guide and tracker for all **55 PlayStation 5 trophies**
of Grand Theft Auto VI (1 platinum, 2 gold, 6 silver, 46 bronze; 28 hidden;
0 online), built for the make.fun competition `gta6-trophy-guide-01`.

## What it is

- **Checklist tracker** — every trophy with its official name, description and
  grade; tick earned trophies, saved in the browser (localStorage), with
  export to a JSON file and import back.
- **Filters** — by kind (story, missable, collectibles, activities, side
  missions, crime, 100% completion, online), by grade, by earned/unearned,
  plus free-text search.
- **Spoiler-safe mode** — hides the names and descriptions of story trophies
  until they are earned (on by default).
- **Roadmap to the platinum** — 3 steps, ~200 hours, difficulty 4/10, built
  from PowerPyx's roadmap and the official descriptions.
- **Missables page** — the one possibly missable trophy (Positive Mental
  Attitude: the Chapter 1 meditation) plus the no-mission-replay and
  cheats-disable-trophies warnings.
- **A guide for every trophy**, written in our own words, each citing its
  sources (Exophase and PSNProfiles for the official list and counts;
  PowerPyx, GTA Zone, SixShore and GTA Scoop for methods). Five trophies had
  no confirmed unlock method at launch — their guides say so plainly instead
  of inventing one.

## Run it

```sh
node serve.ts          # serves app/ on http://localhost:8080
```

The app is plain static files under `app/` with no build step and no network
use at run time: it loads only its own files and works with the network off.
Open `app/index.html` in desktop Chrome. `?demo=1` seeds 13 earned trophies
(for screenshots); `?spoiler=0` turns spoiler-safe mode off.

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes
`dossier.json` with the vendored make.fun library (`vendor/makefun-frontend.ts`,
the kit's copy, unchanged).

## License

MIT — see `LICENSE`. Unofficial fan-made guide; not affiliated with or
endorsed by Rockstar Games. No Rockstar logo, artwork, box art or game
screenshot is used anywhere.

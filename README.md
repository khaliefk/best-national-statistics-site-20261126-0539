# Arunika in Numbers

[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/khaliefk/best-national-statistics-site-20261126-0539/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/khaliefk/best-national-statistics-site-20261126-0539/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

Arunika is a made-up country. This is its statistics office website, built for the [make.fun bounty](https://make.fun/bounty/best-national-statistics-site-20261126-0539) asking for the best national statistics site.

The idea was simple: a real statistics office site does not feel like a dashboard. It feels like a place where someone publishes numbers, explains where they came from, and corrects them when they are wrong. So this one has seven pages that link to each other, each with its own figures, tables, and a note on the source. Nothing here calls out to a server. Open a page and everything you need is already in the files.

## What is inside

**Overview** opens with six headline indicators, each with its source and year. Population and GDP charts sit below, then the latest releases.

**Population** covers 18.42 million people. Age structure, a year picker, and a table with the 2019 to 2025 series.

**Economy** covers GDP growth, exports and imports, and how much each sector contributes.

**Jobs** puts unemployment at 5.8%. It also shows participation and a sortable table of employment by industry.

**Prices** puts inflation at 3.1%. It lists the CPI groups that rose fastest and explains how the index gets built.

**Regions** compares six regions on income, population, or unemployment, with a full table underneath.

**Data & sources** names the publications behind every figure. You can download the CSV tables there, read a short note on methods, and check the corrections log.

Charts draw on canvas with the site's own code in `app/charts.js`. All the figures live in `app/data.js`. Routing and the page controls live in `app/main.js`. The search box in the header looks through indicators, releases, and regions.

## Running it

Any static server works. Serve the `app` folder and open `index.html`:

```sh
cd app && python3 -m http.server 8080
```

## Building the hand-in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

That copies `app/` and `screenshots/` into the output folder and writes `dossier.json` using the vendored make.fun library.

## License

MIT. See [LICENSE](LICENSE).

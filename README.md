# Arunika in Numbers

[![make.fun](https://img.shields.io/badge/make.fun-bounty-blue)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![National Statistics](https://img.shields.io/badge/site-national%20statistics-teal)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A national statistics site for the fictional country of Arunika, built for the
[make.fun bounty](https://make.fun/bounty/best-national-statistics-site-20261126-0539):
"Make the best national statistics site".

## What it is

A static site with no build step and no network requests. Seven sections,
each a real page reached by a link:

- **Overview** — six headline indicators with source and year, population and
  GDP charts, and the latest releases.
- **Population** — 18.42 million people, age structure, a year picker and a
  table of the 2019-2025 series.
- **Economy** — GDP growth, exports and imports, and each sector's share.
- **Jobs** — unemployment at 5.8%, participation, and a sortable table of
  employment by industry.
- **Prices** — inflation at 3.1%, the CPI groups that rose fastest, and how
  the index is built.
- **Regions** — six regions compared on income, population or unemployment,
  with a full table.
- **Data & sources** — the publications behind every figure, downloadable
  CSV tables, methods in brief, and a corrections log.

Charts are drawn on canvas by the site's own code (`app/charts.js`). Data
lives in `app/data.js`, routing and controls in `app/main.js`. Search in the
header searches indicators, releases and regions.

## Run it

Serve `app/` with any static server and open `index.html`:

```sh
cd app && python3 -m http.server 8080
```

## Hand in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes
`dossier.json` with the vendored make.fun library.

## License

MIT. See [LICENSE](LICENSE).

// Arunika by the Numbers: routing, painting and controls.
// Hash routes: #/overview, #/population, #/economy, #/labour, #/prices,
// #/regions, #/data. One HTML file holds every section; this module
// shows one at a time and draws its charts when it appears.

import {
  YEARS, POP_M, AGE_BANDS, AGE_PCT, GDP_REAL, SECTORS, EXPORTS_BN,
  IMPORTS_BN, UNEMP_PCT, PARTIC_PCT, EMPLOY_PCT, INDUSTRIES, CPI_PCT,
  CPI_GROUPS, REGIONS, HEADLINES, RELEASES,
} from "./data.js";
import { plotLine, plotBars, plotPairs, barList } from "./charts.js";

const SECTIONS = ["overview", "population", "economy", "labour", "prices", "regions", "data"];

const $ = (id) => document.getElementById(id);
const fmtInt = (n) => n.toLocaleString("en-US");
const fmtPct1 = (v) => v.toFixed(1) + "%";
const fmtMillions = (v) => v.toFixed(2) + "m";

// Show one section, mark its nav link, paint its content, jump to top.
function go(name) {
  const view = SECTIONS.includes(name) ? name : "overview";
  document.querySelectorAll(".view").forEach((el) => {
    el.hidden = el.dataset.view !== view;
  });
  document.querySelectorAll(".nav a").forEach((a) => {
    a.classList.toggle("on", a.dataset.route === view);
  });
  paint(view);
  window.scrollTo(0, 0);
}

function paint(view) {
  if (view === "overview") paintOverview();
  else if (view === "population") paintPopulation();
  else if (view === "economy") paintEconomy();
  else if (view === "labour") paintLabour();
  else if (view === "prices") paintPrices();
  else if (view === "regions") paintRegions();
  else if (view === "data") paintData();
}

function paintOverview() {
  const row = $("stat-row");
  if (row.childElementCount === 0) {
    HEADLINES.forEach(([label, value, delta, src, hint]) => {
      const card = document.createElement("article");
      card.className = "stat";
      card.innerHTML =
        "<h3></h3><p class='stat-big'></p><p class='stat-delta'></p>" +
        "<p class='stat-src'></p><p class='stat-hint'></p>";
      card.querySelector("h3").textContent = label;
      card.querySelector(".stat-big").textContent = value;
      card.querySelector(".stat-delta").textContent = delta;
      card.querySelector(".stat-src").textContent = "Source: " + src;
      card.querySelector(".stat-hint").textContent = hint;
      row.appendChild(card);
    });
    const list = $("news-list");
    RELEASES.forEach(([date, title, detail]) => {
      const li = document.createElement("li");
      const time = document.createElement("time");
      time.textContent = date;
      const head = document.createElement("strong");
      head.textContent = title;
      const body = document.createElement("span");
      body.textContent = detail;
      li.append(time, head, body);
      list.appendChild(li);
    });
  }
  plotLine($("fig-population"), YEARS.map(String), POP_M, fmtMillions, "");
  plotBars($("fig-gdp"), YEARS.map(String), GDP_REAL, fmtPct1, "%");
}

let pickedYear = 2025;

function paintPopulation() {
  plotLine($("fig-population-full"), YEARS.map(String), POP_M, fmtMillions, "");
  plotBars($("fig-age"), AGE_BANDS, AGE_PCT, fmtPct1, "%");
  const pills = $("year-pills");
  if (pills.childElementCount === 0) {
    YEARS.forEach((y) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = y;
      btn.addEventListener("click", () => {
        pickedYear = y;
        refreshPopNote();
      });
      pills.appendChild(btn);
    });
  }
  refreshPopNote();
  const tbody = document.querySelector("#pop-table tbody");
  if (tbody.childElementCount === 0) {
    POP_M.forEach((v, i) => {
      const prev = i === 0 ? null : POP_M[i - 1];
      const change = prev === null
        ? "—"
        : "+" + (((v - prev) / prev) * 100).toFixed(1) + "%";
      const tr = document.createElement("tr");
      tr.innerHTML = "<td>" + YEARS[i] + "</td><td>" + v.toFixed(2) + "</td><td>" + change + "</td>";
      tbody.appendChild(tr);
    });
  }
}

function refreshPopNote() {
  const i = YEARS.indexOf(pickedYear);
  const prev = i === 0 ? null : POP_M[i - 1];
  const note = $("pop-year-note");
  const change = prev === null
    ? "the first year of the series."
    : "up " + (((POP_M[i] - prev) / prev) * 100).toFixed(1) + "% on " + YEARS[i - 1] + ".";
  note.textContent =
    "In " + pickedYear + " the mid-year population was " + POP_M[i].toFixed(2) + " million, " + change;
  document.querySelectorAll("#year-pills button").forEach((b) => {
    b.classList.toggle("on", Number(b.textContent) === pickedYear);
  });
}

function paintEconomy() {
  plotBars($("fig-gdp-full"), YEARS.map(String), GDP_REAL, fmtPct1, "%");
  plotPairs($("fig-trade"), YEARS.map(String), EXPORTS_BN, IMPORTS_BN, "Exports", "Imports");
  barList($("sector-bars"), SECTORS, (v) => v.toFixed(1) + "%");
}

let sortCol = 1;
let sortAsc = false;

function paintLabour() {
  plotLine($("fig-unemployment"), YEARS.map(String), UNEMP_PCT, fmtPct1, "%");
  plotLine($("fig-participation"), YEARS.map(String), PARTIC_PCT, fmtPct1, "%");
  paintIndustry();
}

function paintIndustry() {
  const rows = INDUSTRIES.slice().sort((a, b) => {
    const diff = typeof a[sortCol] === "string"
      ? a[sortCol].localeCompare(b[sortCol])
      : a[sortCol] - b[sortCol];
    return sortAsc ? diff : -diff;
  });
  const tbody = document.querySelector("#industry-table tbody");
  tbody.innerHTML = "";
  rows.forEach(([name, jobs, share]) => {
    const tr = document.createElement("tr");
    tr.innerHTML =
      "<td>" + name + "</td><td>" + fmtInt(jobs) + "</td><td>" + share.toFixed(1) + "%</td>";
    tbody.appendChild(tr);
  });
}

function paintPrices() {
  plotBars($("fig-cpi"), YEARS.map(String), CPI_PCT, fmtPct1, "%");
  barList(
    $("cpi-bars"),
    CPI_GROUPS.map(([g, c]) => [g, c, c >= 3.5]),
    (v) => "+" + v.toFixed(1) + "%",
  );
}

let regionMetric = "gdp";

function paintRegions() {
  const defs = {
    gdp: { label: "GDP per capita, AR", fmt: (v) => "AR " + fmtInt(v) },
    pop: { label: "Population, millions", fmt: (v) => v.toFixed(2) + "m" },
    unemp: { label: "Unemployment, %", fmt: (v) => v.toFixed(1) + "%" },
  };
  const def = defs[regionMetric];
  const col = regionMetric === "gdp" ? 3 : regionMetric === "pop" ? 2 : 4;
  plotBars(
    $("fig-regions"),
    REGIONS.map((r) => r[0]),
    REGIONS.map((r) => r[col]),
    def.fmt,
    "",
    regionMetric === "unemp" ? "#b3402e" : undefined,
  );
  const top = REGIONS.reduce((a, b) => (b[col] > a[col] ? b : a));
  const note = $("region-note");
  if (regionMetric === "unemp") {
    const low = REGIONS.reduce((a, b) => (b[col] < a[col] ? b : a));
    note.textContent =
      "Lowest unemployment: " + low[0] + " at " + low[4].toFixed(1) + "%. Highest: " +
      top[0] + " at " + top[4].toFixed(1) + "%.";
  } else {
    note.textContent =
      "Highest " + def.label.toLowerCase() + ": " + top[0] + " (" + def.fmt(top[col]) + ").";
  }
  const tbody = document.querySelector("#region-table tbody");
  if (tbody.childElementCount === 0) {
    REGIONS.forEach(([name, capital, pop, gdp, unemp]) => {
      const tr = document.createElement("tr");
      tr.innerHTML =
        "<td>" + name + "</td><td>" + capital + "</td><td>" + pop.toFixed(2) + "</td>" +
        "<td>" + fmtInt(gdp) + "</td><td>" + unemp.toFixed(1) + "%</td>";
      tbody.appendChild(tr);
    });
  }
}

// Build a CSV string from headers and rows, quoting every cell.
function csvOf(headers, rows) {
  const cell = (c) => '"' + String(c).replace(/"/g, '""') + '"';
  const lines = [headers.join(",")];
  rows.forEach((r) => lines.push(r.map(cell).join(",")));
  return lines.join("\n");
}

function paintData() {
  const list = $("file-list");
  if (list.childElementCount !== 0) return;
  const files = [
    {
      name: "population-2019-2025.csv",
      label: "Population by year, 2019 to 2025",
      csv: csvOf(["year", "population_millions"], YEARS.map((y, i) => [y, POP_M[i]])),
    },
    {
      name: "gdp-growth-2019-2025.csv",
      label: "Real GDP growth by year, 2019 to 2025",
      csv: csvOf(["year", "real_gdp_growth_pct"], YEARS.map((y, i) => [y, GDP_REAL[i]])),
    },
    {
      name: "labour-2019-2025.csv",
      label: "Unemployment, participation and employment, 2019 to 2025",
      csv: csvOf(
        ["year", "unemployment_pct", "participation_pct", "employment_pct"],
        YEARS.map((y, i) => [y, UNEMP_PCT[i], PARTIC_PCT[i], EMPLOY_PCT[i]]),
      ),
    },
    {
      name: "regions-2025.csv",
      label: "Regions: population, GDP per capita and unemployment, 2025",
      csv: csvOf(
        ["region", "capital", "population_millions", "gdp_per_capita_ar", "unemployment_pct"],
        REGIONS.map(([n, c, p, g, u]) => [n, c, p, g, u]),
      ),
    },
  ];
  files.forEach((f) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(f.csv);
    a.download = f.name;
    a.textContent = f.label;
    const span = document.createElement("span");
    span.textContent = " — " + f.name;
    li.append(a, span);
    list.appendChild(li);
  });
}

// Search across headlines, releases and regions.
const LOOKUP = [
  ...HEADLINES.map(([label, value, , src]) => ({
    text: label + " " + value + " " + src, route: "overview", label: label + ": " + value,
  })),
  ...RELEASES.map(([date, title, detail]) => ({
    text: title + " " + detail, route: "overview", label: title,
  })),
  ...REGIONS.map(([name, capital]) => ({
    text: name + " " + capital, route: "regions", label: name + " region, capital " + capital,
  })),
  { text: "population age structure census", route: "population", label: "Population: 18.42 million people" },
  { text: "gdp growth economy trade sectors manufacturing", route: "economy", label: "Economy: GDP AR 412.6 billion" },
  { text: "unemployment jobs labour participation employment industry", route: "labour", label: "Jobs: unemployment 5.8%" },
  { text: "inflation cpi prices food housing transport", route: "prices", label: "Prices: inflation 3.1%" },
  { text: "download tables csv methods sources", route: "data", label: "Data & sources: download the tables" },
];

function lookup(query) {
  const box = $("search-hits");
  const q = query.trim().toLowerCase();
  if (q.length < 2) { box.hidden = true; return; }
  const hits = LOOKUP.filter((item) => item.text.toLowerCase().includes(q)).slice(0, 6);
  if (hits.length === 0) {
    box.hidden = false;
    box.textContent = "No match for \"" + query.trim() + "\". Try population, unemployment or inflation.";
    return;
  }
  box.hidden = false;
  box.innerHTML = "";
  const intro = document.createElement("span");
  intro.textContent = hits.length + " match" + (hits.length > 1 ? "es" : "") + ": ";
  box.appendChild(intro);
  hits.forEach((hit, i) => {
    const a = document.createElement("a");
    a.href = "#/" + hit.route;
    a.textContent = hit.label;
    box.appendChild(a);
    if (i < hits.length - 1) box.appendChild(document.createTextNode(" · "));
  });
}

$("site-search").addEventListener("submit", (e) => {
  e.preventDefault();
  lookup($("search-box").value);
});
$("search-box").addEventListener("input", (e) => lookup(e.target.value));

document.querySelectorAll("#industry-table th button").forEach((btn) => {
  btn.addEventListener("click", () => {
    const col = Number(btn.dataset.sort);
    if (sortCol === col) sortAsc = !sortAsc;
    else { sortCol = col; sortAsc = col === 0; }
    paintIndustry();
  });
});

$("region-metric").addEventListener("change", (e) => {
  regionMetric = e.target.value;
  paintRegions();
});

window.addEventListener("hashchange", () => {
  go(location.hash.replace(/^#\//, ""));
});

go(location.hash.replace(/^#\//, ""));

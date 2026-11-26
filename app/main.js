// Arunika in Numbers: routing, rendering and controls.
// Hash routes: #/overview, #/population, #/economy, #/labour, #/prices,
// #/regions, #/data. Every section is a real page of the single file.

import {
  HEADLINES, POPULATION_SERIES, AGE_STRUCTURE, GDP_GROWTH, GDP_SECTORS,
  TRADE_SERIES, LABOUR_SERIES, EMPLOYMENT_BY_INDUSTRY, CPI_SERIES, CPI_GROUPS,
  REGIONS, RELEASES,
} from "./data.js";
import { drawLineChart, drawBarChart, drawGroupedBars, drawHorizontalBars } from "./charts.js";

const PAGES = ["overview", "population", "economy", "labour", "prices", "regions", "data"];

function showPage(name) {
  const page = PAGES.includes(name) ? name : "overview";
  document.querySelectorAll(".page").forEach((el) => {
    el.hidden = el.dataset.page !== page;
  });
  document.querySelectorAll(".main-nav a").forEach((a) => {
    a.classList.toggle("active", a.dataset.route === page);
  });
  renderPage(page);
  window.scrollTo(0, 0);
}

function renderPage(page) {
  if (page === "overview") renderOverview();
  if (page === "population") renderPopulation();
  if (page === "economy") renderEconomy();
  if (page === "labour") renderLabour();
  if (page === "prices") renderPrices();
  if (page === "regions") renderRegions();
  if (page === "data") renderData();
}

function renderOverview() {
  const grid = document.getElementById("kpi-grid");
  if (grid.childElementCount === 0) {
    HEADLINES.forEach((k) => {
      const card = document.createElement("article");
      card.className = "kpi";
      card.innerHTML =
        "<h3></h3><p class='kpi-value'></p><p class='kpi-change'></p><p class='kpi-source'></p><p class='kpi-note'></p>";
      card.querySelector("h3").textContent = k.label;
      card.querySelector(".kpi-value").textContent = k.value;
      card.querySelector(".kpi-change").textContent = k.change;
      card.querySelector(".kpi-source").textContent = "Source: " + k.source;
      card.querySelector(".kpi-note").textContent = k.note;
      grid.appendChild(card);
    });
    const list = document.getElementById("release-list");
    RELEASES.forEach((r) => {
      const li = document.createElement("li");
      const time = document.createElement("time");
      time.textContent = r.date;
      const title = document.createElement("strong");
      title.textContent = r.title;
      const detail = document.createElement("span");
      detail.textContent = r.detail;
      li.append(time, title, detail);
      list.appendChild(li);
    });
  }
  drawLineChart(document.getElementById("chart-population"), POPULATION_SERIES, {
    unit: "", format: (v) => v.toFixed(2) + "m",
  });
  drawBarChart(document.getElementById("chart-gdp"), GDP_GROWTH, {
    unit: "%", format: (v) => v.toFixed(1) + "%",
  });
}

let populationYear = 2025;

function renderPopulation() {
  drawLineChart(document.getElementById("chart-population-full"), POPULATION_SERIES, {
    unit: "", format: (v) => v.toFixed(2) + "m",
  });
  drawBarChart(document.getElementById("chart-age"),
    AGE_STRUCTURE.map((a) => ({ year: a.group, value: a.share })), {
      unit: "%", format: (v) => v.toFixed(1) + "%",
    });
  const picker = document.getElementById("population-year-picker");
  if (picker.childElementCount === 0) {
    POPULATION_SERIES.forEach((p) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = p.year;
      btn.addEventListener("click", () => {
        populationYear = p.year;
        updatePopulationNote();
        picker.querySelectorAll("button").forEach((b) => b.classList.toggle("active", b === btn));
      });
      picker.appendChild(btn);
    });
  }
  updatePopulationNote();
  const tbody = document.querySelector("#population-table tbody");
  if (tbody.childElementCount === 0) {
    POPULATION_SERIES.forEach((p, i) => {
      const tr = document.createElement("tr");
      const prev = i === 0 ? null : POPULATION_SERIES[i - 1].value;
      const change = prev === null ? "—" : "+" + ((p.value - prev) / prev * 100).toFixed(1) + "%";
      tr.innerHTML = "<td></td><td></td><td></td>";
      tr.children[0].textContent = p.year;
      tr.children[1].textContent = p.value.toFixed(2);
      tr.children[2].textContent = change;
      tbody.appendChild(tr);
    });
  }
}

function updatePopulationNote() {
  const p = POPULATION_SERIES.find((row) => row.year === populationYear);
  const idx = POPULATION_SERIES.indexOf(p);
  const prev = idx === 0 ? null : POPULATION_SERIES[idx - 1].value;
  const note = document.getElementById("population-year-note");
  const change = prev === null
    ? "the first year of the series."
    : "up " + ((p.value - prev) / prev * 100).toFixed(1) + "% on " + POPULATION_SERIES[idx - 1].year + ".";
  note.textContent = "In " + p.year + " the mid-year population was " + p.value.toFixed(2) + " million, " + change;
  document.querySelectorAll("#population-year-picker button").forEach((b) => {
    b.classList.toggle("active", Number(b.textContent) === populationYear);
  });
}

function renderEconomy() {
  drawBarChart(document.getElementById("chart-gdp-full"), GDP_GROWTH, {
    unit: "%", format: (v) => v.toFixed(1) + "%",
  });
  drawGroupedBars(document.getElementById("chart-trade"),
    TRADE_SERIES.map((t) => ({ year: t.year, a: t.exports, b: t.imports })), {
      unit: "", labelA: "Exports", labelB: "Imports",
    });
  drawHorizontalBars(document.getElementById("sector-bars"),
    GDP_SECTORS.map((s) => ({ label: s.sector, value: s.share })), {
      format: (v) => v.toFixed(1) + "%",
    });
}

let industrySort = { key: "jobs", dir: -1 };

function renderLabour() {
  drawLineChart(document.getElementById("chart-unemployment"),
    LABOUR_SERIES.map((l) => ({ year: l.year, value: l.unemployment })), {
      unit: "%", format: (v) => v.toFixed(1) + "%",
    });
  drawLineChart(document.getElementById("chart-participation"),
    LABOUR_SERIES.map((l) => ({ year: l.year, value: l.participation })), {
      unit: "%", format: (v) => v.toFixed(1) + "%",
    });
  renderIndustryTable();
}

function renderIndustryTable() {
  const rows = EMPLOYMENT_BY_INDUSTRY.slice().sort((a, b) => {
    const k = industrySort.key;
    const diff = typeof a[k] === "string" ? a[k].localeCompare(b[k]) : a[k] - b[k];
    return diff * industrySort.dir;
  });
  const tbody = document.querySelector("#industry-table tbody");
  tbody.innerHTML = "";
  rows.forEach((r) => {
    const tr = document.createElement("tr");
    tr.innerHTML = "<td></td><td></td><td></td>";
    tr.children[0].textContent = r.industry;
    tr.children[1].textContent = r.jobs.toLocaleString("en-US");
    tr.children[2].textContent = r.share.toFixed(1) + "%";
    tbody.appendChild(tr);
  });
}

function renderPrices() {
  drawBarChart(document.getElementById("chart-cpi"), CPI_SERIES, {
    unit: "%", format: (v) => v.toFixed(1) + "%",
  });
  drawHorizontalBars(document.getElementById("cpi-bars"),
    CPI_GROUPS.map((g) => ({ label: g.group, value: g.change, amber: g.change >= 3.5 })), {
      format: (v) => "+" + v.toFixed(1) + "%",
    });
}

let regionMetric = "gdpPerCapita";

function renderRegions() {
  const metricLabels = {
    gdpPerCapita: { label: "GDP per capita, AR", format: (v) => "AR " + v.toLocaleString("en-US") },
    population: { label: "Population, millions", format: (v) => v.toFixed(2) + "m" },
    unemployment: { label: "Unemployment, %", format: (v) => v.toFixed(1) + "%" },
  };
  const meta = metricLabels[regionMetric];
  drawBarChart(document.getElementById("chart-regions"),
    REGIONS.map((r) => ({ year: r.name, value: r[regionMetric] })), {
      unit: "", format: meta.format,
    });
  const best = REGIONS.reduce((a, b) => (b[regionMetric] > a[regionMetric] ? b : a));
  const note = document.getElementById("region-note");
  if (regionMetric === "unemployment") {
    const lowest = REGIONS.reduce((a, b) => (b[regionMetric] < a[regionMetric] ? b : a));
    note.textContent = "Lowest unemployment: " + lowest.name + " at " + lowest.unemployment.toFixed(1) + "%. Highest: " + best.name + " at " + best.unemployment.toFixed(1) + "%.";
  } else {
    note.textContent = "Highest " + meta.label.toLowerCase() + ": " + best.name + " (" + meta.format(best[regionMetric]) + ").";
  }
  const tbody = document.querySelector("#region-table tbody");
  if (tbody.childElementCount === 0) {
    REGIONS.forEach((r) => {
      const tr = document.createElement("tr");
      tr.innerHTML = "<td></td><td></td><td></td><td></td><td></td>";
      tr.children[0].textContent = r.name;
      tr.children[1].textContent = r.capital;
      tr.children[2].textContent = r.population.toFixed(2);
      tr.children[3].textContent = r.gdpPerCapita.toLocaleString("en-US");
      tr.children[4].textContent = r.unemployment.toFixed(1) + "%";
      tbody.appendChild(tr);
    });
  }
}

function toCsv(headers, rows) {
  const lines = [headers.join(",")];
  rows.forEach((r) => lines.push(r.map((c) => '"' + String(c).replace(/"/g, '""') + '"').join(",")));
  return lines.join("\n");
}

function renderData() {
  const list = document.getElementById("download-list");
  if (list.childElementCount !== 0) return;
  const files = [
    {
      name: "population-2019-2025.csv",
      label: "Population by year, 2019 to 2025",
      csv: toCsv(["year", "population_millions"], POPULATION_SERIES.map((p) => [p.year, p.value])),
    },
    {
      name: "gdp-growth-2019-2025.csv",
      label: "Real GDP growth by year, 2019 to 2025",
      csv: toCsv(["year", "real_gdp_growth_pct"], GDP_GROWTH.map((g) => [g.year, g.value])),
    },
    {
      name: "labour-2019-2025.csv",
      label: "Unemployment, participation and employment, 2019 to 2025",
      csv: toCsv(["year", "unemployment_pct", "participation_pct", "employment_pct"],
        LABOUR_SERIES.map((l) => [l.year, l.unemployment, l.participation, l.employment])),
    },
    {
      name: "regions-2025.csv",
      label: "Regions: population, GDP per capita and unemployment, 2025",
      csv: toCsv(["region", "capital", "population_millions", "gdp_per_capita_ar", "unemployment_pct"],
        REGIONS.map((r) => [r.name, r.capital, r.population, r.gdpPerCapita, r.unemployment])),
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

// Search across headline indicators, releases and regions.
const SEARCH_INDEX = [
  ...HEADLINES.map((k) => ({ text: k.label + " " + k.value + " " + k.source, route: "overview", label: k.label + ": " + k.value })),
  ...RELEASES.map((r) => ({ text: r.title + " " + r.detail, route: "overview", label: r.title })),
  ...REGIONS.map((r) => ({ text: r.name + " " + r.capital, route: "regions", label: r.name + " region, capital " + r.capital })),
  { text: "population age structure census", route: "population", label: "Population: 18.42 million people" },
  { text: "gdp growth economy trade sectors manufacturing", route: "economy", label: "Economy: GDP AR 412.6 billion" },
  { text: "unemployment jobs labour participation employment industry", route: "labour", label: "Jobs: unemployment 5.8%" },
  { text: "inflation cpi prices food housing transport", route: "prices", label: "Prices: inflation 3.1%" },
  { text: "download tables csv methods sources", route: "data", label: "Data & sources: download the tables" },
];

function runSearch(query) {
  const box = document.getElementById("search-results");
  const q = query.trim().toLowerCase();
  if (q.length < 2) { box.hidden = true; return; }
  const hits = SEARCH_INDEX.filter((item) => item.text.toLowerCase().includes(q)).slice(0, 6);
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

document.getElementById("site-search").addEventListener("submit", (e) => {
  e.preventDefault();
  runSearch(document.getElementById("search-box").value);
});
document.getElementById("search-box").addEventListener("input", (e) => runSearch(e.target.value));

document.querySelectorAll("#industry-table th button").forEach((btn) => {
  btn.addEventListener("click", () => {
    const key = btn.dataset.sort;
    if (industrySort.key === key) industrySort.dir *= -1;
    else industrySort = { key, dir: key === "industry" ? 1 : -1 };
    renderIndustryTable();
  });
});

document.getElementById("region-metric").addEventListener("change", (e) => {
  regionMetric = e.target.value;
  renderRegions();
});

window.addEventListener("hashchange", () => {
  showPage(location.hash.replace(/^#\//, ""));
});

showPage(location.hash.replace(/^#\//, ""));

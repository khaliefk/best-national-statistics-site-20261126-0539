// Figures for Arunika, published by its National Statistics Office.
// The country is fictional; the office and every number here were made
// for this site. Each series names its source and reference year where
// it is shown. Values are stored as parallel arrays so a year and its
// figure always line up by position.

export const COUNTRY = "Arunika";
export const OFFICE = "National Statistics Office of Arunika";
export const UPDATED = "14 November 2026";
export const MONEY = "AR";

// Calendar years covered by the time series on this site.
export const YEARS = [2019, 2020, 2021, 2022, 2023, 2024, 2025];

// Mid-year population, millions of people.
export const POP_M = [17.31, 17.48, 17.66, 17.89, 18.09, 18.26, 18.42];

// Share of the population in each age band, 2025, percent.
export const AGE_BANDS = ["0–14", "15–24", "25–54", "55–64", "65+"];
export const AGE_PCT = [24.1, 16.8, 41.3, 9.6, 8.2];

// Real GDP growth, percent a year.
export const GDP_REAL = [3.4, -1.8, 4.6, 5.2, 3.8, 4.4, 4.1];

// Share of GDP by sector, 2025, percent. Each row is [sector, share].
export const SECTORS = [
  ["Agriculture, forestry and fishing", 11.4],
  ["Mining and quarrying", 6.2],
  ["Manufacturing", 19.8],
  ["Construction", 7.1],
  ["Trade, hotels and restaurants", 16.5],
  ["Transport and communications", 9.3],
  ["Finance and business services", 12.6],
  ["Public services and other", 17.1],
];

// Trade in goods, AR billion a year.
export const EXPORTS_BN = [58.2, 51.7, 63.8, 74.5, 71.9, 76.3, 81.2];
export const IMPORTS_BN = [61.4, 54.9, 66.1, 78.2, 76.4, 79.8, 83.6];

// Labour market, percent. Unemployment is a share of the labour force;
// participation and employment are shares of people aged 15 to 64.
export const UNEMP_PCT = [6.9, 8.4, 7.6, 6.8, 6.3, 6.2, 5.8];
export const PARTIC_PCT = [67.2, 64.8, 66.1, 67.4, 68.0, 68.3, 68.7];
export const EMPLOY_PCT = [62.6, 59.4, 61.1, 62.8, 63.7, 64.1, 64.7];

// Jobs by industry, 2025. Each row is [industry, jobs in thousands, share %].
export const INDUSTRIES = [
  ["Agriculture", 2140, 22.4],
  ["Manufacturing", 1730, 18.1],
  ["Trade and retail", 1610, 16.9],
  ["Construction", 820, 8.6],
  ["Transport and storage", 540, 5.7],
  ["Education and health", 1180, 12.4],
  ["Public administration", 690, 7.2],
  ["Other services", 830, 8.7],
];

// Consumer prices, annual change, percent.
export const CPI_PCT = [2.8, 1.9, 2.4, 5.6, 4.2, 3.7, 3.1];

// CPI groups, annual change in October 2025, percent.
// Each row is [group, change].
export const CPI_GROUPS = [
  ["Food and non-alcoholic drinks", 4.0],
  ["Housing, water and energy", 2.6],
  ["Transport", 1.8],
  ["Health", 3.4],
  ["Education", 2.1],
  ["Recreation and culture", 2.9],
  ["Restaurants and hotels", 3.8],
  ["Clothing and footwear", 1.2],
];

// Regions, 2025. Each row is [name, capital, population in millions,
// GDP per capita in AR, unemployment rate in percent].
export const REGIONS = [
  ["North Coast", "Port Selin", 4.12, 28410, 4.9],
  ["Central Valley", "Arun City", 5.68, 24180, 5.4],
  ["Highlands", "Kerta", 2.34, 16870, 7.2],
  ["Eastern Plains", "Tomba", 3.05, 19340, 6.1],
  ["Southern Isles", "Nusa Mara", 1.87, 22150, 5.9],
  ["Western Hills", "Belo", 1.36, 15420, 8.3],
];

// Headline indicators for the front page. Each entry is
// [label, value, change on the previous period, source, note].
export const HEADLINES = [
  ["Population", "18.42m", "+0.9% on 2024", "Population Estimates 2025", "Mid-year estimate, 30 June 2025."],
  ["GDP", "AR 412.6bn", "+4.1% real growth", "National Accounts 2025", "Current prices; real growth at 2020 prices."],
  ["GDP per capita", "AR 22,398", "+3.2% on 2024", "National Accounts 2025", "Current prices."],
  ["Unemployment rate", "5.8%", "0.4 points lower", "Labour Force Survey, Q3 2025", "People aged 15 to 64, seasonally adjusted."],
  ["Inflation (CPI)", "3.1%", "0.6 points lower", "Consumer Prices, October 2025", "Annual change, all items."],
  ["Median monthly income", "AR 1,940", "+5.2% nominal", "Household Income Survey 2024", "Employees, gross, before tax."],
];

// Latest releases. Each row is [date, title, detail].
export const RELEASES = [
  ["14 Nov 2026", "Consumer price index, October 2025", "Annual inflation 3.1%, down from 3.7% in September."],
  ["31 Oct 2026", "Labour force survey, Q3 2025", "Unemployment 5.8%; participation 68.7%, the highest since 2019."],
  ["15 Oct 2026", "National accounts, Q2 2025", "GDP grew 4.1% on the year; manufacturing added 0.9 points."],
  ["30 Sep 2026", "Population estimates, mid-2025", "Population 18.42 million; the 65+ share reached 8.2%."],
  ["12 Sep 2026", "Regional accounts 2024", "North Coast GDP per capita AR 28,410, the highest of six regions."],
  ["28 Aug 2026", "Household income survey 2024", "Median monthly income AR 1,940; the Gini index stands at 0.38."],
];

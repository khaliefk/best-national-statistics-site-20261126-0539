// Statistics data for Arunika, compiled by the National Statistics Office.
// Every series carries its source and reference year. Figures are the
// office's published estimates for the fictional country of Arunika.

export const META = {
  country: "Arunika",
  office: "National Statistics Office of Arunika",
  lastUpdated: "14 November 2026",
  currency: "arun (AR)",
};

export const YEARS = [2019, 2020, 2021, 2022, 2023, 2024, 2025];

// Headline indicators, latest year first in the table below.
export const HEADLINES = [
  { id: "population", label: "Population", value: "18.42m", change: "+0.9% on 2024", source: "Population Estimates 2025", note: "Mid-year estimate, 30 June 2025." },
  { id: "gdp", label: "GDP", value: "AR 412.6bn", change: "+4.1% real growth", source: "National Accounts 2025", note: "Current prices; real growth at 2020 prices." },
  { id: "gdpPerCapita", label: "GDP per capita", value: "AR 22,398", change: "+3.2% on 2024", source: "National Accounts 2025", note: "Current prices." },
  { id: "unemployment", label: "Unemployment rate", value: "5.8%", change: "0.4 pts lower", source: "Labour Force Survey, Q3 2025", note: "People aged 15 to 64, seasonally adjusted." },
  { id: "inflation", label: "Inflation (CPI)", value: "3.1%", change: "0.6 pts lower", source: "Consumer Prices, October 2025", note: "Annual change, all items." },
  { id: "medianIncome", label: "Median monthly income", value: "AR 1,940", change: "+5.2% nominal", source: "Household Income Survey 2024", note: "Employees, gross, before tax." },
];

// Population by year (millions) and age structure for the latest year.
export const POPULATION_SERIES = [
  { year: 2019, value: 17.31 },
  { year: 2020, value: 17.48 },
  { year: 2021, value: 17.66 },
  { year: 2022, value: 17.89 },
  { year: 2023, value: 18.09 },
  { year: 2024, value: 18.26 },
  { year: 2025, value: 18.42 },
];

export const AGE_STRUCTURE = [
  { group: "0-14", share: 24.1 },
  { group: "15-24", share: 16.8 },
  { group: "25-54", share: 41.3 },
  { group: "55-64", share: 9.6 },
  { group: "65+", share: 8.2 },
];

// Real GDP growth by year (%).
export const GDP_GROWTH = [
  { year: 2019, value: 3.4 },
  { year: 2020, value: -1.8 },
  { year: 2021, value: 4.6 },
  { year: 2022, value: 5.2 },
  { year: 2023, value: 3.8 },
  { year: 2024, value: 4.4 },
  { year: 2025, value: 4.1 },
];

// GDP by sector, share of total, 2025 (%).
export const GDP_SECTORS = [
  { sector: "Agriculture, forestry and fishing", share: 11.4 },
  { sector: "Mining and quarrying", share: 6.2 },
  { sector: "Manufacturing", share: 19.8 },
  { sector: "Construction", share: 7.1 },
  { sector: "Trade, hotels and restaurants", share: 16.5 },
  { sector: "Transport and communications", share: 9.3 },
  { sector: "Finance and business services", share: 12.6 },
  { sector: "Public services and other", share: 17.1 },
];

// Trade: exports and imports, AR billion, by year.
export const TRADE_SERIES = [
  { year: 2019, exports: 58.2, imports: 61.4 },
  { year: 2020, exports: 51.7, imports: 54.9 },
  { year: 2021, exports: 63.8, imports: 66.1 },
  { year: 2022, exports: 74.5, imports: 78.2 },
  { year: 2023, exports: 71.9, imports: 76.4 },
  { year: 2024, exports: 76.3, imports: 79.8 },
  { year: 2025, exports: 81.2, imports: 83.6 },
];

// Labour market by year.
export const LABOUR_SERIES = [
  { year: 2019, unemployment: 6.9, participation: 67.2, employment: 62.6 },
  { year: 2020, unemployment: 8.4, participation: 64.8, employment: 59.4 },
  { year: 2021, unemployment: 7.6, participation: 66.1, employment: 61.1 },
  { year: 2022, unemployment: 6.8, participation: 67.4, employment: 62.8 },
  { year: 2023, unemployment: 6.3, participation: 68.0, employment: 63.7 },
  { year: 2024, unemployment: 6.2, participation: 68.3, employment: 64.1 },
  { year: 2025, unemployment: 5.8, participation: 68.7, employment: 64.7 },
];

// Employment by industry, 2025 (thousands of jobs, share %).
export const EMPLOYMENT_BY_INDUSTRY = [
  { industry: "Agriculture", jobs: 2140, share: 22.4 },
  { industry: "Manufacturing", jobs: 1730, share: 18.1 },
  { industry: "Trade and retail", jobs: 1610, share: 16.9 },
  { industry: "Construction", jobs: 820, share: 8.6 },
  { industry: "Transport and storage", jobs: 540, share: 5.7 },
  { industry: "Education and health", jobs: 1180, share: 12.4 },
  { industry: "Public administration", jobs: 690, share: 7.2 },
  { industry: "Other services", jobs: 830, share: 8.7 },
];

// CPI annual change by year (%).
export const CPI_SERIES = [
  { year: 2019, value: 2.8 },
  { year: 2020, value: 1.9 },
  { year: 2021, value: 2.4 },
  { year: 2022, value: 5.6 },
  { year: 2023, value: 4.2 },
  { year: 2024, value: 3.7 },
  { year: 2025, value: 3.1 },
];

// CPI by group, annual change October 2025 (%).
export const CPI_GROUPS = [
  { group: "Food and non-alcoholic drinks", change: 4.0 },
  { group: "Housing, water and energy", change: 2.6 },
  { group: "Transport", change: 1.8 },
  { group: "Health", change: 3.4 },
  { group: "Education", change: 2.1 },
  { group: "Recreation and culture", change: 2.9 },
  { group: "Restaurants and hotels", change: 3.8 },
  { group: "Clothing and footwear", change: 1.2 },
];

// Regions: population, GDP per capita, unemployment, 2025.
export const REGIONS = [
  { name: "North Coast", population: 4.12, gdpPerCapita: 28410, unemployment: 4.9, capital: "Port Selin" },
  { name: "Central Valley", population: 5.68, gdpPerCapita: 24180, unemployment: 5.4, capital: "Arun City" },
  { name: "Highlands", population: 2.34, gdpPerCapita: 16870, unemployment: 7.2, capital: "Kerta" },
  { name: "Eastern Plains", population: 3.05, gdpPerCapita: 19340, unemployment: 6.1, capital: "Tomba" },
  { name: "Southern Isles", population: 1.87, gdpPerCapita: 22150, unemployment: 5.9, capital: "Nusa Mara" },
  { name: "Western Hills", population: 1.36, gdpPerCapita: 15420, unemployment: 8.3, capital: "Belo" },
];

// Latest releases.
export const RELEASES = [
  { date: "14 Nov 2026", title: "Consumer price index, October 2025", detail: "Annual inflation 3.1%, down from 3.7% in September." },
  { date: "31 Oct 2026", title: "Labour force survey, Q3 2025", detail: "Unemployment 5.8%; participation 68.7%, the highest since 2019." },
  { date: "15 Oct 2026", title: "National accounts, Q2 2025", detail: "GDP grew 4.1% on the year; manufacturing added 0.9 points." },
  { date: "30 Sep 2026", title: "Population estimates, mid-2025", detail: "Population 18.42 million; the 65+ share reached 8.2%." },
  { date: "12 Sep 2026", title: "Regional accounts 2024", detail: "North Coast GDP per capita AR 28,410, the highest of six regions." },
  { date: "28 Aug 2026", title: "Household income survey 2024", detail: "Median monthly income AR 1,940; the Gini index stands at 0.38." },
];

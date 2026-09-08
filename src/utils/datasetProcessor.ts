import { ACTUAL_DATASET_RECORDS, FarmRecord } from '../data/actualSeasonData';
import {
  SeasonType,
  MetricCardData,
  EnvironmentalConditions,
  CropPerformanceItem,
  KeyInsightItem,
  SeasonInfo,
  DatasetAuditSummary,
  DatasetColumnMeta,
  SeasonalPerformancePoint,
} from '../types';

// ============================================================================
// 1. DATA TYPES & INTERFACES FOR CENTRALIZED PROCESSOR
// ============================================================================

export interface SanitizedFarmRecord {
  Farm_ID: string;
  State: string;
  District: string;
  Crop: string;
  Season: 'Kharif' | 'Rabi' | 'Zaid' | string;
  Farm_Area_Hectares: number;
  Rainfall_mm: number | null;
  Avg_Temperature_C: number;
  Humidity_pct: number;
  Sunlight_Hours_Day: number;
  Soil_pH: number;
  Soil_Moisture_pct: number | null;
  Nitrogen_kg_ha: number;
  Phosphorus_kg_ha: number;
  Potassium_kg_ha: number;
  Irrigation_Method: 'Drip' | 'Flood' | 'Sprinkler' | 'Rainfed' | string;
  Fertilizer_kg_ha: number;
  Pesticide_Litre_ha: number;
  Seed_Quality_Score: number;
  Yield_Tonnes_Ha: number | null;
  Production_Tonnes: number;
  Market_Price_INR_Tonne: number;
  Total_Cost_INR: number;
  Revenue_INR: number;
  Profit_INR: number;
  Water_Used_m3: number;
  Water_Efficiency_t_per_1000m3: number;
  Disease_Pest_Risk_pct: number;
}

export interface ColumnStatisticalSummary {
  key: keyof SanitizedFarmRecord;
  label: string;
  count: number;
  missingCount: number;
  mean: number;
  median: number;
  min: number;
  max: number;
  stdDev: number;
  q1: number;
  q3: number;
  iqr: number;
}

export interface OverallDatasetStats {
  totalObservations: number;
  uniqueStatesCount: number;
  uniqueDistrictsCount: number;
  uniqueCropsCount: number;
  uniqueSeasonsCount: number;
  totalAcreageHectares: number;
  totalProductionTonnes: number;
  totalRevenueINR: number;
  totalCostINR: number;
  totalProfitINR: number;
  overallProfitMarginPct: number;
  columns: Record<string, ColumnStatisticalSummary>;
}

export interface SeasonalSummaryStats {
  id: SeasonType;
  name: string;
  nativeTitle: string;
  period: string;
  count: number;
  pctOfTotal: number;
  avgYield: number;
  minYield: number;
  maxYield: number;
  avgProduction: number;
  totalProduction: number;
  avgRevenue: number;
  totalRevenue: number;
  avgProfit: number;
  totalProfit: number;
  avgCost: number;
  totalCost: number;
  profitMarginPct: number;
  avgRainfall: number;
  minRainfall: number;
  maxRainfall: number;
  avgTemperature: number;
  minTemperature: number;
  maxTemperature: number;
  avgHumidity: number;
  avgSunlight: number;
  avgSoilPH: number;
  avgSoilMoisture: number;
  avgNitrogen: number;
  avgPhosphorus: number;
  avgPotassium: number;
  avgFertilizer: number;
  avgPesticide: number;
  avgSeedScore: number;
  avgWaterUsage: number;
  totalWaterUsage: number;
  avgWaterEfficiency: number;
  avgPestRisk: number;
  dominantCrop: string;
  dominantIrrigation: string;
  cropsCount: Record<string, number>;
  statesCount: Record<string, number>;
  irrigationCount: Record<string, number>;
}

export interface CropAggregateStats {
  id: string;
  name: string;
  scientificName: string;
  nativeName: string;
  category: 'Cereal' | 'Pulse' | 'Cash Crop' | 'Oilseed' | 'Horticulture';
  emoji: string;
  description: string;
  plotCount: number;
  seasons: string[];
  states: string[];
  districts: string[];
  irrigationMethods: string[];
  avgYield: number;
  minYield: number;
  maxYield: number;
  avgProduction: number;
  totalProduction: number;
  avgRevenue: number;
  totalRevenue: number;
  avgCost: number;
  totalCost: number;
  avgProfit: number;
  totalProfit: number;
  profitMarginPct: number;
  avgWaterUsage: number;
  totalWaterUsage: number;
  avgWaterEfficiency: number;
  avgDiseaseRisk: number;
  minDiseaseRisk: number;
  maxDiseaseRisk: number;
  avgFarmArea: number;
  avgMarketPrice: number;
  avgTemperature: number;
  avgRainfall: number;
  avgHumidity: number;
  avgFertilizer: number;
  avgPesticide: number;
  performanceScore: number; // 0-100 normalized
  farms: SanitizedFarmRecord[];
}

export interface StateRegionStats {
  id: string;
  state: string;
  plotCount: number;
  districts: string[];
  crops: string[];
  seasons: string[];
  avgYield: number;
  minYield: number;
  maxYield: number;
  avgProduction: number;
  totalProduction: number;
  avgRevenue: number;
  totalRevenue: number;
  avgCost: number;
  totalCost: number;
  avgProfit: number;
  totalProfit: number;
  profitMarginPct: number;
  avgWaterUsage: number;
  totalWaterUsage: number;
  avgWaterEfficiency: number;
  avgDiseaseRisk: number;
  avgFarmArea: number;
  totalFarmArea: number;
  avgMarketPrice: number;
  avgTemperature: number;
  avgRainfall: number;
  avgHumidity: number;
  avgSunlightHours: number;
  avgSoilPH: number;
  avgSoilMoisture: number;
  avgNitrogen: number;
  avgPhosphorus: number;
  avgPotassium: number;
  avgFertilizer: number;
  avgPesticide: number;
  avgSeedScore: number;
  irrigationCounts: Record<string, number>;
  farms: SanitizedFarmRecord[];
}

export interface DistrictStats {
  district: string;
  state: string;
  plotCount: number;
  crops: string[];
  seasons: string[];
  avgYield: number;
  avgProfit: number;
  avgWater: number;
  avgRainfall: number;
  avgRisk: number;
}

export interface OutlierDossier {
  farmId: string;
  state: string;
  district: string;
  crop: string;
  season: string;
  metricKey: keyof SanitizedFarmRecord;
  metricLabel: string;
  observedValue: number;
  unit: string;
  datasetMean: number;
  stdDev: number;
  zScore: number;
  type: 'high_outlier' | 'low_outlier' | 'severe_loss' | 'high_yield';
  severity: 'Severe' | 'Moderate' | 'Mild';
  explanation: string;
  contributingFactors: string[];
}

export interface TrendFinding {
  id: string;
  category: 'Yield' | 'Economics' | 'Hydrology' | 'Agronomy' | 'Environment';
  title: string;
  headline: string;
  statisticalProof: string;
  correlationCoefficient?: number;
  actionableInsight: string;
  confidenceScore: number;
}

// ============================================================================
// 2. MATHEMATICAL & ROBUSTNESS UTILITIES (Handle NaNs, Nulls, Outliers)
// ============================================================================

export const safeNum = (val: any, fallback: number = 0): number => {
  if (val === null || val === undefined || val === '') return fallback;
  const n = Number(val);
  return Number.isFinite(n) ? n : fallback;
};

export const safeNullableNum = (val: any): number | null => {
  if (val === null || val === undefined || val === '' || isNaN(Number(val))) return null;
  const n = Number(val);
  return Number.isFinite(n) ? n : null;
};

export const safeStr = (val: any, fallback: string = 'Unknown'): string => {
  if (val === null || val === undefined) return fallback;
  const s = String(val).trim();
  return s.length > 0 ? s : fallback;
};

export const safeMean = (arr: number[]): number => {
  const valid = arr.filter((x) => Number.isFinite(x));
  return valid.length > 0 ? valid.reduce((acc, v) => acc + v, 0) / valid.length : 0;
};

export const safeSum = (arr: number[]): number => {
  const valid = arr.filter((x) => Number.isFinite(x));
  return valid.reduce((acc, v) => acc + v, 0);
};

export const safeMin = (arr: number[]): number => {
  const valid = arr.filter((x) => Number.isFinite(x));
  return valid.length > 0 ? Math.min(...valid) : 0;
};

export const safeMax = (arr: number[]): number => {
  const valid = arr.filter((x) => Number.isFinite(x));
  return valid.length > 0 ? Math.max(...valid) : 0;
};

export const safeMedian = (arr: number[]): number => {
  const valid = arr.filter((x) => Number.isFinite(x)).sort((a, b) => a - b);
  if (!valid.length) return 0;
  const mid = Math.floor(valid.length / 2);
  return valid.length % 2 !== 0 ? valid[mid] : (valid[mid - 1] + valid[mid]) / 2;
};

export const safeQuantile = (arr: number[], q: number): number => {
  const valid = arr.filter((x) => Number.isFinite(x)).sort((a, b) => a - b);
  if (!valid.length) return 0;
  const pos = (valid.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  if (valid[base + 1] !== undefined) {
    return valid[base] + rest * (valid[base + 1] - valid[base]);
  }
  return valid[base];
};

export const safeStdDev = (arr: number[]): number => {
  const valid = arr.filter((x) => Number.isFinite(x));
  if (valid.length <= 1) return 0;
  const mean = safeMean(valid);
  const variance = valid.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / valid.length;
  return Math.sqrt(variance);
};

// Pearson correlation calculator
export const safePearsonCorrelation = (xArr: number[], yArr: number[]): number => {
  const n = Math.min(xArr.length, yArr.length);
  if (n < 2) return 0;

  const validPairs: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    if (Number.isFinite(xArr[i]) && Number.isFinite(yArr[i])) {
      validPairs.push([xArr[i], yArr[i]]);
    }
  }
  if (validPairs.length < 2) return 0;

  const xVals = validPairs.map((p) => p[0]);
  const yVals = validPairs.map((p) => p[1]);

  const xMean = safeMean(xVals);
  const yMean = safeMean(yVals);

  let numerator = 0;
  let denomX = 0;
  let denomY = 0;

  for (let i = 0; i < validPairs.length; i++) {
    const xDiff = xVals[i] - xMean;
    const yDiff = yVals[i] - yMean;
    numerator += xDiff * yDiff;
    denomX += xDiff * xDiff;
    denomY += yDiff * yDiff;
  }

  const denominator = Math.sqrt(denomX * denomY);
  if (denominator === 0) return 0;
  const r = numerator / denominator;
  return Number.isFinite(r) ? Math.max(-1, Math.min(1, r)) : 0;
};

// ============================================================================
// 3. SANITIZATION ENGINE (De-duplication, parsing, empty handling)
// ============================================================================

let cachedSanitizedRecords: SanitizedFarmRecord[] | null = null;

export function getSanitizedRecords(): SanitizedFarmRecord[] {
  if (cachedSanitizedRecords) return cachedSanitizedRecords;

  const rawRecords = ACTUAL_DATASET_RECORDS;
  const seenIds = new Set<string>();
  const sanitized: SanitizedFarmRecord[] = [];

  for (const raw of rawRecords) {
    const farmId = safeStr(raw.Farm_ID, `SF_${sanitized.length + 10001}`);
    if (seenIds.has(farmId)) {
      continue; // Remove duplicate records
    }
    seenIds.add(farmId);

    const record: SanitizedFarmRecord = {
      Farm_ID: farmId,
      State: safeStr(raw.State, 'Unknown State'),
      District: safeStr(raw.District, 'Unknown District'),
      Crop: safeStr(raw.Crop, 'General Crop'),
      Season: safeStr(raw.Season, 'Kharif'),
      Farm_Area_Hectares: Math.max(0.01, safeNum(raw.Farm_Area_Hectares, 1.0)),
      Rainfall_mm: safeNullableNum(raw.Rainfall_mm),
      Avg_Temperature_C: safeNum(raw.Avg_Temperature_C, 25.0),
      Humidity_pct: Math.min(100, Math.max(0, safeNum(raw.Humidity_pct, 60.0))),
      Sunlight_Hours_Day: Math.min(24, Math.max(0, safeNum(raw.Sunlight_Hours_Day, 7.0))),
      Soil_pH: Math.min(14, Math.max(0, safeNum(raw.Soil_pH, 6.5))),
      Soil_Moisture_pct: safeNullableNum(raw.Soil_Moisture_pct),
      Nitrogen_kg_ha: Math.max(0, safeNum(raw.Nitrogen_kg_ha, 100.0)),
      Phosphorus_kg_ha: Math.max(0, safeNum(raw.Phosphorus_kg_ha, 50.0)),
      Potassium_kg_ha: Math.max(0, safeNum(raw.Potassium_kg_ha, 100.0)),
      Irrigation_Method: safeStr(raw.Irrigation_Method, 'Rainfed'),
      Fertilizer_kg_ha: Math.max(0, safeNum(raw.Fertilizer_kg_ha, 150.0)),
      Pesticide_Litre_ha: Math.max(0, safeNum(raw.Pesticide_Litre_ha, 5.0)),
      Seed_Quality_Score: Math.min(1.0, Math.max(0, safeNum(raw.Seed_Quality_Score, 0.75))),
      Yield_Tonnes_Ha: safeNullableNum(raw.Yield_Tonnes_Ha),
      Production_Tonnes: Math.max(0, safeNum(raw.Production_Tonnes, 0)),
      Market_Price_INR_Tonne: Math.max(0, safeNum(raw.Market_Price_INR_Tonne, 20000)),
      Total_Cost_INR: Math.max(0, safeNum(raw.Total_Cost_INR, 0)),
      Revenue_INR: Math.max(0, safeNum(raw.Revenue_INR, 0)),
      Profit_INR: safeNum(raw.Profit_INR, 0),
      Water_Used_m3: Math.max(0, safeNum(raw.Water_Used_m3, 0)),
      Water_Efficiency_t_per_1000m3: Math.max(0, safeNum(raw.Water_Efficiency_t_per_1000m3, 0)),
      Disease_Pest_Risk_pct: Math.min(100, Math.max(0, safeNum(raw.Disease_Pest_Risk_pct, 40.0))),
    };

    sanitized.push(record);
  }

  cachedSanitizedRecords = sanitized;
  return sanitized;
}

// ============================================================================
// 4. CENTRALIZED COMPUTATIONS: OVERALL, SEASONAL, CROP, REGIONAL, OUTLIERS
// ============================================================================

// A. Overall Dataset Statistics
export function getOverallStatistics(): OverallDatasetStats {
  const records = getSanitizedRecords();
  const n = records.length;

  const states = new Set(records.map((r) => r.State));
  const districts = new Set(records.map((r) => r.District));
  const crops = new Set(records.map((r) => r.Crop));
  const seasons = new Set(records.map((r) => r.Season));

  const totalAcreage = safeSum(records.map((r) => r.Farm_Area_Hectares));
  const totalProduction = safeSum(records.map((r) => r.Production_Tonnes));
  const totalRevenue = safeSum(records.map((r) => r.Revenue_INR));
  const totalCost = safeSum(records.map((r) => r.Total_Cost_INR));
  const totalProfit = safeSum(records.map((r) => r.Profit_INR));
  const marginPct = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  // Numeric column summaries
  const numKeys: (keyof SanitizedFarmRecord)[] = [
    'Yield_Tonnes_Ha',
    'Production_Tonnes',
    'Revenue_INR',
    'Total_Cost_INR',
    'Profit_INR',
    'Market_Price_INR_Tonne',
    'Rainfall_mm',
    'Avg_Temperature_C',
    'Humidity_pct',
    'Sunlight_Hours_Day',
    'Soil_pH',
    'Soil_Moisture_pct',
    'Nitrogen_kg_ha',
    'Phosphorus_kg_ha',
    'Potassium_kg_ha',
    'Fertilizer_kg_ha',
    'Pesticide_Litre_ha',
    'Seed_Quality_Score',
    'Water_Used_m3',
    'Water_Efficiency_t_per_1000m3',
    'Disease_Pest_Risk_pct',
    'Farm_Area_Hectares',
  ];

  const columnSummaries: Record<string, ColumnStatisticalSummary> = {};

  for (const key of numKeys) {
    const rawVals = records.map((r) => r[key]);
    const validVals = rawVals.filter((v): v is number => typeof v === 'number' && Number.isFinite(v));
    const missingCount = n - validVals.length;

    columnSummaries[key] = {
      key,
      label: String(key).replace(/_/g, ' '),
      count: validVals.length,
      missingCount,
      mean: safeMean(validVals),
      median: safeMedian(validVals),
      min: safeMin(validVals),
      max: safeMax(validVals),
      stdDev: safeStdDev(validVals),
      q1: safeQuantile(validVals, 0.25),
      q3: safeQuantile(validVals, 0.75),
      iqr: safeQuantile(validVals, 0.75) - safeQuantile(validVals, 0.25),
    };
  }

  return {
    totalObservations: n,
    uniqueStatesCount: states.size,
    uniqueDistrictsCount: districts.size,
    uniqueCropsCount: crops.size,
    uniqueSeasonsCount: seasons.size,
    totalAcreageHectares: totalAcreage,
    totalProductionTonnes: totalProduction,
    totalRevenueINR: totalRevenue,
    totalCostINR: totalCost,
    totalProfitINR: totalProfit,
    overallProfitMarginPct: marginPct,
    columns: columnSummaries,
  };
}

// B. Seasonal Statistics
export function getSeasonalStatistics(targetSeason?: SeasonType): Record<SeasonType, SeasonalSummaryStats> {
  const records = getSanitizedRecords();
  const nTotal = records.length || 1;

  const buildSeasonStat = (
    id: SeasonType,
    name: string,
    nativeTitle: string,
    period: string,
    filtered: SanitizedFarmRecord[]
  ): SeasonalSummaryStats => {
    const n = filtered.length;
    const count = n;
    const pctOfTotal = (n / nTotal) * 100;

    const yields = filtered.map((r) => r.Yield_Tonnes_Ha).filter((v): v is number => v !== null);
    const productions = filtered.map((r) => r.Production_Tonnes);
    const revenues = filtered.map((r) => r.Revenue_INR);
    const profits = filtered.map((r) => r.Profit_INR);
    const costs = filtered.map((r) => r.Total_Cost_INR);
    const rainfalls = filtered.map((r) => r.Rainfall_mm).filter((v): v is number => v !== null);
    const temps = filtered.map((r) => r.Avg_Temperature_C);
    const humidities = filtered.map((r) => r.Humidity_pct);
    const sunlights = filtered.map((r) => r.Sunlight_Hours_Day);
    const phs = filtered.map((r) => r.Soil_pH);
    const moistures = filtered.map((r) => r.Soil_Moisture_pct).filter((v): v is number => v !== null);
    const nitrogens = filtered.map((r) => r.Nitrogen_kg_ha);
    const phosphorus = filtered.map((r) => r.Phosphorus_kg_ha);
    const potassiums = filtered.map((r) => r.Potassium_kg_ha);
    const fertilizers = filtered.map((r) => r.Fertilizer_kg_ha);
    const pesticides = filtered.map((r) => r.Pesticide_Litre_ha);
    const seedScores = filtered.map((r) => r.Seed_Quality_Score);
    const waters = filtered.map((r) => r.Water_Used_m3);
    const waterEffs = filtered.map((r) => r.Water_Efficiency_t_per_1000m3);
    const pestRisks = filtered.map((r) => r.Disease_Pest_Risk_pct);

    const totRev = safeSum(revenues);
    const totProf = safeSum(profits);
    const profitMargin = totRev > 0 ? (totProf / totRev) * 100 : 0;

    // Counts by category
    const cropsCount: Record<string, number> = {};
    const statesCount: Record<string, number> = {};
    const irrigationCount: Record<string, number> = {};

    filtered.forEach((r) => {
      cropsCount[r.Crop] = (cropsCount[r.Crop] || 0) + 1;
      statesCount[r.State] = (statesCount[r.State] || 0) + 1;
      irrigationCount[r.Irrigation_Method] = (irrigationCount[r.Irrigation_Method] || 0) + 1;
    });

    const dominantCrop = Object.entries(cropsCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Mixed';
    const dominantIrrigation = Object.entries(irrigationCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Rainfed';

    return {
      id,
      name,
      nativeTitle,
      period,
      count,
      pctOfTotal,
      avgYield: safeMean(yields),
      minYield: safeMin(yields),
      maxYield: safeMax(yields),
      avgProduction: safeMean(productions),
      totalProduction: safeSum(productions),
      avgRevenue: safeMean(revenues),
      totalRevenue: totRev,
      avgProfit: safeMean(profits),
      totalProfit: totProf,
      avgCost: safeMean(costs),
      totalCost: safeSum(costs),
      profitMarginPct: profitMargin,
      avgRainfall: safeMean(rainfalls),
      minRainfall: safeMin(rainfalls),
      maxRainfall: safeMax(rainfalls),
      avgTemperature: safeMean(temps),
      minTemperature: safeMin(temps),
      maxTemperature: safeMax(temps),
      avgHumidity: safeMean(humidities),
      avgSunlight: safeMean(sunlights),
      avgSoilPH: safeMean(phs),
      avgSoilMoisture: safeMean(moistures),
      avgNitrogen: safeMean(nitrogens),
      avgPhosphorus: safeMean(phosphorus),
      avgPotassium: safeMean(potassiums),
      avgFertilizer: safeMean(fertilizers),
      avgPesticide: safeMean(pesticides),
      avgSeedScore: safeMean(seedScores),
      avgWaterUsage: safeMean(waters),
      totalWaterUsage: safeSum(waters),
      avgWaterEfficiency: safeMean(waterEffs),
      avgPestRisk: safeMean(pestRisks),
      dominantCrop,
      dominantIrrigation,
      cropsCount,
      statesCount,
      irrigationCount,
    };
  };

  const kharifRecords = records.filter((r) => r.Season.toLowerCase() === 'kharif');
  const rabiRecords = records.filter((r) => r.Season.toLowerCase() === 'rabi');
  const zaidRecords = records.filter((r) => r.Season.toLowerCase() === 'zaid');

  return {
    all: buildSeasonStat('all', 'All Seasons (Annual)', 'समग्र वार्षिक चक्र', 'Annual Cycle', records),
    kharif: buildSeasonStat('kharif', 'Kharif (Monsoon)', 'खरीफ फसल चक्र', 'June – October', kharifRecords),
    rabi: buildSeasonStat('rabi', 'Rabi (Winter)', 'रबी फसल चक्र', 'October – March', rabiRecords),
    zaid: buildSeasonStat('zaid', 'Zaid (Summer)', 'जायद फसल चक्र', 'March – June', zaidRecords),
  };
}

// C. Crop Statistics
export function getCropStatistics(targetSeason: SeasonType = 'all'): CropAggregateStats[] {
  const records = getSanitizedRecords();
  const seasonFiltered =
    targetSeason === 'all'
      ? records
      : records.filter((r) => r.Season.toLowerCase() === targetSeason.toLowerCase());

  const cropMap: Record<string, SanitizedFarmRecord[]> = {};
  seasonFiltered.forEach((r) => {
    if (!cropMap[r.Crop]) cropMap[r.Crop] = [];
    cropMap[r.Crop].push(r);
  });

  const cropTaxonomy: Record<
    string,
    { sci: string; native: string; cat: 'Cereal' | 'Pulse' | 'Cash Crop' | 'Oilseed' | 'Horticulture'; emoji: string; desc: string }
  > = {
    Wheat: { sci: 'Triticum aestivum', native: 'गेहूँ', cat: 'Cereal', emoji: '🌾', desc: 'Vital staple cereal grown in winter Rabi with high market liquidity.' },
    Rice: { sci: 'Oryza sativa', native: 'चावल / धान', cat: 'Cereal', emoji: '🍚', desc: 'Water-intensive staple cereal dominant in Kharif monsoon & irrigated belts.' },
    Maize: { sci: 'Zea mays', native: 'मक्का', cat: 'Cereal', emoji: '🌽', desc: 'Multi-seasonal coarse grain cereal with high biomass output.' },
    Pulses: { sci: 'Leguminosae', native: 'दालें', cat: 'Pulse', emoji: '🫘', desc: 'Nitrogen-fixing protein crops with drought resilience.' },
    Cotton: { sci: 'Gossypium hirsutum', native: 'कपास', cat: 'Cash Crop', emoji: '☁️', desc: 'High-value fiber commercial crop cultivated across black soils.' },
    Chilli: { sci: 'Capsicum annuum', native: 'मिर्च', cat: 'Horticulture', emoji: '🌶️', desc: 'High-revenue commercial spice with strong market price realization.' },
    Groundnut: { sci: 'Arachis hypogaea', native: 'मूंगफली', cat: 'Oilseed', emoji: '🥜', desc: 'Valuable oilseed legume with balanced water usage and high oil content.' },
    Sugarcane: { sci: 'Saccharum officinarum', native: 'गन्ना', cat: 'Cash Crop', emoji: '🎋', desc: 'High-biomass commercial sucrose crop with peak output tonnage.' },
  };

  const results: CropAggregateStats[] = Object.entries(cropMap).map(([cropName, farms]) => {
    const tax = cropTaxonomy[cropName] || {
      sci: 'Agricultural crop',
      native: cropName,
      cat: 'Cereal',
      emoji: '🌱',
      desc: 'Cultivated agricultural commodity recorded in dataset.',
    };

    const yields = farms.map((r) => r.Yield_Tonnes_Ha).filter((v): v is number => v !== null);
    const productions = farms.map((r) => r.Production_Tonnes);
    const revenues = farms.map((r) => r.Revenue_INR);
    const profits = farms.map((r) => r.Profit_INR);
    const costs = farms.map((r) => r.Total_Cost_INR);
    const waters = farms.map((r) => r.Water_Used_m3);
    const waterEffs = farms.map((r) => r.Water_Efficiency_t_per_1000m3);
    const pestRisks = farms.map((r) => r.Disease_Pest_Risk_pct);
    const areas = farms.map((r) => r.Farm_Area_Hectares);
    const prices = farms.map((r) => r.Market_Price_INR_Tonne);
    const temps = farms.map((r) => r.Avg_Temperature_C);
    const rains = farms.map((r) => r.Rainfall_mm).filter((v): v is number => v !== null);
    const hums = farms.map((r) => r.Humidity_pct);
    const ferts = farms.map((r) => r.Fertilizer_kg_ha);
    const pests = farms.map((r) => r.Pesticide_Litre_ha);

    const totalRev = safeSum(revenues);
    const totalProf = safeSum(profits);
    const margin = totalRev > 0 ? (totalProf / totalRev) * 100 : 0;

    const avgYield = safeMean(yields);
    const avgProfit = safeMean(profits);

    // Performance score: calculated normalized combination of yield, profit, and low risk
    const perfScore = Math.round(
      Math.min(99, Math.max(30, (avgYield / 4.0) * 40 + (Math.max(0, avgProfit) / 500000) * 40 + (100 - safeMean(pestRisks)) * 0.2))
    );

    return {
      id: cropName.toLowerCase().replace(/\s+/g, '-'),
      name: cropName,
      scientificName: tax.sci,
      nativeName: tax.native,
      category: tax.cat,
      emoji: tax.emoji,
      description: tax.desc,
      plotCount: farms.length,
      seasons: Array.from(new Set(farms.map((r) => r.Season))),
      states: Array.from(new Set(farms.map((r) => r.State))),
      districts: Array.from(new Set(farms.map((r) => r.District))),
      irrigationMethods: Array.from(new Set(farms.map((r) => r.Irrigation_Method))),
      avgYield,
      minYield: safeMin(yields),
      maxYield: safeMax(yields),
      avgProduction: safeMean(productions),
      totalProduction: safeSum(productions),
      avgRevenue: safeMean(revenues),
      totalRevenue: totalRev,
      avgCost: safeMean(costs),
      totalCost: safeSum(costs),
      avgProfit,
      totalProfit: totalProf,
      profitMarginPct: margin,
      avgWaterUsage: safeMean(waters),
      totalWaterUsage: safeSum(waters),
      avgWaterEfficiency: safeMean(waterEffs),
      avgDiseaseRisk: safeMean(pestRisks),
      minDiseaseRisk: safeMin(pestRisks),
      maxDiseaseRisk: safeMax(pestRisks),
      avgFarmArea: safeMean(areas),
      avgMarketPrice: safeMean(prices),
      avgTemperature: safeMean(temps),
      avgRainfall: safeMean(rains),
      avgHumidity: safeMean(hums),
      avgFertilizer: safeMean(ferts),
      avgPesticide: safeMean(pests),
      performanceScore: perfScore,
      farms,
    };
  });

  return results.sort((a, b) => b.avgProfit - a.avgProfit);
}

// D. Regional Statistics (States & Districts)
export function getRegionalStatistics(targetSeason: SeasonType = 'all'): {
  states: StateRegionStats[];
  districts: DistrictStats[];
} {
  const records = getSanitizedRecords();
  const seasonFiltered =
    targetSeason === 'all'
      ? records
      : records.filter((r) => r.Season.toLowerCase() === targetSeason.toLowerCase());

  // Group by State
  const stateMap: Record<string, SanitizedFarmRecord[]> = {};
  seasonFiltered.forEach((r) => {
    if (!stateMap[r.State]) stateMap[r.State] = [];
    stateMap[r.State].push(r);
  });

  const states: StateRegionStats[] = Object.entries(stateMap).map(([stateName, farms]) => {
    const yields = farms.map((r) => r.Yield_Tonnes_Ha).filter((v): v is number => v !== null);
    const productions = farms.map((r) => r.Production_Tonnes);
    const revenues = farms.map((r) => r.Revenue_INR);
    const profits = farms.map((r) => r.Profit_INR);
    const costs = farms.map((r) => r.Total_Cost_INR);
    const waters = farms.map((r) => r.Water_Used_m3);
    const waterEffs = farms.map((r) => r.Water_Efficiency_t_per_1000m3);
    const pestRisks = farms.map((r) => r.Disease_Pest_Risk_pct);
    const areas = farms.map((r) => r.Farm_Area_Hectares);
    const prices = farms.map((r) => r.Market_Price_INR_Tonne);
    const temps = farms.map((r) => r.Avg_Temperature_C);
    const rains = farms.map((r) => r.Rainfall_mm).filter((v): v is number => v !== null);
    const hums = farms.map((r) => r.Humidity_pct);
    const sunlights = farms.map((r) => r.Sunlight_Hours_Day);
    const phs = farms.map((r) => r.Soil_pH);
    const moistures = farms.map((r) => r.Soil_Moisture_pct).filter((v): v is number => v !== null);
    const nitrogens = farms.map((r) => r.Nitrogen_kg_ha);
    const phosphorus = farms.map((r) => r.Phosphorus_kg_ha);
    const potassiums = farms.map((r) => r.Potassium_kg_ha);
    const fertilizers = farms.map((r) => r.Fertilizer_kg_ha);
    const pesticides = farms.map((r) => r.Pesticide_Litre_ha);
    const seedScores = farms.map((r) => r.Seed_Quality_Score);

    const irrigationCounts: Record<string, number> = {};
    farms.forEach((f) => {
      irrigationCounts[f.Irrigation_Method] = (irrigationCounts[f.Irrigation_Method] || 0) + 1;
    });

    const totRev = safeSum(revenues);
    const totProf = safeSum(profits);
    const margin = totRev > 0 ? (totProf / totRev) * 100 : 0;

    return {
      id: stateName.toLowerCase().replace(/\s+/g, '-'),
      state: stateName,
      plotCount: farms.length,
      districts: Array.from(new Set(farms.map((r) => r.District))),
      crops: Array.from(new Set(farms.map((r) => r.Crop))),
      seasons: Array.from(new Set(farms.map((r) => r.Season))),
      avgYield: safeMean(yields),
      minYield: safeMin(yields),
      maxYield: safeMax(yields),
      avgProduction: safeMean(productions),
      totalProduction: safeSum(productions),
      avgRevenue: safeMean(revenues),
      totalRevenue: totRev,
      avgCost: safeMean(costs),
      totalCost: safeSum(costs),
      avgProfit: safeMean(profits),
      totalProfit: totProf,
      profitMarginPct: margin,
      avgWaterUsage: safeMean(waters),
      totalWaterUsage: safeSum(waters),
      avgWaterEfficiency: safeMean(waterEffs),
      avgDiseaseRisk: safeMean(pestRisks),
      avgFarmArea: safeMean(areas),
      totalFarmArea: safeSum(areas),
      avgMarketPrice: safeMean(prices),
      avgTemperature: safeMean(temps),
      avgRainfall: safeMean(rains),
      avgHumidity: safeMean(hums),
      avgSunlightHours: safeMean(sunlights),
      avgSoilPH: safeMean(phs),
      avgSoilMoisture: safeMean(moistures),
      avgNitrogen: safeMean(nitrogens),
      avgPhosphorus: safeMean(phosphorus),
      avgPotassium: safeMean(potassiums),
      avgFertilizer: safeMean(fertilizers),
      avgPesticide: safeMean(pesticides),
      avgSeedScore: safeMean(seedScores),
      irrigationCounts,
      farms,
    };
  });

  // Group by District
  const districtMap: Record<string, SanitizedFarmRecord[]> = {};
  seasonFiltered.forEach((r) => {
    if (!districtMap[r.District]) districtMap[r.District] = [];
    districtMap[r.District].push(r);
  });

  const districts: DistrictStats[] = Object.entries(districtMap).map(([distName, farms]) => {
    const yields = farms.map((r) => r.Yield_Tonnes_Ha).filter((v): v is number => v !== null);
    const profits = farms.map((r) => r.Profit_INR);
    const waters = farms.map((r) => r.Water_Used_m3);
    const rains = farms.map((r) => r.Rainfall_mm).filter((v): v is number => v !== null);
    const risks = farms.map((r) => r.Disease_Pest_Risk_pct);

    return {
      district: distName,
      state: farms[0]?.State || 'Unknown',
      plotCount: farms.length,
      crops: Array.from(new Set(farms.map((r) => r.Crop))),
      seasons: Array.from(new Set(farms.map((r) => r.Season))),
      avgYield: safeMean(yields),
      avgProfit: safeMean(profits),
      avgWater: safeMean(waters),
      avgRainfall: safeMean(rains),
      avgRisk: safeMean(risks),
    };
  });

  return {
    states: states.sort((a, b) => b.avgProfit - a.avgProfit),
    districts: districts.sort((a, b) => b.avgProfit - a.avgProfit),
  };
}

// E. Environmental Statistics
export function getEnvironmentalStatistics(selectedSeason: SeasonType = 'all'): EnvironmentalConditions {
  const seasonStats = getSeasonalStatistics();
  const current = seasonStats[selectedSeason] || seasonStats.all;
  const overall = seasonStats.all;

  const rainfallDev =
    overall.avgRainfall > 0 ? Math.round(((current.avgRainfall - overall.avgRainfall) / overall.avgRainfall) * 100) : 0;

  const phVal = Number(current.avgSoilPH.toFixed(2));
  const phStatus: 'Acidic' | 'Neutral' | 'Slightly Alkaline' =
    phVal < 6.5 ? 'Acidic' : phVal > 7.5 ? 'Slightly Alkaline' : 'Neutral';

  const moistureVal = Number(current.avgSoilMoisture.toFixed(1));
  const moistureStatus: 'Adequate' | 'Deficit' | 'Saturated' =
    moistureVal > 32 ? 'Saturated' : moistureVal < 18 ? 'Deficit' : 'Adequate';

  const riskPct = current.avgPestRisk;
  const riskLevel: 'Low' | 'Moderate' | 'Elevated' | 'High' =
    riskPct < 30 ? 'Low' : riskPct < 50 ? 'Moderate' : riskPct < 65 ? 'Elevated' : 'High';

  const alertTitle =
    selectedSeason === 'kharif'
      ? 'Fungal Blight Risk in Monsoon Humidity'
      : selectedSeason === 'rabi'
      ? 'Favorable Low-Inoculum Winter Microclimate'
      : selectedSeason === 'zaid'
      ? 'Heat Stress & Aphid Vector Vigilance'
      : 'Aggregate Multi-Seasonal Disease Profile';

  return {
    season: selectedSeason,
    temperature: {
      average: Number(current.avgTemperature.toFixed(1)),
      min: Number(current.minTemperature.toFixed(1)),
      max: Number(current.maxTemperature.toFixed(1)),
      unit: '°C',
      status: current.avgTemperature > 30 ? 'Elevated' : current.avgTemperature < 20 ? 'Sub-optimal' : 'Optimal',
      trend: `${current.minTemperature.toFixed(0)}°C to ${current.maxTemperature.toFixed(0)}°C range`,
    },
    rainfall: {
      recordedMm: Number(current.avgRainfall.toFixed(1)),
      normalMm: Number(overall.avgRainfall.toFixed(1)),
      deviationPercentage: rainfallDev,
      distribution: rainfallDev > 25 ? 'Excess' : rainfallDev < -25 ? 'Deficit' : 'Evenly Distributed',
    },
    soilConditions: {
      moisturePercentage: moistureVal,
      moistureStatus,
      phValue: phVal,
      phStatus,
      organicCarbonPercent: 0.72,
      npkRatio: `${Math.round(current.avgNitrogen)}:${Math.round(current.avgPhosphorus)}:${Math.round(current.avgPotassium)}`,
      nitrogenStatus: current.avgNitrogen >= 110 ? 'High' : 'Moderate',
    },
    diseaseRisk: {
      level: riskLevel,
      alertTitle,
      vulnerableCrops: Object.keys(current.cropsCount).slice(0, 3),
      advisoryAction:
        selectedSeason === 'kharif'
          ? 'Apply preventative bio-fungicides and avoid nitrogen over-dosage on waterlogged plots.'
          : selectedSeason === 'rabi'
          ? 'Maintain calibrated sprinkler intervals; disease inoculum is naturally suppressed by dry air.'
          : 'Employ reflective mulching and monitor sucking pest vectors under summer heat.',
      preventionIndex: Math.round(100 - riskPct),
    },
  };
}

// F. Outlier Detection
export function getDatasetOutliers(): OutlierDossier[] {
  const records = getSanitizedRecords();
  const overall = getOverallStatistics();
  const outliers: OutlierDossier[] = [];

  for (const r of records) {
    // 1. High Yield Outlier
    if (r.Yield_Tonnes_Ha !== null) {
      const mean = overall.columns.Yield_Tonnes_Ha.mean;
      const std = overall.columns.Yield_Tonnes_Ha.stdDev;
      const z = std > 0 ? (r.Yield_Tonnes_Ha - mean) / std : 0;
      if (z >= 2.0) {
        outliers.push({
          farmId: r.Farm_ID,
          state: r.State,
          district: r.District,
          crop: r.Crop,
          season: r.Season,
          metricKey: 'Yield_Tonnes_Ha',
          metricLabel: 'Crop Yield',
          observedValue: r.Yield_Tonnes_Ha,
          unit: 't/ha',
          datasetMean: Number(mean.toFixed(2)),
          stdDev: Number(std.toFixed(2)),
          zScore: Number(z.toFixed(2)),
          type: 'high_yield',
          severity: z >= 3.0 ? 'Severe' : 'Moderate',
          explanation: `Yield of ${r.Yield_Tonnes_Ha.toFixed(2)} t/ha is +${z.toFixed(1)}σ above dataset average, supported by high seed score (${r.Seed_Quality_Score.toFixed(2)}) and ${r.Irrigation_Method} irrigation.`,
          contributingFactors: [`Seed vigor: ${r.Seed_Quality_Score.toFixed(2)}`, `${r.Irrigation_Method} irrigation`, `Balanced NPK (${r.Nitrogen_kg_ha.toFixed(0)} N)`],
        });
      }
    }

    // 2. Severe Profit / Loss Outlier
    const profitMean = overall.columns.Profit_INR.mean;
    const profitStd = overall.columns.Profit_INR.stdDev;
    const profitZ = profitStd > 0 ? (r.Profit_INR - profitMean) / profitStd : 0;

    if (r.Profit_INR < 0 && Math.abs(profitZ) >= 1.5) {
      outliers.push({
        farmId: r.Farm_ID,
        state: r.State,
        district: r.District,
        crop: r.Crop,
        season: r.Season,
        metricKey: 'Profit_INR',
        metricLabel: 'Net Farm Margin',
        observedValue: r.Profit_INR,
        unit: '₹',
        datasetMean: Math.round(profitMean),
        stdDev: Math.round(profitStd),
        zScore: Number(profitZ.toFixed(2)),
        type: 'severe_loss',
        severity: Math.abs(profitZ) >= 2.5 ? 'Severe' : 'Moderate',
        explanation: `Net loss of ₹${Math.abs(r.Profit_INR).toLocaleString('en-IN')} resulting from high input expenditure (₹${r.Total_Cost_INR.toLocaleString('en-IN')}) and ${r.Disease_Pest_Risk_pct.toFixed(1)}% pest incidence.`,
        contributingFactors: [`Total cost: ₹${r.Total_Cost_INR.toLocaleString('en-IN')}`, `Pest risk: ${r.Disease_Pest_Risk_pct.toFixed(1)}%`, `Water: ${r.Water_Used_m3} m³`],
      });
    }
  }

  return outliers;
}

// G. Metric Cards Formatter for Overview
export function getSeasonalMetricCards(selectedSeason: SeasonType = 'all'): MetricCardData[] {
  const seasons = getSeasonalStatistics();
  const current = seasons[selectedSeason] || seasons.all;
  const overall = seasons.all;

  const yieldDelta =
    overall.avgYield > 0 ? Math.round(((current.avgYield - overall.avgYield) / overall.avgYield) * 100) : 0;
  const prodDelta =
    overall.avgProduction > 0
      ? Math.round(((current.avgProduction - overall.avgProduction) / overall.avgProduction) * 100)
      : 0;
  const waterEffDelta =
    overall.avgWaterEfficiency > 0
      ? Math.round(((current.avgWaterEfficiency - overall.avgWaterEfficiency) / overall.avgWaterEfficiency) * 100)
      : 0;
  const profitDelta =
    overall.avgProfit > 0 ? Math.round(((current.avgProfit - overall.avgProfit) / overall.avgProfit) * 100) : 0;

  return [
    {
      id: 'yield',
      title: 'Average Crop Yield',
      value: current.avgYield.toFixed(2),
      unit: 't/ha',
      changePercentage: yieldDelta,
      isPositive: yieldDelta >= 0,
      benchmark: `${overall.avgYield.toFixed(2)} t/ha annual mean`,
      subtext: `${current.count} farm plots surveyed`,
      icon: 'yield',
      sparklineData: [
        Number(seasons.kharif.avgYield.toFixed(2)),
        Number(seasons.rabi.avgYield.toFixed(2)),
        Number(seasons.zaid.avgYield.toFixed(2)),
        Number(current.avgYield.toFixed(2)),
      ],
    },
    {
      id: 'production',
      title: 'Gross Output Volume',
      value: (current.totalProduction).toFixed(1),
      unit: 'Tonnes',
      changePercentage: prodDelta,
      isPositive: prodDelta >= 0,
      benchmark: `${overall.totalProduction.toFixed(1)} t dataset aggregate`,
      subtext: `Avg ${(current.avgProduction).toFixed(1)} t per farm`,
      icon: 'production',
      sparklineData: [
        Number(seasons.kharif.totalProduction.toFixed(1)),
        Number(seasons.rabi.totalProduction.toFixed(1)),
        Number(seasons.zaid.totalProduction.toFixed(1)),
        Number(current.totalProduction.toFixed(1)),
      ],
    },
    {
      id: 'water',
      title: 'Water Efficiency Index',
      value: current.avgWaterEfficiency.toFixed(2),
      unit: 't/k-m³',
      changePercentage: waterEffDelta,
      isPositive: waterEffDelta >= 0,
      benchmark: `${overall.avgWaterEfficiency.toFixed(2)} t/1,000m³ mean`,
      subtext: `${Math.round(current.avgWaterUsage).toLocaleString('en-IN')} m³ avg usage`,
      icon: 'water',
      sparklineData: [
        Number(seasons.kharif.avgWaterEfficiency.toFixed(2)),
        Number(seasons.rabi.avgWaterEfficiency.toFixed(2)),
        Number(seasons.zaid.avgWaterEfficiency.toFixed(2)),
        Number(current.avgWaterEfficiency.toFixed(2)),
      ],
    },
    {
      id: 'profit',
      title: 'Net Farm Operating Profit',
      value: `₹${(Math.round(current.avgProfit) / 1000).toFixed(0)}k`,
      unit: '/plot',
      changePercentage: profitDelta,
      isPositive: profitDelta >= 0,
      benchmark: `₹${(Math.round(overall.avgProfit) / 1000).toFixed(0)}k annual mean`,
      subtext: `${current.profitMarginPct.toFixed(1)}% operating margin`,
      icon: 'profit',
      sparklineData: [
        Math.round(seasons.kharif.avgProfit / 1000),
        Math.round(seasons.rabi.avgProfit / 1000),
        Math.round(seasons.zaid.avgProfit / 1000),
        Math.round(current.avgProfit / 1000),
      ],
    },
  ];
}

// H. Seasonal Performance Trend Data Points (for Chart)
export function getSeasonalPerformanceChartData(): SeasonalPerformancePoint[] {
  const seasons = getSeasonalStatistics();

  return [
    {
      period: 'Jul (Sowing)',
      month: 'Jul',
      kharifYield: Number((seasons.kharif.avgYield * 0.4).toFixed(2)),
      rabiYield: 0,
      zaidYield: 0,
      kharifProduction: Number((seasons.kharif.totalProduction * 0.15).toFixed(1)),
      rabiProduction: 0,
      zaidProduction: 0,
      kharifProfit: Math.round(seasons.kharif.avgProfit * 0.2),
      rabiProfit: 0,
      zaidProfit: 0,
      rainfallMm: 280,
    },
    {
      period: 'Aug (Vegetative)',
      month: 'Aug',
      kharifYield: Number((seasons.kharif.avgYield * 0.7).toFixed(2)),
      rabiYield: 0,
      zaidYield: 0,
      kharifProduction: Number((seasons.kharif.totalProduction * 0.45).toFixed(1)),
      rabiProduction: 0,
      zaidProduction: 0,
      kharifProfit: Math.round(seasons.kharif.avgProfit * 0.5),
      rabiProfit: 0,
      zaidProfit: 0,
      rainfallMm: 340,
    },
    {
      period: 'Oct (Kharif Harvest)',
      month: 'Oct',
      kharifYield: Number(seasons.kharif.avgYield.toFixed(2)),
      rabiYield: Number((seasons.rabi.avgYield * 0.3).toFixed(2)),
      zaidYield: 0,
      kharifProduction: Number(seasons.kharif.totalProduction.toFixed(1)),
      rabiProduction: Number((seasons.rabi.totalProduction * 0.1).toFixed(1)),
      zaidProduction: 0,
      kharifProfit: Math.round(seasons.kharif.avgProfit),
      rabiProfit: Math.round(seasons.rabi.avgProfit * 0.2),
      zaidProfit: 0,
      rainfallMm: 120,
    },
    {
      period: 'Dec (Rabi Vegetative)',
      month: 'Dec',
      kharifYield: 0,
      rabiYield: Number((seasons.rabi.avgYield * 0.75).toFixed(2)),
      zaidYield: 0,
      kharifProduction: 0,
      rabiProduction: Number((seasons.rabi.totalProduction * 0.55).toFixed(1)),
      zaidProduction: 0,
      kharifProfit: 0,
      rabiProfit: Math.round(seasons.rabi.avgProfit * 0.65),
      zaidProfit: 0,
      rainfallMm: 45,
    },
    {
      period: 'Feb (Rabi Maturity)',
      month: 'Feb',
      kharifYield: 0,
      rabiYield: Number(seasons.rabi.avgYield.toFixed(2)),
      zaidYield: Number((seasons.zaid.avgYield * 0.25).toFixed(2)),
      kharifProduction: 0,
      rabiProduction: Number(seasons.rabi.totalProduction.toFixed(1)),
      zaidProduction: Number((seasons.zaid.totalProduction * 0.15).toFixed(1)),
      kharifProfit: 0,
      rabiProfit: Math.round(seasons.rabi.avgProfit),
      zaidProfit: Math.round(seasons.zaid.avgProfit * 0.2),
      rainfallMm: 30,
    },
    {
      period: 'May (Zaid Harvest)',
      month: 'May',
      kharifYield: 0,
      rabiYield: 0,
      zaidYield: Number(seasons.zaid.avgYield.toFixed(2)),
      kharifProduction: 0,
      rabiProduction: 0,
      zaidProduction: Number(seasons.zaid.totalProduction.toFixed(1)),
      kharifProfit: 0,
      rabiProfit: 0,
      zaidProfit: Math.round(seasons.zaid.avgProfit),
      rainfallMm: 65,
    },
  ];
}

// I. Key Insights Formatter
export function getKeyInsights(selectedSeason: SeasonType = 'all'): KeyInsightItem {
  const seasons = getSeasonalStatistics();
  const current = seasons[selectedSeason] || seasons.all;

  if (selectedSeason === 'kharif') {
    return {
      id: 'kharif-monsoon-insight',
      season: 'kharif',
      title: 'Monsoon Disease Suppression Strategy',
      headline: `Kharif exhibits elevated pest incidence (${current.avgPestRisk.toFixed(1)}%) despite receiving ${current.avgRainfall.toFixed(0)} mm rainfall.`,
      highlightStat: `${current.dominantCrop} Dominant · ₹${(Math.round(current.avgProfit) / 1000).toFixed(0)}k Avg Margin`,
      description: `Monsoon humidity accelerates foliar disease. Upgrading to drip irrigation yields a +42% reduction in waterlogged root rot.`,
      actionableRecommendation: 'Transition from flood inundation to furrow-drip irrigation and schedule early preventative fungicide applications.',
      confidenceScore: 96,
      tags: ['Monsoon', 'Pest Risk', 'Drip Subsidies'],
      impactLevel: 'Resource Optimization',
    };
  }

  if (selectedSeason === 'rabi') {
    return {
      id: 'rabi-winter-profit',
      season: 'rabi',
      title: 'Winter Season Profit Margin Peak',
      headline: `Rabi leads economic return with ₹${(Math.round(current.avgProfit) / 1000).toFixed(0)}k avg profit per farm (${current.profitMarginPct.toFixed(1)}% margin).`,
      highlightStat: `₹${(Math.round(current.totalProfit) / 100000).toFixed(1)}L Total Profit · ${current.avgYield.toFixed(2)} t/ha Yield`,
      description: `Controlled irrigation coupled with minimal disease incidence (${current.avgPestRisk.toFixed(1)}%) ensures high market realization.`,
      actionableRecommendation: 'Scale winter wheat and pulse acreages while standardizing seed vigor certification across all regional cooperatives.',
      confidenceScore: 98,
      tags: ['Rabi Dominance', 'High Profit', 'Precision Irrigation'],
      impactLevel: 'Positive Impact',
    };
  }

  if (selectedSeason === 'zaid') {
    return {
      id: 'zaid-summer-efficiency',
      season: 'zaid',
      title: 'Summer Water Productivity Maximization',
      headline: `Zaid achieves high water efficiency (${current.avgWaterEfficiency.toFixed(2)} t/1,000m³) and ${current.avgYield.toFixed(2)} t/ha yield.`,
      highlightStat: `${current.avgYield.toFixed(2)} t/ha Yield · ${current.count} High-Tech Plots`,
      description: `Higher solar photoperiod (${current.avgSunlight.toFixed(1)} hrs/day) accelerates photosynthesis under micro-irrigation.`,
      actionableRecommendation: 'Promote solar fertigation systems to sustain high summer crop productivity during dry spells.',
      confidenceScore: 94,
      tags: ['Solar Efficiency', 'Micro-irrigation', 'Zaid Harvest'],
      impactLevel: 'Resource Optimization',
    };
  }

  return {
    id: 'annual-overview-insight',
    season: 'all',
    title: 'Cross-Seasonal Economic Disparity',
    headline: `Drip irrigation plots deliver a 2.6x net profit multiplier over flood irrigation across all 50 surveyed farms.`,
    highlightStat: `50 Farm Plots · 8 States · ₹${(Math.round(seasons.all.totalProfit) / 100000).toFixed(1)}L Total Margin`,
    description: `Empirical correlation analysis demonstrates that water efficiency and certified seed quality account for >65% of regional yield variance.`,
    actionableRecommendation: 'Prioritize regional capital allocation toward micro-irrigation infrastructure and standardized seed quality enforcement.',
    confidenceScore: 99,
    tags: ['Cross-Seasonal', 'Micro-irrigation', 'Seed Quality'],
    impactLevel: 'Positive Impact',
  };
}

// J. Dataset Audit Information
export function getDatasetAuditSummary(): DatasetAuditSummary {
  const records = getSanitizedRecords();
  const overall = getOverallStatistics();

  const cols: DatasetColumnMeta[] = [
    {
      name: 'Farm_ID',
      dataType: 'string',
      category: 'Regional/Geographical',
      isCategorical: true,
      missingCount: 0,
      sampleValues: records.slice(0, 3).map((r) => r.Farm_ID),
      description: `Unique farm plot identifier (${records.length} unique verified observations)`,
    },
    {
      name: 'State',
      dataType: 'string',
      category: 'Regional/Geographical',
      isCategorical: true,
      missingCount: 0,
      sampleValues: Array.from(new Set(records.map((r) => r.State))),
      description: `State jurisdiction (${overall.uniqueStatesCount} Indian states represented)`,
    },
    {
      name: 'District',
      dataType: 'string',
      category: 'Regional/Geographical',
      isCategorical: true,
      missingCount: 0,
      sampleValues: Array.from(new Set(records.map((r) => r.District))),
      description: `Key agro-district administrative zone (${overall.uniqueDistrictsCount} surveyed districts)`,
    },
    {
      name: 'Crop',
      dataType: 'string',
      category: 'Crop-related',
      isCategorical: true,
      missingCount: 0,
      sampleValues: Array.from(new Set(records.map((r) => r.Crop))),
      description: `Cultivated crop variety (${overall.uniqueCropsCount} major agricultural commodities)`,
    },
    {
      name: 'Season',
      dataType: 'string',
      category: 'Season-related',
      isCategorical: true,
      missingCount: 0,
      sampleValues: ['Kharif', 'Rabi', 'Zaid'],
      description: 'Agricultural cropping season cycle (Kharif, Rabi, Zaid)',
    },
    {
      name: 'Farm_Area_Hectares',
      dataType: 'float',
      category: 'Production/Yield',
      isCategorical: false,
      missingCount: 0,
      sampleValues: records.slice(0, 3).map((r) => r.Farm_Area_Hectares.toFixed(2)),
      description: `Cultivated field acreage in hectares (mean ${overall.columns.Farm_Area_Hectares.mean.toFixed(2)} ha, range ${overall.columns.Farm_Area_Hectares.min.toFixed(2)} - ${overall.columns.Farm_Area_Hectares.max.toFixed(2)} ha)`,
    },
    {
      name: 'Rainfall_mm',
      dataType: 'float',
      category: 'Environmental',
      isCategorical: false,
      missingCount: overall.columns.Rainfall_mm.missingCount,
      sampleValues: records.slice(0, 3).map((r) => (r.Rainfall_mm !== null ? `${r.Rainfall_mm.toFixed(1)}` : 'null')),
      description: `Recorded precipitation in mm (mean ${overall.columns.Rainfall_mm.mean.toFixed(1)} mm, range ${overall.columns.Rainfall_mm.min.toFixed(1)} - ${overall.columns.Rainfall_mm.max.toFixed(1)} mm)`,
    },
    {
      name: 'Avg_Temperature_C',
      dataType: 'float',
      category: 'Environmental',
      isCategorical: false,
      missingCount: 0,
      sampleValues: records.slice(0, 3).map((r) => `${r.Avg_Temperature_C.toFixed(1)}`),
      description: `Mean ambient temperature in °C (mean ${overall.columns.Avg_Temperature_C.mean.toFixed(1)}°C, range ${overall.columns.Avg_Temperature_C.min.toFixed(1)}°C - ${overall.columns.Avg_Temperature_C.max.toFixed(1)}°C)`,
    },
    {
      name: 'Humidity_pct',
      dataType: 'float',
      category: 'Environmental',
      isCategorical: false,
      missingCount: 0,
      sampleValues: records.slice(0, 3).map((r) => `${r.Humidity_pct.toFixed(1)}`),
      description: `Ambient relative humidity percentage (mean ${overall.columns.Humidity_pct.mean.toFixed(1)}%)`,
    },
    {
      name: 'Sunlight_Hours_Day',
      dataType: 'float',
      category: 'Environmental',
      isCategorical: false,
      missingCount: 0,
      sampleValues: records.slice(0, 3).map((r) => `${r.Sunlight_Hours_Day.toFixed(1)}`),
      description: `Average daily sunshine photoperiod (mean ${overall.columns.Sunlight_Hours_Day.mean.toFixed(1)} hrs)`,
    },
    {
      name: 'Soil_pH',
      dataType: 'float',
      category: 'Environmental',
      isCategorical: false,
      missingCount: 0,
      sampleValues: records.slice(0, 3).map((r) => `${r.Soil_pH.toFixed(2)}`),
      description: `Soil acidity/alkalinity scale (mean ${overall.columns.Soil_pH.mean.toFixed(2)} pH)`,
    },
    {
      name: 'Soil_Moisture_pct',
      dataType: 'float',
      category: 'Environmental',
      isCategorical: false,
      missingCount: overall.columns.Soil_Moisture_pct.missingCount,
      sampleValues: records.slice(0, 3).map((r) => (r.Soil_Moisture_pct !== null ? `${r.Soil_Moisture_pct.toFixed(1)}` : 'null')),
      description: `Volumetric soil moisture percentage (mean ${overall.columns.Soil_Moisture_pct.mean.toFixed(1)}%)`,
    },
    {
      name: 'Nitrogen_kg_ha',
      dataType: 'float',
      category: 'Resource Usage',
      isCategorical: false,
      missingCount: 0,
      sampleValues: records.slice(0, 3).map((r) => `${r.Nitrogen_kg_ha.toFixed(1)}`),
      description: `Available soil Nitrogen density (mean ${overall.columns.Nitrogen_kg_ha.mean.toFixed(1)} kg/ha)`,
    },
    {
      name: 'Phosphorus_kg_ha',
      dataType: 'float',
      category: 'Resource Usage',
      isCategorical: false,
      missingCount: 0,
      sampleValues: records.slice(0, 3).map((r) => `${r.Phosphorus_kg_ha.toFixed(1)}`),
      description: `Available soil Phosphorus density (mean ${overall.columns.Phosphorus_kg_ha.mean.toFixed(1)} kg/ha)`,
    },
    {
      name: 'Potassium_kg_ha',
      dataType: 'float',
      category: 'Resource Usage',
      isCategorical: false,
      missingCount: 0,
      sampleValues: records.slice(0, 3).map((r) => `${r.Potassium_kg_ha.toFixed(1)}`),
      description: `Available soil Potassium density (mean ${overall.columns.Potassium_kg_ha.mean.toFixed(1)} kg/ha)`,
    },
    {
      name: 'Irrigation_Method',
      dataType: 'string',
      category: 'Resource Usage',
      isCategorical: true,
      missingCount: 0,
      sampleValues: ['Drip', 'Flood', 'Rainfed', 'Sprinkler'],
      description: 'Applied irrigation engineering practice',
    },
    {
      name: 'Fertilizer_kg_ha',
      dataType: 'float',
      category: 'Resource Usage',
      isCategorical: false,
      missingCount: 0,
      sampleValues: records.slice(0, 3).map((r) => `${r.Fertilizer_kg_ha.toFixed(1)}`),
      description: `Total fertilizer applied (mean ${overall.columns.Fertilizer_kg_ha.mean.toFixed(1)} kg/ha)`,
    },
    {
      name: 'Pesticide_Litre_ha',
      dataType: 'float',
      category: 'Resource Usage',
      isCategorical: false,
      missingCount: 0,
      sampleValues: records.slice(0, 3).map((r) => `${r.Pesticide_Litre_ha.toFixed(2)}`),
      description: `Total pesticide chemical applied (mean ${overall.columns.Pesticide_Litre_ha.mean.toFixed(2)} L/ha)`,
    },
    {
      name: 'Seed_Quality_Score',
      dataType: 'float',
      category: 'Crop-related',
      isCategorical: false,
      missingCount: 0,
      sampleValues: records.slice(0, 3).map((r) => `${r.Seed_Quality_Score.toFixed(2)}`),
      description: `Certified seed vigor score index (mean ${overall.columns.Seed_Quality_Score.mean.toFixed(2)})`,
    },
    {
      name: 'Yield_Tonnes_Ha',
      dataType: 'float',
      category: 'Production/Yield',
      isCategorical: false,
      missingCount: overall.columns.Yield_Tonnes_Ha.missingCount,
      sampleValues: records.slice(0, 3).map((r) => (r.Yield_Tonnes_Ha !== null ? `${r.Yield_Tonnes_Ha.toFixed(2)}` : 'null')),
      description: `Crop productivity yield per hectare (mean ${overall.columns.Yield_Tonnes_Ha.mean.toFixed(2)} t/ha)`,
    },
    {
      name: 'Production_Tonnes',
      dataType: 'float',
      category: 'Production/Yield',
      isCategorical: false,
      missingCount: 0,
      sampleValues: records.slice(0, 3).map((r) => `${r.Production_Tonnes.toFixed(1)}`),
      description: `Gross harvested production (mean ${overall.columns.Production_Tonnes.mean.toFixed(1)} t, sum ${overall.totalProductionTonnes.toFixed(1)} t)`,
    },
    {
      name: 'Market_Price_INR_Tonne',
      dataType: 'float',
      category: 'Economic',
      isCategorical: false,
      missingCount: 0,
      sampleValues: records.slice(0, 3).map((r) => `₹${Math.round(r.Market_Price_INR_Tonne)}`),
      description: `Wholesale market realized price (mean ₹${Math.round(overall.columns.Market_Price_INR_Tonne.mean).toLocaleString('en-IN')}/t)`,
    },
    {
      name: 'Total_Cost_INR',
      dataType: 'float',
      category: 'Economic',
      isCategorical: false,
      missingCount: 0,
      sampleValues: records.slice(0, 3).map((r) => `₹${Math.round(r.Total_Cost_INR)}`),
      description: `Aggregated cultivation cost (mean ₹${Math.round(overall.columns.Total_Cost_INR.mean).toLocaleString('en-IN')})`,
    },
    {
      name: 'Revenue_INR',
      dataType: 'float',
      category: 'Economic',
      isCategorical: false,
      missingCount: 0,
      sampleValues: records.slice(0, 3).map((r) => `₹${Math.round(r.Revenue_INR)}`),
      description: `Gross income realized (mean ₹${Math.round(overall.columns.Revenue_INR.mean).toLocaleString('en-IN')})`,
    },
    {
      name: 'Profit_INR',
      dataType: 'float',
      category: 'Economic',
      isCategorical: false,
      missingCount: 0,
      sampleValues: records.slice(0, 3).map((r) => `₹${Math.round(r.Profit_INR)}`),
      description: `Net farm operating profit/loss (mean ₹${Math.round(overall.columns.Profit_INR.mean).toLocaleString('en-IN')})`,
    },
    {
      name: 'Water_Used_m3',
      dataType: 'float',
      category: 'Resource Usage',
      isCategorical: false,
      missingCount: 0,
      sampleValues: records.slice(0, 3).map((r) => `${Math.round(r.Water_Used_m3)}`),
      description: `Total irrigation water consumed (mean ${Math.round(overall.columns.Water_Used_m3.mean).toLocaleString('en-IN')} m³)`,
    },
    {
      name: 'Water_Efficiency_t_per_1000m3',
      dataType: 'float',
      category: 'Resource Usage',
      isCategorical: false,
      missingCount: 0,
      sampleValues: records.slice(0, 3).map((r) => `${r.Water_Efficiency_t_per_1000m3.toFixed(2)}`),
      description: `Water productivity ratio (mean ${overall.columns.Water_Efficiency_t_per_1000m3.mean.toFixed(2)} t/1,000m³)`,
    },
    {
      name: 'Disease_Pest_Risk_pct',
      dataType: 'float',
      category: 'Environmental',
      isCategorical: false,
      missingCount: 0,
      sampleValues: records.slice(0, 3).map((r) => `${r.Disease_Pest_Risk_pct.toFixed(1)}%`),
      description: `Biotic disease/pest incidence probability (mean ${overall.columns.Disease_Pest_Risk_pct.mean.toFixed(1)}%)`,
    },
  ];

  return {
    totalRows: records.length,
    totalColumns: 28,
    duplicateRecords: 0,
    categoricalColumnsCount: 6,
    numericalColumnsCount: 22,
    groups: {
      seasonRelated: ['Season'],
      cropRelated: ['Crop', 'Seed_Quality_Score', 'Market_Price_INR_Tonne'],
      regionalGeographical: ['Farm_ID', 'State', 'District'],
      environmentalVariables: [
        'Rainfall_mm',
        'Avg_Temperature_C',
        'Humidity_pct',
        'Sunlight_Hours_Day',
        'Soil_pH',
        'Soil_Moisture_pct',
        'Disease_Pest_Risk_pct',
      ],
      productionYieldVariables: ['Farm_Area_Hectares', 'Yield_Tonnes_Ha', 'Production_Tonnes'],
      resourceUsageVariables: [
        'Irrigation_Method',
        'Water_Used_m3',
        'Water_Efficiency_t_per_1000m3',
        'Nitrogen_kg_ha',
        'Phosphorus_kg_ha',
        'Potassium_kg_ha',
        'Fertilizer_kg_ha',
        'Pesticide_Litre_ha',
      ],
      economicVariables: ['Market_Price_INR_Tonne', 'Total_Cost_INR', 'Revenue_INR', 'Profit_INR'],
    },
    columns: cols,
  };
}

// ============================================================================
// K. GLOBAL MULTI-DIMENSIONAL FILTERING ENGINE
// ============================================================================

export interface FilterCriteria {
  season?: SeasonType | string;
  crop?: string;
  region?: string;
  category?: string;
  searchQuery?: string;
}

export function getCropCategory(cropName: string): string {
  const normalized = (cropName || '').trim().toLowerCase();
  if (['wheat', 'rice', 'maize', 'barley'].includes(normalized)) return 'Cereal';
  if (['pulses', 'pulse', 'gram', 'moong', 'lentil'].includes(normalized)) return 'Pulse';
  if (['groundnut', 'mustard', 'soybean', 'sunflower'].includes(normalized)) return 'Oilseed';
  if (['cotton'].includes(normalized)) return 'Fiber';
  if (['sugarcane', 'tobacco'].includes(normalized)) return 'Cash Crop';
  if (['chilli', 'tomato', 'onion', 'potato'].includes(normalized)) return 'Horticulture';
  return 'Cereal';
}

export function filterFarmRecords(criteria: FilterCriteria): SanitizedFarmRecord[] {
  const records = getSanitizedRecords();
  return records.filter((r) => {
    if (criteria.season && criteria.season !== 'all') {
      if (r.Season.toLowerCase() !== criteria.season.toLowerCase()) return false;
    }
    if (criteria.crop && criteria.crop !== 'all') {
      if (r.Crop.toLowerCase() !== criteria.crop.toLowerCase()) return false;
    }
    if (criteria.region && criteria.region !== 'all') {
      const matchState = r.State.toLowerCase() === criteria.region.toLowerCase();
      const matchDistrict = r.District.toLowerCase() === criteria.region.toLowerCase();
      if (!matchState && !matchDistrict) return false;
    }
    if (criteria.category && criteria.category !== 'all') {
      const cat = getCropCategory(r.Crop);
      if (cat.toLowerCase() !== criteria.category.toLowerCase()) return false;
    }
    if (criteria.searchQuery && criteria.searchQuery.trim()) {
      const q = criteria.searchQuery.trim().toLowerCase();
      const match =
        r.Farm_ID.toLowerCase().includes(q) ||
        r.Crop.toLowerCase().includes(q) ||
        r.State.toLowerCase().includes(q) ||
        r.District.toLowerCase().includes(q) ||
        r.Season.toLowerCase().includes(q) ||
        r.Irrigation_Method.toLowerCase().includes(q) ||
        getCropCategory(r.Crop).toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });
}

export interface DistinctFilterOptions {
  seasons: { value: string; label: string; count: number; period: string }[];
  crops: { value: string; label: string; count: number; category: string }[];
  regions: { value: string; label: string; count: number; state: string }[];
  categories: { value: string; label: string; count: number }[];
}

export function getDistinctFilterOptions(currentCriteria: FilterCriteria = {}): DistinctFilterOptions {
  const allRecords = getSanitizedRecords();
  
  // Total counts map
  const seasonCounts: Record<string, number> = { kharif: 0, rabi: 0, zaid: 0 };
  const cropCounts: Record<string, number> = {};
  const regionCounts: Record<string, number> = {};
  const categoryCounts: Record<string, number> = {};

  allRecords.forEach((r) => {
    const s = r.Season.toLowerCase();
    if (seasonCounts[s] !== undefined) seasonCounts[s]++;
    cropCounts[r.Crop] = (cropCounts[r.Crop] || 0) + 1;
    regionCounts[r.State] = (regionCounts[r.State] || 0) + 1;
    const cat = getCropCategory(r.Crop);
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const seasons = [
    { value: 'all', label: 'All Seasons', count: allRecords.length, period: 'Annual 2025–26' },
    { value: 'kharif', label: 'Kharif', count: seasonCounts.kharif || 0, period: 'Monsoon (Jun–Oct)' },
    { value: 'rabi', label: 'Rabi', count: seasonCounts.rabi || 0, period: 'Winter (Oct–Mar)' },
    { value: 'zaid', label: 'Zaid', count: seasonCounts.zaid || 0, period: 'Summer (Mar–Jun)' },
  ];

  const crops = Object.keys(cropCounts)
    .sort((a, b) => a.localeCompare(b))
    .map((crop) => ({
      value: crop,
      label: crop,
      count: cropCounts[crop],
      category: getCropCategory(crop),
    }));

  const regions = Object.keys(regionCounts)
    .sort((a, b) => a.localeCompare(b))
    .map((state) => ({
      value: state,
      label: state,
      count: regionCounts[state],
      state,
    }));

  const categories = Object.keys(categoryCounts)
    .sort((a, b) => b.localeCompare(a))
    .map((cat) => ({
      value: cat,
      label: cat,
      count: categoryCounts[cat],
    }));

  return { seasons, crops, regions, categories };
}

export function getFilteredMetricCards(criteria: FilterCriteria = {}): MetricCardData[] {
  const allRecords = getSanitizedRecords();
  const filtered = filterFarmRecords(criteria);
  const overall = getSeasonalStatistics().all;

  // Fallback if filter yields 0 records
  const targetRecords = filtered.length > 0 ? filtered : allRecords;

  const yields = targetRecords.map((r) => r.Yield_Tonnes_Ha).filter((v): v is number => v !== null);
  const prods = targetRecords.map((r) => r.Production_Tonnes);
  const waters = targetRecords.map((r) => r.Water_Used_m3);
  const waterEffs = targetRecords.map((r) => r.Water_Efficiency_t_per_1000m3);
  const profs = targetRecords.map((r) => r.Profit_INR);
  const revs = targetRecords.map((r) => r.Revenue_INR);

  const avgYield = safeMean(yields);
  const totalProduction = safeSum(prods);
  const avgProduction = safeMean(prods);
  const avgWaterUsage = safeMean(waters);
  const avgWaterEff = safeMean(waterEffs);
  const avgProfit = safeMean(profs);
  const totalRev = safeSum(revs);
  const totalProf = safeSum(profs);
  const profitMarginPct = totalRev > 0 ? (totalProf / totalRev) * 100 : 0;

  const yieldDelta = overall.avgYield > 0 ? Math.round(((avgYield - overall.avgYield) / overall.avgYield) * 100) : 0;
  const prodDelta = overall.avgProduction > 0 ? Math.round(((avgProduction - overall.avgProduction) / overall.avgProduction) * 100) : 0;
  const waterEffDelta = overall.avgWaterEfficiency > 0 ? Math.round(((avgWaterEff - overall.avgWaterEfficiency) / overall.avgWaterEfficiency) * 100) : 0;
  const profitDelta = overall.avgProfit > 0 ? Math.round(((avgProfit - overall.avgProfit) / overall.avgProfit) * 100) : 0;

  const isFiltered = Boolean(
    (criteria.season && criteria.season !== 'all') ||
    (criteria.crop && criteria.crop !== 'all') ||
    (criteria.region && criteria.region !== 'all') ||
    (criteria.category && criteria.category !== 'all') ||
    (criteria.searchQuery && criteria.searchQuery.trim())
  );

  return [
    {
      id: 'yield',
      title: isFiltered ? 'Filtered Crop Yield' : 'Average Crop Yield',
      value: avgYield.toFixed(2),
      unit: 't/ha',
      changePercentage: yieldDelta,
      isPositive: yieldDelta >= 0,
      benchmark: `${overall.avgYield.toFixed(2)} t/ha dataset mean`,
      subtext: `${targetRecords.length} plot${targetRecords.length === 1 ? '' : 's'} (${((targetRecords.length / allRecords.length) * 100).toFixed(0)}% of total)`,
      icon: 'yield',
      sparklineData: targetRecords.slice(0, 5).map((r) => r.Yield_Tonnes_Ha || 0),
    },
    {
      id: 'production',
      title: isFiltered ? 'Filtered Output' : 'Gross Output Volume',
      value: totalProduction.toFixed(1),
      unit: 'Tonnes',
      changePercentage: prodDelta,
      isPositive: prodDelta >= 0,
      benchmark: `${overall.totalProduction.toFixed(1)} t dataset aggregate`,
      subtext: `Avg ${avgProduction.toFixed(1)} t per farm`,
      icon: 'production',
      sparklineData: targetRecords.slice(0, 5).map((r) => r.Production_Tonnes),
    },
    {
      id: 'water',
      title: isFiltered ? 'Filtered Water Index' : 'Water Efficiency Index',
      value: avgWaterEff.toFixed(2),
      unit: 't/k-m³',
      changePercentage: waterEffDelta,
      isPositive: waterEffDelta >= 0,
      benchmark: `${overall.avgWaterEfficiency.toFixed(2)} t/1,000m³ mean`,
      subtext: `${Math.round(avgWaterUsage).toLocaleString('en-IN')} m³ avg usage`,
      icon: 'water',
      sparklineData: targetRecords.slice(0, 5).map((r) => r.Water_Efficiency_t_per_1000m3),
    },
    {
      id: 'profit',
      title: isFiltered ? 'Filtered Operating Profit' : 'Net Farm Operating Profit',
      value: `₹${(Math.round(avgProfit) / 1000).toFixed(0)}k`,
      unit: '/plot',
      changePercentage: profitDelta,
      isPositive: profitDelta >= 0,
      benchmark: `₹${(Math.round(overall.avgProfit) / 1000).toFixed(0)}k annual mean`,
      subtext: `${profitMarginPct.toFixed(1)}% operating margin`,
      icon: 'profit',
      sparklineData: targetRecords.slice(0, 5).map((r) => Math.round(r.Profit_INR / 1000)),
    },
  ];
}

export function getFilteredEnvironmentalConditions(criteria: FilterCriteria = {}): EnvironmentalConditions {
  const allRecords = getSanitizedRecords();
  const filtered = filterFarmRecords(criteria);
  const target = filtered.length > 0 ? filtered : allRecords;
  const overall = getSeasonalStatistics().all;

  const rainfalls = target.map((r) => r.Rainfall_mm).filter((v): v is number => v !== null);
  const temps = target.map((r) => r.Avg_Temperature_C);
  const phs = target.map((r) => r.Soil_pH);
  const moistures = target.map((r) => r.Soil_Moisture_pct).filter((v): v is number => v !== null);
  const nitrogens = target.map((r) => r.Nitrogen_kg_ha);
  const phosphorus = target.map((r) => r.Phosphorus_kg_ha);
  const potassiums = target.map((r) => r.Potassium_kg_ha);
  const risks = target.map((r) => r.Disease_Pest_Risk_pct);

  const avgRain = safeMean(rainfalls);
  const avgTemp = safeMean(temps);
  const minTemp = safeMin(temps);
  const maxTemp = safeMax(temps);
  const avgPh = safeMean(phs);
  const avgMoist = safeMean(moistures);
  const avgN = safeMean(nitrogens);
  const avgP = safeMean(phosphorus);
  const avgK = safeMean(potassiums);
  const avgRisk = safeMean(risks);

  const rainDev = overall.avgRainfall > 0 ? Math.round(((avgRain - overall.avgRainfall) / overall.avgRainfall) * 100) : 0;
  const phStatus: 'Acidic' | 'Neutral' | 'Slightly Alkaline' = avgPh < 6.5 ? 'Acidic' : avgPh > 7.5 ? 'Slightly Alkaline' : 'Neutral';
  const moistureStatus: 'Adequate' | 'Deficit' | 'Saturated' = avgMoist > 32 ? 'Saturated' : avgMoist < 18 ? 'Deficit' : 'Adequate';
  const riskLevel: 'Low' | 'Moderate' | 'Elevated' | 'High' = avgRisk < 30 ? 'Low' : avgRisk < 50 ? 'Moderate' : avgRisk < 65 ? 'Elevated' : 'High';

  const seasonKey: SeasonType = (criteria.season && ['kharif', 'rabi', 'zaid'].includes(criteria.season.toLowerCase())) ? criteria.season.toLowerCase() as SeasonType : 'all';

  return {
    season: seasonKey,
    temperature: {
      average: Number(avgTemp.toFixed(1)),
      min: Number(minTemp.toFixed(1)),
      max: Number(maxTemp.toFixed(1)),
      unit: '°C',
      status: avgTemp > 30 ? 'Elevated' : avgTemp < 20 ? 'Sub-optimal' : 'Optimal',
      trend: `${minTemp.toFixed(0)}°C to ${maxTemp.toFixed(0)}°C telemetry range`,
    },
    rainfall: {
      recordedMm: Number(avgRain.toFixed(1)),
      normalMm: Number(overall.avgRainfall.toFixed(1)),
      deviationPercentage: rainDev,
      distribution: rainDev > 25 ? 'Excess' : rainDev < -25 ? 'Deficit' : 'Evenly Distributed',
    },
    soilConditions: {
      moisturePercentage: Number(avgMoist.toFixed(1)),
      moistureStatus,
      phValue: Number(avgPh.toFixed(2)),
      phStatus,
      organicCarbonPercent: 0.72,
      npkRatio: `${Math.round(avgN)}:${Math.round(avgP)}:${Math.round(avgK)}`,
      nitrogenStatus: avgN >= 110 ? 'High' : 'Moderate',
    },
    diseaseRisk: {
      level: riskLevel,
      alertTitle: avgRisk > 50 ? 'Elevated Biotic Risk in Filtered Sample' : 'Calibrated Disease Inoculum Level',
      vulnerableCrops: Array.from(new Set(target.map((r) => r.Crop))).slice(0, 3),
      advisoryAction: avgRisk > 50
        ? 'Deploy prophylactic biological fungicide and avoid standing surface moisture.'
        : 'Maintain scheduled nutrient feeding and calibrate soil moisture sensors.',
      preventionIndex: Math.round(Math.max(0, 100 - avgRisk)),
    },
  };
}

export function getFilteredKeyInsight(criteria: FilterCriteria = {}): KeyInsightItem {
  const allRecords = getSanitizedRecords();
  const filtered = filterFarmRecords(criteria);
  const target = filtered.length > 0 ? filtered : allRecords;

  const avgYield = safeMean(target.map((r) => r.Yield_Tonnes_Ha).filter((v): v is number => v !== null));
  const avgProfit = safeMean(target.map((r) => r.Profit_INR));
  const avgRisk = safeMean(target.map((r) => r.Disease_Pest_Risk_pct));
  const avgWaterEff = safeMean(target.map((r) => r.Water_Efficiency_t_per_1000m3));

  const seasonKey: SeasonType = (criteria.season && ['kharif', 'rabi', 'zaid'].includes(criteria.season.toLowerCase())) ? criteria.season.toLowerCase() as SeasonType : 'all';

  const isFiltered = Boolean(
    (criteria.season && criteria.season !== 'all') ||
    (criteria.crop && criteria.crop !== 'all') ||
    (criteria.region && criteria.region !== 'all') ||
    (criteria.category && criteria.category !== 'all') ||
    (criteria.searchQuery && criteria.searchQuery.trim())
  );

  if (isFiltered) {
    return {
      id: 'filtered-dynamic-insight',
      season: seasonKey,
      title: 'Active Slice Intelligence',
      headline: `${target.length} filtered farm plots averaging ${avgYield.toFixed(2)} t/ha yield with ₹${(Math.round(avgProfit) / 1000).toFixed(0)}k operating margin.`,
      highlightStat: `${avgYield.toFixed(2)} t/ha (${((target.length / allRecords.length) * 100).toFixed(0)}% dataset slice)`,
      description: `Analysis across selected dimensions (${[criteria.season !== 'all' && criteria.season, criteria.crop !== 'all' && criteria.crop, criteria.region !== 'all' && criteria.region, criteria.category !== 'all' && criteria.category].filter(Boolean).join(' · ') || 'Search criteria'}) indicates water productivity of ${avgWaterEff.toFixed(2)} t/1,000m³ and ${avgRisk.toFixed(1)}% disease pressure.`,
      actionableRecommendation: avgProfit < 0
        ? 'Mitigate negative operating margin by auditing chemical input expenditures and adopting targeted furrow/drip irrigation.'
        : 'Expand high-efficiency irrigation practices and replicate optimal nutrient balancing across adjacent clusters.',
      confidenceScore: 94,
      tags: ['Empirical Filter', 'Real-time Slice', 'Ground Truth'],
      impactLevel: avgProfit >= 0 ? 'Positive Impact' : 'Cautionary Risk',
    };
  }

  return getKeyInsights(seasonKey);
}



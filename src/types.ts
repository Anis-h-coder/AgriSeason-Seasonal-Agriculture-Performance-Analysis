export type SeasonType = 'all' | 'kharif' | 'rabi' | 'zaid';

export interface SeasonInfo {
  id: SeasonType;
  name: string;
  hindiName?: string;
  months: string;
  sowingPeriod: string;
  harvestPeriod: string;
  primaryClimate: string;
  majorCrops: string[];
  description: string;
}

export interface MetricCardData {
  id: string;
  title: string;
  value: string;
  unit: string;
  changePercentage: number;
  isPositive: boolean;
  benchmark: string;
  subtext: string;
  icon: string;
  sparklineData: number[];
}

export interface SeasonalPerformancePoint {
  period: string; // e.g., 'Jul (Sowing)', 'Aug (Tillering)', 'Nov (Harvest)'
  month: string;
  kharifYield: number; // in tonnes/ha
  rabiYield: number;
  zaidYield: number;
  kharifProduction: number; // in '000 MT
  rabiProduction: number;
  zaidProduction: number;
  kharifProfit: number; // $/ha
  rabiProfit: number;
  zaidProfit: number;
  rainfallMm: number;
}

export interface EnvironmentalConditions {
  season: SeasonType;
  temperature: {
    average: number;
    min: number;
    max: number;
    unit: string;
    status: 'Optimal' | 'Elevated' | 'Sub-optimal';
    trend: string;
  };
  rainfall: {
    recordedMm: number;
    normalMm: number;
    deviationPercentage: number;
    distribution: 'Evenly Distributed' | 'Deficit' | 'Excess';
  };
  soilConditions: {
    moisturePercentage: number;
    moistureStatus: 'Adequate' | 'Deficit' | 'Saturated';
    phValue: number;
    phStatus: 'Slightly Alkaline' | 'Neutral' | 'Acidic';
    organicCarbonPercent: number;
    npkRatio: string;
    nitrogenStatus: string;
  };
  diseaseRisk: {
    level: 'Low' | 'Moderate' | 'Elevated' | 'High';
    alertTitle: string;
    vulnerableCrops: string[];
    advisoryAction: string;
    preventionIndex: number; // 0 - 100
  };
}

export interface CropPerformanceItem {
  id: string;
  name: string;
  scientificName: string;
  category: 'Cereal' | 'Pulse' | 'Cash Crop' | 'Oilseed' | 'Horticulture';
  season: 'kharif' | 'rabi' | 'zaid';
  seasonLabel: string;
  yieldPerHa: number; // t/ha
  yieldUnit: string;
  yieldChange: number; // %
  productionTotal: number; // in k MT
  productionUnit: string;
  profitPerHa: number; // in USD
  performanceScore: number; // 0 to 100
  harvestStatus: 'Sowing' | 'Vegetative' | 'Maturity' | 'Harvested';
  waterRequirement: 'High' | 'Medium' | 'Low';
  resilienceScore: number; // out of 10
}

export interface KeyInsightItem {
  id: string;
  season: SeasonType;
  title: string;
  headline: string;
  highlightStat: string;
  description: string;
  actionableRecommendation: string;
  confidenceScore: number;
  tags: string[];
  impactLevel: 'Positive Impact' | 'Resource Optimization' | 'Cautionary Risk';
}

export interface RegionPerformance {
  id: string;
  name: string;
  state: string;
  agroClimaticZone: string;
  primarySoil: string;
  kharifDominance: string;
  rabiDominance: string;
  avgYield: number;
  productionShare: number;
  waterStressLevel: 'Low' | 'Moderate' | 'High';
}

export interface GlobalFilterState {
  season: SeasonType;
  crop: string; // 'all' or crop name
  region: string; // 'all' or state/district name
  category: string; // 'all' or 'Cereal' | 'Pulse' | 'Cash Crop' | 'Oilseed' | 'Fiber'
  searchQuery: string;
}

export interface FilterOptionItem {
  value: string;
  label: string;
  count?: number;
  badge?: string;
}

export interface DatasetColumnMeta {
  name: string;
  dataType: 'string' | 'number' | 'float';
  category:
    | 'Season-related'
    | 'Crop-related'
    | 'Regional/Geographical'
    | 'Environmental'
    | 'Production/Yield'
    | 'Resource Usage'
    | 'Economic';
  isCategorical: boolean;
  missingCount: number;
  sampleValues: string[];
  description: string;
}

export interface DatasetAuditSummary {
  totalRows: number;
  totalColumns: number;
  duplicateRecords: number;
  categoricalColumnsCount: number;
  numericalColumnsCount: number;
  columns: DatasetColumnMeta[];
  groups: {
    seasonRelated: string[];
    cropRelated: string[];
    regionalGeographical: string[];
    environmentalVariables: string[];
    productionYieldVariables: string[];
    resourceUsageVariables: string[];
    economicVariables: string[];
  };
}

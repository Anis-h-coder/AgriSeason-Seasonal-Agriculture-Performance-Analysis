// Ground-truth Crop Performance Data dynamically calculated from the centralized dataset processor
import { getCropStatistics, CropAggregateStats } from '../utils/datasetProcessor';

export interface CropFarmSummary {
  farmId: string;
  state: string;
  district: string;
  season: string;
  area: number;
  yieldVal: number;
  production: number;
  revenue: number;
  profit: number;
  cost: number;
  water: number;
  waterEff: number;
  pestRisk: number;
  irrigation: string;
  price: number;
}

export interface ActualCropPerformance {
  id: string;
  name: string;
  scientificName: string;
  nativeName: string;
  category: string;
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
  farms: CropFarmSummary[];
}

function transformCropStat(stat: CropAggregateStats): ActualCropPerformance {
  const farmSummaries: CropFarmSummary[] = stat.farms.map((f) => ({
    farmId: f.Farm_ID,
    state: f.State,
    district: f.District,
    season: f.Season,
    area: Number(f.Farm_Area_Hectares.toFixed(2)),
    yieldVal: f.Yield_Tonnes_Ha !== null ? Number(f.Yield_Tonnes_Ha.toFixed(2)) : 0,
    production: Number(f.Production_Tonnes.toFixed(2)),
    revenue: Math.round(f.Revenue_INR),
    profit: Math.round(f.Profit_INR),
    cost: Math.round(f.Total_Cost_INR),
    water: Math.round(f.Water_Used_m3),
    waterEff: Number(f.Water_Efficiency_t_per_1000m3.toFixed(3)),
    pestRisk: Number(f.Disease_Pest_Risk_pct.toFixed(1)),
    irrigation: f.Irrigation_Method,
    price: Math.round(f.Market_Price_INR_Tonne),
  }));

  return {
    id: stat.id,
    name: stat.name,
    scientificName: stat.scientificName,
    nativeName: stat.nativeName,
    category: stat.category,
    emoji: stat.emoji,
    description: stat.description,
    plotCount: stat.plotCount,
    seasons: stat.seasons,
    states: stat.states,
    districts: stat.districts,
    irrigationMethods: stat.irrigationMethods,
    avgYield: Number(stat.avgYield.toFixed(2)),
    minYield: Number(stat.minYield.toFixed(2)),
    maxYield: Number(stat.maxYield.toFixed(2)),
    avgProduction: Number(stat.avgProduction.toFixed(2)),
    totalProduction: Number(stat.totalProduction.toFixed(2)),
    avgRevenue: Math.round(stat.avgRevenue),
    totalRevenue: Math.round(stat.totalRevenue),
    avgCost: Math.round(stat.avgCost),
    totalCost: Math.round(stat.totalCost),
    avgProfit: Math.round(stat.avgProfit),
    totalProfit: Math.round(stat.totalProfit),
    profitMarginPct: Number(stat.profitMarginPct.toFixed(1)),
    avgWaterUsage: Math.round(stat.avgWaterUsage),
    totalWaterUsage: Math.round(stat.totalWaterUsage),
    avgWaterEfficiency: Number(stat.avgWaterEfficiency.toFixed(2)),
    avgDiseaseRisk: Number(stat.avgDiseaseRisk.toFixed(1)),
    minDiseaseRisk: Number(stat.minDiseaseRisk.toFixed(1)),
    maxDiseaseRisk: Number(stat.maxDiseaseRisk.toFixed(1)),
    avgFarmArea: Number(stat.avgFarmArea.toFixed(2)),
    avgMarketPrice: Math.round(stat.avgMarketPrice),
    avgTemperature: Number(stat.avgTemperature.toFixed(1)),
    avgRainfall: Number(stat.avgRainfall.toFixed(1)),
    avgHumidity: Number(stat.avgHumidity.toFixed(1)),
    avgFertilizer: Number(stat.avgFertilizer.toFixed(1)),
    avgPesticide: Number(stat.avgPesticide.toFixed(2)),
    farms: farmSummaries,
  };
}

export const ALL_CROPS_PERFORMANCE: ActualCropPerformance[] = getCropStatistics('all').map(transformCropStat);
export const KHARIF_CROPS_PERFORMANCE: ActualCropPerformance[] = getCropStatistics('kharif').map(transformCropStat);
export const RABI_CROPS_PERFORMANCE: ActualCropPerformance[] = getCropStatistics('rabi').map(transformCropStat);
export const ZAID_CROPS_PERFORMANCE: ActualCropPerformance[] = getCropStatistics('zaid').map(transformCropStat);

export const CROPS_BY_SEASON_MAP: Record<string, ActualCropPerformance[]> = {
  all: ALL_CROPS_PERFORMANCE,
  kharif: KHARIF_CROPS_PERFORMANCE,
  rabi: RABI_CROPS_PERFORMANCE,
  zaid: ZAID_CROPS_PERFORMANCE,
};

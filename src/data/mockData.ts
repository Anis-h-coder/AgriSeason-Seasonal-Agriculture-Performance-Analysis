import {
  SeasonInfo,
  MetricCardData,
  SeasonalPerformancePoint,
  EnvironmentalConditions,
  CropPerformanceItem,
  KeyInsightItem,
  RegionPerformance,
  SeasonType,
  DatasetAuditSummary,
} from '../types';
import {
  getDatasetAuditSummary,
  getSeasonalStatistics,
  getSeasonalMetricCards,
  getSeasonalPerformanceChartData,
  getEnvironmentalStatistics,
  getKeyInsights,
  getCropStatistics,
  getRegionalStatistics,
  getSanitizedRecords,
} from '../utils/datasetProcessor';

// ============================================================================
// 1. DATASET SCHEMA & AUDIT SPECIFICATION (Dynamic Ground Truth from Dataset)
// ============================================================================
export const DATASET_AUDIT: DatasetAuditSummary = getDatasetAuditSummary();

// ============================================================================
// 2. SEASON INFORMATION TAXONOMY
// ============================================================================
const seasonalStats = getSeasonalStatistics();

export const SEASONS_INFO: Record<SeasonType, SeasonInfo> = {
  all: {
    id: 'all',
    name: 'All Seasons (Annual Overview)',
    hindiName: 'समग्र वार्षिक कृषि चक्र',
    months: 'Annual (Jul – Jun)',
    sowingPeriod: 'Multi-Season Rotation',
    harvestPeriod: 'Continuous Agro-Cycle',
    primaryClimate: 'Sub-tropical monsoon, temperate winter & semi-arid summer',
    majorCrops: ['Wheat', 'Rice', 'Maize', 'Pulses', 'Cotton', 'Chilli', 'Groundnut', 'Sugarcane'],
    description: `Comprehensive multi-seasonal performance across ${seasonalStats.all.count} verified farm observations spanning 8 Indian states.`,
  },
  kharif: {
    id: 'kharif',
    name: 'Kharif (Monsoon Season)',
    hindiName: 'खरीफ फसल चक्र',
    months: 'Jun – Oct',
    sowingPeriod: 'June – July (Onset of South-West Monsoon)',
    harvestPeriod: 'October – November',
    primaryClimate: `Warm & Humid (${seasonalStats.kharif.avgTemperature.toFixed(1)}°C avg, ${seasonalStats.kharif.avgRainfall.toFixed(0)} mm rainfall)`,
    majorCrops: Object.keys(seasonalStats.kharif.cropsCount),
    description: `Monsoon crop cycle driven by South-West rains, accounting for ${seasonalStats.kharif.pctOfTotal.toFixed(0)}% of dataset observations.`,
  },
  rabi: {
    id: 'rabi',
    name: 'Rabi (Winter Season)',
    hindiName: 'रबी फसल चक्र',
    months: 'Oct – Mar',
    sowingPeriod: 'October – November (Post-Monsoon)',
    harvestPeriod: 'March – April',
    primaryClimate: `Cool & Dry (${seasonalStats.rabi.avgTemperature.toFixed(1)}°C avg, ${seasonalStats.rabi.avgRainfall.toFixed(0)} mm rainfall)`,
    majorCrops: Object.keys(seasonalStats.rabi.cropsCount),
    description: `Winter season characterized by peak net profit margins (₹${(Math.round(seasonalStats.rabi.avgProfit) / 1000).toFixed(0)}k avg/plot) and controlled irrigation.`,
  },
  zaid: {
    id: 'zaid',
    name: 'Zaid (Summer Season)',
    hindiName: 'जायद फसल चक्र',
    months: 'Mar – Jun',
    sowingPeriod: 'March – April (Warm Pre-Monsoon)',
    harvestPeriod: 'May – June',
    primaryClimate: `High Thermal Photoperiod (${seasonalStats.zaid.avgTemperature.toFixed(1)}°C avg, ${seasonalStats.zaid.avgSunlight.toFixed(1)} sunlight hrs/day)`,
    majorCrops: Object.keys(seasonalStats.zaid.cropsCount),
    description: `Short summer cycle maximizing high-efficiency micro-irrigation (${seasonalStats.zaid.avgWaterEfficiency.toFixed(2)} t/1,000m³ water efficiency).`,
  },
};

// ============================================================================
// 3. SEASONAL METRICS (Calculated dynamically)
// ============================================================================
export const getSeasonalMetrics = (season: SeasonType = 'all'): MetricCardData[] => {
  return getSeasonalMetricCards(season);
};

export const SEASONS_METRICS: Record<SeasonType, MetricCardData[]> = {
  all: getSeasonalMetricCards('all'),
  kharif: getSeasonalMetricCards('kharif'),
  rabi: getSeasonalMetricCards('rabi'),
  zaid: getSeasonalMetricCards('zaid'),
};

// ============================================================================
// 4. SEASONAL PERFORMANCE TIME-SERIES & COMPARISON
// ============================================================================
export const SEASONAL_PERFORMANCE_DATA: SeasonalPerformancePoint[] = getSeasonalPerformanceChartData();

export const SEASON_COMPARISON_SUMMARY = [
  {
    season: 'Kharif',
    name: 'Kharif',
    period: 'Jun – Oct',
    avgYield: Number(seasonalStats.kharif.avgYield.toFixed(2)),
    yieldAvg: seasonalStats.kharif.avgYield,
    totalProduction: Number(seasonalStats.kharif.totalProduction.toFixed(1)),
    profitPerHa: Math.round(seasonalStats.kharif.avgProfit),
    rainfallMm: Number(seasonalStats.kharif.avgRainfall.toFixed(0)),
    productionShare: seasonalStats.kharif.pctOfTotal,
    waterDependency: 'High (Rainfall + Flood)',
    profitShare: Math.round((seasonalStats.kharif.totalProfit / seasonalStats.all.totalProfit) * 100),
  },
  {
    season: 'Rabi',
    name: 'Rabi',
    period: 'Oct – Mar',
    avgYield: Number(seasonalStats.rabi.avgYield.toFixed(2)),
    yieldAvg: seasonalStats.rabi.avgYield,
    totalProduction: Number(seasonalStats.rabi.totalProduction.toFixed(1)),
    profitPerHa: Math.round(seasonalStats.rabi.avgProfit),
    rainfallMm: Number(seasonalStats.rabi.avgRainfall.toFixed(0)),
    productionShare: seasonalStats.rabi.pctOfTotal,
    waterDependency: 'Moderate (Sprinkler / Drip)',
    profitShare: Math.round((seasonalStats.rabi.totalProfit / seasonalStats.all.totalProfit) * 100),
  },
  {
    season: 'Zaid',
    name: 'Zaid',
    period: 'Mar – Jun',
    avgYield: Number(seasonalStats.zaid.avgYield.toFixed(2)),
    yieldAvg: seasonalStats.zaid.avgYield,
    totalProduction: Number(seasonalStats.zaid.totalProduction.toFixed(1)),
    profitPerHa: Math.round(seasonalStats.zaid.avgProfit),
    rainfallMm: Number(seasonalStats.zaid.avgRainfall.toFixed(0)),
    productionShare: seasonalStats.zaid.pctOfTotal,
    waterDependency: 'High Precision (Drip Focused)',
    profitShare: Math.round((seasonalStats.zaid.totalProfit / seasonalStats.all.totalProfit) * 100),
  },
];

// ============================================================================
// 5. ENVIRONMENTAL TELEMETRY (Dynamic Sensor Matrix)
// ============================================================================
export const ENVIRONMENTAL_DATA: Record<SeasonType, EnvironmentalConditions> = {
  all: getEnvironmentalStatistics('all'),
  kharif: getEnvironmentalStatistics('kharif'),
  rabi: getEnvironmentalStatistics('rabi'),
  zaid: getEnvironmentalStatistics('zaid'),
};

// ============================================================================
// 6. CROP PERFORMANCE DATA (Directly derived from all 50 dataset observations)
// ============================================================================
const dynamicCrops = getCropStatistics('all');

export const CROPS_DATA: CropPerformanceItem[] = dynamicCrops.map((c) => {
  const primarySeason = (c.seasons[0]?.toLowerCase() || 'kharif') as 'kharif' | 'rabi' | 'zaid';
  const overallAvgYield = seasonalStats.all.avgYield;
  const yieldChange = overallAvgYield > 0 ? Math.round(((c.avgYield - overallAvgYield) / overallAvgYield) * 100) : 0;

  const waterReq: 'High' | 'Medium' | 'Low' =
    c.avgWaterUsage > 6000 ? 'High' : c.avgWaterUsage > 3500 ? 'Medium' : 'Low';

  const harvestStatus: 'Sowing' | 'Vegetative' | 'Maturity' | 'Harvested' =
    primarySeason === 'kharif' ? 'Maturity' : primarySeason === 'rabi' ? 'Vegetative' : 'Harvested';

  return {
    id: c.id,
    name: c.name,
    scientificName: c.scientificName,
    category: c.category,
    season: primarySeason,
    seasonLabel: c.seasons.join(', '),
    yieldPerHa: Number(c.avgYield.toFixed(2)),
    yieldUnit: 't/ha',
    yieldChange,
    productionTotal: Number(c.totalProduction.toFixed(1)),
    productionUnit: 'Tonnes',
    profitPerHa: Math.round(c.avgProfit),
    performanceScore: c.performanceScore,
    harvestStatus,
    waterRequirement: waterReq,
    resilienceScore: Number(((100 - c.avgDiseaseRisk) / 10).toFixed(1)),
  };
});

// ============================================================================
// 7. KEY INSIGHTS (Computed from actual empirical differentials)
// ============================================================================
export const KEY_INSIGHTS: Record<SeasonType, KeyInsightItem> = {
  all: getKeyInsights('all'),
  kharif: getKeyInsights('kharif'),
  rabi: getKeyInsights('rabi'),
  zaid: getKeyInsights('zaid'),
};

// ============================================================================
// 8. REGIONS PERFORMANCE (Derived dynamically from state groupings)
// ============================================================================
const regionalStats = getRegionalStatistics('all');

export const REGIONS_PERFORMANCE: RegionPerformance[] = regionalStats.states.map((st) => {
  const waterStress: 'Low' | 'Moderate' | 'High' =
    st.avgRainfall < 400 ? 'High' : st.avgRainfall < 700 ? 'Moderate' : 'Low';

  const kharifCrops = st.farms.filter((f) => f.Season.toLowerCase() === 'kharif').map((f) => f.Crop);
  const rabiCrops = st.farms.filter((f) => f.Season.toLowerCase() === 'rabi').map((f) => f.Crop);

  return {
    id: st.id,
    name: st.state,
    state: st.state,
    agroClimaticZone: `Zone ${st.districts.join(', ')}`,
    primarySoil: st.avgSoilPH > 7.5 ? 'Black Alkaline Soil' : st.avgSoilPH < 6.5 ? 'Red Loamy Soil' : 'Alluvial Soil',
    kharifDominance: kharifCrops[0] || 'Rice / Cotton',
    rabiDominance: rabiCrops[0] || 'Wheat / Pulses',
    avgYield: Number(st.avgYield.toFixed(2)),
    productionShare: Number(((st.totalProduction / seasonalStats.all.totalProduction) * 100).toFixed(1)),
    waterStressLevel: waterStress,
  };
});

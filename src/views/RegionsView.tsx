import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Search,
  Sprout,
  Wheat,
  Droplets,
  Coins,
  TrendingUp,
  TrendingDown,
  Scale,
  Thermometer,
  CloudRain,
  Sun,
  Activity,
  CheckCircle2,
  Layers,
  Filter,
  Sparkles,
  ChevronRight,
  ArrowRight,
  BarChart3,
  PieChart,
  Info,
  X,
  ExternalLink,
  ShieldAlert,
  Gauge,
  Compass,
  Award,
  SlidersHorizontal,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  Legend,
  AreaChart,
  Area,
  ComposedChart,
  Line,
} from 'recharts';
import { SeasonType } from '../types';
import {
  ACTUAL_REGIONS_DATA,
  ACTUAL_DISTRICTS_DATA,
  DATASET_REGIONAL_INSIGHTS,
  calculateFilteredRegionMetrics,
  StateRegionProfile,
  DistrictProfile,
} from '../data/actualRegionData';
import { useFilters } from '../context/FilterContext';

interface RegionsViewProps {
  selectedSeason?: SeasonType;
  onSeasonChange?: (season: SeasonType) => void;
}

export const RegionsView: React.FC<RegionsViewProps> = ({
  selectedSeason = 'all',
  onSeasonChange,
}) => {
  const { filters, setSeason, setCrop, setSearchQuery: setGlobalSearch } = useFilters();

  // Active filters from Global Filter Bar or local fallback
  const activeSeason = filters.season !== 'all' ? filters.season : selectedSeason;
  const activeCrop = filters.crop;
  const activeRegionFilter = filters.region;
  const activeCategoryFilter = filters.category;
  const searchQuery = filters.searchQuery;

  const [localCrop, setLocalCrop] = useState<string>('all');
  const [localSearchQuery, setLocalSearchQuery] = useState<string>('');
  const [selectedRegionId, setSelectedRegionId] = useState<string>('tamil-nadu');
  const [activeChartLens, setActiveChartLens] = useState<
    'yieldProd' | 'economics' | 'water' | 'environment'
  >('yieldProd');
  const [activeDrilldownTab, setActiveDrilldownTab] = useState<
    'seasonal' | 'crops' | 'environment' | 'resources' | 'economic' | 'plots'
  >('seasonal');
  const [activeInsightIndex, setActiveInsightIndex] = useState<number>(0);

  // Effective filter values combining global and local
  const effectiveCrop = activeCrop !== 'all' ? activeCrop : localCrop;
  const effectiveSearch = searchQuery || localSearchQuery;

  // Sync external season changes if provided
  const handleSeasonChange = (season: string) => {
    setSeason(season as SeasonType);
    if (onSeasonChange) {
      onSeasonChange(season as SeasonType);
    }
  };

  // Available crop options
  const cropFilterOptions = [
    { id: 'all', label: 'All Crops' },
    { id: 'Wheat', label: 'Wheat' },
    { id: 'Rice', label: 'Rice' },
    { id: 'Maize', label: 'Maize' },
    { id: 'Pulses', label: 'Pulses' },
    { id: 'Cotton', label: 'Cotton' },
    { id: 'Chilli', label: 'Chilli' },
    { id: 'Groundnut', label: 'Groundnut' },
    { id: 'Sugarcane', label: 'Sugarcane' },
  ];

  // Season filter options
  const seasonFilterOptions = [
    { id: 'all', label: 'All Seasons' },
    { id: 'Kharif', label: 'Kharif' },
    { id: 'Rabi', label: 'Rabi' },
    { id: 'Zaid', label: 'Zaid' },
  ];

  // Dynamic calculated overview metrics based on current filters
  const overviewMetrics = useMemo(() => {
    return calculateFilteredRegionMetrics(
      ACTUAL_REGIONS_DATA,
      activeSeason,
      effectiveCrop,
      effectiveSearch
    );
  }, [activeSeason, effectiveCrop, effectiveSearch]);

  // Filtered state regions for cards and visualization
  const filteredRegions = useMemo(() => {
    return ACTUAL_REGIONS_DATA.filter((st) => {
      // Region filter
      if (activeRegionFilter !== 'all') {
        const matchState = st.state.toLowerCase() === activeRegionFilter.toLowerCase();
        const matchDistricts = st.districts.some((d) => d.toLowerCase() === activeRegionFilter.toLowerCase());
        if (!matchState && !matchDistricts) return false;
      }

      // Search match: state name, districts, or agro-climatic zone
      if (effectiveSearch.trim() !== '') {
        const q = effectiveSearch.toLowerCase();
        const matchState = st.state.toLowerCase().includes(q);
        const matchDistricts = st.districts.some((d) => d.toLowerCase().includes(q));
        const matchZone = st.zone.toLowerCase().includes(q);
        const matchCrops = st.crops.some((c) => c.toLowerCase().includes(q));
        if (!matchState && !matchDistricts && !matchZone && !matchCrops) return false;
      }

      // Season filter: state must have farms in this season
      if (activeSeason !== 'all') {
        const hasSeason = st.seasons.some(
          (s) => s.toLowerCase() === activeSeason.toLowerCase()
        );
        if (!hasSeason) return false;
      }

      // Crop filter: state must have farms growing this crop
      if (effectiveCrop !== 'all') {
        const hasCrop = st.crops.some(
          (c) => c.toLowerCase().includes(effectiveCrop.toLowerCase())
        );
        if (!hasCrop) return false;
      }

      return true;
    });
  }, [effectiveSearch, activeSeason, effectiveCrop, activeRegionFilter]);

  // Currently selected region profile (fallback to first filtered or first total)
  const selectedRegion = useMemo(() => {
    const found = ACTUAL_REGIONS_DATA.find((r) => r.id === selectedRegionId);
    if (found) return found;
    return filteredRegions[0] || ACTUAL_REGIONS_DATA[0];
  }, [selectedRegionId, filteredRegions]);

  // Chart data for the regional comparison visualization
  const chartData = useMemo(() => {
    return ACTUAL_REGIONS_DATA.map((st) => {
      // Calculate metrics for this state based on active filters
      let matchingFarms = st.farms;
      if (activeSeason !== 'all') {
        matchingFarms = matchingFarms.filter(
          (f) => f.season.toLowerCase() === activeSeason.toLowerCase()
        );
      }
      if (activeCrop !== 'all') {
        matchingFarms = matchingFarms.filter(
          (f) => f.crop.toLowerCase() === activeCrop.toLowerCase()
        );
      }

      const count = matchingFarms.length;
      const avgYld =
        count > 0
          ? +(
              matchingFarms.reduce((a, b) => a + b.yieldVal, 0) / count
            ).toFixed(2)
          : 0;
      const totProd =
        count > 0
          ? +(
              matchingFarms.reduce((a, b) => a + b.production, 0)
            ).toFixed(2)
          : 0;
      const avgRev =
        count > 0
          ? Math.round(
              matchingFarms.reduce((a, b) => a + b.revenue, 0) / count
            )
          : 0;
      const avgProf =
        count > 0
          ? Math.round(
              matchingFarms.reduce((a, b) => a + b.profit, 0) / count
            )
          : 0;
      const avgWat =
        count > 0
          ? Math.round(
              matchingFarms.reduce((a, b) => a + b.water, 0) / count
            )
          : 0;
      const avgWatEff =
        count > 0
          ? +(
              matchingFarms.reduce((a, b) => a + b.waterEff, 0) / count
            ).toFixed(2)
          : 0;
      const avgRsk =
        count > 0
          ? +(
              matchingFarms.reduce((a, b) => a + b.risk, 0) / count
            ).toFixed(1)
          : 0;

      return {
        id: st.id,
        name: st.state,
        shortName: st.state.replace(' Pradesh', ' P.').replace(' Nadu', ' N.'),
        avgYield: avgYld,
        totalProduction: totProd,
        avgRevenueLakhs: +(avgRev / 100000).toFixed(2),
        avgProfitLakhs: +(avgProf / 100000).toFixed(2),
        avgWater: avgWat,
        avgWaterEff: avgWatEff,
        avgRainfall: st.avgRainfall,
        avgTemp: st.avgTemperature,
        avgDiseaseRisk: avgRsk || st.avgDiseaseRisk,
        plotCount: count,
        isSelected: st.id === selectedRegion.id,
      };
    });
  }, [activeSeason, activeCrop, selectedRegion.id]);

  // Format currency in INR
  const formatINR = (val: number) => {
    const abs = Math.abs(val);
    const sign = val < 0 ? '-' : val > 0 ? '+' : '';
    if (abs >= 100000) {
      return `${sign}₹${(abs / 100000).toFixed(2)}L`;
    }
    if (abs >= 1000) {
      return `${sign}₹${(abs / 1000).toFixed(1)}k`;
    }
    return `${sign}₹${abs}`;
  };

  // Clear filters helper
  const hasActiveFilters =
    activeSeason !== 'all' || effectiveCrop !== 'all' || effectiveSearch.trim() !== '';

  const clearAllFilters = () => {
    setSeason('all');
    setCrop('all');
    setGlobalSearch('');
    setLocalCrop('all');
    setLocalSearchQuery('');
  };

  return (
    <div id="regions-page-container" className="space-y-8">
      {/* 1. Top Section: Header & Ground-Truth Context */}
      <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#E2E8DE] shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#F0F7EE] text-[#1B3022] border border-[#E2E8DE] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#347A52]" />
                Geographical & Agro-Climatic Intelligence
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#1B3022] text-[#A3E635] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Actual Dataset (8 States · 10 Districts · 50 Farm Plots)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B3022] font-display mt-3 tracking-tight">
              Regions & Agro-Climatic Belts
            </h1>
            <p className="text-sm text-[#707D72] mt-1 max-w-3xl leading-relaxed">
              Empirical cross-regional benchmarking derived directly from the uploaded dataset.
              Explore regional yield disparities, hydrologic footprints, soil chemistry, and commercial profitability across India's key agricultural belts.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-2 rounded-2xl bg-[#F0F7EE] border border-[#E2E8DE] text-xs">
              <span className="text-[#707D72] block font-medium">Selected Region</span>
              <span className="font-bold text-[#1B3022] font-display text-sm">
                {selectedRegion.state}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Top Interactive Filter Strip: Search, Season Filter, Crop Filter */}
        <div className="mt-6 pt-6 border-t border-[#E2E8DE] space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Search Region / District */}
            <div className="md:col-span-4 relative">
              <Search className="w-4 h-4 text-[#707D72] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="search-regions-input"
                type="text"
                placeholder="Search region, district, or zone..."
                value={effectiveSearch}
                onChange={(e) => {
                  setLocalSearchQuery(e.target.value);
                  setGlobalSearch(e.target.value);
                }}
                className="w-full pl-9 pr-8 py-2 text-xs bg-[#F8FAF5] text-[#1B3022] placeholder-[#8A968B] border border-[#E2E8DE] rounded-full focus:outline-none focus:border-[#347A52] focus:bg-white transition-all font-sans"
              />
              {effectiveSearch && (
                <button
                  onClick={() => {
                    setLocalSearchQuery('');
                    setGlobalSearch('');
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#707D72] hover:text-[#1B3022]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Season Filter Pills */}
            <div className="md:col-span-4 flex items-center gap-1.5 overflow-x-auto py-1">
              <span className="text-[11px] font-bold text-[#707D72] uppercase tracking-wider shrink-0 mr-1">
                Season:
              </span>
              {seasonFilterOptions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSeasonChange(s.id === 'All Seasons' ? 'all' : s.id)}
                  className={`px-3 py-1 text-xs font-bold rounded-full transition-all cursor-pointer shrink-0 border ${
                    activeSeason.toLowerCase() === s.id.toLowerCase()
                      ? 'bg-[#1B3022] text-[#A3E635] border-[#1B3022] shadow-xs'
                      : 'bg-[#F8FAF5] text-[#707D72] border-[#E2E8DE] hover:bg-white hover:text-[#1B3022]'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Crop Filter Dropdown / Selector */}
            <div className="md:col-span-4 flex items-center gap-2 justify-end">
              <span className="text-[11px] font-bold text-[#707D72] uppercase tracking-wider shrink-0">
                Crop:
              </span>
              <div className="relative flex-1 max-w-[200px]">
                <select
                  id="crop-filter-select"
                  value={effectiveCrop}
                  onChange={(e) => {
                    setLocalCrop(e.target.value);
                    setCrop(e.target.value);
                  }}
                  className="w-full px-3 py-1.5 text-xs font-semibold bg-[#F8FAF5] text-[#1B3022] border border-[#E2E8DE] rounded-full focus:outline-none focus:border-[#347A52] focus:bg-white transition-all cursor-pointer appearance-none pr-8"
                >
                  {cropFilterOptions.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <ChevronRight className="w-3.5 h-3.5 text-[#707D72] absolute right-3 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="px-2.5 py-1 text-[11px] font-bold text-[#991B1B] bg-[#FEF2F2] border border-[#FECACA] rounded-full hover:bg-[#FEE2E2] transition-colors cursor-pointer shrink-0"
                  title="Clear all filters"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Clean Region Overview Section: 5 Cards (Calculated from Dataset) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Average Yield */}
        <div
          id="metric-card-region-yield"
          className="bg-white rounded-[28px] p-5 border border-[#E2E8DE] shadow-xs space-y-3 relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#707D72] uppercase tracking-wider">
              Average Yield
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#F0F7EE] text-[#347A52] flex items-center justify-center">
              <Scale className="w-4 h-4 stroke-[2]" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-[#1B3022] font-mono tracking-tight">
                {overviewMetrics.avgYield}
              </span>
              <span className="text-xs text-[#707D72] font-medium">t / ha</span>
            </div>
            <p className="text-[11px] text-[#707D72] mt-1 truncate">
              Punjab peak: <span className="font-bold text-[#1B3022]">6.84 t/ha</span>
            </p>
          </div>
          <div className="w-full bg-[#F0F7EE] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#347A52] h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, (overviewMetrics.avgYield / 7.0) * 100)}%`,
              }}
            />
          </div>
        </div>

        {/* Card 2: Average Production */}
        <div
          id="metric-card-region-production"
          className="bg-white rounded-[28px] p-5 border border-[#E2E8DE] shadow-xs space-y-3 relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#707D72] uppercase tracking-wider">
              Average Production
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#F0F7EE] text-[#347A52] flex items-center justify-center">
              <Wheat className="w-4 h-4 stroke-[2]" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-[#1B3022] font-mono tracking-tight">
                {overviewMetrics.avgProduction}
              </span>
              <span className="text-xs text-[#707D72] font-medium">t / farm</span>
            </div>
            <p className="text-[11px] text-[#707D72] mt-1 truncate">
              Total Output:{' '}
              <span className="font-bold text-[#1B3022]">
                {overviewMetrics.totalProduction} t
              </span>
            </p>
          </div>
          <div className="w-full bg-[#F0F7EE] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#A3E635] h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, (overviewMetrics.avgProduction / 50.0) * 100)}%`,
              }}
            />
          </div>
        </div>

        {/* Card 3: Average Revenue */}
        <div
          id="metric-card-region-revenue"
          className="bg-white rounded-[28px] p-5 border border-[#E2E8DE] shadow-xs space-y-3 relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#707D72] uppercase tracking-wider">
              Average Revenue
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#F0F7EE] text-[#347A52] flex items-center justify-center">
              <Coins className="w-4 h-4 stroke-[2]" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-[#1B3022] font-mono tracking-tight">
                {formatINR(overviewMetrics.avgRevenue)}
              </span>
              <span className="text-xs text-[#707D72] font-medium">/ farm</span>
            </div>
            <p className="text-[11px] text-[#707D72] mt-1 truncate">
              Cumulative:{' '}
              <span className="font-bold text-[#1B3022]">
                {formatINR(overviewMetrics.totalRevenue)}
              </span>
            </p>
          </div>
          <div className="w-full bg-[#F0F7EE] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#1B3022] h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, (overviewMetrics.avgRevenue / 1000000) * 100)}%`,
              }}
            />
          </div>
        </div>

        {/* Card 4: Average Profit */}
        <div
          id="metric-card-region-profit"
          className={`bg-white rounded-[28px] p-5 border shadow-xs space-y-3 relative overflow-hidden ${
            overviewMetrics.avgProfit >= 0 ? 'border-[#E2E8DE]' : 'border-[#FECACA]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#707D72] uppercase tracking-wider">
              Average Profit
            </span>
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                overviewMetrics.avgProfit >= 0
                  ? 'bg-[#F0F7EE] text-[#2F9E44]'
                  : 'bg-[#FEF2F2] text-[#991B1B]'
              }`}
            >
              {overviewMetrics.avgProfit >= 0 ? (
                <TrendingUp className="w-4 h-4 stroke-[2]" />
              ) : (
                <TrendingDown className="w-4 h-4 stroke-[2]" />
              )}
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span
                className={`text-2xl font-extrabold font-mono tracking-tight ${
                  overviewMetrics.avgProfit >= 0 ? 'text-[#1B3022]' : 'text-[#991B1B]'
                }`}
              >
                {formatINR(overviewMetrics.avgProfit)}
              </span>
              <span className="text-xs text-[#707D72] font-medium">/ farm</span>
            </div>
            <p className="text-[11px] text-[#707D72] mt-1 truncate">
              Margin:{' '}
              <span
                className={`font-bold ${
                  overviewMetrics.profitMarginPct >= 0 ? 'text-[#2F9E44]' : 'text-[#991B1B]'
                }`}
              >
                {overviewMetrics.profitMarginPct}%
              </span>
            </p>
          </div>
          <div className="w-full bg-[#F0F7EE] h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                overviewMetrics.avgProfit >= 0 ? 'bg-[#2F9E44]' : 'bg-[#EF4444]'
              }`}
              style={{
                width: `${Math.min(100, Math.max(15, Math.abs(overviewMetrics.profitMarginPct)))}%`,
              }}
            />
          </div>
        </div>

        {/* Card 5: Average Water Usage */}
        <div
          id="metric-card-region-water"
          className="bg-white rounded-[28px] p-5 border border-[#E2E8DE] shadow-xs space-y-3 relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#707D72] uppercase tracking-wider">
              Average Water Usage
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#F0F7EE] text-[#2563EB] flex items-center justify-center">
              <Droplets className="w-4 h-4 stroke-[2]" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-[#1B3022] font-mono tracking-tight">
                {overviewMetrics.avgWater.toLocaleString()}
              </span>
              <span className="text-xs text-[#707D72] font-medium">m³ / farm</span>
            </div>
            <p className="text-[11px] text-[#707D72] mt-1 truncate">
              Efficiency:{' '}
              <span className="font-bold text-[#1B3022]">
                {overviewMetrics.avgWaterEff} t/1000m³
              </span>
            </p>
          </div>
          <div className="w-full bg-[#F0F7EE] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#3B82F6] h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, (overviewMetrics.avgWater / 9000) * 100)}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* 4. Large Interactive Regional Comparison Visualization */}
      <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#E2E8DE] shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#A3E635]" />
              <h2 className="text-lg font-bold text-[#1B3022] font-display">
                Regional Performance Matrix & Comparative Benchmark
              </h2>
            </div>
            <p className="text-xs text-[#707D72] mt-0.5">
              Comparative visualization across 8 surveyed States using actual categorical observations. Click any bar to select a region.
            </p>
          </div>

          {/* Metric Lens Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-[#F0F7EE] rounded-2xl border border-[#E2E8DE] self-start md:self-auto overflow-x-auto">
            <button
              onClick={() => setActiveChartLens('yieldProd')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeChartLens === 'yieldProd'
                  ? 'bg-[#1B3022] text-[#A3E635] shadow-2xs'
                  : 'text-[#707D72] hover:text-[#1B3022]'
              }`}
            >
              Yield & Output
            </button>
            <button
              onClick={() => setActiveChartLens('economics')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeChartLens === 'economics'
                  ? 'bg-[#1B3022] text-[#A3E635] shadow-2xs'
                  : 'text-[#707D72] hover:text-[#1B3022]'
              }`}
            >
              Revenue vs Profit
            </button>
            <button
              onClick={() => setActiveChartLens('water')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeChartLens === 'water'
                  ? 'bg-[#1B3022] text-[#A3E635] shadow-2xs'
                  : 'text-[#707D72] hover:text-[#1B3022]'
              }`}
            >
              Water & Efficiency
            </button>
            <button
              onClick={() => setActiveChartLens('environment')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeChartLens === 'environment'
                  ? 'bg-[#1B3022] text-[#A3E635] shadow-2xs'
                  : 'text-[#707D72] hover:text-[#1B3022]'
              }`}
            >
              Rainfall & Temp
            </button>
          </div>
        </div>

        {/* Chart Viewport */}
        <div className="h-72 sm:h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {activeChartLens === 'yieldProd' ? (
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 20, left: -10, bottom: 20 }}
                onClick={(e: any) => {
                  if (e && e.activePayload && e.activePayload[0]) {
                    const regId = e.activePayload[0].payload.id;
                    setSelectedRegionId(regId);
                  }
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F4EC" vertical={false} />
                <XAxis
                  dataKey="shortName"
                  tick={{ fill: '#707D72', fontSize: 11, fontWeight: 600 }}
                  axisLine={{ stroke: '#E2E8DE' }}
                  tickLine={false}
                  dy={8}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fill: '#707D72', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  unit=" t/ha"
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: '#707D72', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  unit=" t"
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload || !payload.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="bg-[#1B3022] text-white p-3 rounded-2xl shadow-xl text-xs border border-white/10 space-y-1">
                        <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-1.5">
                          <span className="font-bold text-[#A3E635]">{d.name}</span>
                          <span className="text-[10px] text-white/70">{d.plotCount} plots</span>
                        </div>
                        <div className="flex justify-between gap-4 pt-1">
                          <span className="text-white/80">Avg Yield:</span>
                          <span className="font-mono font-bold text-white">{d.avgYield} t/ha</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-white/80">Total Production:</span>
                          <span className="font-mono font-bold text-white">{d.totalProduction} Tonnes</span>
                        </div>
                        <div className="text-[10px] text-[#A3E635] pt-1">Click to select region</div>
                      </div>
                    );
                  }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  wrapperStyle={{ paddingBottom: '12px', fontSize: '11px', fontWeight: 600 }}
                />
                <Bar
                  yAxisId="left"
                  dataKey="avgYield"
                  name="Avg Yield (t/ha)"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={36}
                >
                  {chartData.map((entry) => (
                    <Cell
                      key={`cell-yield-${entry.id}`}
                      fill={entry.isSelected ? '#A3E635' : '#347A52'}
                      cursor="pointer"
                    />
                  ))}
                </Bar>
                <Bar
                  yAxisId="right"
                  dataKey="totalProduction"
                  name="Total Output (Tonnes)"
                  fill="#1B3022"
                  opacity={0.35}
                  radius={[8, 8, 0, 0]}
                  maxBarSize={28}
                  cursor="pointer"
                />
              </BarChart>
            ) : activeChartLens === 'economics' ? (
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 20, left: -5, bottom: 20 }}
                onClick={(e: any) => {
                  if (e && e.activePayload && e.activePayload[0]) {
                    const regId = e.activePayload[0].payload.id;
                    setSelectedRegionId(regId);
                  }
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F4EC" vertical={false} />
                <XAxis
                  dataKey="shortName"
                  tick={{ fill: '#707D72', fontSize: 11, fontWeight: 600 }}
                  axisLine={{ stroke: '#E2E8DE' }}
                  tickLine={false}
                  dy={8}
                />
                <YAxis
                  tick={{ fill: '#707D72', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  unit=" L"
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload || !payload.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="bg-[#1B3022] text-white p-3 rounded-2xl shadow-xl text-xs border border-white/10 space-y-1">
                        <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-1.5">
                          <span className="font-bold text-[#A3E635]">{d.name}</span>
                          <span className="text-[10px] text-white/70">{d.plotCount} plots</span>
                        </div>
                        <div className="flex justify-between gap-4 pt-1">
                          <span className="text-white/80">Avg Revenue:</span>
                          <span className="font-mono font-bold text-white">₹{d.avgRevenueLakhs}L</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-white/80">Avg Net Profit:</span>
                          <span
                            className={`font-mono font-bold ${
                              d.avgProfitLakhs >= 0 ? 'text-[#A3E635]' : 'text-[#FCA5A5]'
                            }`}
                          >
                            ₹{d.avgProfitLakhs}L
                          </span>
                        </div>
                        <div className="text-[10px] text-[#A3E635] pt-1">Click to select region</div>
                      </div>
                    );
                  }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  wrapperStyle={{ paddingBottom: '12px', fontSize: '11px', fontWeight: 600 }}
                />
                <Bar
                  dataKey="avgRevenueLakhs"
                  name="Avg Revenue (₹ Lakhs)"
                  fill="#1B3022"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={32}
                  cursor="pointer"
                />
                <Bar
                  dataKey="avgProfitLakhs"
                  name="Avg Net Profit (₹ Lakhs)"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={32}
                  cursor="pointer"
                >
                  {chartData.map((entry) => (
                    <Cell
                      key={`cell-profit-${entry.id}`}
                      fill={
                        entry.isSelected
                          ? '#A3E635'
                          : entry.avgProfitLakhs >= 0
                          ? '#2F9E44'
                          : '#EF4444'
                      }
                      cursor="pointer"
                    />
                  ))}
                </Bar>
              </BarChart>
            ) : activeChartLens === 'water' ? (
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 20, left: -5, bottom: 20 }}
                onClick={(e: any) => {
                  if (e && e.activePayload && e.activePayload[0]) {
                    const regId = e.activePayload[0].payload.id;
                    setSelectedRegionId(regId);
                  }
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F4EC" vertical={false} />
                <XAxis
                  dataKey="shortName"
                  tick={{ fill: '#707D72', fontSize: 11, fontWeight: 600 }}
                  axisLine={{ stroke: '#E2E8DE' }}
                  tickLine={false}
                  dy={8}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fill: '#707D72', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  unit=" m³"
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: '#707D72', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  unit=" t"
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload || !payload.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="bg-[#1B3022] text-white p-3 rounded-2xl shadow-xl text-xs border border-white/10 space-y-1">
                        <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-1.5">
                          <span className="font-bold text-[#A3E635]">{d.name}</span>
                        </div>
                        <div className="flex justify-between gap-4 pt-1">
                          <span className="text-white/80">Water Used:</span>
                          <span className="font-mono font-bold text-white">{d.avgWater.toLocaleString()} m³</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-white/80">Water Productivity:</span>
                          <span className="font-mono font-bold text-[#A3E635]">{d.avgWaterEff} t/1000m³</span>
                        </div>
                        <div className="text-[10px] text-[#A3E635] pt-1">Click to select region</div>
                      </div>
                    );
                  }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  wrapperStyle={{ paddingBottom: '12px', fontSize: '11px', fontWeight: 600 }}
                />
                <Bar
                  yAxisId="left"
                  dataKey="avgWater"
                  name="Water Usage (m³)"
                  fill="#3B82F6"
                  opacity={0.85}
                  radius={[8, 8, 0, 0]}
                  maxBarSize={32}
                  cursor="pointer"
                >
                  {chartData.map((entry) => (
                    <Cell
                      key={`cell-water-${entry.id}`}
                      fill={entry.isSelected ? '#A3E635' : '#3B82F6'}
                    />
                  ))}
                </Bar>
                <Bar
                  yAxisId="right"
                  dataKey="avgWaterEff"
                  name="Water Efficiency (t/1000m³)"
                  fill="#1B3022"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={24}
                  cursor="pointer"
                />
              </BarChart>
            ) : (
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 20, left: -5, bottom: 20 }}
                onClick={(e: any) => {
                  if (e && e.activePayload && e.activePayload[0]) {
                    const regId = e.activePayload[0].payload.id;
                    setSelectedRegionId(regId);
                  }
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F4EC" vertical={false} />
                <XAxis
                  dataKey="shortName"
                  tick={{ fill: '#707D72', fontSize: 11, fontWeight: 600 }}
                  axisLine={{ stroke: '#E2E8DE' }}
                  tickLine={false}
                  dy={8}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fill: '#707D72', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  unit=" mm"
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: '#707D72', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  unit=" °C"
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload || !payload.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="bg-[#1B3022] text-white p-3 rounded-2xl shadow-xl text-xs border border-white/10 space-y-1">
                        <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-1.5">
                          <span className="font-bold text-[#A3E635]">{d.name}</span>
                        </div>
                        <div className="flex justify-between gap-4 pt-1">
                          <span className="text-white/80">Mean Rainfall:</span>
                          <span className="font-mono font-bold text-white">{d.avgRainfall} mm</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-white/80">Mean Temperature:</span>
                          <span className="font-mono font-bold text-white">{d.avgTemp} °C</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-white/80">Disease Risk:</span>
                          <span className="font-mono font-bold text-[#FCA5A5]">{d.avgDiseaseRisk}%</span>
                        </div>
                        <div className="text-[10px] text-[#A3E635] pt-1">Click to select region</div>
                      </div>
                    );
                  }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  wrapperStyle={{ paddingBottom: '12px', fontSize: '11px', fontWeight: 600 }}
                />
                <Bar
                  yAxisId="left"
                  dataKey="avgRainfall"
                  name="Rainfall (mm)"
                  fill="#0284C7"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={32}
                  cursor="pointer"
                >
                  {chartData.map((entry) => (
                    <Cell
                      key={`cell-rain-${entry.id}`}
                      fill={entry.isSelected ? '#A3E635' : '#0284C7'}
                    />
                  ))}
                </Bar>
                <Bar
                  yAxisId="right"
                  dataKey="avgTemp"
                  name="Temperature (°C)"
                  fill="#EA580C"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={24}
                  cursor="pointer"
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-between text-xs text-[#707D72] pt-2 border-t border-[#E2E8DE]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#A3E635]" />
            <span>Currently Active Selection: <strong className="text-[#1B3022]">{selectedRegion.state}</strong></span>
          </div>
          <span className="text-[11px] font-medium hidden sm:inline">
            Geographic coordinates omitted per ground-truth protocol · Direct categorical mapping active
          </span>
        </div>
      </div>

      {/* 5. Region Cards Selector Carousel / Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#1B3022] font-display">
              Regional Belts Directory ({filteredRegions.length} of {ACTUAL_REGIONS_DATA.length} States)
            </h3>
            <p className="text-xs text-[#707D72]">
              Select a state to inspect localized micro-district telemetry, crop breakdowns, and input costs.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredRegions.map((reg) => {
            const isSelected = reg.id === selectedRegion.id;
            return (
              <div
                key={reg.id}
                id={`region-card-${reg.id}`}
                onClick={() => setSelectedRegionId(reg.id)}
                className={`p-5 rounded-[28px] border transition-all cursor-pointer space-y-3.5 relative ${
                  isSelected
                    ? 'bg-[#1B3022] text-white border-[#1B3022] shadow-md ring-2 ring-[#A3E635]/40'
                    : 'bg-white text-[#2C332E] border-[#E2E8DE] hover:border-[#347A52] hover:shadow-xs'
                }`}
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isSelected
                          ? 'bg-[#A3E635] text-[#1B3022]'
                          : 'bg-[#F0F7EE] text-[#347A52]'
                      }`}
                    >
                      <MapPin className="w-4 h-4 stroke-[2.2]" />
                    </div>
                    <div>
                      <h4
                        className={`text-sm font-bold font-display ${
                          isSelected ? 'text-white' : 'text-[#1B3022]'
                        }`}
                      >
                        {reg.state}
                      </h4>
                      <span
                        className={`text-[10px] ${
                          isSelected ? 'text-white/70' : 'text-[#707D72]'
                        }`}
                      >
                        {reg.plotCount} Surveyed Plots
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      reg.profitMarginPct >= 0
                        ? isSelected
                          ? 'bg-[#A3E635] text-[#1B3022]'
                          : 'bg-[#F0F7EE] text-[#2F9E44] border border-[#E2E8DE]'
                        : isSelected
                        ? 'bg-[#FEF2F2] text-[#991B1B]'
                        : 'bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA]'
                    }`}
                  >
                    {reg.profitMarginPct >= 0 ? `+${reg.profitMarginPct}%` : `${reg.profitMarginPct}%`}
                  </span>
                </div>

                {/* Key Metrics row */}
                <div
                  className={`grid grid-cols-2 gap-2 p-2.5 rounded-2xl text-xs ${
                    isSelected ? 'bg-white/10' : 'bg-[#F8FAF5] border border-[#E2E8DE]'
                  }`}
                >
                  <div>
                    <span
                      className={`text-[10px] uppercase font-bold block ${
                        isSelected ? 'text-white/70' : 'text-[#707D72]'
                      }`}
                    >
                      Avg Yield
                    </span>
                    <span
                      className={`text-sm font-bold font-mono ${
                        isSelected ? 'text-white' : 'text-[#1B3022]'
                      }`}
                    >
                      {reg.avgYield} t/ha
                    </span>
                  </div>
                  <div>
                    <span
                      className={`text-[10px] uppercase font-bold block ${
                        isSelected ? 'text-white/70' : 'text-[#707D72]'
                      }`}
                    >
                      Avg Net Profit
                    </span>
                    <span
                      className={`text-sm font-bold font-mono ${
                        reg.avgProfit >= 0
                          ? isSelected
                            ? 'text-[#A3E635]'
                            : 'text-[#2F9E44]'
                          : isSelected
                          ? 'text-[#FCA5A5]'
                          : 'text-[#991B1B]'
                      }`}
                    >
                      {formatINR(reg.avgProfit)}
                    </span>
                  </div>
                </div>

                {/* Districts and crops preview */}
                <div className="space-y-1 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className={isSelected ? 'text-white/60' : 'text-[#707D72]'}>Districts:</span>
                    <span className={`font-semibold truncate max-w-[130px] ${isSelected ? 'text-white' : 'text-[#1B3022]'}`}>
                      {reg.districts.join(', ')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={isSelected ? 'text-white/60' : 'text-[#707D72]'}>Primary Crops:</span>
                    <span className={`font-semibold truncate max-w-[130px] ${isSelected ? 'text-[#A3E635]' : 'text-[#347A52]'}`}>
                      {reg.crops.slice(0, 3).join(', ')}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Selected Region Deep-Dive Section: Telemetry, Seasons, Crops, Environment, Resources & Economics */}
      <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#E2E8DE] shadow-xs space-y-6">
        {/* Selected Region Profile Banner */}
        <div className="bg-[#F8FAF5] rounded-[24px] p-5 sm:p-6 border border-[#E2E8DE]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#1B3022] text-white flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#A3E635]" />
                  {selectedRegion.state}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white text-[#707D72] border border-[#E2E8DE]">
                  {selectedRegion.zone}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white text-[#707D72] border border-[#E2E8DE]">
                  {selectedRegion.climate}
                </span>
              </div>
              <p className="text-xs text-[#525E54] pt-1 leading-relaxed max-w-2xl">
                <strong className="text-[#1B3022]">Primary Soil:</strong> {selectedRegion.primarySoil} ·{' '}
                <strong className="text-[#1B3022]">Key Advantage:</strong> {selectedRegion.keyAdvantage}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="px-3.5 py-2 rounded-2xl bg-white border border-[#E2E8DE] text-right">
                <span className="text-[10px] font-bold uppercase text-[#707D72] block">Surveyed Land</span>
                <span className="text-sm font-bold text-[#1B3022] font-mono">
                  {selectedRegion.totalFarmArea} ha total
                </span>
              </div>
              <div className="px-3.5 py-2 rounded-2xl bg-white border border-[#E2E8DE] text-right">
                <span className="text-[10px] font-bold uppercase text-[#707D72] block">Cumulative Output</span>
                <span className="text-sm font-bold text-[#1B3022] font-mono">
                  {selectedRegion.totalProduction} Tonnes
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Drill-down Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#E2E8DE] pb-3 overflow-x-auto">
          {[
            { id: 'seasonal', label: 'Seasonal Performance', icon: Sprout },
            { id: 'crops', label: 'Crop Performance', icon: Wheat },
            { id: 'environment', label: 'Environmental Conditions', icon: Thermometer },
            { id: 'resources', label: 'Resource Usage', icon: Droplets },
            { id: 'economic', label: 'Economic Performance', icon: Coins },
            { id: 'plots', label: 'Farm Plots Audit', icon: Layers },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeDrilldownTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveDrilldownTab(tab.id as any)}
                className={`px-4 py-2 text-xs font-bold rounded-full flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#1B3022] text-[#A3E635] shadow-xs'
                    : 'text-[#707D72] hover:text-[#1B3022] hover:bg-[#F0F7EE]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Seasonal Performance */}
        {activeDrilldownTab === 'seasonal' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {selectedRegion.seasonalPerformance.map((seas) => (
                <div
                  key={seas.season}
                  className="bg-[#F8FAF5] rounded-[24px] p-5 border border-[#E2E8DE] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#1B3022] text-[#A3E635]">
                      {seas.season}
                    </span>
                    <span className="text-xs text-[#707D72] font-medium">
                      {seas.plotCount} plot{seas.plotCount > 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#707D72] block">Avg Yield</span>
                      <span className="text-base font-extrabold text-[#1B3022] font-mono">
                        {seas.avgYield} t/ha
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#707D72] block">Output</span>
                      <span className="text-base font-extrabold text-[#1B3022] font-mono">
                        {seas.totalProduction} t
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#707D72] block">Avg Profit</span>
                      <span
                        className={`text-base font-extrabold font-mono ${
                          seas.avgProfit >= 0 ? 'text-[#2F9E44]' : 'text-[#991B1B]'
                        }`}
                      >
                        {formatINR(seas.avgProfit)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#707D72] block">Water Used</span>
                      <span className="text-base font-extrabold text-[#1B3022] font-mono">
                        {seas.avgWater.toLocaleString()} m³
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#E2E8DE] flex justify-between items-center text-[11px] text-[#707D72]">
                    <span>Rainfall: <strong className="text-[#1B3022]">{seas.avgRainfall} mm</strong></span>
                    <span>Temp: <strong className="text-[#1B3022]">{seas.avgTemperature} °C</strong></span>
                  </div>

                  <div className="text-[11px] text-[#707D72]">
                    <span>Crops: </span>
                    <span className="font-semibold text-[#1B3022]">{seas.crops.join(', ')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Crop Performance */}
        {activeDrilldownTab === 'crops' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedRegion.cropPerformance.map((crp) => (
                <div
                  key={crp.crop}
                  className="bg-[#F8FAF5] rounded-[24px] p-5 border border-[#E2E8DE] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-[#F0F7EE] text-[#347A52] flex items-center justify-center">
                        <Wheat className="w-4 h-4 stroke-[2]" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#1B3022] font-display">{crp.crop}</h4>
                        <span className="text-[10px] text-[#707D72]">{crp.plotCount} plot{crp.plotCount > 1 ? 's' : ''}</span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        crp.avgProfit >= 0
                          ? 'bg-[#F0F7EE] text-[#2F9E44]'
                          : 'bg-[#FEF2F2] text-[#991B1B]'
                      }`}
                    >
                      {formatINR(crp.avgProfit)}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#707D72] block">Avg Yield</span>
                      <span className="text-sm font-bold text-[#1B3022] font-mono">{crp.avgYield} t/ha</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#707D72] block">Production</span>
                      <span className="text-sm font-bold text-[#1B3022] font-mono">{crp.totalProduction} t</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#707D72] block">Water</span>
                      <span className="text-sm font-bold text-[#1B3022] font-mono">{crp.avgWater.toLocaleString()} m³</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#E2E8DE] flex justify-between items-center text-[11px] text-[#707D72]">
                    <span>Disease Risk: <strong className="text-[#1B3022]">{crp.avgRisk}%</strong></span>
                    <span>Avg Area: <strong className="text-[#1B3022]">{crp.avgArea} ha</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Environmental Conditions */}
        {activeDrilldownTab === 'environment' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-[#F8FAF5] border border-[#E2E8DE] space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#707D72] flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-[#EA580C]" /> Mean Temperature
                </span>
                <span className="text-xl font-bold text-[#1B3022] font-mono block">
                  {selectedRegion.avgTemperature} °C
                </span>
                <p className="text-[11px] text-[#707D72]">Subtropical thermal belt</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8FAF5] border border-[#E2E8DE] space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#707D72] flex items-center gap-1">
                  <CloudRain className="w-3.5 h-3.5 text-[#0284C7]" /> Mean Rainfall
                </span>
                <span className="text-xl font-bold text-[#1B3022] font-mono block">
                  {selectedRegion.avgRainfall} mm
                </span>
                <p className="text-[11px] text-[#707D72]">Hydrologic season intake</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8FAF5] border border-[#E2E8DE] space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#707D72] flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-[#2563EB]" /> Relative Humidity
                </span>
                <span className="text-xl font-bold text-[#1B3022] font-mono block">
                  {selectedRegion.avgHumidity}%
                </span>
                <p className="text-[11px] text-[#707D72]">Atmospheric moisture</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8FAF5] border border-[#E2E8DE] space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#707D72] flex items-center gap-1">
                  <Sun className="w-3.5 h-3.5 text-[#D97706]" /> Daily Sunlight
                </span>
                <span className="text-xl font-bold text-[#1B3022] font-mono block">
                  {selectedRegion.avgSunlightHours} hrs / day
                </span>
                <p className="text-[11px] text-[#707D72]">Photoperiod intensity</p>
              </div>
            </div>

            {/* Soil Chemistry Telemetry */}
            <div className="p-5 rounded-[24px] bg-[#F8FAF5] border border-[#E2E8DE] space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1B3022]">
                  Soil Chemistry & Macro-Nutrients Profile
                </h4>
                <span className="text-[11px] text-[#707D72]">Lab-sampled telemetry</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-[#E2E8DE]">
                  <span className="text-[10px] font-bold text-[#707D72] block">Soil pH</span>
                  <span className="text-base font-bold text-[#1B3022] font-mono">{selectedRegion.avgSoilPH}</span>
                  <span className="text-[10px] text-[#347A52] block font-semibold">
                    {selectedRegion.avgSoilPH < 6.5 ? 'Slightly Acidic' : selectedRegion.avgSoilPH > 7.3 ? 'Alkaline' : 'Near Neutral'}
                  </span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#E2E8DE]">
                  <span className="text-[10px] font-bold text-[#707D72] block">Soil Moisture</span>
                  <span className="text-base font-bold text-[#1B3022] font-mono">{selectedRegion.avgSoilMoisture}%</span>
                  <span className="text-[10px] text-[#707D72] block">Volumetric %</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#E2E8DE]">
                  <span className="text-[10px] font-bold text-[#707D72] block">Nitrogen (N)</span>
                  <span className="text-base font-bold text-[#1B3022] font-mono">{selectedRegion.avgNitrogen}</span>
                  <span className="text-[10px] text-[#707D72] block">kg / ha</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#E2E8DE]">
                  <span className="text-[10px] font-bold text-[#707D72] block">Phosphorus (P)</span>
                  <span className="text-base font-bold text-[#1B3022] font-mono">{selectedRegion.avgPhosphorus}</span>
                  <span className="text-[10px] text-[#707D72] block">kg / ha</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#E2E8DE]">
                  <span className="text-[10px] font-bold text-[#707D72] block">Potassium (K)</span>
                  <span className="text-base font-bold text-[#1B3022] font-mono">{selectedRegion.avgPotassium}</span>
                  <span className="text-[10px] text-[#707D72] block">kg / ha</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Resource Usage */}
        {activeDrilldownTab === 'resources' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-[24px] bg-[#F8FAF5] border border-[#E2E8DE] space-y-2">
                <span className="text-[10px] uppercase font-bold text-[#707D72] flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-[#2563EB]" /> Hydrologic Volume
                </span>
                <span className="text-2xl font-extrabold text-[#1B3022] font-mono block">
                  {selectedRegion.avgWaterUsage.toLocaleString()} m³
                </span>
                <p className="text-xs text-[#707D72]">
                  Total regional consumption:{' '}
                  <strong className="text-[#1B3022]">{selectedRegion.totalWaterUsage.toLocaleString()} m³</strong>
                </p>
              </div>

              <div className="p-5 rounded-[24px] bg-[#F8FAF5] border border-[#E2E8DE] space-y-2">
                <span className="text-[10px] uppercase font-bold text-[#707D72] flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5 text-[#347A52]" /> Water Efficiency
                </span>
                <span className="text-2xl font-extrabold text-[#1B3022] font-mono block">
                  {selectedRegion.avgWaterEfficiency} t / 1000m³
                </span>
                <p className="text-xs text-[#707D72]">
                  Biomass output per thousand cubic meters
                </p>
              </div>

              <div className="p-5 rounded-[24px] bg-[#F8FAF5] border border-[#E2E8DE] space-y-2">
                <span className="text-[10px] uppercase font-bold text-[#707D72] flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-[#D97706]" /> Disease & Pest Pressure
                </span>
                <span className="text-2xl font-extrabold text-[#1B3022] font-mono block">
                  {selectedRegion.avgDiseaseRisk}%
                </span>
                <p className="text-xs text-[#707D72]">
                  Pest index across regional crop cycles
                </p>
              </div>
            </div>

            {/* Input Application & Irrigation Distribution */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-[24px] bg-[#F8FAF5] border border-[#E2E8DE] space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1B3022]">
                  Agrochemical Inputs Application
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-[#E2E8DE]">
                    <span className="text-[#707D72]">Fertilizer Application Rate:</span>
                    <span className="font-mono font-bold text-[#1B3022]">
                      {selectedRegion.avgFertilizer} kg / ha
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-[#E2E8DE]">
                    <span className="text-[#707D72]">Pesticide Dosage Rate:</span>
                    <span className="font-mono font-bold text-[#1B3022]">
                      {selectedRegion.avgPesticide} L / ha
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-[#E2E8DE]">
                    <span className="text-[#707D72]">Mean Seed Quality Index:</span>
                    <span className="font-mono font-bold text-[#347A52]">
                      {selectedRegion.avgSeedScore} / 1.00
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-[24px] bg-[#F8FAF5] border border-[#E2E8DE] space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1B3022]">
                  Irrigation Systems Deployed
                </h4>
                <div className="space-y-2 text-xs">
                  {Object.entries(selectedRegion.irrigationCounts).map(([method, count]) => {
                    const numCount = Number(count);
                    return (
                      <div
                        key={method}
                        className="flex justify-between items-center p-3 bg-white rounded-xl border border-[#E2E8DE]"
                      >
                        <span className="font-semibold text-[#1B3022]">{method} Irrigation</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#F0F7EE] text-[#1B3022] font-mono font-bold text-xs">
                          {numCount} plot{numCount > 1 ? 's' : ''} ({Math.round((numCount / selectedRegion.plotCount) * 100)}%)
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Economic Performance */}
        {activeDrilldownTab === 'economic' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-[#F8FAF5] border border-[#E2E8DE] space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#707D72]">Total Revenue</span>
                <span className="text-xl font-bold text-[#1B3022] font-mono block">
                  {formatINR(selectedRegion.totalRevenue)}
                </span>
                <p className="text-[11px] text-[#707D72]">
                  Avg: {formatINR(selectedRegion.avgRevenue)} / farm
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8FAF5] border border-[#E2E8DE] space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#707D72]">Total Operating Cost</span>
                <span className="text-xl font-bold text-[#1B3022] font-mono block">
                  {formatINR(selectedRegion.totalCost)}
                </span>
                <p className="text-[11px] text-[#707D72]">
                  Avg: {formatINR(selectedRegion.avgCost)} / farm
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8FAF5] border border-[#E2E8DE] space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#707D72]">Net Regional Profit</span>
                <span
                  className={`text-xl font-bold font-mono block ${
                    selectedRegion.totalProfit >= 0 ? 'text-[#2F9E44]' : 'text-[#991B1B]'
                  }`}
                >
                  {formatINR(selectedRegion.totalProfit)}
                </span>
                <p className="text-[11px] text-[#707D72]">
                  Avg: {formatINR(selectedRegion.avgProfit)} / farm
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8FAF5] border border-[#E2E8DE] space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#707D72]">Profit Margin</span>
                <span
                  className={`text-xl font-bold font-mono block ${
                    selectedRegion.profitMarginPct >= 0 ? 'text-[#2F9E44]' : 'text-[#991B1B]'
                  }`}
                >
                  {selectedRegion.profitMarginPct}%
                </span>
                <p className="text-[11px] text-[#707D72]">
                  Avg Market Price: ₹{selectedRegion.avgMarketPrice.toLocaleString()} / t
                </p>
              </div>
            </div>

            <div className="p-5 rounded-[24px] bg-[#F8FAF5] border border-[#E2E8DE] text-xs text-[#525E54] space-y-1 leading-relaxed">
              <strong className="text-[#1B3022] block font-display text-sm">
                Financial Summary for {selectedRegion.state}:
              </strong>
              {selectedRegion.profitMarginPct >= 0 ? (
                <span>
                  {selectedRegion.state} operates in positive financial territory with a net operating surplus of{' '}
                  {formatINR(selectedRegion.totalProfit)} across {selectedRegion.plotCount} surveyed farm plots. High realization
                  from crops like {selectedRegion.crops.join(' & ')} provides solid cost buffer.
                </span>
              ) : (
                <span>
                  {selectedRegion.state} faces input cost pressure, with total costs ({formatINR(selectedRegion.totalCost)}) exceeding
                  realized crop revenue ({formatINR(selectedRegion.totalRevenue)}). Transitioning towards precision fertilizer scheduling
                  and higher-value rotations will bridge this deficit.
                </span>
              )}
            </div>
          </div>
        )}

        {/* Tab 6: Surveyed Farm Plots Micro-Audit */}
        {activeDrilldownTab === 'plots' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#1B3022]">
                Surveyed Farm Plots in {selectedRegion.state} ({selectedRegion.farms.length} records)
              </h4>
              <span className="text-[11px] text-[#707D72]">Direct from raw_dataset.csv</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-[#E2E8DE] rounded-2xl overflow-hidden">
                <thead className="bg-[#F0F7EE] text-[#1B3022] font-bold text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="p-3">Plot ID</th>
                    <th className="p-3">District</th>
                    <th className="p-3">Crop</th>
                    <th className="p-3">Season</th>
                    <th className="p-3">Area</th>
                    <th className="p-3">Yield</th>
                    <th className="p-3">Revenue</th>
                    <th className="p-3">Profit</th>
                    <th className="p-3">Irrigation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8DE]">
                  {selectedRegion.farms.map((f) => (
                    <tr key={f.farmId} className="hover:bg-[#F8FAF5] transition-colors">
                      <td className="p-3 font-mono font-bold text-[#1B3022]">{f.farmId}</td>
                      <td className="p-3 font-medium text-[#707D72]">{f.district}</td>
                      <td className="p-3 font-semibold text-[#1B3022]">{f.crop}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F0F7EE] text-[#1B3022] border border-[#E2E8DE]">
                          {f.season}
                        </span>
                      </td>
                      <td className="p-3 font-mono">{f.area} ha</td>
                      <td className="p-3 font-mono font-bold text-[#1B3022]">{f.yieldVal} t/ha</td>
                      <td className="p-3 font-mono">{formatINR(f.revenue)}</td>
                      <td
                        className={`p-3 font-mono font-bold ${
                          f.profit >= 0 ? 'text-[#2F9E44]' : 'text-[#991B1B]'
                        }`}
                      >
                        {formatINR(f.profit)}
                      </td>
                      <td className="p-3 text-[#707D72]">{f.irrigation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 7. Regional Insight Card: Summarizes the Most Important Observations from the Actual Dataset */}
      <div className="bg-[#1B3022] rounded-[32px] p-6 sm:p-8 text-white relative overflow-hidden shadow-sm">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#A3E635]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#A3E635] text-[#1B3022] flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-[11px] font-bold tracking-wider text-[#A3E635] uppercase">
                  Dataset Analysis
                </span>
                <h3 className="text-xl font-extrabold font-display text-white tracking-tight">
                  Regional Insights & Key Observations
                </h3>
              </div>
            </div>

            {/* Cyclical Selector for the 4 Ground-Truth Observations */}
            <div className="flex items-center gap-1.5 p-1 bg-white/10 rounded-2xl">
              {DATASET_REGIONAL_INSIGHTS.map((ins, idx) => (
                <button
                  key={ins.region}
                  onClick={() => setActiveInsightIndex(idx)}
                  className={`px-3 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    activeInsightIndex === idx
                      ? 'bg-[#A3E635] text-[#1B3022] shadow-xs'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {ins.region.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Active Insight Content Box */}
          <div className="bg-white/5 rounded-[24px] p-6 border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#A3E635] text-[#1B3022]">
                  {DATASET_REGIONAL_INSIGHTS[activeInsightIndex].badge}
                </span>
                <h4 className="text-lg font-bold text-white font-display mt-2">
                  {DATASET_REGIONAL_INSIGHTS[activeInsightIndex].region} ·{' '}
                  <span className="text-[#A3E635]">
                    {DATASET_REGIONAL_INSIGHTS[activeInsightIndex].metric}
                  </span>
                </h4>
              </div>
            </div>

            <p className="text-sm text-white/90 leading-relaxed">
              {DATASET_REGIONAL_INSIGHTS[activeInsightIndex].summary}
            </p>

            <div className="p-4 rounded-2xl bg-white/10 border border-white/10 flex items-start gap-3">
              <Info className="w-4 h-4 text-[#A3E635] shrink-0 mt-0.5" />
              <div className="text-xs text-white/90">
                <strong className="text-white block">Agronomic Recommendation:</strong>
                {DATASET_REGIONAL_INSIGHTS[activeInsightIndex].recommendation}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

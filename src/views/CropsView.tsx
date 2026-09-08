import React, { useState, useMemo } from 'react';
import {
  Sprout,
  Droplets,
  ShieldAlert,
  TrendingUp,
  TrendingDown,
  Coins,
  Scale,
  Thermometer,
  Search,
  CheckCircle2,
  Info,
  Calendar,
  Layers,
  ArrowRight,
  Sparkles,
  BarChart3,
  SlidersHorizontal,
  X,
  MapPin,
  Flame,
  Activity,
  Award,
  ChevronRight,
  CloudRain,
  ExternalLink,
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
  ScatterChart,
  Scatter,
  ZAxis,
} from 'recharts';
import { SeasonType } from '../types';
import {
  ActualCropPerformance,
  CropFarmSummary,
  CROPS_BY_SEASON_MAP,
  ALL_CROPS_PERFORMANCE,
} from '../data/actualCropData';
import { NoFilterResultsState } from '../components/StateFeedback';
import { useFilters } from '../context/FilterContext';

interface CropsViewProps {
  selectedSeason: SeasonType;
  onSeasonChange: (season: SeasonType) => void;
}

export const CropsView: React.FC<CropsViewProps> = ({
  selectedSeason,
  onSeasonChange,
}) => {
  const { filters, setSearchQuery: setGlobalSearch, clearAllFilters } = useFilters();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [localSearchQuery, setLocalSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<
    'profit' | 'yield' | 'revenue' | 'production' | 'water' | 'diseaseRisk'
  >('profit');
  const [activeChartTab, setActiveChartTab] = useState<
    'yieldProd' | 'economics' | 'water' | 'disease'
  >('yieldProd');
  const [selectedCropModal, setSelectedCropModal] =
    useState<ActualCropPerformance | null>(null);

  // Active global filters
  const activeSeason = filters.season !== 'all' ? filters.season : selectedSeason;
  const activeCrop = filters.crop;
  const activeCategoryFilter = filters.category !== 'all' ? filters.category : activeCategory;
  const activeSearch = filters.searchQuery || localSearchQuery;
  const activeRegion = filters.region;

  // Get crops dataset for the selected season
  const baseCrops: ActualCropPerformance[] =
    CROPS_BY_SEASON_MAP[activeSeason] || ALL_CROPS_PERFORMANCE;

  // Filter and sort crops
  const filteredCrops = useMemo(() => {
    return baseCrops
      .filter((crop) => {
        // Global Crop filter
        if (
          activeCrop !== 'all' &&
          !crop.name.toLowerCase().includes(activeCrop.toLowerCase())
        ) {
          return false;
        }
        // Category filter (global or local tab)
        if (
          activeCategoryFilter !== 'all' &&
          crop.category.toLowerCase() !== activeCategoryFilter.toLowerCase()
        ) {
          return false;
        }
        // Region filter
        if (
          activeRegion !== 'all' &&
          !crop.states.some((s) => s.toLowerCase().includes(activeRegion.toLowerCase()))
        ) {
          return false;
        }
        // Search query
        if (activeSearch.trim() !== '') {
          const q = activeSearch.toLowerCase();
          const matchName = crop.name.toLowerCase().includes(q);
          const matchSci = crop.scientificName.toLowerCase().includes(q);
          const matchNat = crop.nativeName.toLowerCase().includes(q);
          const matchCat = crop.category.toLowerCase().includes(q);
          const matchStates = crop.states.some((s) => s.toLowerCase().includes(q));
          if (!matchName && !matchSci && !matchNat && !matchCat && !matchStates) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'profit') return b.avgProfit - a.avgProfit;
        if (sortBy === 'yield') return b.avgYield - a.avgYield;
        if (sortBy === 'revenue') return b.avgRevenue - a.avgRevenue;
        if (sortBy === 'production') return b.totalProduction - a.totalProduction;
        if (sortBy === 'water') return a.avgWaterUsage - b.avgWaterUsage; // lower water first
        if (sortBy === 'diseaseRisk') return a.avgDiseaseRisk - b.avgDiseaseRisk; // lower risk first
        return 0;
      });
  }, [baseCrops, activeCrop, activeCategoryFilter, activeRegion, activeSearch, sortBy]);

  // Currency formatter
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

  // Categories list
  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'Cereal', label: 'Cereals (Wheat, Rice, Maize)' },
    { id: 'Pulse', label: 'Pulses (Dal / Legumes)' },
    { id: 'Cash Crop', label: 'Cash Crops (Cotton, Sugarcane)' },
    { id: 'Oilseed', label: 'Oilseeds (Groundnut)' },
    { id: 'Horticulture', label: 'Horticulture (Chilli)' },
  ];

  // Season selector pills metadata
  const seasonOptions: {
    id: SeasonType;
    label: string;
    native: string;
    cropsCount: number;
    plotsCount: number;
  }[] = [
    {
      id: 'all',
      label: 'All Seasons',
      native: 'वार्षिक चक्र',
      cropsCount: 8,
      plotsCount: 50,
    },
    {
      id: 'kharif',
      label: 'Kharif',
      native: 'खरीफ (Monsoon)',
      cropsCount: 6,
      plotsCount: 19,
    },
    {
      id: 'rabi',
      label: 'Rabi',
      native: 'रबी (Winter)',
      cropsCount: 6,
      plotsCount: 20,
    },
    {
      id: 'zaid',
      label: 'Zaid',
      native: 'जायद (Summer)',
      cropsCount: 7,
      plotsCount: 11,
    },
  ];

  // Prepare chart dataset from current filtered crops
  const chartData = useMemo(() => {
    return filteredCrops.map((c) => ({
      name: c.name,
      nativeName: c.nativeName,
      category: c.category,
      yield: c.avgYield,
      production: c.totalProduction,
      avgProduction: c.avgProduction,
      revenue: Math.round(c.avgRevenue / 1000), // in thousands
      profit: Math.round(c.avgProfit / 1000), // in thousands
      margin: c.profitMarginPct,
      water: c.avgWaterUsage,
      waterEff: c.avgWaterEfficiency,
      diseaseRisk: c.avgDiseaseRisk,
      plotCount: c.plotCount,
    }));
  }, [filteredCrops]);

  // Overall dataset summary highlights
  const highestProfitCrop = useMemo(() => {
    return [...baseCrops].sort((a, b) => b.avgProfit - a.avgProfit)[0];
  }, [baseCrops]);

  const highestYieldCrop = useMemo(() => {
    return [...baseCrops].sort((a, b) => b.avgYield - a.avgYield)[0];
  }, [baseCrops]);

  const lowestWaterCrop = useMemo(() => {
    return [...baseCrops].sort((a, b) => a.avgWaterUsage - b.avgWaterUsage)[0];
  }, [baseCrops]);

  const lowestDiseaseCrop = useMemo(() => {
    return [...baseCrops].sort((a, b) => a.avgDiseaseRisk - b.avgDiseaseRisk)[0];
  }, [baseCrops]);

  return (
    <div id="crops-page-container" className="space-y-8">
      {/* 1. Header Banner with Ground-Truth Context & Season Switching */}
      <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#E2E8DE] shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#F0F7EE] text-[#1B3022] border border-[#E2E8DE] flex items-center gap-1.5">
                <Sprout className="w-3.5 h-3.5 text-[#347A52]" />
                Crop Performance Directory
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#1B3022] text-[#A3E635] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Actual CSV Dataset (50 Farm Plots · 8 Cultivars)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1B3022] tracking-tight font-display mt-2.5">
              Crop-Level Agronomic & Economic Telemetry
            </h1>
            <p className="text-xs sm:text-sm text-[#707D72] mt-1 max-w-3xl leading-relaxed">
              In-depth performance across 8 monitored cultivars. Every yield metric, output tonnage, revenue, net profit margin, hydrological volume, and pathogen vulnerability is computed directly from surveyed farm records.
            </p>
          </div>

          {/* Season Filter Selector */}
          <div className="flex flex-col gap-2 shrink-0">
            <span className="text-[11px] font-bold text-[#707D72] uppercase tracking-wider">
              Filter by Cultivation Season
            </span>
            <div
              id="crop-season-filters"
              className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F0F7EE] rounded-2xl border border-[#E2E8DE]"
            >
              {seasonOptions.map((s) => {
                const isSelected = selectedSeason === s.id;
                return (
                  <button
                    key={s.id}
                    id={`filter-season-${s.id}`}
                    onClick={() => onSeasonChange(s.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#1B3022] text-white shadow-2xs'
                        : 'text-[#707D72] hover:text-[#1B3022] hover:bg-white/60'
                    }`}
                  >
                    <span>{s.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isSelected
                          ? 'bg-[#A3E635] text-[#1B3022]'
                          : 'bg-white text-[#707D72] border border-[#E2E8DE]'
                      }`}
                    >
                      {s.cropsCount}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 4 Spotlight Agronomic Insights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-6 pt-6 border-t border-[#E2E8DE]">
          {/* Highest Profit */}
          {highestProfitCrop && (
            <div className="p-3.5 rounded-2xl bg-[#F8FAF5] border border-[#E2E8DE] flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#E2E8DE] flex items-center justify-center text-xl shrink-0">
                {highestProfitCrop.emoji}
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] uppercase font-bold text-[#2F9E44] block">
                  Top Net Margin
                </span>
                <div className="flex items-baseline justify-between gap-1">
                  <span className="text-sm font-bold text-[#1B3022] truncate">
                    {highestProfitCrop.name}
                  </span>
                  <span className="text-xs font-bold text-[#2F9E44] font-mono shrink-0">
                    +{highestProfitCrop.profitMarginPct.toFixed(1)}%
                  </span>
                </div>
                <p className="text-[11px] text-[#707D72] font-mono">
                  {formatINR(highestProfitCrop.avgProfit)} net / farm
                </p>
              </div>
            </div>
          )}

          {/* Highest Yield */}
          {highestYieldCrop && (
            <div className="p-3.5 rounded-2xl bg-[#F8FAF5] border border-[#E2E8DE] flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#E2E8DE] flex items-center justify-center text-xl shrink-0">
                {highestYieldCrop.emoji}
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] uppercase font-bold text-[#347A52] block">
                  Peak Biomass Yield
                </span>
                <div className="flex items-baseline justify-between gap-1">
                  <span className="text-sm font-bold text-[#1B3022] truncate">
                    {highestYieldCrop.name}
                  </span>
                  <span className="text-xs font-bold text-[#347A52] font-mono shrink-0">
                    {highestYieldCrop.avgYield.toFixed(1)} t/ha
                  </span>
                </div>
                <p className="text-[11px] text-[#707D72] font-mono">
                  {highestYieldCrop.totalProduction.toLocaleString()} t total output
                </p>
              </div>
            </div>
          )}

          {/* Water Conservation */}
          {lowestWaterCrop && (
            <div className="p-3.5 rounded-2xl bg-[#F8FAF5] border border-[#E2E8DE] flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#E2E8DE] flex items-center justify-center text-xl shrink-0">
                {lowestWaterCrop.emoji}
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] uppercase font-bold text-[#347A52] block">
                  Lowest Water Influx
                </span>
                <div className="flex items-baseline justify-between gap-1">
                  <span className="text-sm font-bold text-[#1B3022] truncate">
                    {lowestWaterCrop.name}
                  </span>
                  <span className="text-xs font-bold text-[#1B3022] font-mono shrink-0">
                    {lowestWaterCrop.avgWaterUsage.toLocaleString()} m³
                  </span>
                </div>
                <p className="text-[11px] text-[#707D72] font-mono">
                  {lowestWaterCrop.avgWaterEfficiency.toFixed(2)} t / 1,000 m³
                </p>
              </div>
            </div>
          )}

          {/* Lowest Disease Risk */}
          {lowestDiseaseCrop && (
            <div className="p-3.5 rounded-2xl bg-[#F8FAF5] border border-[#E2E8DE] flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#E2E8DE] flex items-center justify-center text-xl shrink-0">
                {lowestDiseaseCrop.emoji}
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] uppercase font-bold text-[#2F9E44] block">
                  Optimal Disease Resistance
                </span>
                <div className="flex items-baseline justify-between gap-1">
                  <span className="text-sm font-bold text-[#1B3022] truncate">
                    {lowestDiseaseCrop.name}
                  </span>
                  <span className="text-xs font-bold text-[#2F9E44] font-mono shrink-0">
                    {lowestDiseaseCrop.avgDiseaseRisk.toFixed(1)}% Risk
                  </span>
                </div>
                <p className="text-[11px] text-[#707D72] font-mono">
                  {lowestDiseaseCrop.plotCount} surveyed plots
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Interactive Charts Suite (Visualizing Cross-Crop Telemetry) */}
      <div
        id="crop-interactive-charts"
        className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#E2E8DE] shadow-xs space-y-5"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E2E8DE]">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#347A52]" />
              <h2 className="text-lg sm:text-xl font-bold text-[#1B3022] font-display">
                Comparative Crop Performance Visualizer
              </h2>
            </div>
            <p className="text-xs text-[#707D72] mt-0.5">
              Interactive side-by-side benchmark of the {filteredCrops.length} active cultivars across agricultural, hydrologic, and economic dimensions
            </p>
          </div>

          {/* Chart View Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-[#F0F7EE] rounded-full border border-[#E2E8DE] self-start md:self-auto overflow-x-auto">
            {(
              [
                { id: 'yieldProd', label: 'Yield & Production' },
                { id: 'economics', label: 'Revenue & Profit' },
                { id: 'water', label: 'Water Usage & Efficiency' },
                { id: 'disease', label: 'Disease & Pest Risk' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                id={`chart-tab-${tab.id}`}
                onClick={() => setActiveChartTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeChartTab === tab.id
                    ? 'bg-[#1B3022] text-white shadow-2xs'
                    : 'text-[#707D72] hover:text-[#1B3022]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Chart Display */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {activeChartTab === 'yieldProd' ? (
              <BarChart
                data={chartData}
                margin={{ top: 15, right: 15, left: -15, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F7EE" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#707D72', fontSize: 12, fontWeight: 600 }}
                  axisLine={{ stroke: '#E2E8DE' }}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fill: '#707D72', fontSize: 11 }}
                  axisLine={{ stroke: '#E2E8DE' }}
                  label={{
                    value: 'Yield (t/ha)',
                    angle: -90,
                    position: 'insideLeft',
                    fill: '#707D72',
                    fontSize: 10,
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: '#707D72', fontSize: 11 }}
                  axisLine={{ stroke: '#E2E8DE' }}
                  label={{
                    value: 'Total Production (t)',
                    angle: 90,
                    position: 'insideRight',
                    fill: '#707D72',
                    fontSize: 10,
                  }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-[#1B3022] text-white p-3 rounded-xl shadow-xl text-xs space-y-1">
                          <div className="font-bold text-[#A3E635] text-sm flex items-center justify-between gap-3">
                            <span>{d.name} ({d.nativeName})</span>
                            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full font-mono">
                              {d.plotCount} plots
                            </span>
                          </div>
                          <div className="text-[#E2E8DE]">{d.category}</div>
                          <div className="pt-1 border-t border-white/15 space-y-0.5">
                            <div>Average Yield: <strong className="text-white">{d.yield} t/ha</strong></div>
                            <div>Total Production: <strong className="text-white">{d.production} Tonnes</strong></div>
                            <div>Mean Output / Farm: <strong className="text-white">{d.avgProduction} Tonnes</strong></div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  yAxisId="left"
                  dataKey="yield"
                  name="Average Yield (t/ha)"
                  fill="#347A52"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  yAxisId="right"
                  dataKey="production"
                  name="Total Production (t)"
                  fill="#A3E635"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            ) : activeChartTab === 'economics' ? (
              <BarChart
                data={chartData}
                margin={{ top: 15, right: 15, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F7EE" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#707D72', fontSize: 12, fontWeight: 600 }}
                  axisLine={{ stroke: '#E2E8DE' }}
                />
                <YAxis
                  tick={{ fill: '#707D72', fontSize: 11 }}
                  axisLine={{ stroke: '#E2E8DE' }}
                  label={{
                    value: 'Amount (₹ Thousands)',
                    angle: -90,
                    position: 'insideLeft',
                    fill: '#707D72',
                    fontSize: 10,
                  }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-[#1B3022] text-white p-3 rounded-xl shadow-xl text-xs space-y-1">
                          <div className="font-bold text-[#A3E635] text-sm">
                            {d.name} Financial Economics
                          </div>
                          <div>Average Revenue: <strong>₹{d.revenue}k ({formatINR(d.revenue * 1000)})</strong></div>
                          <div>
                            Average Net Profit:{' '}
                            <strong className={d.profit >= 0 ? 'text-[#A3E635]' : 'text-red-400'}>
                              {d.profit >= 0 ? '+' : ''}₹{d.profit}k ({formatINR(d.profit * 1000)})
                            </strong>
                          </div>
                          <div>
                            Net Profit Margin:{' '}
                            <strong className={d.margin >= 0 ? 'text-[#A3E635]' : 'text-red-400'}>
                              {d.margin > 0 ? '+' : ''}{d.margin.toFixed(1)}%
                            </strong>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="revenue"
                  name="Average Revenue (₹k)"
                  fill="#1B3022"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="profit"
                  name="Average Net Profit (₹k)"
                  radius={[6, 6, 0, 0]}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`profit-cell-${index}`}
                      fill={entry.profit >= 0 ? '#2F9E44' : '#C53030'}
                    />
                  ))}
                </Bar>
              </BarChart>
            ) : activeChartTab === 'water' ? (
              <BarChart
                data={chartData}
                margin={{ top: 15, right: 15, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F7EE" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#707D72', fontSize: 12, fontWeight: 600 }}
                  axisLine={{ stroke: '#E2E8DE' }}
                />
                <YAxis
                  yAxisId="waterY"
                  tick={{ fill: '#707D72', fontSize: 11 }}
                  axisLine={{ stroke: '#E2E8DE' }}
                  label={{
                    value: 'Water Influx (m³)',
                    angle: -90,
                    position: 'insideLeft',
                    fill: '#707D72',
                    fontSize: 10,
                  }}
                />
                <YAxis
                  yAxisId="effY"
                  orientation="right"
                  tick={{ fill: '#707D72', fontSize: 11 }}
                  axisLine={{ stroke: '#E2E8DE' }}
                  label={{
                    value: 'Efficiency (t/1000m³)',
                    angle: 90,
                    position: 'insideRight',
                    fill: '#707D72',
                    fontSize: 10,
                  }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-[#1B3022] text-white p-3 rounded-xl shadow-xl text-xs space-y-1">
                          <div className="font-bold text-[#A3E635] text-sm">
                            {d.name} Hydrological Telemetry
                          </div>
                          <div>Mean Water Usage: <strong>{d.water.toLocaleString()} m³ / plot</strong></div>
                          <div>Water Productivity: <strong className="text-[#A3E635]">{d.waterEff} t / 1,000 m³</strong></div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  yAxisId="waterY"
                  dataKey="water"
                  name="Water Used (m³)"
                  fill="#347A52"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  yAxisId="effY"
                  dataKey="waterEff"
                  name="Efficiency (t/1000m³)"
                  fill="#A3E635"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            ) : (
              <BarChart
                data={chartData}
                margin={{ top: 15, right: 15, left: -15, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F7EE" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#707D72', fontSize: 12, fontWeight: 600 }}
                  axisLine={{ stroke: '#E2E8DE' }}
                />
                <YAxis
                  tick={{ fill: '#707D72', fontSize: 11 }}
                  axisLine={{ stroke: '#E2E8DE' }}
                  label={{
                    value: 'Disease Risk (%)',
                    angle: -90,
                    position: 'insideLeft',
                    fill: '#707D72',
                    fontSize: 10,
                  }}
                  domain={[0, 70]}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-[#1B3022] text-white p-3 rounded-xl shadow-xl text-xs space-y-1">
                          <div className="font-bold text-[#A3E635] text-sm">
                            {d.name} Disease Vulnerability
                          </div>
                          <div>
                            Pathogen Pressure: <strong>{d.diseaseRisk.toFixed(1)}%</strong>
                          </div>
                          <div className="text-[11px] text-[#E2E8DE]">
                            {d.diseaseRisk > 48
                              ? 'High Disease Pressure - Strict preventive bio-protection required'
                              : d.diseaseRisk > 38
                              ? 'Moderate Disease Pressure - Standard monitoring'
                              : 'Low Pathogen Pressure - Highly resilient cultivar'}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="diseaseRisk"
                  name="Disease & Pest Risk (%)"
                  radius={[6, 6, 0, 0]}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`disease-cell-${index}`}
                      fill={
                        entry.diseaseRisk > 48
                          ? '#C53030'
                          : entry.diseaseRisk > 40
                          ? '#E67E22'
                          : '#2F9E44'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Chart Explanatory Legend / Footer */}
        <div className="p-3 rounded-2xl bg-[#F8FAF5] border border-[#E2E8DE] flex flex-wrap items-center justify-between gap-3 text-xs text-[#707D72]">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#347A52] shrink-0" />
            <span>
              {activeChartTab === 'yieldProd' &&
                'Dark green bars represent average yields per hectare. Light green bars represent cumulative production harvested across all surveyed plots.'}
              {activeChartTab === 'economics' &&
                'Black bars show average gross revenue per farm. Green bars indicate profitable crops (e.g. Chilli, Groundnut, Sugarcane) while red bars indicate deficit margins.'}
              {activeChartTab === 'water' &&
                'Water usage tracks cumulative irrigation volume per plot (m³), contrasted against productivity ratio (Tonnes produced per 1,000 m³).'}
              {activeChartTab === 'disease' &&
                'Disease and pest risk index tracks recorded fungal, bacterial, and pest vulnerability. Red reflects >48% pathogen incidence.'}
            </span>
          </div>
          <span className="font-mono font-bold text-[#1B3022]">
            Season: {selectedSeason.toUpperCase()}
          </span>
        </div>
      </div>

      {/* 3. Search, Category Filters, and Sort Controls */}
      <div className="bg-white rounded-[32px] p-5 sm:p-6 border border-[#E2E8DE] shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#707D72] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="crop-search-input"
              type="text"
              value={activeSearch}
              onChange={(e) => {
                setLocalSearchQuery(e.target.value);
                setGlobalSearch(e.target.value);
              }}
              placeholder="Search by crop, botanical, or native name..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-[#F8FAF5] border border-[#E2E8DE] rounded-full text-[#1B3022] placeholder:text-[#707D72] focus:outline-none focus:ring-1 focus:ring-[#A3E635]"
            />
            {activeSearch && (
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

          {/* Sort Selector */}
          <div className="flex items-center gap-2 shrink-0 self-start lg:self-auto">
            <span className="text-xs font-semibold text-[#707D72] flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Sort By:
            </span>
            <select
              id="crop-sort-selector"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs font-semibold bg-[#F8FAF5] text-[#1B3022] border border-[#E2E8DE] rounded-full px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#A3E635] cursor-pointer"
            >
              <option value="profit">Highest Profit (₹)</option>
              <option value="yield">Highest Yield (t/ha)</option>
              <option value="revenue">Highest Revenue (₹)</option>
              <option value="production">Total Production (t)</option>
              <option value="water">Lowest Water Influx (m³)</option>
              <option value="diseaseRisk">Lowest Disease Risk (%)</option>
            </select>
          </div>
        </div>

        {/* Category Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-t border-[#E2E8DE] pt-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              id={`category-chip-${cat.id}`}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer whitespace-nowrap ${
                activeCategory.toLowerCase() === cat.id.toLowerCase()
                  ? 'bg-[#1B3022] text-[#A3E635] shadow-2xs'
                  : 'bg-[#F8FAF5] text-[#707D72] border border-[#E2E8DE] hover:bg-white hover:text-[#1B3022]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Elegant Crop Cards Grid (Not a Table!) */}
      <div id="crop-cards-grid" className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#1B3022] font-display">
              Cultivar Telemetry Cards
            </h2>
            <span className="text-xs font-bold text-[#1B3022] bg-[#F0F7EE] px-2.5 py-0.5 rounded-full border border-[#E2E8DE]">
              {filteredCrops.length} of {baseCrops.length} Cultivars Active
            </span>
          </div>
          <span className="text-xs text-[#707D72]">
            Click any card to inspect individual farm plots & soil telemetry
          </span>
        </div>

        {filteredCrops.length === 0 ? (
          <NoFilterResultsState
            onReset={() => {
              setLocalSearchQuery('');
              setActiveCategory('all');
              clearAllFilters();
              onSeasonChange('all');
            }}
            filterSummary={`"${activeSearch || activeCategoryFilter}"`}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
            {filteredCrops.map((crop) => {
              const isProfitable = crop.avgProfit >= 0;
              const hasHighDisease = crop.avgDiseaseRisk > 48;

              return (
                <div
                  key={crop.id}
                  id={`crop-card-${crop.id}`}
                  onClick={() => setSelectedCropModal(crop)}
                  className="bg-white rounded-[28px] p-6 border border-[#E2E8DE] shadow-xs hover:shadow-md hover:border-[#347A52]/50 transition-all duration-200 cursor-pointer flex flex-col justify-between group relative"
                >
                  {/* Card Header: Emoji, Title, Native Title, Scientific Name, Badges */}
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3.5">
                        <div className="w-13 h-13 rounded-2xl bg-[#F0F7EE] border border-[#E2E8DE] flex items-center justify-center text-3xl shrink-0 group-hover:scale-105 transition-transform">
                          {crop.emoji}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-[#1B3022] font-display tracking-tight group-hover:text-[#347A52] transition-colors">
                              {crop.name}
                            </h3>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#F8FAF5] text-[#707D72] border border-[#E2E8DE]">
                              {crop.nativeName}
                            </span>
                          </div>
                          <p className="text-xs italic text-[#707D72] mt-0.5">
                            {crop.scientificName}
                          </p>
                        </div>
                      </div>

                      {/* Plot Count Badge */}
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#1B3022] text-[#A3E635] font-mono shrink-0 shadow-2xs">
                        N={crop.plotCount} Plots
                      </span>
                    </div>

                    {/* Description snippet */}
                    <p className="text-xs text-[#707D72] mt-3 leading-relaxed line-clamp-2">
                      {crop.description}
                    </p>

                    {/* Season and Category Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-[#F0F7EE]">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#1B3022] text-white">
                        {crop.category}
                      </span>
                      {crop.seasons.map((s) => (
                        <span
                          key={s}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#F0F7EE] text-[#347A52] border border-[#E2E8DE]"
                        >
                          {s}
                        </span>
                      ))}
                      <span className="text-[10px] text-[#707D72] ml-auto font-mono">
                        Market: ₹{crop.avgMarketPrice.toLocaleString()}/t
                      </span>
                    </div>
                  </div>

                  {/* 6 Core Required Metrics Grid (Clean, Spacious Tiles) */}
                  <div className="mt-4 pt-4 border-t border-[#E2E8DE] grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {/* 1. Average Yield */}
                    <div className="p-3 rounded-xl bg-[#F8FAF5] border border-[#E2E8DE] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#707D72] uppercase tracking-wider">
                          Avg Yield
                        </span>
                        <Sprout className="w-3.5 h-3.5 text-[#347A52]" />
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-base sm:text-lg font-bold text-[#1B3022] font-mono">
                          {crop.avgYield.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-[#707D72] font-semibold">t/ha</span>
                      </div>
                      <div className="text-[9px] text-[#707D72] font-mono truncate">
                        Spread: {crop.minYield}–{crop.maxYield}
                      </div>
                    </div>

                    {/* 2. Production */}
                    <div className="p-3 rounded-xl bg-[#F8FAF5] border border-[#E2E8DE] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#707D72] uppercase tracking-wider">
                          Production
                        </span>
                        <Scale className="w-3.5 h-3.5 text-[#347A52]" />
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-base sm:text-lg font-bold text-[#1B3022] font-mono">
                          {crop.totalProduction.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-[#707D72] font-semibold">t</span>
                      </div>
                      <div className="text-[9px] text-[#707D72] font-mono truncate">
                        Avg: {crop.avgProduction.toFixed(1)} t/farm
                      </div>
                    </div>

                    {/* 3. Average Revenue */}
                    <div className="p-3 rounded-xl bg-[#F8FAF5] border border-[#E2E8DE] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#707D72] uppercase tracking-wider">
                          Avg Revenue
                        </span>
                        <Coins className="w-3.5 h-3.5 text-[#347A52]" />
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-base sm:text-lg font-bold text-[#1B3022] font-mono">
                          {formatINR(crop.avgRevenue)}
                        </span>
                      </div>
                      <div className="text-[9px] text-[#707D72] font-mono truncate">
                        Total: {formatINR(crop.totalRevenue)}
                      </div>
                    </div>

                    {/* 4. Net Profit & Margin */}
                    <div
                      className={`p-3 rounded-xl border space-y-1 ${
                        isProfitable
                          ? 'bg-[#F0F7EE] border-[#C8E6C9]'
                          : 'bg-[#FFF5F5] border-[#FED7D7]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider ${
                            isProfitable ? 'text-[#2F9E44]' : 'text-[#C53030]'
                          }`}
                        >
                          Net Profit
                        </span>
                        {isProfitable ? (
                          <TrendingUp className="w-3.5 h-3.5 text-[#2F9E44]" />
                        ) : (
                          <TrendingDown className="w-3.5 h-3.5 text-[#C53030]" />
                        )}
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span
                          className={`text-base sm:text-lg font-bold font-mono ${
                            isProfitable ? 'text-[#2F9E44]' : 'text-[#C53030]'
                          }`}
                        >
                          {formatINR(crop.avgProfit)}
                        </span>
                      </div>
                      <div
                        className={`text-[9px] font-bold font-mono truncate ${
                          isProfitable ? 'text-[#2F9E44]' : 'text-[#C53030]'
                        }`}
                      >
                        {crop.profitMarginPct > 0 ? '+' : ''}
                        {crop.profitMarginPct.toFixed(1)}% margin
                      </div>
                    </div>

                    {/* 5. Water Usage */}
                    <div className="p-3 rounded-xl bg-[#F8FAF5] border border-[#E2E8DE] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#707D72] uppercase tracking-wider">
                          Water Used
                        </span>
                        <Droplets className="w-3.5 h-3.5 text-[#347A52]" />
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-base sm:text-lg font-bold text-[#1B3022] font-mono">
                          {crop.avgWaterUsage.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-[#707D72] font-semibold">m³</span>
                      </div>
                      <div className="text-[9px] text-[#347A52] font-bold font-mono truncate">
                        {crop.avgWaterEfficiency.toFixed(2)} t/1000m³
                      </div>
                    </div>

                    {/* 6. Disease / Pest Risk */}
                    <div
                      className={`p-3 rounded-xl border space-y-1 ${
                        hasHighDisease
                          ? 'bg-[#FFF5F5] border-[#FED7D7]'
                          : 'bg-[#F8FAF5] border-[#E2E8DE]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider ${
                            hasHighDisease ? 'text-[#C53030]' : 'text-[#707D72]'
                          }`}
                        >
                          Disease Risk
                        </span>
                        <ShieldAlert
                          className={`w-3.5 h-3.5 ${
                            hasHighDisease ? 'text-[#C53030]' : 'text-[#347A52]'
                          }`}
                        />
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span
                          className={`text-base sm:text-lg font-bold font-mono ${
                            hasHighDisease ? 'text-[#C53030]' : 'text-[#1B3022]'
                          }`}
                        >
                          {crop.avgDiseaseRisk.toFixed(1)}%
                        </span>
                      </div>
                      <div
                        className={`text-[9px] font-semibold truncate ${
                          hasHighDisease ? 'text-[#C53030]' : 'text-[#707D72]'
                        }`}
                      >
                        {hasHighDisease ? 'High Pressure' : 'Normal Range'}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Action */}
                  <div className="mt-4 pt-3 border-t border-[#F0F7EE] flex items-center justify-between text-xs text-[#707D72]">
                    <span className="text-[11px] truncate">
                      States: {crop.states.slice(0, 3).join(', ')}
                      {crop.states.length > 3 ? ` +${crop.states.length - 3}` : ''}
                    </span>
                    <span className="text-xs font-bold text-[#347A52] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform shrink-0">
                      Deep Telemetry <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Deep Telemetry Modal for Crop Farm Records */}
      <AnimatePresence>
        {selectedCropModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.18 }}
              className="bg-white rounded-[32px] max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-[#E2E8DE] shadow-2xl p-6 sm:p-8 space-y-6"
            >
              {/* Modal Top Bar */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#E2E8DE]">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#F0F7EE] border border-[#E2E8DE] flex items-center justify-center text-4xl shrink-0">
                    {selectedCropModal.emoji}
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h2 className="text-2xl font-bold text-[#1B3022] font-display">
                        {selectedCropModal.name}
                      </h2>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#F0F7EE] text-[#1B3022] border border-[#E2E8DE]">
                        {selectedCropModal.nativeName}
                      </span>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#1B3022] text-[#A3E635]">
                        {selectedCropModal.category}
                      </span>
                    </div>
                    <p className="text-xs italic text-[#707D72] mt-0.5">
                      {selectedCropModal.scientificName} · {selectedCropModal.plotCount} Surveyed Farm Observations
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedCropModal(null)}
                  className="p-2 rounded-full bg-[#F8FAF5] text-[#707D72] hover:text-[#1B3022] hover:bg-[#F0F7EE] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Complete Agronomic Profile Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#F8FAF5] border border-[#E2E8DE]">
                  <span className="text-[10px] uppercase font-bold text-[#707D72] block">
                    Observed Yield
                  </span>
                  <span className="text-lg font-bold text-[#1B3022] font-mono">
                    {selectedCropModal.avgYield} t/ha
                  </span>
                  <span className="text-[10px] text-[#707D72] block">
                    Min {selectedCropModal.minYield} · Max {selectedCropModal.maxYield}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F8FAF5] border border-[#E2E8DE]">
                  <span className="text-[10px] uppercase font-bold text-[#707D72] block">
                    Cumulative Output
                  </span>
                  <span className="text-lg font-bold text-[#1B3022] font-mono">
                    {selectedCropModal.totalProduction.toLocaleString()} t
                  </span>
                  <span className="text-[10px] text-[#707D72] block">
                    Avg {selectedCropModal.avgProduction} t / farm
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F8FAF5] border border-[#E2E8DE]">
                  <span className="text-[10px] uppercase font-bold text-[#707D72] block">
                    Net Profit Margin
                  </span>
                  <span
                    className={`text-lg font-bold font-mono ${
                      selectedCropModal.avgProfit >= 0 ? 'text-[#2F9E44]' : 'text-[#C53030]'
                    }`}
                  >
                    {formatINR(selectedCropModal.avgProfit)}
                  </span>
                  <span
                    className={`text-[10px] font-bold block ${
                      selectedCropModal.profitMarginPct >= 0 ? 'text-[#2F9E44]' : 'text-[#C53030]'
                    }`}
                  >
                    {selectedCropModal.profitMarginPct > 0 ? '+' : ''}
                    {selectedCropModal.profitMarginPct.toFixed(1)}% margin
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F8FAF5] border border-[#E2E8DE]">
                  <span className="text-[10px] uppercase font-bold text-[#707D72] block">
                    Water Efficiency
                  </span>
                  <span className="text-lg font-bold text-[#347A52] font-mono">
                    {selectedCropModal.avgWaterEfficiency} t/1000m³
                  </span>
                  <span className="text-[10px] text-[#707D72] block">
                    {selectedCropModal.avgWaterUsage.toLocaleString()} m³ avg volume
                  </span>
                </div>
              </div>

              {/* Environmental & Resource Telemetry row */}
              <div className="p-4 rounded-2xl bg-[#F0F7EE] border border-[#E2E8DE] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-[#707D72] block">Average Farm Size:</span>
                  <span className="font-bold text-[#1B3022] font-mono">{selectedCropModal.avgFarmArea} Hectares</span>
                </div>
                <div>
                  <span className="text-[#707D72] block">Average Fertilizer:</span>
                  <span className="font-bold text-[#1B3022] font-mono">{selectedCropModal.avgFertilizer} kg/ha</span>
                </div>
                <div>
                  <span className="text-[#707D72] block">Average Pesticide:</span>
                  <span className="font-bold text-[#1B3022] font-mono">{selectedCropModal.avgPesticide} L/ha</span>
                </div>
                <div>
                  <span className="text-[#707D72] block">Disease & Pest Pressure:</span>
                  <span className="font-bold text-[#1B3022] font-mono">{selectedCropModal.avgDiseaseRisk}%</span>
                </div>
              </div>

              {/* Individual Farm Observations Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#1B3022] uppercase tracking-wider">
                    Actual Farm Records ({selectedCropModal.farms.length} Plots in Dataset)
                  </h3>
                  <span className="text-xs text-[#707D72]">
                    Extracted from raw CSV records
                  </span>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-[#E2E8DE]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F8FAF5] text-[#1B3022] font-semibold border-b border-[#E2E8DE]">
                      <tr>
                        <th className="p-3">Farm ID</th>
                        <th className="p-3">Location</th>
                        <th className="p-3">Season</th>
                        <th className="p-3">Area (ha)</th>
                        <th className="p-3">Yield (t/ha)</th>
                        <th className="p-3">Output (t)</th>
                        <th className="p-3">Revenue</th>
                        <th className="p-3">Net Profit</th>
                        <th className="p-3">Water (m³)</th>
                        <th className="p-3">Disease Risk</th>
                        <th className="p-3">Irrigation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8DE]">
                      {selectedCropModal.farms.map((f) => (
                        <tr key={f.farmId} className="hover:bg-[#F8FAF5] transition-colors">
                          <td className="p-3 font-mono font-bold text-[#1B3022]">{f.farmId}</td>
                          <td className="p-3 text-[#1B3022]">
                            <div>{f.district}</div>
                            <div className="text-[10px] text-[#707D72]">{f.state}</div>
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#F0F7EE] text-[#347A52] border border-[#E2E8DE]">
                              {f.season}
                            </span>
                          </td>
                          <td className="p-3 font-mono">{f.area.toFixed(2)}</td>
                          <td className="p-3 font-mono font-bold text-[#1B3022]">{f.yieldVal.toFixed(2)}</td>
                          <td className="p-3 font-mono">{f.production.toFixed(2)}</td>
                          <td className="p-3 font-mono">{formatINR(f.revenue)}</td>
                          <td
                            className={`p-3 font-mono font-bold ${
                              f.profit >= 0 ? 'text-[#2F9E44]' : 'text-[#C53030]'
                            }`}
                          >
                            {formatINR(f.profit)}
                          </td>
                          <td className="p-3 font-mono text-[#707D72]">{f.water.toLocaleString()}</td>
                          <td className="p-3 font-mono">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                f.pestRisk > 48
                                  ? 'bg-[#FFF5F5] text-[#C53030]'
                                  : 'bg-[#F0F7EE] text-[#347A52]'
                              }`}
                            >
                              {f.pestRisk.toFixed(1)}%
                            </span>
                          </td>
                          <td className="p-3 text-[#707D72]">{f.irrigation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Close button */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedCropModal(null)}
                  className="px-5 py-2 text-xs font-bold bg-[#1B3022] text-white rounded-full hover:bg-[#347A52] transition-colors cursor-pointer"
                >
                  Close Inspection
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

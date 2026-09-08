import React, { useState } from 'react';
import {
  CloudRain,
  Snowflake,
  Sun,
  Layers,
  TrendingUp,
  TrendingDown,
  Droplets,
  Thermometer,
  Coins,
  Scale,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Info,
  Sprout,
  Activity,
  Compass,
  BarChart3,
  Gauge,
  CircleDot,
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
  Legend,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { SeasonType } from '../types';
import {
  ACTUAL_SEASON_AGGREGATES,
  DATASET_SEASONAL_COMPARISON_TABLE,
  DATASET_KEY_FINDINGS,
  SeasonAggregate,
  ACTUAL_DATASET_RECORDS,
} from '../data/actualSeasonData';
import { useFilters } from '../context/FilterContext';

interface SeasonsViewProps {
  selectedSeason: SeasonType;
  onSeasonChange: (season: SeasonType) => void;
}

export const SeasonsView: React.FC<SeasonsViewProps> = ({
  selectedSeason,
  onSeasonChange,
}) => {
  const { filters, setSeason } = useFilters();
  const [activeComparisonTab, setActiveComparisonTab] = useState<
    'chart' | 'environmental' | 'resource' | 'economic'
  >('chart');

  const [chartMetric, setChartMetric] = useState<
    'yield' | 'production' | 'revenue' | 'profit' | 'rainfall' | 'temp' | 'water' | 'efficiency'
  >('yield');

  const effectiveSeason = filters.season !== 'all' ? filters.season : selectedSeason;

  // Selected season dataset aggregate
  const currentAgg: SeasonAggregate =
    ACTUAL_SEASON_AGGREGATES[effectiveSeason] || ACTUAL_SEASON_AGGREGATES.all;

  // Season selector cards metadata
  const selectorOptions: {
    id: SeasonType;
    label: string;
    native: string;
    period: string;
    count: number;
    icon: any;
    accentColor: string;
    summary: string;
  }[] = [
    {
      id: 'all',
      label: 'All Seasons',
      native: 'समग्र वार्षिक चक्र',
      period: 'Annual Cycle',
      count: 50,
      icon: Layers,
      accentColor: '#1B3022',
      summary: '50 plots across Kharif, Rabi & Zaid',
    },
    {
      id: 'kharif',
      label: 'Kharif (Monsoon)',
      native: 'खरीफ फसल चक्र',
      period: 'June – October',
      count: 19,
      icon: CloudRain,
      accentColor: '#347A52',
      summary: 'Monsoon cycle · 790.9 mm rainfall',
    },
    {
      id: 'rabi',
      label: 'Rabi (Winter)',
      native: 'रबी फसल चक्र',
      period: 'October – March',
      count: 20,
      icon: Snowflake,
      accentColor: '#2F9E44',
      summary: 'Winter cycle · ₹6.36L peak revenue',
    },
    {
      id: 'zaid',
      label: 'Zaid (Summer)',
      native: 'जायद फसल चक्र',
      period: 'March – June',
      count: 11,
      icon: Sun,
      accentColor: '#E67E22',
      summary: 'Summer cycle · 4.44 t/1000m³ efficiency',
    },
  ];

  // Chart data formatted from actual dataset aggregates
  const chartData = [
    {
      season: 'Kharif',
      count: 19,
      yield: ACTUAL_SEASON_AGGREGATES.kharif.avgYield,
      production: ACTUAL_SEASON_AGGREGATES.kharif.avgProduction,
      revenue: Math.round(ACTUAL_SEASON_AGGREGATES.kharif.avgRevenue / 1000),
      cost: Math.round(ACTUAL_SEASON_AGGREGATES.kharif.avgCost / 1000),
      profit: Math.round(ACTUAL_SEASON_AGGREGATES.kharif.avgProfit / 1000),
      rainfall: ACTUAL_SEASON_AGGREGATES.kharif.avgRainfall,
      temp: ACTUAL_SEASON_AGGREGATES.kharif.avgTemperature,
      water: ACTUAL_SEASON_AGGREGATES.kharif.avgWaterUsage,
      efficiency: ACTUAL_SEASON_AGGREGATES.kharif.avgWaterEfficiency,
      humidity: ACTUAL_SEASON_AGGREGATES.kharif.avgHumidity,
      pestRisk: ACTUAL_SEASON_AGGREGATES.kharif.avgPestRisk,
    },
    {
      season: 'Rabi',
      count: 20,
      yield: ACTUAL_SEASON_AGGREGATES.rabi.avgYield,
      production: ACTUAL_SEASON_AGGREGATES.rabi.avgProduction,
      revenue: Math.round(ACTUAL_SEASON_AGGREGATES.rabi.avgRevenue / 1000),
      cost: Math.round(ACTUAL_SEASON_AGGREGATES.rabi.avgCost / 1000),
      profit: Math.round(ACTUAL_SEASON_AGGREGATES.rabi.avgProfit / 1000),
      rainfall: ACTUAL_SEASON_AGGREGATES.rabi.avgRainfall,
      temp: ACTUAL_SEASON_AGGREGATES.rabi.avgTemperature,
      water: ACTUAL_SEASON_AGGREGATES.rabi.avgWaterUsage,
      efficiency: ACTUAL_SEASON_AGGREGATES.rabi.avgWaterEfficiency,
      humidity: ACTUAL_SEASON_AGGREGATES.rabi.avgHumidity,
      pestRisk: ACTUAL_SEASON_AGGREGATES.rabi.avgPestRisk,
    },
    {
      season: 'Zaid',
      count: 11,
      yield: ACTUAL_SEASON_AGGREGATES.zaid.avgYield,
      production: ACTUAL_SEASON_AGGREGATES.zaid.avgProduction,
      revenue: Math.round(ACTUAL_SEASON_AGGREGATES.zaid.avgRevenue / 1000),
      cost: Math.round(ACTUAL_SEASON_AGGREGATES.zaid.avgCost / 1000),
      profit: Math.round(ACTUAL_SEASON_AGGREGATES.zaid.avgProfit / 1000),
      rainfall: ACTUAL_SEASON_AGGREGATES.zaid.avgRainfall,
      temp: ACTUAL_SEASON_AGGREGATES.zaid.avgTemperature,
      water: ACTUAL_SEASON_AGGREGATES.zaid.avgWaterUsage,
      efficiency: ACTUAL_SEASON_AGGREGATES.zaid.avgWaterEfficiency,
      humidity: ACTUAL_SEASON_AGGREGATES.zaid.avgHumidity,
      pestRisk: ACTUAL_SEASON_AGGREGATES.zaid.avgPestRisk,
    },
    {
      season: 'All Seasons',
      count: 50,
      yield: ACTUAL_SEASON_AGGREGATES.all.avgYield,
      production: ACTUAL_SEASON_AGGREGATES.all.avgProduction,
      revenue: Math.round(ACTUAL_SEASON_AGGREGATES.all.avgRevenue / 1000),
      cost: Math.round(ACTUAL_SEASON_AGGREGATES.all.avgCost / 1000),
      profit: Math.round(ACTUAL_SEASON_AGGREGATES.all.avgProfit / 1000),
      rainfall: ACTUAL_SEASON_AGGREGATES.all.avgRainfall,
      temp: ACTUAL_SEASON_AGGREGATES.all.avgTemperature,
      water: ACTUAL_SEASON_AGGREGATES.all.avgWaterUsage,
      efficiency: ACTUAL_SEASON_AGGREGATES.all.avgWaterEfficiency,
      humidity: ACTUAL_SEASON_AGGREGATES.all.avgHumidity,
      pestRisk: ACTUAL_SEASON_AGGREGATES.all.avgPestRisk,
    },
  ];

  // Helper formatting for currency in Lakhs / Thousands
  const formatINR = (val: number) => {
    const absVal = Math.abs(val);
    const sign = val < 0 ? '-' : val > 0 ? '+' : '';
    if (absVal >= 100000) {
      return `${sign}₹${(absVal / 100000).toFixed(2)}L`;
    }
    if (absVal >= 1000) {
      return `${sign}₹${(absVal / 1000).toFixed(1)}k`;
    }
    return `${sign}₹${absVal}`;
  };

  return (
    <div id="seasons-page-container" className="space-y-8">
      {/* Top Banner & Context */}
      <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#E2E8DE] shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#F0F7EE] text-[#1B3022] border border-[#E2E8DE] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#347A52]" />
                Agronomic Cropping Calendar
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#1B3022] text-[#A3E635] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                100% Calculated from Actual CSV
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1B3022] tracking-tight font-display mt-2.5">
              Seasonal Agricultural Performance
            </h1>
            <p className="text-xs sm:text-sm text-[#707D72] mt-1 max-w-3xl leading-relaxed">
              Granular agro-economic telemetry across <strong>Kharif</strong>, <strong>Rabi</strong>, and <strong>Zaid</strong> cropping cycles. Every average, range, and comparison is computed directly from the 50 surveyed farm records.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-[#F8FAF5] p-3 rounded-2xl border border-[#E2E8DE] text-right">
              <span className="text-[10px] uppercase font-bold text-[#707D72] block">
                Active Cycle Sample
              </span>
              <span className="text-sm font-bold text-[#1B3022] font-mono">
                {currentAgg.count} Plots ({((currentAgg.count / 50) * 100).toFixed(0)}% Dataset)
              </span>
            </div>
          </div>
        </div>

        {/* Elegant Season Selector */}
        <div className="mt-6 pt-6 border-t border-[#E2E8DE]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#1B3022] uppercase tracking-wider">
              Select Cultivation Cycle
            </span>
            <span className="text-xs text-[#707D72]">
              Switching updates all averages, comparisons, and crop distributions
            </span>
          </div>

          <div
            id="elegant-season-selector"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5"
          >
            {selectorOptions.map((opt) => {
              const Icon = opt.icon;
              const isSelected = selectedSeason === opt.id;
              return (
                <button
                  key={opt.id}
                  id={`season-selector-${opt.id}`}
                  onClick={() => onSeasonChange(opt.id)}
                  className={`p-4 rounded-2xl text-left border transition-all relative overflow-hidden cursor-pointer ${
                    isSelected
                      ? 'bg-[#1B3022] text-white border-[#1B3022] shadow-sm'
                      : 'bg-[#F8FAF5] text-[#1B3022] border-[#E2E8DE] hover:bg-white hover:border-[#347A52]/40'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isSelected
                          ? 'bg-white/15 text-[#A3E635]'
                          : 'bg-white text-[#1B3022] border border-[#E2E8DE]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-[#A3E635] text-[#1B3022]'
                          : 'bg-white text-[#707D72] border border-[#E2E8DE]'
                      }`}
                    >
                      N={opt.count}
                    </span>
                  </div>

                  <div className="mt-3">
                    <h3 className="text-sm font-bold tracking-tight">
                      {opt.label}
                    </h3>
                    <p
                      className={`text-[11px] mt-0.5 ${
                        isSelected ? 'text-[#A3E635]' : 'text-[#707D72]'
                      }`}
                    >
                      {opt.native} · {opt.period}
                    </p>
                    <p
                      className={`text-[11px] mt-1.5 line-clamp-1 ${
                        isSelected ? 'text-white/80' : 'text-[#707D72]'
                      }`}
                    >
                      {opt.summary}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Season: 7 Required Metrics Cards */}
      <div id="selected-season-7-metrics" className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-[#1B3022] font-display">
              {currentAgg.name} Performance Averages
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#F0F7EE] text-[#1B3022] border border-[#E2E8DE]">
              Calculated from {currentAgg.count} Farms
            </span>
          </div>
          <span className="text-xs text-[#707D72]">
            Active Window: {currentAgg.period}
          </span>
        </div>

        {/* 7 Required Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Average Yield */}
          <div
            id="metric-avg-yield"
            className="bg-white rounded-2xl p-5 border border-[#E2E8DE] shadow-2xs space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#707D72] uppercase tracking-wider">
                Average Yield
              </span>
              <div className="w-8 h-8 rounded-xl bg-[#F0F7EE] text-[#347A52] flex items-center justify-center">
                <Sprout className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-bold text-[#1B3022] font-mono">
                  {currentAgg.avgYield.toFixed(2)}
                </span>
                <span className="text-xs text-[#707D72] font-semibold">t/ha</span>
              </div>
              <p className="text-[11px] text-[#707D72] mt-1">
                Observed Range: {currentAgg.minYield.toFixed(2)} – {currentAgg.maxYield.toFixed(2)} t/ha
              </p>
            </div>
            <div className="pt-2 border-t border-[#F0F7EE] flex justify-between text-[10px] text-[#707D72]">
              <span>Annual Benchmark:</span>
              <span className="font-bold text-[#1B3022]">2.35 t/ha</span>
            </div>
          </div>

          {/* 2. Average Production */}
          <div
            id="metric-avg-production"
            className="bg-white rounded-2xl p-5 border border-[#E2E8DE] shadow-2xs space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#707D72] uppercase tracking-wider">
                Average Production
              </span>
              <div className="w-8 h-8 rounded-xl bg-[#F0F7EE] text-[#347A52] flex items-center justify-center">
                <Scale className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-bold text-[#1B3022] font-mono">
                  {currentAgg.avgProduction.toFixed(2)}
                </span>
                <span className="text-xs text-[#707D72] font-semibold">Tonnes / farm</span>
              </div>
              <p className="text-[11px] text-[#707D72] mt-1">
                Harvested Total: {currentAgg.totalProduction.toLocaleString()} Tonnes
              </p>
            </div>
            <div className="pt-2 border-t border-[#F0F7EE] flex justify-between text-[10px] text-[#707D72]">
              <span>Mean Farm Size:</span>
              <span className="font-bold text-[#1B3022]">{currentAgg.avgFarmArea.toFixed(2)} ha</span>
            </div>
          </div>

          {/* 3. Average Revenue */}
          <div
            id="metric-avg-revenue"
            className="bg-white rounded-2xl p-5 border border-[#E2E8DE] shadow-2xs space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#707D72] uppercase tracking-wider">
                Average Revenue
              </span>
              <div className="w-8 h-8 rounded-xl bg-[#F0F7EE] text-[#347A52] flex items-center justify-center">
                <Coins className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-bold text-[#1B3022] font-mono">
                  {formatINR(currentAgg.avgRevenue)}
                </span>
                <span className="text-xs text-[#707D72] font-semibold">/ farm</span>
              </div>
              <p className="text-[11px] text-[#707D72] mt-1">
                Total Revenue: ₹{(currentAgg.totalRevenue / 10000000).toFixed(2)} Crores
              </p>
            </div>
            <div className="pt-2 border-t border-[#F0F7EE] flex justify-between text-[10px] text-[#707D72]">
              <span>Market Price Avg:</span>
              <span className="font-bold text-[#1B3022]">₹{Math.round(currentAgg.avgMarketPrice).toLocaleString()}/t</span>
            </div>
          </div>

          {/* 4. Average Profit */}
          <div
            id="metric-avg-profit"
            className={`rounded-2xl p-5 border shadow-2xs space-y-2 ${
              currentAgg.avgProfit >= 0
                ? 'bg-white border-[#E2E8DE]'
                : 'bg-[#FFF5F5] border-[#FED7D7]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-xs font-bold uppercase tracking-wider ${
                  currentAgg.avgProfit >= 0 ? 'text-[#707D72]' : 'text-[#C53030]'
                }`}
              >
                Average Net Profit
              </span>
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  currentAgg.avgProfit >= 0
                    ? 'bg-[#F0F7EE] text-[#2F9E44]'
                    : 'bg-[#FED7D7] text-[#C53030]'
                }`}
              >
                {currentAgg.avgProfit >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span
                  className={`text-2xl sm:text-3xl font-bold font-mono ${
                    currentAgg.avgProfit >= 0 ? 'text-[#1B3022]' : 'text-[#C53030]'
                  }`}
                >
                  {formatINR(currentAgg.avgProfit)}
                </span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    currentAgg.profitMarginPct >= 0
                      ? 'bg-[#F0F7EE] text-[#2F9E44]'
                      : 'bg-[#FED7D7] text-[#C53030]'
                  }`}
                >
                  {currentAgg.profitMarginPct > 0 ? '+' : ''}
                  {currentAgg.profitMarginPct.toFixed(1)}% margin
                </span>
              </div>
              <p className="text-[11px] text-[#707D72] mt-1">
                Mean Total Cost: {formatINR(currentAgg.avgCost)} / plot
              </p>
            </div>
            <div className="pt-2 border-t border-[#E2E8DE] flex justify-between text-[10px] text-[#707D72]">
              <span>Cumulative Margin:</span>
              <span
                className={`font-bold font-mono ${
                  currentAgg.totalProfit >= 0 ? 'text-[#2F9E44]' : 'text-[#C53030]'
                }`}
              >
                {formatINR(currentAgg.totalProfit)}
              </span>
            </div>
          </div>

          {/* 5. Average Rainfall */}
          <div
            id="metric-avg-rainfall"
            className="bg-white rounded-2xl p-5 border border-[#E2E8DE] shadow-2xs space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#707D72] uppercase tracking-wider">
                Average Rainfall
              </span>
              <div className="w-8 h-8 rounded-xl bg-[#F0F7EE] text-[#347A52] flex items-center justify-center">
                <CloudRain className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-bold text-[#1B3022] font-mono">
                  {currentAgg.avgRainfall.toFixed(1)}
                </span>
                <span className="text-xs text-[#707D72] font-semibold">mm</span>
              </div>
              <p className="text-[11px] text-[#707D72] mt-1">
                Precipitation Spread: {currentAgg.minRainfall.toFixed(0)} – {currentAgg.maxRainfall.toFixed(0)} mm
              </p>
            </div>
            <div className="pt-2 border-t border-[#F0F7EE] flex justify-between text-[10px] text-[#707D72]">
              <span>Soil Moisture:</span>
              <span className="font-bold text-[#1B3022]">{currentAgg.avgSoilMoisture.toFixed(1)}%</span>
            </div>
          </div>

          {/* 6. Average Temperature */}
          <div
            id="metric-avg-temp"
            className="bg-white rounded-2xl p-5 border border-[#E2E8DE] shadow-2xs space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#707D72] uppercase tracking-wider">
                Average Temperature
              </span>
              <div className="w-8 h-8 rounded-xl bg-[#F0F7EE] text-[#347A52] flex items-center justify-center">
                <Thermometer className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-bold text-[#1B3022] font-mono">
                  {currentAgg.avgTemperature.toFixed(1)}
                </span>
                <span className="text-xs text-[#707D72] font-semibold">°C</span>
              </div>
              <p className="text-[11px] text-[#707D72] mt-1">
                Thermal Range: {currentAgg.minTemperature.toFixed(1)}°C – {currentAgg.maxTemperature.toFixed(1)}°C
              </p>
            </div>
            <div className="pt-2 border-t border-[#F0F7EE] flex justify-between text-[10px] text-[#707D72]">
              <span>Humidity Level:</span>
              <span className="font-bold text-[#1B3022]">{currentAgg.avgHumidity.toFixed(1)}%</span>
            </div>
          </div>

          {/* 7. Average Water Usage */}
          <div
            id="metric-avg-water"
            className="bg-white rounded-2xl p-5 border border-[#E2E8DE] shadow-2xs space-y-2 lg:col-span-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#707D72] uppercase tracking-wider">
                Average Water Usage & Efficiency
              </span>
              <div className="w-8 h-8 rounded-xl bg-[#F0F7EE] text-[#347A52] flex items-center justify-center">
                <Droplets className="w-4 h-4" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-bold text-[#1B3022] font-mono">
                    {Math.round(currentAgg.avgWaterUsage).toLocaleString()}
                  </span>
                  <span className="text-xs text-[#707D72] font-semibold">m³ / plot</span>
                </div>
                <p className="text-[11px] text-[#707D72] mt-1">
                  Cumulative Volume: {Math.round(currentAgg.totalWaterUsage).toLocaleString()} m³
                </p>
              </div>
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-bold text-[#347A52] font-mono">
                    {currentAgg.avgWaterEfficiency.toFixed(2)}
                  </span>
                  <span className="text-xs text-[#707D72] font-semibold">t / 1,000 m³</span>
                </div>
                <p className="text-[11px] text-[#707D72] mt-1">
                  Water Productivity Ratio
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-[#F0F7EE] flex justify-between text-[10px] text-[#707D72]">
              <span>Irrigation Methods in {currentAgg.name}:</span>
              <span className="font-bold text-[#1B3022]">
                {Object.entries(currentAgg.irrigationMethods)
                  .map(([m, cnt]) => `${m}: ${cnt}`)
                  .join(' · ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Comparisons Between Seasons */}
      <div id="interactive-seasonal-comparisons" className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#E2E8DE] shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E2E8DE]">
          <div>
            <h2 className="text-xl font-bold text-[#1B3022] font-display">
              Comparative Seasonal Analytics
            </h2>
            <p className="text-xs text-[#707D72] mt-0.5">
              Side-by-side benchmark across Kharif, Rabi, and Zaid for performance, environmental sensors, resource inputs, and profit margins.
            </p>
          </div>

          {/* Sub-tab Navigation */}
          <div className="flex items-center gap-1.5 p-1 bg-[#F0F7EE] rounded-full border border-[#E2E8DE] self-start md:self-auto overflow-x-auto">
            {(
              [
                { id: 'chart', label: 'Performance Chart' },
                { id: 'environmental', label: 'Environmental' },
                { id: 'resource', label: 'Resource Usage' },
                { id: 'economic', label: 'Economic Returns' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                id={`tab-comparison-${tab.id}`}
                onClick={() => setActiveComparisonTab(tab.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeComparisonTab === tab.id
                    ? 'bg-[#1B3022] text-white shadow-xs'
                    : 'text-[#707D72] hover:text-[#1B3022]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab 1: Seasonal Performance Chart */}
        {activeComparisonTab === 'chart' && (
          <div className="space-y-4">
            {/* Metric Switcher Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2.5">
              <span className="text-xs font-semibold text-[#707D72]">
                Select Comparison Metric:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(
                  [
                    { id: 'yield', label: 'Yield (t/ha)' },
                    { id: 'production', label: 'Production (t)' },
                    { id: 'revenue', label: 'Revenue (₹k)' },
                    { id: 'profit', label: 'Profit (₹k)' },
                    { id: 'rainfall', label: 'Rainfall (mm)' },
                    { id: 'temp', label: 'Temp (°C)' },
                    { id: 'water', label: 'Water (m³)' },
                    { id: 'efficiency', label: 'Water Eff (t/1000m³)' },
                  ] as const
                ).map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setChartMetric(m.id)}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-colors cursor-pointer ${
                      chartMetric === m.id
                        ? 'bg-[#1B3022] text-[#A3E635] border-[#1B3022]'
                        : 'bg-[#F8FAF5] text-[#707D72] border-[#E2E8DE] hover:bg-white hover:text-[#1B3022]'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Chart Canvas */}
            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 15, right: 20, left: -10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0F7EE" vertical={false} />
                  <XAxis
                    dataKey="season"
                    tick={{ fill: '#707D72', fontSize: 12, fontWeight: 600 }}
                    axisLine={{ stroke: '#E2E8DE' }}
                  />
                  <YAxis
                    tick={{ fill: '#707D72', fontSize: 11 }}
                    axisLine={{ stroke: '#E2E8DE' }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-[#1B3022] text-white p-3 rounded-xl shadow-xl text-xs space-y-1">
                            <div className="font-bold text-[#A3E635] text-sm">
                              {d.season} ({d.count} farms)
                            </div>
                            <div>
                              Yield: <span className="font-bold">{d.yield} t/ha</span>
                            </div>
                            <div>
                              Production: <span className="font-bold">{d.production} Tonnes</span>
                            </div>
                            <div>
                              Revenue: <span className="font-bold">₹{d.revenue}k</span>
                            </div>
                            <div>
                              Net Profit:{' '}
                              <span
                                className={`font-bold ${
                                  d.profit >= 0 ? 'text-[#A3E635]' : 'text-red-400'
                                }`}
                              >
                                ₹{d.profit}k
                              </span>
                            </div>
                            <div>
                              Rainfall: <span className="font-bold">{d.rainfall} mm</span>
                            </div>
                            <div>
                              Temperature: <span className="font-bold">{d.temp} °C</span>
                            </div>
                            <div>
                              Water Used: <span className="font-bold">{d.water.toLocaleString()} m³</span>
                            </div>
                            <div>
                              Water Efficiency: <span className="font-bold">{d.efficiency} t/1000m³</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey={chartMetric}
                    radius={[6, 6, 0, 0]}
                    fill="#347A52"
                  >
                    {chartData.map((entry, index) => {
                      // highlight current season
                      const isCurrent =
                        (selectedSeason === 'kharif' && entry.season === 'Kharif') ||
                        (selectedSeason === 'rabi' && entry.season === 'Rabi') ||
                        (selectedSeason === 'zaid' && entry.season === 'Zaid') ||
                        (selectedSeason === 'all' && entry.season === 'All Seasons');

                      return (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            isCurrent
                              ? '#1B3022'
                              : entry.season === 'All Seasons'
                              ? '#A3E635'
                              : '#347A52'
                          }
                        />
                      );
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F8FAF5] border border-[#E2E8DE] flex items-center justify-between text-xs text-[#707D72]">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-[#347A52] shrink-0" />
                <span>
                  Dark green bar indicates the currently active season (<strong>{currentAgg.name}</strong>). Light green bar indicates the full 50-farm aggregate reference.
                </span>
              </div>
              <span className="font-mono font-bold text-[#1B3022]">
                Actual Dataset Values
              </span>
            </div>
          </div>
        )}

        {/* Tab 2: Environmental Comparison */}
        {activeComparisonTab === 'environmental' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Kharif Env */}
              <div className="p-5 rounded-2xl bg-[#F8FAF5] border border-[#E2E8DE] space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#E2E8DE]">
                  <div className="flex items-center gap-2">
                    <CloudRain className="w-4 h-4 text-[#347A52]" />
                    <h3 className="font-bold text-[#1B3022] text-sm">Kharif Environment</h3>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[#1B3022] border border-[#E2E8DE]">
                    19 Plots
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#707D72]">Rainfall:</span>
                    <span className="font-bold text-[#1B3022] font-mono">790.9 mm (Monsoon)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#707D72]">Avg Temperature:</span>
                    <span className="font-bold text-[#1B3022] font-mono">28.0 °C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#707D72]">Relative Humidity:</span>
                    <span className="font-bold text-[#1B3022] font-mono">73.2% (Peak)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#707D72]">Sunlight Hours:</span>
                    <span className="font-bold text-[#1B3022] font-mono">6.47 hrs/day</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#707D72]">Soil Moisture:</span>
                    <span className="font-bold text-[#1B3022] font-mono">31.08%</span>
                  </div>
                  <div className="flex justify-between text-red-600 font-semibold pt-1 border-t border-[#E2E8DE]">
                    <span>Disease & Pest Risk:</span>
                    <span className="font-mono font-bold">53.60% (High)</span>
                  </div>
                </div>
              </div>

              {/* Rabi Env */}
              <div className="p-5 rounded-2xl bg-[#F8FAF5] border border-[#E2E8DE] space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#E2E8DE]">
                  <div className="flex items-center gap-2">
                    <Snowflake className="w-4 h-4 text-[#2F9E44]" />
                    <h3 className="font-bold text-[#1B3022] text-sm">Rabi Environment</h3>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[#1B3022] border border-[#E2E8DE]">
                    20 Plots
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#707D72]">Rainfall:</span>
                    <span className="font-bold text-[#1B3022] font-mono">442.6 mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#707D72]">Avg Temperature:</span>
                    <span className="font-bold text-[#1B3022] font-mono">23.4 °C (Cool)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#707D72]">Relative Humidity:</span>
                    <span className="font-bold text-[#1B3022] font-mono">55.6%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#707D72]">Sunlight Hours:</span>
                    <span className="font-bold text-[#1B3022] font-mono">7.85 hrs/day</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#707D72]">Soil Moisture:</span>
                    <span className="font-bold text-[#1B3022] font-mono">24.63%</span>
                  </div>
                  <div className="flex justify-between text-[#2F9E44] font-semibold pt-1 border-t border-[#E2E8DE]">
                    <span>Disease & Pest Risk:</span>
                    <span className="font-mono font-bold">40.88% (Moderate)</span>
                  </div>
                </div>
              </div>

              {/* Zaid Env */}
              <div className="p-5 rounded-2xl bg-[#F8FAF5] border border-[#E2E8DE] space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#E2E8DE]">
                  <div className="flex items-center gap-2">
                    <Sun className="w-4 h-4 text-[#E67E22]" />
                    <h3 className="font-bold text-[#1B3022] text-sm">Zaid Environment</h3>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[#1B3022] border border-[#E2E8DE]">
                    11 Plots
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#707D72]">Rainfall:</span>
                    <span className="font-bold text-[#1B3022] font-mono">277.1 mm (Arid)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#707D72]">Avg Temperature:</span>
                    <span className="font-bold text-[#1B3022] font-mono">32.5 °C (High)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#707D72]">Relative Humidity:</span>
                    <span className="font-bold text-[#1B3022] font-mono">51.2% (Dry)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#707D72]">Sunlight Hours:</span>
                    <span className="font-bold text-[#1B3022] font-mono">7.88 hrs/day</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#707D72]">Soil Moisture:</span>
                    <span className="font-bold text-[#1B3022] font-mono">17.21% (Low)</span>
                  </div>
                  <div className="flex justify-between text-[#2F9E44] font-semibold pt-1 border-t border-[#E2E8DE]">
                    <span>Disease & Pest Risk:</span>
                    <span className="font-mono font-bold">38.95% (Lowest)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Environmental Summary Table */}
            <div className="overflow-x-auto rounded-2xl border border-[#E2E8DE]">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#F0F7EE] text-[#1B3022] font-bold border-b border-[#E2E8DE]">
                  <tr>
                    <th className="p-3">Environmental Parameter</th>
                    <th className="p-3">Unit</th>
                    <th className="p-3">Kharif (Monsoon)</th>
                    <th className="p-3">Rabi (Winter)</th>
                    <th className="p-3">Zaid (Summer)</th>
                    <th className="p-3">All Seasons Baseline</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8DE]">
                  {DATASET_SEASONAL_COMPARISON_TABLE.filter(
                    (r) => r.category === 'environmental' || r.metricKey === 'rainfall' || r.metricKey === 'temperature'
                  ).map((row) => (
                    <tr key={row.metricKey} className="hover:bg-[#F8FAF5] transition-colors">
                      <td className="p-3 font-semibold text-[#1B3022]">{row.metricLabel}</td>
                      <td className="p-3 text-[#707D72]">{row.unit}</td>
                      <td className="p-3 font-mono font-bold text-[#1B3022]">{row.kharif}</td>
                      <td className="p-3 font-mono font-bold text-[#1B3022]">{row.rabi}</td>
                      <td className="p-3 font-mono font-bold text-[#1B3022]">{row.zaid}</td>
                      <td className="p-3 font-mono text-[#707D72]">{row.all}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Resource Usage Comparison */}
        {activeComparisonTab === 'resource' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Resource Metrics Table */}
              <div className="rounded-2xl border border-[#E2E8DE] overflow-hidden">
                <div className="p-4 bg-[#F0F7EE] border-b border-[#E2E8DE]">
                  <h3 className="font-bold text-sm text-[#1B3022]">
                    Nutrient & Water Influx Breakdown
                  </h3>
                  <p className="text-[11px] text-[#707D72]">
                    Mean agricultural input intensity calculated per plot and hectare
                  </p>
                </div>
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#F8FAF5] text-[#1B3022] font-semibold border-b border-[#E2E8DE]">
                    <tr>
                      <th className="p-3">Resource Input</th>
                      <th className="p-3">Kharif</th>
                      <th className="p-3">Rabi</th>
                      <th className="p-3">Zaid</th>
                      <th className="p-3">All</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8DE]">
                    {DATASET_SEASONAL_COMPARISON_TABLE.filter(
                      (r) => r.category === 'resource' || r.metricKey === 'water'
                    ).map((row) => (
                      <tr key={row.metricKey} className="hover:bg-[#F8FAF5] transition-colors">
                        <td className="p-3 font-medium text-[#1B3022]">
                          {row.metricLabel} <span className="text-[#707D72]">({row.unit})</span>
                        </td>
                        <td className="p-3 font-mono font-bold text-[#1B3022]">{row.kharif}</td>
                        <td className="p-3 font-mono font-bold text-[#1B3022]">{row.rabi}</td>
                        <td className="p-3 font-mono font-bold text-[#1B3022]">{row.zaid}</td>
                        <td className="p-3 font-mono text-[#707D72]">{row.all}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Irrigation Method Breakdown */}
              <div className="p-5 rounded-2xl bg-[#F8FAF5] border border-[#E2E8DE] space-y-4">
                <div className="pb-3 border-b border-[#E2E8DE]">
                  <h3 className="font-bold text-sm text-[#1B3022]">
                    Irrigation Method Distribution by Season
                  </h3>
                  <p className="text-[11px] text-[#707D72]">
                    Distribution of Drip, Flood, Rainfed, and Sprinkler across 50 plots
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      season: 'Kharif',
                      methods: ACTUAL_SEASON_AGGREGATES.kharif.irrigationMethods,
                      total: 19,
                    },
                    {
                      season: 'Rabi',
                      methods: ACTUAL_SEASON_AGGREGATES.rabi.irrigationMethods,
                      total: 20,
                    },
                    {
                      season: 'Zaid',
                      methods: ACTUAL_SEASON_AGGREGATES.zaid.irrigationMethods,
                      total: 11,
                    },
                  ].map((item) => (
                    <div key={item.season} className="p-3 bg-white rounded-xl border border-[#E2E8DE]">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-xs text-[#1B3022]">
                          {item.season} ({item.total} plots)
                        </span>
                        <span className="text-[10px] text-[#707D72]">
                          Drip: {item.methods['Drip'] || 0} · Sprinkler: {item.methods['Sprinkler'] || 0} · Rainfed: {item.methods['Rainfed'] || 0} · Flood: {item.methods['Flood'] || 0}
                        </span>
                      </div>
                      <div className="w-full h-2.5 rounded-full overflow-hidden flex bg-gray-100">
                        <div
                          style={{
                            width: `${(((item.methods['Drip'] || 0) / item.total) * 100).toFixed(0)}%`,
                          }}
                          className="bg-[#2F9E44]"
                          title={`Drip: ${item.methods['Drip'] || 0}`}
                        />
                        <div
                          style={{
                            width: `${(((item.methods['Sprinkler'] || 0) / item.total) * 100).toFixed(0)}%`,
                          }}
                          className="bg-[#A3E635]"
                          title={`Sprinkler: ${item.methods['Sprinkler'] || 0}`}
                        />
                        <div
                          style={{
                            width: `${(((item.methods['Rainfed'] || 0) / item.total) * 100).toFixed(0)}%`,
                          }}
                          className="bg-[#ca8a04]"
                          title={`Rainfed: ${item.methods['Rainfed'] || 0}`}
                        />
                        <div
                          style={{
                            width: `${(((item.methods['Flood'] || 0) / item.total) * 100).toFixed(0)}%`,
                          }}
                          className="bg-[#707D72]"
                          title={`Flood: ${item.methods['Flood'] || 0}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-[11px] text-[#707D72] pt-2">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2F9E44]" /> Drip
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#A3E635]" /> Sprinkler
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ca8a04]" /> Rainfed
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#707D72]" /> Flood
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Economic Performance Comparison */}
        {activeComparisonTab === 'economic' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Kharif Economics */}
              <div className="p-5 rounded-2xl bg-[#FFF5F5] border border-[#FED7D7] space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#FED7D7]">
                  <h3 className="font-bold text-[#C53030] text-sm">Kharif Economics</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[#C53030] border border-[#FED7D7]">
                    -24.9% Margin
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#707D72]">Avg Revenue:</span>
                    <span className="font-bold text-[#1B3022] font-mono">₹3,81,763</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#707D72]">Avg Total Cost:</span>
                    <span className="font-bold text-[#1B3022] font-mono">₹4,76,959</span>
                  </div>
                  <div className="flex justify-between text-[#C53030] font-bold pt-1 border-t border-[#FED7D7]">
                    <span>Avg Net Profit:</span>
                    <span className="font-mono">-₹95,196 (Loss)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#707D72]">Total Seasonal Loss:</span>
                    <span className="font-bold font-mono text-[#C53030]">-₹18.09 Lakhs</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#707D72]">Market Price Realized:</span>
                    <span className="font-bold font-mono text-[#1B3022]">₹46,315 / Tonne</span>
                  </div>
                </div>
              </div>

              {/* Rabi Economics */}
              <div className="p-5 rounded-2xl bg-[#F0F7EE] border border-[#E2E8DE] space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#E2E8DE]">
                  <h3 className="font-bold text-[#1B3022] text-sm">Rabi Economics</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1B3022] text-[#A3E635]">
                    +4.4% Margin
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#707D72]">Avg Revenue:</span>
                    <span className="font-bold text-[#1B3022] font-mono">₹6,35,755 (Peak)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#707D72]">Avg Total Cost:</span>
                    <span className="font-bold text-[#1B3022] font-mono">₹6,07,745</span>
                  </div>
                  <div className="flex justify-between text-[#2F9E44] font-bold pt-1 border-t border-[#E2E8DE]">
                    <span>Avg Net Profit:</span>
                    <span className="font-mono">+₹28,010 (Profit)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#707D72]">Total Seasonal Profit:</span>
                    <span className="font-bold font-mono text-[#2F9E44]">+₹5.60 Lakhs</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#707D72]">Market Price Realized:</span>
                    <span className="font-bold font-mono text-[#1B3022]">₹36,079 / Tonne</span>
                  </div>
                </div>
              </div>

              {/* Zaid Economics */}
              <div className="p-5 rounded-2xl bg-[#F8FAF5] border border-[#E2E8DE] space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#E2E8DE]">
                  <h3 className="font-bold text-[#1B3022] text-sm">Zaid Economics</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[#1B3022] border border-[#E2E8DE]">
                    +2.4% Margin
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#707D72]">Avg Revenue:</span>
                    <span className="font-bold text-[#1B3022] font-mono">₹5,20,992</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#707D72]">Avg Total Cost:</span>
                    <span className="font-bold text-[#1B3022] font-mono">₹5,08,479</span>
                  </div>
                  <div className="flex justify-between text-[#2F9E44] font-bold pt-1 border-t border-[#E2E8DE]">
                    <span>Avg Net Profit:</span>
                    <span className="font-mono">+₹12,513 (Profit)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#707D72]">Total Seasonal Profit:</span>
                    <span className="font-bold font-mono text-[#2F9E44]">+₹1.38 Lakhs</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#707D72]">Market Price Realized:</span>
                    <span className="font-bold font-mono text-[#1B3022]">₹50,126 / Tonne (Peak)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Economic Summary Table */}
            <div className="overflow-x-auto rounded-2xl border border-[#E2E8DE]">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#F0F7EE] text-[#1B3022] font-bold border-b border-[#E2E8DE]">
                  <tr>
                    <th className="p-3">Financial Parameter</th>
                    <th className="p-3">Kharif</th>
                    <th className="p-3">Rabi</th>
                    <th className="p-3">Zaid</th>
                    <th className="p-3">All Seasons Aggregate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8DE]">
                  <tr className="hover:bg-[#F8FAF5]">
                    <td className="p-3 font-semibold text-[#1B3022]">Mean Gross Revenue</td>
                    <td className="p-3 font-mono font-bold text-[#1B3022]">₹3,81,763</td>
                    <td className="p-3 font-mono font-bold text-[#1B3022]">₹6,35,755</td>
                    <td className="p-3 font-mono font-bold text-[#1B3022]">₹5,20,992</td>
                    <td className="p-3 font-mono text-[#707D72]">₹5,13,990</td>
                  </tr>
                  <tr className="hover:bg-[#F8FAF5]">
                    <td className="p-3 font-semibold text-[#1B3022]">Mean Total Cost</td>
                    <td className="p-3 font-mono font-bold text-[#1B3022]">₹4,76,959</td>
                    <td className="p-3 font-mono font-bold text-[#1B3022]">₹6,07,745</td>
                    <td className="p-3 font-mono font-bold text-[#1B3022]">₹5,08,479</td>
                    <td className="p-3 font-mono text-[#707D72]">₹5,36,208</td>
                  </tr>
                  <tr className="hover:bg-[#F8FAF5]">
                    <td className="p-3 font-semibold text-[#1B3022]">Mean Net Profit</td>
                    <td className="p-3 font-mono font-bold text-[#C53030]">-₹95,196</td>
                    <td className="p-3 font-mono font-bold text-[#2F9E44]">+₹28,010</td>
                    <td className="p-3 font-mono font-bold text-[#2F9E44]">+₹12,513</td>
                    <td className="p-3 font-mono text-[#C53030]">-₹22,218</td>
                  </tr>
                  <tr className="hover:bg-[#F8FAF5]">
                    <td className="p-3 font-semibold text-[#1B3022]">Operating Profit Margin</td>
                    <td className="p-3 font-mono font-bold text-[#C53030]">-24.94%</td>
                    <td className="p-3 font-mono font-bold text-[#2F9E44]">+4.41%</td>
                    <td className="p-3 font-mono font-bold text-[#2F9E44]">+2.40%</td>
                    <td className="p-3 font-mono text-[#C53030]">-4.32%</td>
                  </tr>
                  <tr className="hover:bg-[#F8FAF5]">
                    <td className="p-3 font-semibold text-[#1B3022]">Realized Market Price</td>
                    <td className="p-3 font-mono font-bold text-[#1B3022]">₹46,315/t</td>
                    <td className="p-3 font-mono font-bold text-[#1B3022]">₹36,079/t</td>
                    <td className="p-3 font-mono font-bold text-[#1B3022]">₹50,126/t</td>
                    <td className="p-3 font-mono text-[#707D72]">₹43,059/t</td>
                  </tr>
                  <tr className="hover:bg-[#F8FAF5]">
                    <td className="p-3 font-semibold text-[#1B3022]">Average Holding Area</td>
                    <td className="p-3 font-mono font-bold text-[#1B3022]">6.76 ha</td>
                    <td className="p-3 font-mono font-bold text-[#1B3022]">8.93 ha</td>
                    <td className="p-3 font-mono font-bold text-[#1B3022]">7.50 ha</td>
                    <td className="p-3 font-mono text-[#707D72]">7.79 ha</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Crops Cultivated in Selected Season */}
      <div id="season-crop-distribution" className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#E2E8DE] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-[#1B3022] font-display">
              Crops Cultivated in {currentAgg.name}
            </h3>
            <p className="text-xs text-[#707D72]">
              Real crop varieties planted during this cycle in the dataset, with plot counts and actual average yields
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#F0F7EE] text-[#1B3022] border border-[#E2E8DE] self-start sm:self-auto">
            {Object.keys(currentAgg.crops).length} Varieties Recorded
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 pt-2">
          {Object.entries(currentAgg.crops).map(([cropName, data]) => (
            <div
              key={cropName}
              className="p-4 rounded-2xl bg-[#F8FAF5] border border-[#E2E8DE] hover:border-[#347A52]/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1B3022]">{cropName}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[#707D72] border border-[#E2E8DE]">
                  {data.count} {data.count === 1 ? 'Plot' : 'Plots'}
                </span>
              </div>
              <div className="mt-3">
                <span className="text-[10px] text-[#707D72] uppercase font-bold block">
                  Average Yield
                </span>
                <span className="text-base font-bold text-[#1B3022] font-mono">
                  {data.avgYield.toFixed(2)} t/ha
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Findings Section */}
      <div id="season-key-findings" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#347A52]" />
              <h2 className="text-lg font-bold text-[#1B3022] font-display">
                Key Agronomic & Economic Findings
              </h2>
            </div>
            <p className="text-xs text-[#707D72] mt-0.5">
              Empirical patterns and operational directives deduced directly from the 50 dataset observations
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#1B3022] text-[#A3E635]">
            4 Data Directives
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DATASET_KEY_FINDINGS.map((finding) => (
            <div
              key={finding.id}
              className="bg-white rounded-[24px] p-6 border border-[#E2E8DE] shadow-2xs space-y-3.5 hover:border-[#347A52]/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#F0F7EE] text-[#1B3022] border border-[#E2E8DE]">
                  {finding.badge}
                </span>
                <span className="text-[10px] font-mono text-[#707D72] uppercase font-bold">
                  {finding.seasonId.toUpperCase()}
                </span>
              </div>

              <h3 className="font-bold text-sm text-[#1B3022] leading-snug">
                {finding.title}
              </h3>

              <div className="p-3 rounded-xl bg-[#F8FAF5] border border-[#E2E8DE] text-xs space-y-1 text-[#1B3022]">
                <span className="text-[10px] font-bold uppercase text-[#707D72] block">
                  Ground-Truth Evidence
                </span>
                <p className="font-mono text-[11px] leading-relaxed">
                  {finding.datasetEvidence}
                </p>
              </div>

              <div className="text-xs space-y-1 text-[#707D72] leading-relaxed">
                <p>
                  <strong className="text-[#1B3022]">Agronomic Driver:</strong>{' '}
                  {finding.agronomicRootCause}
                </p>
                <p>
                  <strong className="text-[#1B3022]">Economic Impact:</strong>{' '}
                  {finding.economicImpact}
                </p>
              </div>

              <div className="pt-3 border-t border-[#E2E8DE] flex items-start gap-2 text-xs">
                <CheckCircle2 className="w-4 h-4 text-[#347A52] shrink-0 mt-0.5" />
                <p className="text-[#1B3022] font-medium">
                  <strong className="text-[#347A52]">Strategic Directive:</strong>{' '}
                  {finding.strategicTakeaway}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

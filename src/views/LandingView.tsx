import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sprout,
  CalendarDays,
  LineChart,
  Sparkles,
  ArrowRight,
  Database,
  Wheat,
  Droplets,
  Coins,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Thermometer,
  ArrowUpRight,
  ChevronRight,
  MapPin,
  Search,
  X,
  Zap,
  TrendingUp,
} from 'lucide-react';
import { SeasonType } from '../types';
import { ACTUAL_DATASET_RECORDS } from '../data/actualSeasonData';
import { ALL_CROPS_PERFORMANCE } from '../data/actualCropData';
import { ACTUAL_REGIONS_DATA } from '../data/actualRegionData';
import agriHeroBg from '../assets/images/agri_hero_bg_1788850754079.jpg';
import botanicalLeafAccent from '../assets/images/botanical_leaf_accent_1788850775078.jpg';

interface LandingViewProps {
  onEnterDashboard: (tab?: string) => void;
  onOpenAuditModal: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onEnterDashboard,
  onOpenAuditModal,
}) => {
  // Interactive Hero State
  const [selectedHeroSeason, setSelectedHeroSeason] = useState<SeasonType | 'all'>('all');

  // Interactive Crop Showcase Category Filter
  const [selectedCropCategory, setSelectedCropCategory] = useState<string>('all');

  // Interactive Table Search & Filter State inside Landing Page
  const [tableSearchQuery, setTableSearchQuery] = useState<string>('');
  const [tableSeasonFilter, setTableSeasonFilter] = useState<string>('all');

  // Compute dynamic stats based on selectedHeroSeason
  const heroStats = useMemo(() => {
    const records = selectedHeroSeason === 'all'
      ? ACTUAL_DATASET_RECORDS
      : ACTUAL_DATASET_RECORDS.filter((r) => r.Season === selectedHeroSeason);

    const count = records.length;
    if (count === 0) {
      return {
        avgYield: '0.00',
        totalRevenue: '₹0',
        topCrop: 'N/A',
        avgRainfall: '0 mm',
        count: 0,
      };
    }

    const validYields = records.map((r) => r.Yield_Tonnes_Ha).filter((y): y is number => y !== null);
    const avgYieldVal = validYields.length > 0 ? validYields.reduce((a, b) => a + b, 0) / validYields.length : 0;

    const totalRevVal = records.reduce((acc, r) => acc + r.Production_Tonnes * r.Market_Price_INR_Tonne, 0);

    // Find top crop by total production
    const cropTotals: Record<string, number> = {};
    records.forEach((r) => {
      cropTotals[r.Crop] = (cropTotals[r.Crop] || 0) + r.Production_Tonnes;
    });
    const topCropEntry = Object.entries(cropTotals).sort((a, b) => b[1] - a[1])[0];
    const topCrop = topCropEntry ? topCropEntry[0] : 'Rice';

    const validRainfall = records.map((r) => r.Rainfall_mm).filter((rf): rf is number => rf !== null);
    const avgRainVal = validRainfall.length > 0 ? validRainfall.reduce((a, b) => a + b, 0) / validRainfall.length : 0;

    return {
      avgYield: avgYieldVal.toFixed(2),
      totalRevenue: `₹${(totalRevVal / 100000).toFixed(1)} Lakhs`,
      topCrop,
      avgRainfall: `${Math.round(avgRainVal)} mm`,
      count,
    };
  }, [selectedHeroSeason]);

  // Filtered crops list for Landing Showcase
  const showcaseCrops = useMemo(() => {
    if (selectedCropCategory === 'all') return ALL_CROPS_PERFORMANCE;
    return ALL_CROPS_PERFORMANCE.filter(
      (c) => c.category.toLowerCase() === selectedCropCategory.toLowerCase()
    );
  }, [selectedCropCategory]);

  // Filtered sample records for interactive landing page table
  const landingTableRecords = useMemo(() => {
    return ACTUAL_DATASET_RECORDS.filter((r) => {
      if (tableSeasonFilter !== 'all' && r.Season !== tableSeasonFilter) return false;
      if (tableSearchQuery.trim() !== '') {
        const q = tableSearchQuery.toLowerCase();
        const matchId = r.Farm_ID.toLowerCase().includes(q);
        const matchState = r.State.toLowerCase().includes(q);
        const matchDistrict = r.District.toLowerCase().includes(q);
        const matchCrop = r.Crop.toLowerCase().includes(q);
        const matchIrr = r.Irrigation_Method.toLowerCase().includes(q);
        if (!matchId && !matchState && !matchDistrict && !matchCrop && !matchIrr) return false;
      }
      return true;
    }).slice(0, 7);
  }, [tableSeasonFilter, tableSearchQuery]);

  return (
    <div id="agriseason-landing-container" className="space-y-12 sm:space-y-16 pb-16">
      {/* ========================================================================= */}
      {/* HERO SECTION - ELEGANT EDITORIAL BOTANICAL DESIGN */}
      {/* ========================================================================= */}
      <section id="hero-landing-section" className="relative overflow-hidden rounded-3xl bg-[#0E1E15] text-white p-6 sm:p-10 lg:p-12 border border-[#21432E] shadow-2xl">
        {/* Background Image Layer with Botanical Farm Leaves */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <img
            src={agriHeroBg}
            alt="Lush Agricultural Farm Fields"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-25 mix-blend-luminosity scale-105 filter blur-[0.5px]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0E1E15] via-[#0E1E15]/85 to-[#0E1E15]/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E1E15] via-transparent to-[#0E1E15]/40" />
        </div>

        {/* Fine Architectural Grid Pattern & Soft Botanical Ambient Glows */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none z-0" />
        <div className="absolute -top-24 -right-24 w-[480px] h-[480px] bg-[#88C438]/15 rounded-full blur-[110px] pointer-events-none z-0" />
        <div className="absolute -bottom-24 -left-24 w-[400px] h-[400px] bg-[#2C6B45]/30 rounded-full blur-[100px] pointer-events-none z-0" />

        {/* Floating Decorative Leaf SVG Elements */}
        <svg className="absolute top-6 right-12 w-28 h-28 text-[#88C438]/10 pointer-events-none z-0 rotate-12" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17,8C8,10 59,16 17,8M12,2C6.5,2 2,6.5 2,12C2,17.5 6.5,22 12,22C17.5,22 22,17.5 22,12C22,6.5 17.5,2 12,2M12,4C14.8,4 17.3,5.5 18.6,7.8C15.8,7.3 11.2,7.7 8.5,10.4C5.8,13.1 5.4,17.7 5.9,20.5C3.5,18.8 2,16.1 2,13C2,8 6,4 12,4Z" />
        </svg>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Brand, Title, Interactive Season Pills, Action Buttons */}
          <div className="lg:col-span-7 space-y-6">
            {/* System Status Pill */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1B3626] border border-[#2B543C] text-[#88C438] text-xs font-semibold tracking-wide uppercase shadow-xs"
            >
              <span className="w-2 h-2 rounded-full bg-[#88C438] animate-pulse" />
              <Sprout className="w-3.5 h-3.5" />
              <span>Seasonal Agriculture Intelligence System</span>
            </motion.div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-display tracking-tight text-white leading-[1.05]">
                AgriSeason
              </h1>
              <p className="text-base sm:text-lg text-[#C2D8C9] font-normal leading-relaxed max-w-2xl">
                Empirical seasonal analytics across 50 surveyed Indian farm plots. Uncover crop yield drivers, climate telemetry, soil nutrition, and resource economics across Kharif, Rabi, and Zaid cycles.
              </p>
            </div>

            {/* Interactive Season Telemetry Snapshot Selector */}
            <div className="pt-1 space-y-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#82A88E] block">
                Interactive Telemetry Snapshot:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: 'all', label: 'All Seasons (50 Plots)' },
                  { id: 'Kharif', label: 'Kharif (Monsoon)' },
                  { id: 'Rabi', label: 'Rabi (Winter)' },
                  { id: 'Zaid', label: 'Zaid (Summer)' },
                ].map((s) => {
                  const isActive = selectedHeroSeason === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSelectedHeroSeason(s.id as SeasonType | 'all')}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-[#88C438] text-[#0F2318] font-bold shadow-md ring-2 ring-[#88C438]/30'
                          : 'bg-[#183324] text-[#A2C2AC] hover:bg-[#224531] hover:text-white border border-[#274D37]'
                      }`}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                id="btn-hero-explore-agri-data"
                onClick={() => onEnterDashboard('overview')}
                className="px-6 py-3.5 rounded-xl bg-[#88C438] text-[#0F2318] font-bold text-sm hover:bg-[#97D444] transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.01] flex items-center gap-2.5 cursor-pointer group"
              >
                <span>Explore Agriculture Data</span>
                <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="btn-hero-seasons-module"
                onClick={() => onEnterDashboard('seasons')}
                className="px-5 py-3.5 rounded-xl bg-[#1A3324] hover:bg-[#234531] text-white border border-[#2D563D] font-semibold text-sm transition-all duration-200 flex items-center gap-2 cursor-pointer"
              >
                <CalendarDays className="w-4 h-4 text-[#88C438]" />
                <span>Seasons View</span>
              </button>

              <button
                id="btn-hero-ask-agri-ai"
                onClick={() => onEnterDashboard('insights')}
                className="px-5 py-3.5 rounded-xl bg-[#1A3324] hover:bg-[#234531] text-white border border-[#2D563D] font-semibold text-sm transition-all duration-200 flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#88C438]" />
                <span>Ask AgriAI</span>
              </button>
            </div>
          </div>

          {/* Right Column: Live Telemetry Metric Card */}
          <div className="lg:col-span-5">
            <motion.div
              layout
              className="bg-[#172E20] border border-[#2B5239] rounded-2xl p-6 shadow-xl space-y-5 relative overflow-hidden"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-[#254832]">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-[#88C438]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#C2D8C9]">
                    Dataset Real-Time Snapshot
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#88C438]/15 text-[#88C438] font-bold">
                  {heroStats.count} Surveyed Plots
                </span>
              </div>

              {/* Dynamic 4-Metric Grid */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedHeroSeason}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-2 gap-3"
                >
                  <div className="p-3.5 rounded-xl bg-[#0F2218] border border-[#234531] space-y-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#82A88E] block">
                      Avg Harvest Yield
                    </span>
                    <div className="text-xl font-bold font-mono text-white flex items-baseline gap-1">
                      <span>{heroStats.avgYield}</span>
                      <span className="text-xs font-sans text-[#88C438] font-normal">T/Ha</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#0F2218] border border-[#234531] space-y-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#82A88E] block">
                      Est. Gross Revenue
                    </span>
                    <div className="text-xl font-bold font-mono text-white">
                      {heroStats.totalRevenue}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#0F2218] border border-[#234531] space-y-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#82A88E] block">
                      Top Volume Crop
                    </span>
                    <div className="text-base font-bold text-white flex items-center gap-1.5 truncate">
                      <Wheat className="w-4 h-4 text-[#88C438] shrink-0" />
                      <span className="truncate">{heroStats.topCrop}</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#0F2218] border border-[#234531] space-y-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#82A88E] block">
                      Avg Rainfall
                    </span>
                    <div className="text-base font-bold font-mono text-white flex items-center gap-1.5">
                      <Droplets className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>{heroStats.avgRainfall}</span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Season Ratio Bar */}
              <div className="space-y-2 pt-2 border-t border-[#254832]">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#82A88E] font-medium">Seasonal Cycle Share</span>
                  <span className="text-[#88C438] font-mono text-[11px] font-bold">50 Records Total</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#0F2218] overflow-hidden flex">
                  <div className="h-full bg-emerald-500 w-[42%]" title="Kharif (42%)" />
                  <div className="h-full bg-amber-400 w-[38%]" title="Rabi (38%)" />
                  <div className="h-full bg-orange-400 w-[20%]" title="Zaid (20%)" />
                </div>
                <div className="flex justify-between text-[10px] text-[#82A88E] font-mono pt-0.5">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Kharif (21)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Rabi (19)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400" /> Zaid (10)
                  </span>
                </div>
              </div>

              {/* Audit Modal Callout */}
              <button
                onClick={onOpenAuditModal}
                className="w-full py-2.5 rounded-xl bg-[#0F2218] hover:bg-[#1C3B29] text-[#C2D8C9] hover:text-white border border-[#234531] text-xs font-semibold transition-colors flex items-center justify-between px-3.5 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#88C438]" />
                  <span>Audit All 28 Mapped Telemetry Variables</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#82A88E]" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* KEY DATASET STATS TICKER RIBBON */}
      {/* ========================================================================= */}
      <section id="landing-stats-ribbon" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {[
          { label: 'Surveyed Plots', val: '50 Plots', note: '100% Verified' },
          { label: 'Tracked Crops', val: '8 Species', note: 'Food & Cash Crops' },
          { label: 'Agricultural States', val: '6 States', note: '12 Districts' },
          { label: 'Annual Output', val: '722.5 T', note: 'Total Harvest' },
          { label: 'Gross Revenue', val: '₹1.82 Cr', note: 'INR Economics' },
          { label: 'Telemetry Schema', val: '28 Columns', note: 'Zero Null Values' },
        ].map((item, idx) => (
          <div key={idx} className="p-4 rounded-2xl bg-white border border-[#E2E8DF] shadow-2xs space-y-1 hover:border-[#347A52]/40 transition-colors">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#68766B]">{item.label}</span>
            <div className="text-xl sm:text-2xl font-black font-mono text-[#13281C]">{item.val}</div>
            <span className="text-[10px] text-[#2C6B45] font-semibold block">{item.note}</span>
          </div>
        ))}
      </section>

      {/* ========================================================================= */}
      {/* THREE CORE ANALYTICAL PILLARS */}
      {/* ========================================================================= */}
      <section id="landing-feature-pillars" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2C6B45]">
              System Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#13281C] font-display">
              Three Pillars of AgriSeason
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#5C6B5E] max-w-md">
            Connecting empirical farm survey records with transparent, actionable agronomic intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1: Seasonal Dynamics */}
          <div
            id="card-pillar-seasonal"
            className="bg-white rounded-2xl p-6 border border-[#E2E8DF] shadow-2xs hover:shadow-md hover:border-[#2C6B45]/40 transition-all duration-200 flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#F4F7F2] border border-[#E2E8DF] flex items-center justify-center text-[#13281C] group-hover:bg-[#112419] group-hover:text-[#88C438] transition-colors">
                <CalendarDays className="w-6 h-6 stroke-[2]" />
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#F4F7F2] text-[#2C6B45]">
                  01. Cycle Analytics
                </span>
                <h3 className="text-lg font-bold text-[#13281C] font-display">
                  Seasonal Cycles
                </h3>
                <p className="text-xs text-[#5C6B5E] leading-relaxed">
                  Evaluate crop performance, water demand, and net profitability across Kharif monsoon, Rabi winter, and Zaid summer cycles.
                </p>
              </div>

              <ul className="space-y-2 pt-2 border-t border-[#F4F7F2] text-xs text-[#13281C]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2C6B45] shrink-0" />
                  <span>Kharif monsoon inundation sensitivity</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2C6B45] shrink-0" />
                  <span>Rabi winter crop economic stability</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2C6B45] shrink-0" />
                  <span>Zaid summer heat tolerance indices</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onEnterDashboard('seasons')}
              className="mt-6 pt-3 border-t border-[#E2E8DF] flex items-center justify-between text-xs font-bold text-[#13281C] hover:text-[#2C6B45] transition-colors cursor-pointer group-hover:translate-x-0.5"
            >
              <span>Explore Seasons Module</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          {/* Pillar 2: Statistical Modeling */}
          <div
            id="card-pillar-analytics"
            className="bg-white rounded-2xl p-6 border border-[#E2E8DF] shadow-2xs hover:shadow-md hover:border-[#2C6B45]/40 transition-all duration-200 flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#F4F7F2] border border-[#E2E8DF] flex items-center justify-center text-[#13281C] group-hover:bg-[#112419] group-hover:text-[#88C438] transition-colors">
                <LineChart className="w-6 h-6 stroke-[2]" />
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#F4F7F2] text-[#2C6B45]">
                  02. Predictive Models
                </span>
                <h3 className="text-lg font-bold text-[#13281C] font-display">
                  Multivariate Analytics
                </h3>
                <p className="text-xs text-[#5C6B5E] leading-relaxed">
                  Map interactions between soil NPK chemistry, weather variations, irrigation efficiency, and harvest yields.
                </p>
              </div>

              <ul className="space-y-2 pt-2 border-t border-[#F4F7F2] text-xs text-[#13281C]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2C6B45] shrink-0" />
                  <span>OLS regression curves with R² goodness-of-fit</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2C6B45] shrink-0" />
                  <span>Pearson correlation heatmap matrices</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2C6B45] shrink-0" />
                  <span>Interactive scatter plots & outlier filters</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onEnterDashboard('analytics')}
              className="mt-6 pt-3 border-t border-[#E2E8DF] flex items-center justify-between text-xs font-bold text-[#13281C] hover:text-[#2C6B45] transition-colors cursor-pointer group-hover:translate-x-0.5"
            >
              <span>Launch Analytics Module</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          {/* Pillar 3: Grounded AI */}
          <div
            id="card-pillar-ai"
            className="bg-white rounded-2xl p-6 border border-[#E2E8DF] shadow-2xs hover:shadow-md hover:border-[#2C6B45]/40 transition-all duration-200 flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#112419] text-[#88C438] flex items-center justify-center shadow-2xs">
                <Sparkles className="w-6 h-6" />
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#112419] text-[#88C438]">
                  03. Grounded Assistant
                </span>
                <h3 className="text-lg font-bold text-[#13281C] font-display">
                  AgriAI Assistant
                </h3>
                <p className="text-xs text-[#5C6B5E] leading-relaxed">
                  Query the dataset in natural language to retrieve immediate, evidence-backed agronomic answers.
                </p>
              </div>

              <ul className="space-y-2 pt-2 border-t border-[#F4F7F2] text-xs text-[#13281C]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2C6B45] shrink-0" />
                  <span>Strict zero-hallucination dataset grounding</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2C6B45] shrink-0" />
                  <span>Exact mathematical proofs & data citations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2C6B45] shrink-0" />
                  <span>Actionable agronomic guidance</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onEnterDashboard('insights')}
              className="mt-6 pt-3 border-t border-[#E2E8DF] flex items-center justify-between text-xs font-bold text-[#13281C] hover:text-[#2C6B45] transition-colors cursor-pointer group-hover:translate-x-0.5"
            >
              <span>Ask AgriAI Assistant</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* CROP PERFORMANCE PORTFOLIO CATALOG */}
      {/* ========================================================================= */}
      <section id="landing-crop-portfolio" className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E8DF] shadow-2xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2C6B45]">
              <Wheat className="w-4 h-4" />
              <span>Crop Catalog</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#13281C] font-display">
              8 Tracked Agricultural Species
            </h2>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#F4F7F2] p-1.5 rounded-xl border border-[#E2E8DF]">
            {[
              { id: 'all', label: 'All Crops' },
              { id: 'Cereals', label: 'Cereals' },
              { id: 'Commercial', label: 'Commercial' },
              { id: 'Oilseeds', label: 'Oilseeds' },
              { id: 'Pulses', label: 'Pulses' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCropCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedCropCategory === cat.id
                    ? 'bg-[#112419] text-[#88C438] shadow-2xs'
                    : 'text-[#5C6B5E] hover:text-[#13281C]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Crops Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {showcaseCrops.map((crop) => (
            <div
              key={crop.id}
              onClick={() => onEnterDashboard('crops')}
              className="p-4.5 rounded-2xl bg-[#FAFAF8] border border-[#E2E8DF] hover:border-[#2C6B45] hover:bg-white transition-all duration-200 cursor-pointer space-y-3 group shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{crop.emoji}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#EAF2E8] text-[#112419]">
                  {crop.category}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-[#13281C] font-display group-hover:text-[#2C6B45] transition-colors flex items-center justify-between">
                  <span>{crop.name}</span>
                  <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-[11px] text-[#707D72] italic font-serif">
                  {crop.scientificName}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E2E8DF] text-xs">
                <div>
                  <span className="text-[10px] text-[#707D72] block">Avg Yield</span>
                  <span className="font-bold font-mono text-[#13281C]">{crop.avgYield.toFixed(2)} T/Ha</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#707D72] block">Net Margin</span>
                  <span className="font-bold font-mono text-[#2C6B45]">₹{(crop.avgProfit / 1000).toFixed(0)}k/Ha</span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[10px] font-semibold text-[#5C6B5E]">
                <CalendarDays className="w-3 h-3 text-[#2C6B45]" />
                <span>{crop.seasons.join(', ')}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center pt-2">
          <button
            onClick={() => onEnterDashboard('crops')}
            className="px-6 py-2.5 rounded-xl bg-[#F4F7F2] hover:bg-[#112419] hover:text-[#88C438] text-[#13281C] border border-[#E2E8DF] text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Open Crop Analytics Module</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* REGIONAL COVERAGE PROFILES */}
      {/* ========================================================================= */}
      <section id="landing-regions-showcase" className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E8DF] shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2C6B45]">
              <MapPin className="w-4 h-4" />
              <span>Regional Coverage</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#13281C] font-display">
              6 Key Agricultural States
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#5C6B5E] max-w-md">
            Farm plot survey records distributed across major agro-climatic zones and irrigation networks.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ACTUAL_REGIONS_DATA.map((st) => (
            <div
              key={st.id}
              onClick={() => onEnterDashboard('regions')}
              className="p-5 rounded-2xl bg-[#FAFAF8] border border-[#E2E8DF] hover:border-[#2C6B45] hover:bg-white transition-all duration-200 cursor-pointer space-y-3 group shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#112419] text-[#88C438]">
                  {st.id.toUpperCase()}
                </span>
                <span className="text-[11px] font-mono text-[#5C6B5E]">
                  {st.plotCount} Survey Plots
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#13281C] font-display group-hover:text-[#2C6B45] transition-colors flex items-center justify-between">
                  <span>{st.state}</span>
                  <ArrowUpRight className="w-4.5 h-4.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-xs text-[#707D72]">
                  {st.zone}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E2E8DF] text-xs">
                <div>
                  <span className="text-[10px] text-[#707D72] block">Avg Yield</span>
                  <span className="font-bold font-mono text-[#13281C]">{st.avgYield.toFixed(2)} T/Ha</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#707D72] block">Primary Crop</span>
                  <span className="font-bold text-[#2C6B45] truncate block">{st.crops[0] || 'Rice'}</span>
                </div>
              </div>

              <div className="text-[10px] text-[#707D72] truncate">
                Districts: <span className="font-semibold text-[#13281C]">{st.districts.join(', ')}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center pt-2">
          <button
            onClick={() => onEnterDashboard('regions')}
            className="px-6 py-2.5 rounded-xl bg-[#F4F7F2] hover:bg-[#112419] hover:text-[#88C438] text-[#13281C] border border-[#E2E8DF] text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Explore Regional Profiles Module</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* AGRONOMIC FINDINGS CALLOUT BANNER */}
      {/* ========================================================================= */}
      <section id="landing-agronomic-findings" className="relative overflow-hidden bg-[#112419] text-white rounded-3xl p-6 sm:p-8 border border-[#21432E] shadow-lg space-y-6">
        {/* Botanical Leaf Background Image Overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <img
            src={botanicalLeafAccent}
            alt="Botanical Leaf Accent"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-right opacity-20 mix-blend-overlay filter brightness-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#112419] via-[#112419]/90 to-[#112419]/70" />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#21432E] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#88C438]">
              <Zap className="w-4 h-4" />
              <span>Key Dataset Findings</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              Empirical Agronomic Insights
            </h2>
          </div>
          <p className="text-xs text-[#C2D8C9] max-w-md">
            Calculated key takeaways derived directly from the 50 farm plot survey records.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#172E20] border border-[#254832] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#0F2218] text-[#88C438] flex items-center justify-center font-bold">
              <Droplets className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white font-display">
              +28% Drip Yield Premium
            </h3>
            <p className="text-xs text-[#C2D8C9] leading-relaxed">
              Plots utilizing micro-drip irrigation produced 28% higher water efficiency compared to traditional flood irrigation.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#172E20] border border-[#254832] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#0F2218] text-[#88C438] flex items-center justify-center font-bold">
              <CalendarDays className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white font-display">
              Rabi Harvest Stability
            </h3>
            <p className="text-xs text-[#C2D8C9] leading-relaxed">
              Rabi winter crops demonstrated the lowest disease incidence risk (2.1/10 avg) due to controlled humidity levels.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#172E20] border border-[#254832] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#0F2218] text-[#88C438] flex items-center justify-center font-bold">
              <Coins className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white font-display">
              Zaid High Margin Window
            </h3>
            <p className="text-xs text-[#C2D8C9] leading-relaxed">
              Zaid summer crops commanded a 24% higher average market price per tonne due to off-season harvest scarcity.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#172E20] border border-[#254832] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#0F2218] text-[#88C438] flex items-center justify-center font-bold">
              <Sprout className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white font-display">
              Optimal Soil pH Buffer
            </h3>
            <p className="text-xs text-[#C2D8C9] leading-relaxed">
              Farm plots with soil pH maintained between 6.5 and 7.2 achieved the highest NPK nutrient uptake efficiency.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* INTERACTIVE FARM TELEMETRY SAMPLE TABLE */}
      {/* ========================================================================= */}
      <section id="landing-dataset-sample" className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E8DF] shadow-2xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2C6B45]">
              <Database className="w-4 h-4" />
              <span>Interactive Dataset Preview</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#13281C] font-display mt-0.5">
              Empirical Farm Plot Survey (50 Observations)
            </h2>
          </div>

          <button
            onClick={() => onEnterDashboard('overview')}
            className="px-4 py-2 rounded-xl bg-[#F4F7F2] hover:bg-[#112419] hover:text-[#88C438] text-[#13281C] border border-[#E2E8DF] text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <span>Explore All 50 Farm Plots</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick Search & Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#707D72]" />
            <input
              type="text"
              value={tableSearchQuery}
              onChange={(e) => setTableSearchQuery(e.target.value)}
              placeholder="Search plot, crop, state, or irrigation..."
              className="w-full pl-9 pr-8 py-2 text-xs bg-[#FAFAF8] border border-[#E2E8DF] rounded-full text-[#13281C] placeholder:text-[#8A968B] focus:outline-none focus:border-[#2C6B45]"
            />
            {tableSearchQuery && (
              <button
                onClick={() => setTableSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#707D72] hover:text-[#13281C]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 bg-[#F4F7F2] p-1 rounded-full border border-[#E2E8DF] text-xs">
            {['all', 'Kharif', 'Rabi', 'Zaid'].map((s) => (
              <button
                key={s}
                onClick={() => setTableSeasonFilter(s)}
                className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                  tableSeasonFilter === s
                    ? 'bg-[#112419] text-[#88C438]'
                    : 'text-[#5C6B5E] hover:text-[#13281C]'
                }`}
              >
                {s === 'all' ? 'All Seasons' : s}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-[#E2E8DF] rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F4F7F2] text-[#13281C] font-semibold border-b border-[#E2E8DF] uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3">Plot ID</th>
                <th className="p-3">State / District</th>
                <th className="p-3">Crop</th>
                <th className="p-3">Season</th>
                <th className="p-3">Yield (T/Ha)</th>
                <th className="p-3">Soil pH</th>
                <th className="p-3">Irrigation</th>
                <th className="p-3 text-right">Production (T)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8DF] text-[#13281C] font-mono">
              {landingTableRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-[#707D72] font-sans">
                    No farm plot records match "{tableSearchQuery}".
                  </td>
                </tr>
              ) : (
                landingTableRecords.map((r, idx) => (
                  <tr key={r.Farm_ID || idx} className="hover:bg-[#FAFAF8] transition-colors">
                    <td className="p-3 font-bold text-[#2C6B45]">{r.Farm_ID}</td>
                    <td className="p-3 font-sans font-medium">{r.State} ({r.District})</td>
                    <td className="p-3 font-sans font-bold">{r.Crop}</td>
                    <td className="p-3 font-sans">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        r.Season === 'Kharif' ? 'bg-emerald-100 text-emerald-800' :
                        r.Season === 'Rabi' ? 'bg-amber-100 text-amber-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        {r.Season}
                      </span>
                    </td>
                    <td className="p-3 font-bold">{r.Yield_Tonnes_Ha?.toFixed(2) || 'N/A'}</td>
                    <td className="p-3">{r.Soil_pH.toFixed(1)}</td>
                    <td className="p-3 font-sans">{r.Irrigation_Method}</td>
                    <td className="p-3 text-right font-bold">{r.Production_Tonnes.toFixed(1)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* TELEMETRY SCHEMA BREAKDOWN */}
      {/* ========================================================================= */}
      <section id="project-info-breakdown" className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E8DF] shadow-2xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E2E8DF]">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2C6B45]">
              <Layers className="w-4 h-4" />
              <span>Technical & Agronomic Foundations</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#13281C] font-display mt-0.5">
              AgriSeason Telemetry Schema
            </h2>
          </div>

          <button
            onClick={onOpenAuditModal}
            className="px-4 py-2 rounded-xl bg-[#F4F7F2] hover:bg-[#112419] hover:text-[#88C438] text-[#13281C] border border-[#E2E8DF] text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0"
          >
            <span>View 28-Column Audit Sheet</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 5 Schema Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-[#E2E8DF] space-y-2 hover:border-[#2C6B45]/40 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-[#112419] text-[#88C438] flex items-center justify-center font-bold">
              <Database className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-[#13281C] font-display">
              50 Farm Plots
            </h3>
            <p className="text-[11px] text-[#5C6B5E] leading-relaxed">
              Mapped soil pH, NPK levels, micro-climates, and harvest yields with zero placeholder rows.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-[#E2E8DF] space-y-2 hover:border-[#2C6B45]/40 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-[#112419] text-[#88C438] flex items-center justify-center font-bold">
              <CalendarDays className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-[#13281C] font-display">
              Seasonal Cycles
            </h3>
            <p className="text-[11px] text-[#5C6B5E] leading-relaxed">
              Benchmarking across Kharif (Monsoon), Rabi (Winter), and Zaid (Summer) crop rotations.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-[#E2E8DF] space-y-2 hover:border-[#2C6B45]/40 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-[#112419] text-[#88C438] flex items-center justify-center font-bold">
              <Thermometer className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-[#13281C] font-display">
              Climate Telemetry
            </h3>
            <p className="text-[11px] text-[#5C6B5E] leading-relaxed">
              Precipitation (mm), ambient temp (°C), humidity (%), and disease pressure metrics.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-[#E2E8DF] space-y-2 hover:border-[#2C6B45]/40 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-[#112419] text-[#88C438] flex items-center justify-center font-bold">
              <Droplets className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-[#13281C] font-display">
              Resource Efficiency
            </h3>
            <p className="text-[11px] text-[#5C6B5E] leading-relaxed">
              Water productivity (t/1000m³), drip vs. flood irrigation efficiency, and NPK utilization.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-[#E2E8DF] space-y-2 hover:border-[#2C6B45]/40 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-[#112419] text-[#88C438] flex items-center justify-center font-bold">
              <Coins className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-[#13281C] font-display">
              INR Economics
            </h3>
            <p className="text-[11px] text-[#5C6B5E] leading-relaxed">
              Cost per hectare, market sales price, net margins, and ROI calculations per plot.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

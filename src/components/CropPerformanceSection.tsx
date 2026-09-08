import React, { useState } from 'react';
import {
  Wheat,
  TrendingUp,
  Droplets,
  Shield,
  Search,
  ArrowUpRight,
  SlidersHorizontal,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CropPerformanceItem, SeasonType } from '../types';
import { CROPS_DATA } from '../data/mockData';
import { AnimatedNumber } from './AnimatedNumber';
import { NoFilterResultsState } from './StateFeedback';
import { useFilters } from '../context/FilterContext';

interface CropPerformanceSectionProps {
  selectedSeason?: SeasonType;
  searchQuery?: string;
}

export const CropPerformanceSection: React.FC<CropPerformanceSectionProps> = ({
  searchQuery = '',
}) => {
  const { filters, clearAllFilters } = useFilters();
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'performance' | 'yield' | 'profit'>('performance');

  const activeSeason = filters.season;
  const activeCrop = filters.crop;
  const activeCategory = filters.category;
  const activeSearch = filters.searchQuery || searchQuery;

  // Filter crops based on active global filters + local category filter
  const filteredCrops = CROPS_DATA.filter((crop) => {
    // Global Season filter
    if (activeSeason !== 'all' && crop.season.toLowerCase() !== activeSeason.toLowerCase()) {
      return false;
    }
    // Global Crop filter
    if (activeCrop !== 'all' && !crop.name.toLowerCase().includes(activeCrop.toLowerCase())) {
      return false;
    }
    // Global Category filter
    if (activeCategory !== 'all' && crop.category.toLowerCase() !== activeCategory.toLowerCase()) {
      return false;
    }
    // Local Category filter button
    if (categoryFilter !== 'all' && crop.category.toLowerCase() !== categoryFilter.toLowerCase()) {
      return false;
    }
    // Search query
    if (activeSearch.trim() !== '') {
      const q = activeSearch.toLowerCase();
      const matchName = crop.name.toLowerCase().includes(q);
      const matchSci = crop.scientificName.toLowerCase().includes(q);
      const matchCat = crop.category.toLowerCase().includes(q);
      const matchSeason = crop.season.toLowerCase().includes(q);
      if (!matchName && !matchSci && !matchCat && !matchSeason) return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'performance') return b.performanceScore - a.performanceScore;
    if (sortBy === 'yield') return b.yieldPerHa - a.yieldPerHa;
    if (sortBy === 'profit') return b.profitPerHa - a.profitPerHa;
    return 0;
  });

  const categories = ['all', 'Cereal', 'Pulse', 'Oilseed', 'Cash Crop', 'Horticulture'];

  const resetLocalFilters = () => {
    setCategoryFilter('all');
    clearAllFilters();
  };

  return (
    <section id="crop-performance-section" className="w-full mt-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-[#1B3022] tracking-tight font-display">
              Crop Performance Matrix
            </h3>
            <span className="text-xs font-bold text-[#1B3022] bg-[#F0F7EE] px-2.5 py-0.5 rounded-full border border-[#E2E8DE]">
              {filteredCrops.length} Crops Tracked
            </span>
          </div>
          <p className="text-xs text-[#707D72]">
            Yield capacity, gross output, and net return index by seasonal crop
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <div className="flex items-center bg-[#F0F7EE] p-1 rounded-full border border-[#E2E8DE]">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 text-xs font-semibold rounded-full capitalize transition-all cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-[#1B3022] text-[#A3E635] shadow-2xs'
                    : 'text-[#707D72] hover:text-[#1B3022]'
                }`}
              >
                {cat === 'all' ? 'All Types' : cat}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs font-semibold bg-white text-[#1B3022] border border-[#E2E8DE] rounded-full px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#A3E635] cursor-pointer"
          >
            <option value="performance">Sort: Score</option>
            <option value="yield">Sort: Yield</option>
            <option value="profit">Sort: Profit</option>
          </select>
        </div>
      </div>

      {/* Crop Cards Grid */}
      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4 items-stretch">
        <AnimatePresence>
          {filteredCrops.map((crop, idx) => {
            // Crop icon emoji for artistic flair
            const getCropEmoji = (name: string) => {
              if (name.includes('Rice')) return '🌾';
              if (name.includes('Maize')) return '🌽';
              if (name.includes('Wheat')) return '🌱';
              if (name.includes('Sunflower')) return '🌻';
              if (name.includes('Cotton')) return '☁️';
              if (name.includes('Mustard')) return '🌼';
              if (name.includes('Gram') || name.includes('Pulse')) return '🫘';
              if (name.includes('Watermelon') || name.includes('Cucumber')) return '🍉';
              return '🌿';
            };

            const formatProfit = (p: number) => {
              const abs = Math.abs(p);
              const sign = p < 0 ? '-' : '';
              if (abs >= 100000) return `${sign}₹${(abs / 100000).toFixed(1)}L`;
              if (abs >= 1000) return `${sign}₹${(abs / 1000).toFixed(0)}k`;
              return `${sign}₹${abs}`;
            };

            return (
              <motion.div
                layout
                key={crop.id}
                id={`crop-card-${crop.id}`}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2, delay: idx * 0.03 }}
                whileHover={{ y: -3, transition: { duration: 0.15 } }}
                className="bg-white rounded-2xl p-4.5 border border-[#E2E8DE]/80 shadow-[0_2px_10px_rgba(27,48,34,0.03)] hover:shadow-[0_6px_20px_rgba(27,48,34,0.08)] transition-all duration-200 flex flex-col justify-between cursor-default h-full min-h-[250px]"
              >
                {/* Top Row: Crop Name + Badges */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 bg-[#F0F7EE] rounded-xl flex items-center justify-center text-xl shrink-0">
                      {getCropEmoji(crop.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-bold text-[#1B3022] text-sm tracking-tight truncate font-display">
                          {crop.name}
                        </h4>
                        <span className="text-[10px] text-[#347A52] font-bold px-2 py-0.5 rounded-full bg-[#F0F7EE] border border-[#E2E8DE] shrink-0">
                          <AnimatedNumber value={crop.performanceScore} suffix="% Score" durationMs={300} />
                        </span>
                      </div>
                      <p className="text-[11px] italic text-[#707D72] truncate mt-0.5 h-4">
                        {crop.scientificName}
                      </p>
                      <div className="w-full bg-[#F0F7EE] h-1.5 rounded-full mt-1.5 overflow-hidden">
                        <div
                          className="bg-[#A3E635] h-full rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${crop.performanceScore}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Category & Season Tags */}
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <span className="font-bold px-2 py-0.5 rounded-md bg-[#1B3022] text-[#A3E635] uppercase tracking-wider shrink-0">
                      {crop.season}
                    </span>
                    <span className="font-semibold text-[#5C6B5E] bg-[#F4F7F2] px-2 py-0.5 rounded-md truncate max-w-[100px]">
                      {crop.category}
                    </span>
                    <span className="font-semibold text-[#5C6B5E] bg-[#F4F7F2] px-2 py-0.5 rounded-md ml-auto shrink-0">
                      {crop.harvestStatus}
                    </span>
                  </div>
                </div>

                {/* Performance Metrics Breakdown */}
                <div className="my-3 p-3 rounded-xl bg-[#F8FAF5] border border-[#E2E8DE]/70 grid grid-cols-3 gap-2 text-center">
                  <div className="flex flex-col justify-between">
                    <span className="text-[9px] uppercase font-bold text-[#707D72] tracking-wider block">
                      Yield
                    </span>
                    <span className="text-sm font-bold text-[#1B3022] font-mono block my-0.5">
                      <AnimatedNumber value={crop.yieldPerHa} durationMs={350} />
                    </span>
                    <span className="text-[9px] text-[#707D72] block">
                      {crop.yieldUnit}
                    </span>
                  </div>

                  <div className="border-x border-[#E2E8DE]/80 px-1 flex flex-col justify-between">
                    <span className="text-[9px] uppercase font-bold text-[#707D72] tracking-wider block">
                      Output
                    </span>
                    <span className="text-sm font-bold text-[#1B3022] font-mono block my-0.5">
                      <AnimatedNumber value={crop.productionTotal} durationMs={350} />
                    </span>
                    <span className="text-[9px] text-[#707D72] block">
                      {crop.productionUnit}
                    </span>
                  </div>

                  <div className="flex flex-col justify-between">
                    <span className="text-[9px] uppercase font-bold text-[#707D72] tracking-wider block">
                      Profit
                    </span>
                    <span className={`text-sm font-bold font-mono block my-0.5 ${crop.profitPerHa < 0 ? 'text-red-600' : 'text-[#1B3022]'}`}>
                      {formatProfit(crop.profitPerHa)}
                    </span>
                    <span className="text-[9px] text-[#707D72] block">
                      / ha
                    </span>
                  </div>
                </div>

                {/* Micro indicators */}
                <div className="flex items-center justify-between text-[10px] text-[#707D72] pt-1">
                  <div className="flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5 text-[#2F9E44]" />
                    <span>Water: <strong className="text-[#1B3022] font-medium">{crop.waterRequirement}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-[#1B3022]" />
                    <span>Resilience: <strong className="text-[#1B3022] font-medium">{crop.resilienceScore}/10</strong></span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {filteredCrops.length === 0 && (
        <NoFilterResultsState
          onReset={resetLocalFilters}
          filterSummary={searchQuery ? `"${searchQuery}" under ${categoryFilter === 'all' ? 'All categories' : categoryFilter}` : categoryFilter !== 'all' ? `${categoryFilter} crops` : undefined}
          compact
        />
      )}
    </section>
  );
};

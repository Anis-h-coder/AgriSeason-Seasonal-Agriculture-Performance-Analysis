import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Filter,
  X,
  RotateCcw,
  ChevronDown,
  Calendar,
  Wheat,
  MapPin,
  Layers,
  Search,
  Check,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';
import { useFilters } from '../context/FilterContext';
import { SeasonType } from '../types';
import { AnimatedNumber } from './AnimatedNumber';

export const GlobalFilterBar: React.FC = () => {
  const {
    filters,
    setSeason,
    setCrop,
    setRegion,
    setCategory,
    setSearchQuery,
    clearFilter,
    clearAllFilters,
    hasActiveFilters,
    activeFilterCount,
    activeFilterTags,
    filteredRecordsCount,
    totalRecordsCount,
    distinctOptions,
  } = useFilters();

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const toggleDropdown = (name: string) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const percentage = Math.round((filteredRecordsCount / (totalRecordsCount || 1)) * 100);

  return (
    <div
      ref={containerRef}
      id="global-filter-bar"
      className="bg-white rounded-3xl p-4 sm:p-5 border border-[#E2E8DE]/80 shadow-[0_2px_8px_rgba(27,48,34,0.03)] space-y-3.5 transition-all"
    >
      {/* Top Controls Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
        {/* Left: Filter Selectors Group */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1B3022] text-[#A3E635] rounded-2xl text-xs font-bold shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 bg-[#A3E635] text-[#1B3022] text-[10px] font-black rounded-full flex items-center justify-center ml-0.5">
                {activeFilterCount}
              </span>
            )}
          </div>

          {/* 1. Season Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('season')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-semibold border transition-all cursor-pointer ${
                filters.season !== 'all'
                  ? 'bg-[#1B3022] text-white border-[#1B3022] shadow-xs'
                  : 'bg-[#F0F7EE]/60 text-[#2C332E] border-[#E2E8DE] hover:bg-[#F0F7EE] hover:border-[#CBD8CD]'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-[#707D72]" />
              <span>
                {filters.season === 'all'
                  ? 'Season: All'
                  : `Season: ${filters.season.charAt(0).toUpperCase() + filters.season.slice(1)}`}
              </span>
              <ChevronDown
                className={`w-3 h-3 text-[#707D72] transition-transform duration-200 ${
                  openDropdown === 'season' ? 'rotate-180' : ''
                }`}
              />
            </button>

            <AnimatePresence>
              {openDropdown === 'season' && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-full mt-2 w-56 bg-white rounded-2xl border border-[#E2E8DE] shadow-xl z-30 p-1.5 space-y-0.5"
                >
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#707D72]">
                    Select Agricultural Season
                  </div>
                  {distinctOptions.seasons.map((opt) => {
                    const isSelected = filters.season === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setSeason(opt.value as SeasonType);
                          setOpenDropdown(null);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#1B3022] text-[#A3E635] font-bold'
                            : 'text-[#2C332E] hover:bg-[#F0F7EE]'
                        }`}
                      >
                        <div>
                          <div>{opt.label}</div>
                          <div className={`text-[10px] ${isSelected ? 'text-[#A3E635]/80' : 'text-[#707D72]'}`}>
                            {opt.period}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                              isSelected ? 'bg-white/20 text-white' : 'bg-[#E2E8DE]/60 text-[#707D72]'
                            }`}
                          >
                            {opt.count} plots
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#A3E635]" />}
                        </div>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 2. Crop Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('crop')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-semibold border transition-all cursor-pointer ${
                filters.crop !== 'all'
                  ? 'bg-[#1B3022] text-white border-[#1B3022] shadow-xs'
                  : 'bg-[#F0F7EE]/60 text-[#2C332E] border-[#E2E8DE] hover:bg-[#F0F7EE] hover:border-[#CBD8CD]'
              }`}
            >
              <Wheat className="w-3.5 h-3.5 text-[#707D72]" />
              <span>{filters.crop === 'all' ? 'Crop: All' : `Crop: ${filters.crop}`}</span>
              <ChevronDown
                className={`w-3 h-3 text-[#707D72] transition-transform duration-200 ${
                  openDropdown === 'crop' ? 'rotate-180' : ''
                }`}
              />
            </button>

            <AnimatePresence>
              {openDropdown === 'crop' && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-full mt-2 w-60 bg-white rounded-2xl border border-[#E2E8DE] shadow-xl z-30 p-1.5 space-y-0.5 max-h-72 overflow-y-auto"
                >
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#707D72]">
                    Select Crop Variety
                  </div>
                  <button
                    onClick={() => {
                      setCrop('all');
                      setOpenDropdown(null);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors cursor-pointer ${
                      filters.crop === 'all'
                        ? 'bg-[#1B3022] text-[#A3E635] font-bold'
                        : 'text-[#2C332E] hover:bg-[#F0F7EE]'
                    }`}
                  >
                    <span>All Crops ({totalRecordsCount} plots)</span>
                    {filters.crop === 'all' && <Check className="w-3.5 h-3.5 text-[#A3E635]" />}
                  </button>

                  {distinctOptions.crops.map((opt) => {
                    const isSelected = filters.crop === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setCrop(opt.value);
                          setOpenDropdown(null);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#1B3022] text-[#A3E635] font-bold'
                            : 'text-[#2C332E] hover:bg-[#F0F7EE]'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span>{opt.label}</span>
                          <span className={`text-[9px] px-1 py-0.2 rounded-sm ${isSelected ? 'bg-white/20 text-[#A3E635]' : 'bg-[#E2E8DE] text-[#707D72]'}`}>
                            {opt.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                              isSelected ? 'bg-white/20 text-white' : 'bg-[#E2E8DE]/60 text-[#707D72]'
                            }`}
                          >
                            {opt.count}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#A3E635]" />}
                        </div>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 3. Region / State Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('region')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-semibold border transition-all cursor-pointer ${
                filters.region !== 'all'
                  ? 'bg-[#1B3022] text-white border-[#1B3022] shadow-xs'
                  : 'bg-[#F0F7EE]/60 text-[#2C332E] border-[#E2E8DE] hover:bg-[#F0F7EE] hover:border-[#CBD8CD]'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-[#707D72]" />
              <span>{filters.region === 'all' ? 'Region: All' : `Region: ${filters.region}`}</span>
              <ChevronDown
                className={`w-3 h-3 text-[#707D72] transition-transform duration-200 ${
                  openDropdown === 'region' ? 'rotate-180' : ''
                }`}
              />
            </button>

            <AnimatePresence>
              {openDropdown === 'region' && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-full mt-2 w-60 bg-white rounded-2xl border border-[#E2E8DE] shadow-xl z-30 p-1.5 space-y-0.5 max-h-72 overflow-y-auto"
                >
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#707D72]">
                    Select State Region
                  </div>
                  <button
                    onClick={() => {
                      setRegion('all');
                      setOpenDropdown(null);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors cursor-pointer ${
                      filters.region === 'all'
                        ? 'bg-[#1B3022] text-[#A3E635] font-bold'
                        : 'text-[#2C332E] hover:bg-[#F0F7EE]'
                    }`}
                  >
                    <span>All States ({totalRecordsCount} plots)</span>
                    {filters.region === 'all' && <Check className="w-3.5 h-3.5 text-[#A3E635]" />}
                  </button>

                  {distinctOptions.regions.map((opt) => {
                    const isSelected = filters.region === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setRegion(opt.value);
                          setOpenDropdown(null);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#1B3022] text-[#A3E635] font-bold'
                            : 'text-[#2C332E] hover:bg-[#F0F7EE]'
                        }`}
                      >
                        <span>{opt.label}</span>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                              isSelected ? 'bg-white/20 text-white' : 'bg-[#E2E8DE]/60 text-[#707D72]'
                            }`}
                          >
                            {opt.count} plots
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#A3E635]" />}
                        </div>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 4. Category Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('category')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-semibold border transition-all cursor-pointer ${
                filters.category !== 'all'
                  ? 'bg-[#1B3022] text-white border-[#1B3022] shadow-xs'
                  : 'bg-[#F0F7EE]/60 text-[#2C332E] border-[#E2E8DE] hover:bg-[#F0F7EE] hover:border-[#CBD8CD]'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#707D72]" />
              <span>
                {filters.category === 'all' ? 'Category: All' : `Category: ${filters.category}`}
              </span>
              <ChevronDown
                className={`w-3 h-3 text-[#707D72] transition-transform duration-200 ${
                  openDropdown === 'category' ? 'rotate-180' : ''
                }`}
              />
            </button>

            <AnimatePresence>
              {openDropdown === 'category' && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-full mt-2 w-56 bg-white rounded-2xl border border-[#E2E8DE] shadow-xl z-30 p-1.5 space-y-0.5"
                >
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#707D72]">
                    Select Crop Category
                  </div>
                  <button
                    onClick={() => {
                      setCategory('all');
                      setOpenDropdown(null);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors cursor-pointer ${
                      filters.category === 'all'
                        ? 'bg-[#1B3022] text-[#A3E635] font-bold'
                        : 'text-[#2C332E] hover:bg-[#F0F7EE]'
                    }`}
                  >
                    <span>All Categories</span>
                    {filters.category === 'all' && <Check className="w-3.5 h-3.5 text-[#A3E635]" />}
                  </button>

                  {distinctOptions.categories.map((opt) => {
                    const isSelected = filters.category === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setCategory(opt.value);
                          setOpenDropdown(null);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#1B3022] text-[#A3E635] font-bold'
                            : 'text-[#2C332E] hover:bg-[#F0F7EE]'
                        }`}
                      >
                        <span>{opt.label}</span>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                              isSelected ? 'bg-white/20 text-white' : 'bg-[#E2E8DE]/60 text-[#707D72]'
                            }`}
                          >
                            {opt.count} plots
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#A3E635]" />}
                        </div>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right: Results Count & Clear All Button */}
        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-[#707D72]">
            <span className="font-semibold text-[#1B3022]">
              <AnimatedNumber value={filteredRecordsCount} durationMs={300} /> of {totalRecordsCount}
            </span>
            <span>farm plots</span>
            <span className="px-2 py-0.5 rounded-full bg-[#F0F7EE] text-[#1B3022] font-mono text-[11px] font-bold border border-[#E2E8DE]">
              <AnimatedNumber value={percentage} suffix="%" durationMs={300} />
            </span>
          </div>

          {hasActiveFilters && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={clearAllFilters}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFF1F0] text-[#D9381E] border border-[#FFCCC7] hover:bg-[#D9381E] hover:text-white transition-all text-xs font-bold cursor-pointer shadow-2xs"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear filters</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Bottom: Active Filter Chips */}
      <AnimatePresence>
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="pt-2 border-t border-[#E2E8DE]/60 flex flex-wrap items-center gap-2 overflow-hidden"
          >
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#707D72] mr-1">
              Active Filters:
            </span>

            {activeFilterTags.map((tag) => (
              <motion.span
                layout
                key={tag.key}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#F0F7EE] border border-[#CBD8CD] text-[#1B3022] shadow-2xs"
              >
                <span className="text-[#707D72] text-[10px] font-bold uppercase">
                  {tag.dimensionLabel}:
                </span>
                <span className="font-bold">{tag.displayValue}</span>
                <button
                  onClick={() => clearFilter(tag.key)}
                  className="w-4 h-4 rounded-full bg-[#CBD8CD]/50 hover:bg-[#D9381E] hover:text-white flex items-center justify-center text-[10px] transition-colors cursor-pointer"
                  title={`Remove ${tag.dimensionLabel} filter`}
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </motion.span>
            ))}

            <button
              onClick={clearAllFilters}
              className="text-[11px] font-bold text-[#707D72] hover:text-[#D9381E] ml-1 transition-colors cursor-pointer underline underline-offset-2"
            >
              Reset all
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

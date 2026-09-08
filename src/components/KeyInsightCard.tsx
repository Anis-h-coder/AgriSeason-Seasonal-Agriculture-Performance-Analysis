import React from 'react';
import { Sparkles, Lightbulb } from 'lucide-react';
import { KeyInsightItem, SeasonType } from '../types';
import { useFilters } from '../context/FilterContext';
import { getFilteredKeyInsight } from '../utils/datasetProcessor';

interface KeyInsightCardProps {
  selectedSeason?: SeasonType;
}

export const KeyInsightCard: React.FC<KeyInsightCardProps> = ({ selectedSeason }) => {
  const { filters } = useFilters();
  const activeCriteria = {
    season: selectedSeason || filters.season,
    crop: filters.crop,
    region: filters.region,
    category: filters.category,
    searchQuery: filters.searchQuery,
  };

  const insight: KeyInsightItem = getFilteredKeyInsight(activeCriteria);


  return (
    <div
      id="key-seasonal-insight-card"
      className="bg-[#D4E157] p-5.5 rounded-[32px] border border-white/60 shadow-[0_4px_20px_rgba(27,48,34,0.04)] text-[#1B3022] relative overflow-hidden flex flex-col justify-between space-y-3"
    >
      {/* Decorative botanical watermark SVG */}
      <svg
        className="absolute -right-6 -bottom-6 w-36 h-36 text-[#1B3022]/10 pointer-events-none"
        viewBox="0 0 100 100"
        fill="currentColor"
      >
        <path d="M50 0 C77 0 100 23 100 50 C100 77 77 100 50 100 C23 100 0 77 0 50 C0 23 23 0 50 0 Z M50 15 C30 15 15 30 15 50 C15 70 30 85 50 85 C70 85 85 70 85 50 C85 30 70 15 50 15 Z" />
      </svg>

      {/* Header Tag */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1B3022] text-[#A3E635] text-[10px] font-bold uppercase tracking-wider">
          <Sparkles className="w-3 h-3 text-[#A3E635]" />
          <span>Key Agronomic Insight</span>
        </div>

        <span className="text-[10px] font-bold text-[#1B3022]/60 uppercase tracking-wider">
          {insight.confidenceScore}% Confidence
        </span>
      </div>

      {/* Headline */}
      <div>
        <p className="text-[10px] font-bold text-[#1B3022]/70 uppercase tracking-widest mb-1">
          {insight.title}
        </p>
        <h3 className="text-base font-bold text-[#1B3022] leading-snug font-display">
          {insight.headline}
        </h3>
      </div>

      {/* Differential Stat Card */}
      <div className="p-3 bg-white/70 rounded-2xl flex items-center justify-between">
        <div>
          <span className="text-[10px] text-[#1B3022]/70 block uppercase font-bold tracking-wider">
            Projected Differential
          </span>
          <span className="text-lg font-bold text-[#1B3022] font-display">
            {insight.highlightStat}
          </span>
        </div>
        <div className="px-2.5 py-1 rounded-full bg-[#1B3022] text-[#A3E635] text-[10px] font-bold uppercase">
          {insight.impactLevel}
        </div>
      </div>

      {/* Actionable Directive */}
      <div className="pt-2 border-t border-[#1B3022]/10 flex items-start gap-2">
        <Lightbulb className="w-4 h-4 text-[#1B3022] shrink-0 mt-0.5" />
        <div className="text-xs text-[#1B3022] font-medium leading-snug">
          <span className="font-bold">Directive: </span>
          {insight.actionableRecommendation}
        </div>
      </div>
    </div>
  );
};

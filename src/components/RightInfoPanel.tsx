import React from 'react';
import { KeyInsightCard } from './KeyInsightCard';
import { EnvironmentalCard } from './EnvironmentalCard';
import { SeasonType } from '../types';
import {
  Calendar,
  ChevronRight,
  CheckCircle2,
  Clock,
  Database,
  Sprout,
  Layers,
  ArrowUpRight,
  Coins,
  ShieldCheck,
  FileSpreadsheet,
  BarChart3,
  Sparkles,
} from 'lucide-react';
import { SEASONS_INFO } from '../data/mockData';

interface RightInfoPanelProps {
  selectedSeason: SeasonType;
  onSeasonChange: (season: SeasonType) => void;
  onOpenAuditModal?: () => void;
  onNavigateToTab?: (tab: string) => void;
}

export const RightInfoPanel: React.FC<RightInfoPanelProps> = ({
  selectedSeason,
  onSeasonChange,
  onOpenAuditModal,
  onNavigateToTab,
}) => {
  const currentSeasonInfo = SEASONS_INFO[selectedSeason];

  // Stage progress pipeline for the active season
  const stages = [
    { title: 'Land Prep & Sowing', date: 'Jul 01 - Jul 25', status: 'completed' },
    { title: 'Vegetative & Tillering', date: 'Aug 01 - Sep 15', status: 'completed' },
    { title: 'Panicle / Flowering', date: 'Sep 16 - Oct 10', status: 'in-progress' },
    { title: 'Physiological Maturity', date: 'Oct 11 - Oct 25', status: 'upcoming' },
    { title: 'Harvest & Threshing', date: 'Oct 26 - Nov 15', status: 'upcoming' },
  ];

  return (
    <aside id="right-information-rail" className="w-full space-y-4">
      {/* 1. Key Insight Visual Card */}
      <KeyInsightCard selectedSeason={selectedSeason} />

      {/* 2. Environmental Conditions Card */}
      <EnvironmentalCard selectedSeason={selectedSeason} />

      {/* 3. Seasonal Phenology Stages & Timeline Card */}
      <div
        id="seasonal-phenology-card"
        className="bg-white rounded-[32px] p-5.5 border border-[#E2E8DE]/70 shadow-[0_2px_12px_rgba(27,48,34,0.02)] space-y-3"
      >
        <div className="flex items-center justify-between pb-2.5 border-b border-[#E2E8DE]/60">
          <div>
            <h4 className="font-bold text-[#1B3022] text-sm tracking-tight font-display">
              Seasonal Agro-Timeline
            </h4>
            <p className="text-[11px] text-[#707D72]">
              Phenological milestones & sowing calendar
            </p>
          </div>
          <span className="text-[10px] font-bold text-[#1B3022] bg-[#F0F7EE] px-2.5 py-0.5 rounded-full">
            Stage 3 of 5
          </span>
        </div>

        {/* Season Description Pill */}
        <div className="p-3 rounded-2xl bg-[#F0F7EE] text-xs space-y-1">
          <div className="flex items-center justify-between text-[#1B3022] font-bold">
            <span>{currentSeasonInfo.name}</span>
            <span className="text-[10px] text-[#707D72] font-semibold">
              {currentSeasonInfo.months}
            </span>
          </div>
          <p className="text-[11px] text-[#707D72] leading-relaxed">
            {currentSeasonInfo.description}
          </p>
        </div>

        {/* Step list */}
        <div className="space-y-1 pt-0.5">
          {stages.map((stage, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between p-2.5 rounded-2xl text-xs transition-colors ${
                stage.status === 'in-progress' ? 'bg-[#F0F7EE]' : 'hover:bg-[#F8FAF5]'
              }`}
            >
              <div className="flex items-center gap-3">
                {stage.status === 'completed' ? (
                  <CheckCircle2 className="w-4 h-4 text-[#2F9E44] shrink-0" />
                ) : stage.status === 'in-progress' ? (
                  <div className="w-4 h-4 rounded-full border-2 border-[#1B3022] flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A3E635]" />
                  </div>
                ) : (
                  <div className="w-4 h-4 rounded-full border border-[#D5E0D7] shrink-0" />
                )}
                <div>
                  <span
                    className={`font-bold block text-xs ${
                      stage.status === 'in-progress'
                        ? 'text-[#1B3022]'
                        : stage.status === 'completed'
                        ? 'text-[#2C332E]'
                        : 'text-[#9AABA0]'
                    }`}
                  >
                    {stage.title}
                  </span>
                  <span className="text-[10px] text-[#707D72]">{stage.date}</span>
                </div>
              </div>

              {stage.status === 'in-progress' && (
                <span className="text-[9px] font-bold uppercase tracking-wider bg-[#A3E635] text-[#1B3022] px-2 py-0.5 rounded-full">
                  Active
                </span>
              )}
            </div>
          ))}
        </div>
      </div>



      {/* 5. Soil & Agronomic Baseline Calibration Card */}
      <div
        id="soil-baseline-calibration-card"
        className="bg-[#1B3022] text-white rounded-[32px] p-5.5 border border-[#2B4E38] shadow-md space-y-3.5"
      >
        <div className="flex items-center justify-between pb-2.5 border-b border-[#2B4E38]">
          <div className="flex items-center gap-2">
            <Sprout className="w-4 h-4 text-[#A3E635]" />
            <h4 className="font-bold text-white text-sm tracking-tight font-display">
              Soil & Agronomic Baseline
            </h4>
          </div>
          <span className="text-[10px] font-bold text-[#A3E635] bg-[#A3E635]/15 px-2.5 py-0.5 rounded-full border border-[#A3E635]/30">
            Optimal Range
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-[#14261B] border border-[#284934]">
            <span className="text-[9px] uppercase font-bold text-[#81A48B] block">Soil pH Target</span>
            <span className="text-sm font-bold text-white font-mono mt-0.5 block">6.5 – 7.2 pH</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#14261B] border border-[#284934]">
            <span className="text-[9px] uppercase font-bold text-[#81A48B] block">NPK Ratio</span>
            <span className="text-sm font-bold text-white font-mono mt-0.5 block">120:60:40</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#14261B] border border-[#284934]">
            <span className="text-[9px] uppercase font-bold text-[#81A48B] block">Organic Carbon</span>
            <span className="text-sm font-bold text-white font-mono mt-0.5 block">0.78% High</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#14261B] border border-[#284934]">
            <span className="text-[9px] uppercase font-bold text-[#81A48B] block">Irrigation Efficiency</span>
            <span className="text-sm font-bold text-[#A3E635] font-mono mt-0.5 block">85% Drip</span>
          </div>
        </div>

        <p className="text-[11px] text-[#C0D7C6] leading-relaxed">
          Balanced NPK application combined with micro-drip irrigation achieves <strong className="text-white">+24.2% higher yield output</strong> compared to flood irrigation models.
        </p>
      </div>

      {/* 6. Economic Highlights & Project Insights CTA Card */}
      <div
        id="project-economic-insights-card"
        className="bg-gradient-to-br from-[#F4F7F2] to-[#E5EFE2] rounded-[32px] p-5.5 border border-[#347A52]/30 shadow-xs space-y-3"
      >
        <div className="flex items-center justify-between pb-2 border-b border-[#347A52]/20">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-[#347A52]" />
            <h4 className="font-bold text-[#1B3022] text-sm tracking-tight font-display">
              Project Findings & Insights
            </h4>
          </div>
          <span className="text-[10px] font-mono font-bold text-[#347A52] bg-white px-2 py-0.5 rounded-full border border-[#347A52]/20">
            FY 2024–25
          </span>
        </div>

        <p className="text-[11px] text-[#4A5E50] leading-relaxed">
          Discover multi-seasonal profit trends, seed efficiency correlations, and pest risk reduction strategies derived from this project dataset.
        </p>

        <div className="space-y-1.5 text-xs text-[#1B3022] font-semibold">
          <div className="flex justify-between py-1 border-b border-[#347A52]/10">
            <span className="text-[#5C6B5E] text-[11px]">Est. Total Production:</span>
            <span className="font-mono font-bold">1,428.5 Tonnes</span>
          </div>
          <div className="flex justify-between py-1 border-b border-[#347A52]/10">
            <span className="text-[#5C6B5E] text-[11px]">Est. Gross Revenue:</span>
            <span className="font-mono font-bold text-[#347A52]">₹3.54 Crores</span>
          </div>
        </div>

        {onNavigateToTab && (
          <button
            onClick={() => onNavigateToTab('project-insights')}
            className="w-full mt-2 py-2.5 rounded-xl bg-[#347A52] hover:bg-[#286141] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <BarChart3 className="w-3.5 h-3.5 text-[#A3E635]" />
            <span>Read Complete Project Findings</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </aside>
  );
};


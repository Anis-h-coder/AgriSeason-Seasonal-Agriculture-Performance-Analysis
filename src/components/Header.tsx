import React from 'react';
import {
  Search,
  Calendar,
  Bell,
  Download,
  Filter,
  Database,
  SlidersHorizontal,
} from 'lucide-react';
import { SeasonType } from '../types';

interface HeaderProps {
  selectedSeason: SeasonType;
  onSeasonChange: (season: SeasonType) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeTabTitle: string;
  onOpenSchemaModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedSeason,
  onSeasonChange,
  searchQuery,
  onSearchChange,
  activeTabTitle,
  onOpenSchemaModal,
}) => {
  const seasons: { id: SeasonType; label: string; shortLabel: string; period: string }[] = [
    { id: 'all', label: 'All Seasons', shortLabel: 'All', period: 'Annual 2025–26' },
    { id: 'kharif', label: 'Kharif', shortLabel: 'Kharif', period: 'Monsoon (Jun–Oct)' },
    { id: 'rabi', label: 'Rabi', shortLabel: 'Rabi', period: 'Winter (Oct–Mar)' },
    { id: 'zaid', label: 'Zaid', shortLabel: 'Zaid', period: 'Summer (Mar–Jun)' },
  ];

  return (
    <header
      id="agriseason-header"
      className="sticky top-0 z-20 bg-white/95 backdrop-blur-xs border-b border-[#E2E8DE]/70 px-4 sm:px-6 md:px-8 lg:px-10 py-3.5 sm:py-4.5 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.015)]"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
        {/* Left: Title & Breadcrumbs */}
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-medium text-[#707D72] mb-0.5">
            <span>AgriSeason</span>
            <span>/</span>
            <span className="text-[#1B3022] font-semibold truncate">{activeTabTitle}</span>
          </div>
          <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
            <h1 className="text-xl sm:text-2xl font-bold text-[#1B3022] font-display tracking-tight truncate">
              {activeTabTitle === 'Overview' ? 'Seasonal Overview' : activeTabTitle}
            </h1>
            <span className="text-xs sm:text-sm text-[#707D72] truncate">
              Performance insights for FY 2024–25
            </span>
          </div>
        </div>

        {/* Right Controls: Search, Season Selector & Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5">
          {/* Search Field */}
          <div className="relative flex-1 sm:flex-initial min-w-[160px] sm:min-w-[200px]">
            <Search className="w-4 h-4 text-[#9AABA0] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="global-crop-search"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search farm data..."
              className="w-full pl-9 sm:pl-10 pr-8 py-2 sm:py-2.5 bg-[#F0F7EE] border border-transparent hover:border-[#E2E8DE] focus:border-[#A3E635] rounded-full text-xs sm:text-sm text-[#2C332E] w-full sm:w-56 md:w-60 lg:w-64 focus:ring-2 focus:ring-[#A3E635]/50 outline-none transition-all placeholder-[#9AABA0] min-h-[38px]"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#9AABA0] hover:text-[#1B3022] min-w-[20px] min-h-[20px] flex items-center justify-center"
              >
                ✕
              </button>
            )}
          </div>

          {/* Season Selector Dropdown / Pills with scroll support */}
          <div
            id="season-selector-group"
            className="flex items-center bg-[#F0F7EE] p-1 rounded-full border border-[#E2E8DE] max-w-full overflow-x-auto no-scrollbar shrink-0"
          >
            {seasons.map((s) => {
              const isSelected = selectedSeason === s.id;
              return (
                <button
                  key={s.id}
                  id={`season-tab-${s.id}`}
                  onClick={() => onSeasonChange(s.id)}
                  className={`px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-150 cursor-pointer whitespace-nowrap min-h-[32px] sm:min-h-[34px] flex items-center justify-center ${
                    isSelected
                      ? 'bg-[#1B3022] text-[#A3E635] font-bold shadow-xs'
                      : 'text-[#707D72] hover:text-[#1B3022]'
                  }`}
                  title={s.period}
                >
                  <span className="flex items-center gap-1.5">
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#A3E635] shrink-0" />
                    )}
                    <span className="hidden sm:inline">{s.label}</span>
                    <span className="sm:hidden">{s.shortLabel}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Export, Schema & Alert buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {onOpenSchemaModal && (
              <button
                id="btn-dataset-schema"
                onClick={onOpenSchemaModal}
                title="View Ground-Truth Dataset Schema & Quality Audit"
                className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 text-xs font-semibold bg-[#F0F7EE] text-[#1B3022] border border-[#E2E8DE] rounded-full hover:bg-[#E2E8DE] transition-colors shadow-2xs cursor-pointer min-h-[38px]"
              >
                <Database className="w-3.5 h-3.5 text-[#347A52] shrink-0" />
                <span className="hidden md:inline">CSV Schema</span>
                <span className="text-[10px] bg-[#1B3022] text-[#A3E635] px-1.5 py-0.2 rounded-full font-bold">28</span>
              </button>
            )}

            <button
              id="btn-quick-export"
              onClick={() => {
                const reportContent = `AgriSeason Harvest Intelligence Report\nSelected Season: ${selectedSeason.toUpperCase()}\nGenerated Date: ${new Date().toLocaleDateString()}\nStatus: Verified Optimal`;
                const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `AgriSeason-Report-${selectedSeason}.txt`;
                link.click();
              }}
              title="Export Seasonal Summary Report"
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 text-xs font-semibold bg-white text-[#1B3022] border border-[#E2E8DE] rounded-full hover:bg-[#F0F7EE] transition-colors shadow-2xs cursor-pointer min-h-[38px]"
            >
              <Download className="w-3.5 h-3.5 text-[#1B3022] shrink-0" />
              <span className="hidden sm:inline">Export</span>
            </button>

            <button
              id="btn-notifications"
              className="p-2 sm:p-2.5 rounded-full bg-white border border-[#E2E8DE] text-[#1B3022] hover:bg-[#F0F7EE] transition-colors relative cursor-pointer min-w-[38px] min-h-[38px] flex items-center justify-center"
              title="Telemetry Alerts: 2 unread seasonal advisories"
            >
              <Bell className="w-4 h-4 stroke-[2]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#A3E635] ring-2 ring-white" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

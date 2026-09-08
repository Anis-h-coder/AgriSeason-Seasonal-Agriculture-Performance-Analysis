import React from 'react';
import {
  Sprout,
  CalendarDays,
  Wheat,
  MapPin,
  LineChart,
  Sparkles,
  Compass,
  FileText,
  LogOut,
  X,
} from 'lucide-react';
import { motion } from 'motion/react';
import { SeasonType } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedSeason: SeasonType;
  onSeasonChange: (season: SeasonType) => void;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  selectedSeason,
  onClose,
}) => {
  const navItems = [
    { id: 'landing', label: 'Home', icon: Compass },
    { id: 'overview', label: 'Overview', icon: Sprout },
    { id: 'seasons', label: 'Seasons', icon: CalendarDays },
    { id: 'crops', label: 'Crops', icon: Wheat },
    { id: 'regions', label: 'Regions', icon: MapPin },
    { id: 'analytics', label: 'Analytics', icon: LineChart },
    { id: 'project-insights', label: 'Project Insights', icon: FileText },
    { id: 'insights', label: 'AI Insights', icon: Sparkles },
  ];

  return (
    <aside
      id="agriseason-sidebar"
      className="w-64 sm:w-60 min-w-[15rem] bg-[#1B3022] text-[#E8F2E9] flex flex-col justify-between p-4.5 shrink-0 h-screen sticky top-0 select-none z-30 transition-all duration-200 border-r border-[#2C4A35] overflow-y-auto"
    >
      {/* Top Brand Section & Mobile Close Button */}
      <div>
        <div className="flex items-center justify-between mb-6 px-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#A3E635] rounded-xl flex items-center justify-center text-[#1B3022] shadow-sm transition-transform duration-200 hover:scale-105">
              <Sprout className="w-4.5 h-4.5 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white font-display block leading-tight">
                AgriSeason
              </span>
              <span className="text-[10px] text-[#A3E635] font-medium tracking-wide uppercase">
                Field Intelligence
              </span>
            </div>
          </div>

          {/* Mobile close button */}
          {onClose && (
            <button
              id="btn-sidebar-close"
              onClick={onClose}
              aria-label="Close Navigation"
              className="lg:hidden p-2 -mr-1 rounded-xl text-white/70 hover:text-white hover:bg-[#25412E] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Current Active Season Pill */}
        <div className="mb-4 px-3.5 py-2.5 rounded-2xl bg-[#25412E] border border-white/5 flex items-center justify-between transition-colors duration-200">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#A3E635] animate-pulse" />
            <span className="text-xs font-medium text-[#D0E2D4]">Cycle:</span>
          </div>
          <span className="text-[11px] font-bold text-[#A3E635] uppercase tracking-wider">
            {selectedSeason === 'all' ? 'All Seasons' : selectedSeason}
          </span>
        </div>

        {/* Navigation Links with animated sliding pill indicator */}
        <nav className="space-y-1 relative">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => {
                  setActiveTab(item.id);
                  if (onClose) onClose();
                }}
                className={`relative w-full flex items-center justify-between px-3.5 py-3 rounded-2xl font-medium text-xs transition-colors duration-150 cursor-pointer min-h-[44px] ${
                  isActive
                    ? 'text-[#A3E635] font-bold'
                    : 'text-[#DCEAE0] opacity-75 hover:opacity-100 hover:text-white hover:bg-[#25412E]/40'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-pill"
                    className="absolute inset-0 bg-[#25412E] rounded-2xl -z-0"
                    transition={{ type: 'spring', stiffness: 450, damping: 38 }}
                  />
                )}

                <div className="flex items-center gap-2.5 relative z-10">
                  <Icon className={`w-4 h-4 transition-transform duration-150 ${isActive ? 'stroke-[2.5] scale-105' : 'stroke-[1.8]'}`} />
                  <span className="text-sm sm:text-xs">{item.label}</span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Pro Callout & Profile Section */}
      <div className="space-y-3 pt-4 border-t border-white/5 mt-4">
        <div className="px-3.5 py-3 bg-[#25412E] rounded-2xl border border-white/5 transition-all duration-200 hover:border-white/10">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[9px] uppercase tracking-widest text-[#A3E635] font-bold">
              Telemetry Status
            </p>
            <div className="flex items-center gap-1 text-[10px] text-[#A3E635] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A3E635] animate-pulse" />
              <span>Live</span>
            </div>
          </div>
          <p className="text-[11px] text-white/70 leading-snug">
            32 sensors active across Kharif & Rabi plots.
          </p>
        </div>

        {/* Profile Card */}
        <div className="flex items-center gap-2.5 px-1 pt-1">
          <div className="w-8 h-8 rounded-full bg-[#A3E635] flex items-center justify-center text-[#1B3022] font-bold text-xs shrink-0 transition-transform duration-200 hover:scale-105">
            AS
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate text-white">Dr. Aranya Sen</p>
            <p className="text-[10px] opacity-60 truncate text-[#DCEAE0]">Chief Agronomist</p>
          </div>
          <button
            id="btn-logout"
            title="Agronomist Profile Active"
            className="p-2 rounded-lg opacity-60 hover:opacity-100 text-[#DCEAE0] hover:bg-[#25412E] transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
          >
            <LogOut className="w-3.5 h-3.5 stroke-[2]" />
          </button>
        </div>
      </div>
    </aside>
  );
};


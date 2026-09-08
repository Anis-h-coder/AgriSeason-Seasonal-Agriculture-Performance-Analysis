import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MetricCards } from './components/MetricCards';
import { SeasonalPerformanceChart } from './components/SeasonalPerformanceChart';
import { CropPerformanceSection } from './components/CropPerformanceSection';
import { RightInfoPanel } from './components/RightInfoPanel';
import { GlobalFilterBar } from './components/GlobalFilterBar';
import { SeasonsView } from './views/SeasonsView';
import { CropsView } from './views/CropsView';
import { RegionsView } from './views/RegionsView';
import { AnalyticsView } from './views/AnalyticsView';
import { AIInsightsView } from './views/AIInsightsView';
import { LandingView } from './views/LandingView';
import { ProjectInsightsView } from './views/ProjectInsightsView';
import { SeasonType } from './types';
import {
  Menu,
  X,
  Database,
  Sprout,
  CalendarDays,
  Wheat,
  LineChart,
  Sparkles,
  MapPin,
  SlidersHorizontal,
  Compass,
  ArrowRight,
  FileText,
} from 'lucide-react';
import { DatasetAuditModal } from './components/DatasetAuditModal';
import { FilterProvider, useFilters } from './context/FilterContext';

function DashboardContent() {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isSchemaModalOpen, setIsSchemaModalOpen] = useState<boolean>(false);

  const { filters, setSeason, setSearchQuery, filteredMetrics } = useFilters();
  const selectedSeason = filters.season;
  const searchQuery = filters.searchQuery;

  const getTabTitle = () => {
    switch (activeTab) {
      case 'landing':
        return 'Home';
      case 'overview':
        return 'Overview';
      case 'seasons':
        return 'Seasons';
      case 'crops':
        return 'Crops';
      case 'regions':
        return 'Regions';
      case 'analytics':
        return 'Analytics';
      case 'project-insights':
        return 'Project Insights';
      case 'insights':
        return 'AI Insights';
      default:
        return 'Overview';
    }
  };

  const mobileBottomNavItems = [
    { id: 'landing', label: 'Home', icon: Compass },
    { id: 'overview', label: 'Overview', icon: Sprout },
    { id: 'project-insights', label: 'Findings', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: LineChart },
    { id: 'insights', label: 'AgriAI', icon: Sparkles },
  ];

  // Standalone Landing Page Mode (No sidebar menu, no header filter bar, no mobile bottom nav)
  if (activeTab === 'landing') {
    return (
      <div className="min-h-screen bg-[#F4F7F4] text-[#1B3022] font-sans antialiased selection:bg-[#A3E635] selection:text-[#1B3022] flex flex-col">
        {/* Top Brand Header Bar - Clean logo, live status tag, & CTA only */}
        <header className="bg-[#13281C] text-white border-b border-[#254632] px-6 sm:px-10 py-3.5 shadow-xs flex items-center justify-between sticky top-0 z-50 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#A3E635] text-[#13281C] flex items-center justify-center font-bold shadow-xs">
              <Sprout className="w-4.5 h-4.5 text-[#13281C]" />
            </div>
            <span className="text-xl font-extrabold tracking-tight font-display text-white">
              AgriSeason
            </span>
            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1F3D2A] border border-[#325A3F] text-[11px] font-mono text-[#A3E635] ml-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A3E635] animate-pulse" />
              <span>50 Farm Telemetry Nodes</span>
            </span>
          </div>

          <button
            onClick={() => setActiveTab('overview')}
            className="px-4 py-2 rounded-xl bg-[#A3E635] hover:bg-[#b8f04d] text-[#13281C] text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs hover:scale-102"
          >
            <span>Explore Agriculture Data</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </header>

        {/* Full Landing View Body */}
        <main className="flex-1 px-4 sm:px-8 lg:px-12 py-8 max-w-[1440px] w-full mx-auto">
          <LandingView
            onEnterDashboard={(tab) => setActiveTab(tab || 'overview')}
            onOpenAuditModal={() => setIsSchemaModalOpen(true)}
          />
        </main>

        {/* Schema Audit Modal if opened from landing */}
        <DatasetAuditModal
          isOpen={isSchemaModalOpen}
          onClose={() => setIsSchemaModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAF5] font-sans text-[#2C332E] flex antialiased">
      {/* Mobile Drawer Backdrop */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Desktop & Mobile Responsive Sidebar Drawer */}
      <div
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 transform lg:transform-none transition-transform duration-300 ease-out shadow-2xl lg:shadow-none ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setIsMobileSidebarOpen(false);
          }}
          selectedSeason={selectedSeason}
          onSeasonChange={setSeason}
          onClose={() => setIsMobileSidebarOpen(false)}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header Bar with Hamburger */}
        <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-[#1B3022] text-white border-b border-[#2C4A35] shadow-md">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 -ml-1 rounded-xl bg-white/10 text-white hover:text-[#A3E635] min-w-[40px] min-h-[40px] flex items-center justify-center cursor-pointer"
              aria-label="Open Navigation Drawer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-white font-display text-base">
                AgriSeason
              </span>
              <span className="text-[10px] text-[#1B3022] bg-[#A3E635] uppercase font-bold px-2 py-0.5 rounded-full">
                {selectedSeason === 'all' ? 'Annual' : selectedSeason}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSchemaModalOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#25412E] text-[#A3E635] text-[11px] font-bold border border-white/10"
              title="Audit Dataset"
            >
              <Database className="w-3.5 h-3.5" />
              <span>50 Plots</span>
            </button>
          </div>
        </div>

        {/* Global Desktop & Tablet Header */}
        <Header
          selectedSeason={selectedSeason}
          onSeasonChange={setSeason}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeTabTitle={getTabTitle()}
          onOpenSchemaModal={() => setIsSchemaModalOpen(true)}
        />

        {/* Scrollable Dashboard Body with safe padding for mobile bottom bar */}
        <main className="flex-1 px-3.5 sm:px-6 md:px-8 lg:px-10 py-5 sm:py-8 pb-28 lg:pb-10 max-w-[1640px] w-full mx-auto space-y-6 sm:space-y-8">
          {/* Ground-Truth Dataset Schema Alert / Banner - Overview Only */}
          {activeTab === 'overview' && (
            <div
              id="dataset-sync-banner"
              className="p-4 sm:p-4.5 rounded-3xl bg-[#F0F7EE] border border-[#E2E8DE] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
            >
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#1B3022] text-[#A3E635] flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-[#1B3022]">
                      Ground-Truth Agricultural Dataset Mapped
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#A3E635]/40 text-[#1B3022]">
                      50 Farm Plots · 28 Columns
                    </span>
                  </div>
                  <p className="text-[11px] text-[#707D72] mt-0.5">
                    Strictly verified: 0 duplicates, INR (₹) economics, real crop yields, environmental sensors & resource telemetry.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSchemaModalOpen(true)}
                className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-xs font-bold bg-white text-[#1B3022] border border-[#E2E8DE] rounded-full hover:bg-[#1B3022] hover:text-[#A3E635] transition-all cursor-pointer shrink-0 shadow-2xs text-center min-h-[40px] flex items-center justify-center"
              >
                Audit 28 Fields & Schema →
              </button>
            </div>
          )}

          {/* Unified Global Multi-Dimensional Filter Bar */}
          <GlobalFilterBar />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              {activeTab === 'landing' && (
                <LandingView
                  onEnterDashboard={(tab) => setActiveTab(tab || 'overview')}
                  onOpenAuditModal={() => setIsSchemaModalOpen(true)}
                />
              )}

              {activeTab === 'overview' && (
                <div className="space-y-6 sm:space-y-8">
                  {/* 1. Four Seasonal Overview Metric Cards */}
                  <MetricCards metrics={filteredMetrics} />

                  {/* 2. Main Dashboard Grid: Spacious Content Area + Right Information Rail */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
                    {/* Left / Center Major Content Area (8 Cols on desktop/laptop) */}
                    <div className="lg:col-span-8 space-y-6 sm:space-y-8">
                      {/* Large Seasonal Performance Chart */}
                      <SeasonalPerformanceChart
                        selectedSeason={selectedSeason}
                        onSeasonChange={setSeason}
                      />

                      {/* Crop Performance Section */}
                      <CropPerformanceSection
                        selectedSeason={selectedSeason}
                        searchQuery={searchQuery}
                      />
                    </div>

                    {/* Right Side Information Area (4 Cols on desktop/laptop, stacks naturally on mobile & tablet) */}
                    <div className="lg:col-span-4">
                      <RightInfoPanel
                        selectedSeason={selectedSeason}
                        onSeasonChange={setSeason}
                        onOpenAuditModal={() => setIsSchemaModalOpen(true)}
                        onNavigateToTab={setActiveTab}
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'seasons' && (
                <SeasonsView
                  selectedSeason={selectedSeason}
                  onSeasonChange={setSeason}
                />
              )}

              {activeTab === 'crops' && (
                <CropsView
                  selectedSeason={selectedSeason}
                  onSeasonChange={setSeason}
                />
              )}

              {activeTab === 'regions' && (
                <RegionsView
                  selectedSeason={selectedSeason}
                  onSeasonChange={setSeason}
                />
              )}

              {activeTab === 'analytics' && (
                <AnalyticsView
                  selectedSeason={selectedSeason}
                  onSeasonChange={setSeason}
                />
              )}

              {activeTab === 'project-insights' && (
                <ProjectInsightsView
                  selectedSeason={selectedSeason}
                  onSeasonChange={setSeason}
                  onNavigateToTab={(tab) => setActiveTab(tab)}
                />
              )}

              {activeTab === 'insights' && (
                <AIInsightsView
                  selectedSeason={selectedSeason}
                  onSeasonChange={setSeason}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Mobile Bottom Navigation Bar (< lg screens) */}
        <nav
          aria-label="Mobile Navigation"
          className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1B3022]/95 backdrop-blur-md border-t border-[#2C4A35] px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.15)] flex items-center justify-around"
        >
          {mobileBottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-150 min-w-[52px] min-h-[44px] cursor-pointer ${
                  isActive
                    ? 'text-[#A3E635]'
                    : 'text-[#9AABA0] hover:text-white'
                }`}
              >
                <div className={`p-1 rounded-lg ${isActive ? 'bg-[#25412E]' : ''}`}>
                  <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                </div>
                <span className={`text-[10px] tracking-tight mt-0.5 ${isActive ? 'font-bold text-[#A3E635]' : 'font-medium'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}

          {/* More Drawer Button */}
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[#9AABA0] hover:text-white transition-all min-w-[52px] min-h-[44px] cursor-pointer"
          >
            <div className="p-1">
              <Menu className="w-4 h-4 stroke-[1.8]" />
            </div>
            <span className="text-[10px] font-medium tracking-tight mt-0.5">
              Menu
            </span>
          </button>
        </nav>
      </div>

      {/* Dataset Audit & Schema Explorer Modal */}
      <DatasetAuditModal
        isOpen={isSchemaModalOpen}
        onClose={() => setIsSchemaModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <FilterProvider>
      <DashboardContent />
    </FilterProvider>
  );
}


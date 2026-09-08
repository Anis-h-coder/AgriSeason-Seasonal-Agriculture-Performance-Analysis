import React from 'react';
import {
  Wheat,
  Sprout,
  Droplets,
  Coins,
  ShieldCheck,
  Filter,
} from 'lucide-react';
import { motion } from 'motion/react';
import { MetricCardData } from '../types';
import { useFilters } from '../context/FilterContext';
import { AnimatedNumber } from './AnimatedNumber';
import { InvalidDataState, NoFilterResultsState } from './StateFeedback';

interface MetricCardsProps {
  metrics?: MetricCardData[];
}

export const MetricCards: React.FC<MetricCardsProps> = ({ metrics: propMetrics }) => {
  const { filteredMetrics, hasActiveFilters, clearAllFilters, filteredRecords } = useFilters();
  const metrics = propMetrics || filteredMetrics;

  // Map icon name to botanical / agricultural Lucide component
  const getIcon = (iconName: string, id: string) => {
    switch (id) {
      case 'yield':
        return <Wheat className="w-5 h-5 text-[#1B3022] stroke-[2]" />;
      case 'production':
        return <Sprout className="w-5 h-5 text-[#1B3022] stroke-[2]" />;
      case 'water':
        return <Droplets className="w-5 h-5 text-[#2F9E44] stroke-[2]" />;
      case 'profit':
        return <Coins className="w-5 h-5 text-[#1B3022] stroke-[2]" />;
      default:
        return <Wheat className="w-5 h-5 text-[#1B3022] stroke-[2]" />;
    }
  };

  // If no data matches the active filters
  if (!metrics || metrics.length === 0 || filteredRecords.length === 0) {
    return (
      <section id="seasonal-overview-metrics" className="w-full">
        <div className="flex items-center justify-between mb-4 px-1">
          <div>
            <h2 className="text-lg font-bold text-[#1B3022] tracking-tight font-display">
              Seasonal Yield & Resource Metrics
            </h2>
            <p className="text-xs text-[#707D72]">
              Key agronomic benchmarks across active crop cycles
            </p>
          </div>
        </div>
        <InvalidDataState
          title="Metric Calculation Suspended"
          message="Unable to calculate this metric from the available data."
          reason="0 observations match the current filter selection."
          onRetry={hasActiveFilters ? clearAllFilters : undefined}
          height={180}
        />
      </section>
    );
  }

  return (
    <section id="seasonal-overview-metrics" className="w-full">
      <div className="flex items-center justify-between mb-4 px-1">
        <div>
          <h2 className="text-lg font-bold text-[#1B3022] tracking-tight font-display">
            Seasonal Yield & Resource Metrics
          </h2>
          <p className="text-xs text-[#707D72]">
            Key agronomic benchmarks across active crop cycles
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#1B3022] font-semibold bg-[#F0F7EE] px-3.5 py-1.5 rounded-full border border-[#E2E8DE]/80 transition-all duration-200 hover:bg-[#E8F2E9]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#2F9E44]" />
          <span>Telemetry Validated</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5 sm:gap-5">
        {metrics.map((card, idx) => {
          const isWaterEfficiency = card.id === 'water';
          const isGoodChange = isWaterEfficiency
            ? card.changePercentage <= 0
            : card.changePercentage >= 0;

          return (
            <motion.div
              key={card.id}
              id={`metric-card-${card.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.05, ease: 'easeOut' }}
              whileHover={{ y: -3, transition: { duration: 0.15, ease: 'easeOut' } }}
              className="bg-[#F0F7EE] p-4.5 sm:p-6 rounded-[24px] sm:rounded-[32px] border border-[#E2E8DE]/60 shadow-[0_2px_12px_rgba(27,48,34,0.03)] hover:shadow-[0_8px_24px_rgba(27,48,34,0.06)] transition-shadow duration-200 flex flex-col justify-between cursor-default min-w-0"
            >
              {/* Card Header: Agricultural Icon + Subtle Trend Pill */}
              <div className="flex items-center justify-between mb-3.5 sm:mb-4">
                <div className="w-10 h-10 sm:w-11 sm:h-11 bg-white rounded-2xl flex items-center justify-center shadow-2xs transition-transform duration-200 group-hover:scale-105">
                  {getIcon(card.icon, card.id)}
                </div>

                <span
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full transition-colors duration-150 shrink-0 ${
                    isGoodChange
                      ? 'text-[#2F9E44] bg-white'
                      : 'text-amber-800 bg-amber-50'
                  }`}
                >
                  {card.changePercentage > 0 ? '+' : ''}
                  <AnimatedNumber value={card.changePercentage} suffix="%" durationMs={350} />
                </span>
              </div>

              {/* Title & Metric Value */}
              <div className="min-w-0">
                <p className="text-[#707D72] text-[11px] font-bold uppercase tracking-wider truncate">
                  {card.title}
                </p>

                <p className="text-2xl sm:text-3xl font-bold mt-1 text-[#1B3022] font-display tracking-tight break-words">
                  <AnimatedNumber value={card.value} durationMs={450} />{' '}
                  <span className="text-xs sm:text-sm font-normal text-[#707D72]">
                    {card.unit}
                  </span>
                </p>
              </div>

              {/* Micro Sparkline & Benchmark */}
              <div className="mt-4 sm:mt-5 pt-3 sm:pt-3.5 border-t border-[#E2E8DE]/60 flex items-center justify-between gap-2">
                <span className="text-[11px] text-[#707D72] font-medium truncate flex-1 min-w-0" title={card.subtext}>
                  {card.subtext}
                </span>

                {/* Minimal micro sparkline with calm height transition */}
                <div className="w-14 h-4 shrink-0 flex items-end justify-end gap-1">
                  {card.sparklineData.map((val, sIdx) => {
                    const min = Math.min(...card.sparklineData);
                    const max = Math.max(...card.sparklineData);
                    const heightPercent = max === min ? 50 : Math.round(((val - min) / (max - min)) * 80 + 20);
                    return (
                      <div
                        key={sIdx}
                        style={{ height: `${heightPercent}%` }}
                        className={`w-1 rounded-full transition-all duration-300 ${
                          sIdx === card.sparklineData.length - 1
                            ? 'bg-[#A3E635]'
                            : 'bg-[#CBD8CD]'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="mt-2 text-[10px] font-medium text-[#707D72] truncate">
                Target: {card.benchmark}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};


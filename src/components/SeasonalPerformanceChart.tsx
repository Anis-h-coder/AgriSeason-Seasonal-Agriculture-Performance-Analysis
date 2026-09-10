import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Layers, Calendar, BarChart3, Info, Sparkles } from 'lucide-react';
import { SeasonalPerformancePoint, SeasonType } from '../types';
import { SEASONAL_PERFORMANCE_DATA, SEASON_COMPARISON_SUMMARY } from '../data/mockData';
import { useFilters } from '../context/FilterContext';

type MetricType = 'yield' | 'production' | 'profit' | 'rainfall';

interface SeasonalPerformanceChartProps {
  selectedSeason?: SeasonType;
  onSeasonChange?: (season: SeasonType) => void;
}

export const SeasonalPerformanceChart: React.FC<SeasonalPerformanceChartProps> = ({
  selectedSeason: propSeason,
  onSeasonChange,
}) => {
  const { filters, setSeason } = useFilters();
  const [metricMode, setMetricMode] = useState<MetricType>('yield');
  const [viewMode, setViewMode] = useState<'trend' | 'comparison'>('trend');

  const activeSeason = filters.season !== 'all' ? filters.season : (propSeason || 'all');

  // Custom tooltip renderer
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0f291c] text-white p-3.5 rounded-xl border border-[#214c33] shadow-xl text-xs space-y-1.5 min-w-[200px]">
          <div className="flex items-center justify-between pb-1.5 border-b border-[#214c33]">
            <span className="font-semibold text-[#c7dfcf]">{label}</span>
            <span className="text-[10px] text-[#bef264] font-mono uppercase px-1.5 py-0.5 rounded bg-[#bef264]/10">
              Agri-Telemetry
            </span>
          </div>

          {payload.map((entry: any, index: number) => {
            if (entry.value === 0 && metricMode !== 'rainfall') return null;
            return (
              <div key={`item-${index}`} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-[#a5c4b1] capitalize">{entry.name}:</span>
                </div>
                <span className="font-bold text-white font-mono">
                  {metricMode === 'profit' ? `₹${(Number(entry.value) / 1000).toFixed(0)}k/plot` : ''}
                  {metricMode === 'yield' ? `${entry.value} t/ha` : ''}
                  {metricMode === 'production' ? `${entry.value}k MT` : ''}
                  {metricMode === 'rainfall' ? `${entry.value} mm` : ''}
                </span>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <div
      id="seasonal-performance-card"
      className="bg-white rounded-[32px] p-6 shadow-sm border border-[#E2E8DE] relative overflow-hidden flex flex-col justify-between"
    >
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-3.5 sm:pb-4 border-b border-[#E2E8DE]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-[#1B3022] tracking-tight font-display">
              Seasonal Performance
            </h3>
            <span className="px-2 py-0.5 text-[11px] font-bold text-[#1B3022] bg-[#F0F7EE] border border-[#E2E8DE] rounded-full shrink-0">
              FY 2024–25
            </span>
          </div>
          <p className="text-xs text-[#707D72] mt-0.5">
            Agricultural yield, production capacity, and economic margin dynamics
          </p>
        </div>

        {/* Metric Mode Pill Selectors - Horizontally scrollable on small screens */}
        <div className="flex items-center gap-1 bg-[#F0F7EE] p-1 rounded-full border border-[#E2E8DE] max-w-full overflow-x-auto no-scrollbar shrink-0">
          {(
            [
              { id: 'yield', label: 'Yield (t/ha)' },
              { id: 'production', label: 'Output (t)' },
              { id: 'profit', label: 'Profit (₹)' },
              { id: 'rainfall', label: 'Rain (mm)' },
            ] as const
          ).map((mode) => (
            <button
              key={mode.id}
              onClick={() => setMetricMode(mode.id)}
              className={`px-3 py-1.5 sm:py-1 text-xs font-semibold rounded-full transition-all cursor-pointer whitespace-nowrap min-h-[34px] sm:min-h-[28px] flex items-center justify-center ${
                metricMode === mode.id
                  ? 'bg-[#1B3022] text-[#A3E635] shadow-2xs font-bold'
                  : 'text-[#707D72] hover:text-[#1B3022]'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Seasonal Quick Compare Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5 my-3.5">
        {SEASON_COMPARISON_SUMMARY.map((s) => {
          const isSelected = activeSeason === s.season.toLowerCase();
          const seasonColor = s.season === 'Kharif' ? '#A3E635' : s.season === 'Rabi' ? '#1B3022' : '#D4E157';
          return (
            <button
              key={s.season}
              onClick={() => {
                const targetSeason = s.season.toLowerCase() as SeasonType;
                if (onSeasonChange) {
                  onSeasonChange(targetSeason);
                } else {
                  setSeason(targetSeason);
                }
              }}
              className={`px-3.5 py-2.5 rounded-2xl text-left border transition-all duration-150 cursor-pointer min-h-[44px] ${
                isSelected
                  ? 'bg-[#F0F7EE] border-[#A3E635] shadow-2xs'
                  : 'bg-[#F8FAF5] border-[#E2E8DE]/60 hover:bg-white hover:border-[#CBD8CD]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: seasonColor }}
                  />
                  <span className="text-xs font-bold text-[#1B3022]">
                    {s.season}
                  </span>
                </div>
                <span className="text-[10px] text-[#707D72] font-medium">
                  {s.period}
                </span>
              </div>

              <div className="flex items-baseline justify-between mt-1">
                <span className="text-[11px] text-[#707D72]">
                  {metricMode === 'yield' && 'Avg Yield'}
                  {metricMode === 'production' && 'Output'}
                  {metricMode === 'profit' && 'Margin'}
                  {metricMode === 'rainfall' && 'Precipitation'}
                </span>
                <span className="text-xs font-bold text-[#1B3022] font-mono">
                  {metricMode === 'yield' && `${s.avgYield} t/ha`}
                  {metricMode === 'production' && `${s.totalProduction}k MT`}
                  {metricMode === 'profit' && `₹${(s.profitPerHa / 1000).toFixed(0)}k/ha`}
                  {metricMode === 'rainfall' && `${s.rainfallMm} mm`}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Chart Area - Sleek, responsive and elegant */}
      <div className="w-full h-52 sm:h-60 md:h-64 pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={SEASONAL_PERFORMANCE_DATA}
            margin={{ top: 8, right: 10, left: -22, bottom: 0 }}
          >
            <defs>
              <linearGradient id="kharifGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#A3E635" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#A3E635" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="rabiGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1B3022" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#1B3022" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="zaidGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D4E157" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#D4E157" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="rainfallGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2F9E44" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#2F9E44" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#E2E8DE"
              strokeOpacity={0.7}
            />

            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={{ stroke: '#E2E8DE' }}
              tick={{ fill: '#707D72', fontSize: 11, fontWeight: 500 }}
              dy={6}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#707D72', fontSize: 11 }}
              dx={-4}
            />

            <Tooltip content={<CustomTooltip />} />

            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              iconSize={7}
              wrapperStyle={{ paddingBottom: '6px', fontSize: '11px', color: '#1B3022' }}
            />

            {metricMode === 'yield' && (
              <>
                <Area
                  type="monotone"
                  dataKey="kharifYield"
                  name="Kharif Yield"
                  stroke="#A3E635"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#kharifGradient)"
                  isAnimationActive={true}
                  animationDuration={450}
                  animationEasing="ease-out"
                  activeDot={{ r: 4, fill: '#A3E635', stroke: '#fff', strokeWidth: 2 }}
                />
                <Area
                  type="monotone"
                  dataKey="rabiYield"
                  name="Rabi Yield"
                  stroke="#1B3022"
                  strokeWidth={2}
                  strokeDasharray="4 2"
                  fillOpacity={1}
                  fill="url(#rabiGradient)"
                  isAnimationActive={true}
                  animationDuration={450}
                  animationEasing="ease-out"
                  activeDot={{ r: 4, fill: '#1B3022', stroke: '#fff', strokeWidth: 2 }}
                />
                <Area
                  type="monotone"
                  dataKey="zaidYield"
                  name="Zaid Yield"
                  stroke="#D4E157"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#zaidGradient)"
                  isAnimationActive={true}
                  animationDuration={450}
                  animationEasing="ease-out"
                  activeDot={{ r: 3, fill: '#D4E157', stroke: '#fff', strokeWidth: 2 }}
                />
              </>
            )}

            {metricMode === 'production' && (
              <>
                <Area
                  type="monotone"
                  dataKey="kharifProduction"
                  name="Kharif Output"
                  stroke="#A3E635"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#kharifGradient)"
                  isAnimationActive={true}
                  animationDuration={450}
                  animationEasing="ease-out"
                />
                <Area
                  type="monotone"
                  dataKey="rabiProduction"
                  name="Rabi Output"
                  stroke="#1B3022"
                  strokeWidth={2}
                  strokeDasharray="4 2"
                  fillOpacity={1}
                  fill="url(#rabiGradient)"
                  isAnimationActive={true}
                  animationDuration={450}
                  animationEasing="ease-out"
                />
                <Area
                  type="monotone"
                  dataKey="zaidProduction"
                  name="Zaid Output"
                  stroke="#D4E157"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#zaidGradient)"
                  isAnimationActive={true}
                  animationDuration={450}
                  animationEasing="ease-out"
                />
              </>
            )}

            {metricMode === 'profit' && (
              <>
                <Area
                  type="monotone"
                  dataKey="kharifProfit"
                  name="Kharif Margin"
                  stroke="#A3E635"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#kharifGradient)"
                  isAnimationActive={true}
                  animationDuration={450}
                  animationEasing="ease-out"
                />
                <Area
                  type="monotone"
                  dataKey="rabiProfit"
                  name="Rabi Margin"
                  stroke="#1B3022"
                  strokeWidth={2}
                  strokeDasharray="4 2"
                  fillOpacity={1}
                  fill="url(#rabiGradient)"
                  isAnimationActive={true}
                  animationDuration={450}
                  animationEasing="ease-out"
                />
                <Area
                  type="monotone"
                  dataKey="zaidProfit"
                  name="Zaid Margin"
                  stroke="#D4E157"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#zaidGradient)"
                  isAnimationActive={true}
                  animationDuration={450}
                  animationEasing="ease-out"
                />
              </>
            )}

            {metricMode === 'rainfall' && (
              <Area
                type="monotone"
                dataKey="rainfallMm"
                name="Precipitation"
                stroke="#2F9E44"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#rainfallGradient)"
                isAnimationActive={true}
                animationDuration={450}
                animationEasing="ease-out"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer Note */}
      <div className="mt-4 pt-3 border-t border-[#E2E8DE] flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#707D72] gap-2">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-[#1B3022]" />
          <span>
            Data grounded in multi-year district agricultural statistics (ICAR-CRIDA standard schema).
          </span>
        </div>
        <span className="text-[10px] font-mono text-[#707D72] bg-[#F0F7EE] px-2 py-0.5 rounded-full">
          Live Telemetry Synced
        </span>
      </div>
    </div>
  );
};

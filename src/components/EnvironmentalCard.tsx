import React from 'react';
import {
  CloudRain,
  Thermometer,
  Layers,
  AlertTriangle,
  CheckCircle2,
  Wind,
  Droplet,
  Compass,
} from 'lucide-react';
import { EnvironmentalConditions, SeasonType } from '../types';
import { useFilters } from '../context/FilterContext';
import { getFilteredEnvironmentalConditions } from '../utils/datasetProcessor';

interface EnvironmentalCardProps {
  selectedSeason?: SeasonType;
}

export const EnvironmentalCard: React.FC<EnvironmentalCardProps> = ({
  selectedSeason,
}) => {
  const { filters } = useFilters();
  const activeCriteria = {
    season: selectedSeason || filters.season,
    crop: filters.crop,
    region: filters.region,
    category: filters.category,
    searchQuery: filters.searchQuery,
  };

  const env: EnvironmentalConditions = getFilteredEnvironmentalConditions(activeCriteria);

  return (
    <div
      id="environmental-conditions-card"
      className="bg-white rounded-[32px] p-5 shadow-[0_2px_12px_rgba(27,48,34,0.02)] border border-[#E2E8DE]/70 flex flex-col justify-between space-y-3.5"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-[#E2E8DE]/60">
        <div>
          <h3 className="font-bold text-[#1B3022] text-sm tracking-tight font-display">
            Environmental Telemetry
          </h3>
          <p className="text-[11px] text-[#707D72]">
            Active micro-climate indices
          </p>
        </div>
        <span className="text-[10px] font-bold text-[#2F9E44] bg-[#F0F7EE] px-2.5 py-0.5 rounded-full">
          Live Sensor Grid
        </span>
      </div>

      {/* Compact Sensor Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Rainfall */}
        <div className="p-3 bg-[#F0F7EE] rounded-2xl">
          <div className="flex items-center gap-1.5 text-[#2F9E44] mb-1">
            <CloudRain className="w-3.5 h-3.5 stroke-[2.2]" />
            <span className="text-[10px] text-[#707D72] font-bold uppercase tracking-wider">Rainfall</span>
          </div>
          <p className="text-base font-bold text-[#1B3022] font-mono">
            {env.rainfall.recordedMm} <span className="text-xs font-normal text-[#707D72]">mm</span>
          </p>
          <span className="text-[10px] text-[#2F9E44] font-medium block mt-0.5">
            {env.rainfall.deviationPercentage >= 0 ? '+' : ''}{env.rainfall.deviationPercentage}% deviation
          </span>
        </div>

        {/* Temperature */}
        <div className="p-3 bg-[#F0F7EE] rounded-2xl">
          <div className="flex items-center gap-1.5 text-[#E67E22] mb-1">
            <Thermometer className="w-3.5 h-3.5 stroke-[2.2]" />
            <span className="text-[10px] text-[#707D72] font-bold uppercase tracking-wider">Temp</span>
          </div>
          <p className="text-base font-bold text-[#1B3022] font-mono">
            {env.temperature.average}°C
          </p>
          <span className="text-[10px] text-[#707D72] font-medium block mt-0.5">
            Range: {env.temperature.min}°–{env.temperature.max}°C
          </span>
        </div>

        {/* Soil Chemistry */}
        <div className="p-3 bg-[#F0F7EE] rounded-2xl col-span-2">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5 text-[#1B3022]">
              <Layers className="w-3.5 h-3.5 stroke-[2.2]" />
              <span className="text-[10px] text-[#707D72] font-bold uppercase tracking-wider">Soil Chemistry & Moisture</span>
            </div>
            <span className="text-[10px] font-bold text-[#1B3022]">{env.soilConditions.phStatus}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-[#1B3022]">
            <span className="font-mono font-bold">{env.soilConditions.phValue} pH</span>
            <span className="text-[#707D72] font-medium">{env.soilConditions.moisturePercentage}% Volumetric Moisture</span>
          </div>
        </div>
      </div>

      {/* Compact Disease Risk Alert Banner */}
      <div className="p-2.5 bg-[#F8FAF5] rounded-2xl flex items-center justify-between border border-[#E2E8DE]/60 text-xs">
        <div className="flex items-center gap-2 text-[#1B3022]">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span className="text-[11px] font-medium truncate max-w-[160px]">
            {env.diseaseRisk.alertTitle.split(':')[0]}
          </span>
        </div>
        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
          env.diseaseRisk.level.toLowerCase() === 'low'
            ? 'bg-[#EAF5E9] text-[#2F9E44]'
            : 'bg-amber-100 text-amber-800'
        }`}>
          {env.diseaseRisk.level} Risk
        </span>
      </div>
    </div>
  );
};

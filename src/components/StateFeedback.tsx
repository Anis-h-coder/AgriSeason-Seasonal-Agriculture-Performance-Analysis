import React from 'react';
import {
  FilterX,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  HelpCircle,
  Database,
  BarChart2,
  TrendingDown,
  Info,
} from 'lucide-react';
import { motion } from 'motion/react';

// 1. General Empty State / No Filter Results
interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ElementType;
  actionText?: string;
  onAction?: () => void;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
  className?: string;
  compact?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Data Available',
  description = 'No data available for this combination of filters.',
  icon: Icon = FilterX,
  actionText,
  onAction,
  secondaryActionText,
  onSecondaryAction,
  className = '',
  compact = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`bg-white rounded-[32px] border border-[#E2E8DE] text-center flex flex-col items-center justify-center ${
        compact ? 'p-6 sm:p-8 min-h-[220px]' : 'p-8 sm:p-12 min-h-[340px]'
      } ${className}`}
    >
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-3xl bg-[#F0F7EE] border border-[#E2E8DE] flex items-center justify-center text-[#1B3022] mb-4 shadow-2xs">
        <Icon className="w-7 h-7 sm:w-8 sm:h-8 stroke-[1.8] text-[#2F9E44]" />
      </div>

      <h3 className="text-base sm:text-lg font-bold text-[#1B3022] font-display tracking-tight mb-1.5">
        {title}
      </h3>

      <p className="text-xs sm:text-sm text-[#707D72] max-w-md mx-auto leading-relaxed mb-6">
        {description}
      </p>

      {(onAction || onSecondaryAction) && (
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {onAction && (
            <button
              onClick={onAction}
              className="px-4 py-2 rounded-full text-xs font-bold bg-[#1B3022] text-[#A3E635] hover:bg-[#25412E] transition-all shadow-xs flex items-center gap-1.5 cursor-pointer min-h-[38px]"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{actionText || 'Reset Filters'}</span>
            </button>
          )}

          {onSecondaryAction && secondaryActionText && (
            <button
              onClick={onSecondaryAction}
              className="px-4 py-2 rounded-full text-xs font-semibold bg-[#F0F7EE] text-[#1B3022] hover:bg-[#E2E8DE] transition-all border border-[#E2E8DE] cursor-pointer min-h-[38px]"
            >
              {secondaryActionText}
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
};

// 2. Specific No Filter Results State with preset text
export const NoFilterResultsState: React.FC<{
  onReset: () => void;
  filterSummary?: string;
  className?: string;
  compact?: boolean;
}> = ({ onReset, filterSummary, className = '', compact = false }) => {
  return (
    <EmptyState
      icon={FilterX}
      title="No Records Match Your Filters"
      description={
        filterSummary
          ? `No agricultural plots found for: "${filterSummary}". Try broadening your season, crop, or regional parameters.`
          : 'No data available for this combination of filters. Try clearing one or more active dimensions.'
      }
      actionText="Reset All Filters"
      onAction={onReset}
      className={className}
      compact={compact}
    />
  );
};

// 3. Invalid Data / Calculation Error State (for charts & formulas)
interface InvalidDataStateProps {
  title?: string;
  message?: string;
  reason?: string;
  onRetry?: () => void;
  className?: string;
  height?: string | number;
}

export const InvalidDataState: React.FC<InvalidDataStateProps> = ({
  title = 'Calculation Unavailable',
  message = 'Unable to calculate this metric from the available data.',
  reason = 'Requires at least 2 non-null observations with positive variance.',
  onRetry,
  className = '',
  height = 260,
}) => {
  return (
    <div
      style={{ minHeight: height }}
      className={`w-full rounded-[24px] bg-[#FAFDF9] border border-dashed border-[#CBD8CD] p-6 flex flex-col items-center justify-center text-center ${className}`}
    >
      <div className="w-11 h-11 rounded-2xl bg-[#FFF9DB] border border-[#F59F00]/20 flex items-center justify-center text-[#E67700] mb-3">
        <AlertTriangle className="w-5 h-5 stroke-[2]" />
      </div>

      <h4 className="text-sm font-bold text-[#1B3022] font-display mb-1">
        {title}
      </h4>

      <p className="text-xs text-[#707D72] max-w-sm mb-2">
        {message}
      </p>

      {reason && (
        <span className="text-[11px] text-[#868E96] bg-white px-2.5 py-1 rounded-md border border-[#E2E8DE] font-mono mb-4">
          Note: {reason}
        </span>
      )}

      {onRetry && (
        <button
          onClick={onRetry}
          className="text-xs font-semibold text-[#1B3022] hover:text-[#2F9E44] flex items-center gap-1 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Recalculate</span>
        </button>
      )}
    </div>
  );
};

// 4. AI Loading State
export const AiLoadingState: React.FC<{
  message?: string;
  subtext?: string;
  className?: string;
}> = ({
  message = 'Synthesizing agronomic response from 50 farm observations...',
  subtext = 'Cross-referencing soil nutrients, water consumption, and yield variance',
  className = '',
}) => {
  return (
    <div
      className={`p-6 rounded-[28px] bg-white border border-[#E2E8DE] shadow-xs space-y-4 ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-[#1B3022] text-[#A3E635] flex items-center justify-center font-bold text-xs">
          <Sparkles className="w-4 h-4 animate-spin text-[#A3E635]" style={{ animationDuration: '3s' }} />
        </div>
        <div>
          <span className="text-xs font-bold text-[#1B3022]">AgriAI Computing</span>
          <p className="text-[11px] text-[#2F9E44] font-medium animate-pulse">{message}</p>
        </div>
      </div>

      <div className="space-y-2 pt-2">
        <div className="h-3.5 bg-[#F0F7EE] rounded-full w-full animate-pulse" />
        <div className="h-3.5 bg-[#F0F7EE] rounded-full w-5/6 animate-pulse" />
        <div className="h-3.5 bg-[#F0F7EE] rounded-full w-4/6 animate-pulse" />
      </div>

      <div className="pt-3 border-t border-[#E2E8DE]/60 flex items-center justify-between text-[10px] text-[#707D72]">
        <span>{subtext}</span>
        <span className="font-mono text-[#A3E635] bg-[#1B3022] px-2 py-0.5 rounded-md font-bold">
          LIVE MODEL
        </span>
      </div>
    </div>
  );
};

// 5. AI Error State with Retry
export const AiErrorState: React.FC<{
  errorMessage?: string;
  onRetry?: () => void;
  className?: string;
}> = ({
  errorMessage = 'AgriAI is temporarily unavailable. Please try again.',
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`p-6 rounded-[28px] bg-[#FFF5F5] border border-[#FFC9C9] text-left space-y-3.5 ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-2xl bg-[#FA5252] text-white flex items-center justify-center shrink-0 shadow-2xs">
          <AlertTriangle className="w-4.5 h-4.5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-[#C92A2A] uppercase tracking-wider">
              Agronomic Inference Interrupted
            </h4>
            <span className="text-[10px] font-mono text-[#E03131] bg-white px-2 py-0.5 rounded-full border border-[#FFC9C9]">
              Fallback Ready
            </span>
          </div>
          <p className="text-sm font-semibold text-[#495057] mt-1">
            {errorMessage}
          </p>
          <p className="text-xs text-[#868E96] mt-0.5">
            Your telemetry and data charts remain 100% active and verifiable from local dataset matrices.
          </p>
        </div>
      </div>

      {onRetry && (
        <div className="pt-2 flex justify-end">
          <button
            onClick={onRetry}
            className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#1B3022] text-[#A3E635] hover:bg-[#25412E] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs min-h-[34px]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Query</span>
          </button>
        </div>
      )}
    </div>
  );
};

// 6. Section Loading Skeleton for Metric Cards
export const MetricCardsSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5 sm:gap-5">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="bg-[#F0F7EE]/60 p-5 sm:p-6 rounded-[24px] sm:rounded-[32px] border border-[#E2E8DE]/60 space-y-4 animate-pulse"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-[#E2E8DE]" />
            <div className="w-16 h-5 rounded-full bg-[#E2E8DE]" />
          </div>
          <div className="space-y-2">
            <div className="w-20 h-3 rounded-md bg-[#E2E8DE]" />
            <div className="w-32 h-8 rounded-xl bg-[#E2E8DE]" />
          </div>
          <div className="pt-3 border-t border-[#E2E8DE]/60 flex items-center justify-between">
            <div className="w-24 h-3 rounded-md bg-[#E2E8DE]" />
            <div className="w-12 h-3 rounded-md bg-[#E2E8DE]" />
          </div>
        </div>
      ))}
    </div>
  );
};

// 7. General Chart Skeleton with Realistic Bars/Curves
export const ChartSkeletonState: React.FC<{
  title?: string;
  height?: string | number;
  className?: string;
}> = ({
  title = 'Rendering Agricultural Visualizer...',
  height = 260,
  className = '',
}) => {
  return (
    <div
      style={{ minHeight: height }}
      className={`w-full bg-white rounded-[32px] p-6 border border-[#E2E8DE] flex flex-col justify-between ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-1.5">
          <div className="h-4 w-40 bg-[#E2E8DE] rounded-md animate-pulse" />
          <div className="h-3 w-56 bg-[#E2E8DE]/60 rounded-md animate-pulse" />
        </div>
        <div className="h-7 w-24 bg-[#E2E8DE] rounded-full animate-pulse" />
      </div>

      <div className="flex-1 flex items-end justify-between gap-3 px-4 pb-2 pt-6">
        {[45, 70, 30, 85, 60, 95, 50, 75, 40, 65].map((h, i) => (
          <div
            key={i}
            style={{ height: `${h}%` }}
            className="w-full bg-[#F0F7EE] border border-[#E2E8DE]/70 rounded-t-lg animate-pulse"
          />
        ))}
      </div>

      <div className="pt-3 border-t border-[#E2E8DE]/60 flex items-center justify-between text-[11px] text-[#707D72]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#2F9E44] animate-ping" />
          <span>{title}</span>
        </div>
        <span className="font-mono text-[10px]">Processing 50 Datapoints</span>
      </div>
    </div>
  );
};

import React from 'react';

interface SkeletonLoaderProps {
  className?: string;
  variant?: 'card' | 'text' | 'chart' | 'avatar' | 'row';
  count?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  className = '',
  variant = 'text',
  count = 1,
}) => {
  const baseClasses = 'animate-pulse bg-[#E2E8DE]/70 rounded-2xl';

  if (variant === 'card') {
    return (
      <div className={`p-5 rounded-[32px] bg-[#F0F7EE]/60 border border-[#E2E8DE]/60 space-y-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-2xl bg-[#E2E8DE] animate-pulse" />
          <div className="w-16 h-5 rounded-full bg-[#E2E8DE] animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="w-24 h-3 rounded-full bg-[#E2E8DE] animate-pulse" />
          <div className="w-36 h-7 rounded-xl bg-[#E2E8DE] animate-pulse" />
        </div>
        <div className="pt-3 border-t border-[#E2E8DE]/60 flex items-center justify-between">
          <div className="w-28 h-3 rounded-full bg-[#E2E8DE] animate-pulse" />
          <div className="w-12 h-3 rounded-full bg-[#E2E8DE] animate-pulse" />
        </div>
      </div>
    );
  }

  if (variant === 'chart') {
    return (
      <div className={`p-6 rounded-[32px] bg-white border border-[#E2E8DE]/70 space-y-5 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="space-y-1.5">
            <div className="w-48 h-5 rounded-lg bg-[#E2E8DE] animate-pulse" />
            <div className="w-64 h-3 rounded-md bg-[#E2E8DE]/70 animate-pulse" />
          </div>
          <div className="w-24 h-8 rounded-full bg-[#E2E8DE] animate-pulse" />
        </div>
        <div className="h-64 flex items-end justify-between gap-3 pt-8 pb-2 px-4">
          {[40, 75, 55, 90, 60, 85, 45, 70].map((h, idx) => (
            <div
              key={idx}
              style={{ height: `${h}%` }}
              className="w-full bg-[#E2E8DE]/70 rounded-t-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'row') {
    return (
      <div className={`space-y-2.5 ${className}`}>
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F0F7EE]/60 border border-[#E2E8DE]/60 animate-pulse"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#E2E8DE]" />
              <div className="space-y-1">
                <div className="w-32 h-3.5 rounded-md bg-[#E2E8DE]" />
                <div className="w-20 h-2.5 rounded-md bg-[#E2E8DE]/70" />
              </div>
            </div>
            <div className="w-16 h-4 rounded-md bg-[#E2E8DE]" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className={`${baseClasses} h-4 w-full`}
        />
      ))}
    </div>
  );
};

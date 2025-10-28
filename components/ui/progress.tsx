'use client';

import { useMemo } from 'react';

import { cn } from '@/lib/utils';

type ProgressProps = {
  value: number;
  className?: string;
  label?: string;
};

export const Progress = ({ value, className, label }: ProgressProps) => {
  const normalized = useMemo(() => {
    if (Number.isNaN(value) || !Number.isFinite(value)) {
      return 0;
    }
    return Math.min(100, Math.max(0, value));
  }, [value]);

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label ? (
        <div className="flex items-center justify-between text-sm text-white/70">
          <span>{label}</span>
          <span>{normalized.toFixed(0)}%</span>
        </div>
      ) : null}
      <div
        className="relative h-3 w-full overflow-hidden rounded-full bg-white/10"
        role="progressbar"
        aria-valuenow={normalized}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-brand-accent transition-all duration-500 ease-out"
          style={{ width: `${normalized}%` }}
        />
      </div>
    </div>
  );
};

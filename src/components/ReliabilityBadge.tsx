import { cn } from '@/lib/utils';
import { getReliabilityLevel, getReliabilityLabel } from '@/types/statistics';

interface ReliabilityBadgeProps {
  score: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ReliabilityBadge({ score, showLabel = true, size = 'md' }: ReliabilityBadgeProps) {
  const level = getReliabilityLevel(score);
  const label = getReliabilityLabel(score);

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  const colorClasses = {
    high: 'bg-reliability-high text-reliability-high-foreground',
    good: 'bg-reliability-good text-reliability-good-foreground',
    moderate: 'bg-reliability-moderate text-reliability-moderate-foreground',
    low: 'bg-reliability-low text-reliability-low-foreground',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-semibold',
        sizeClasses[size],
        colorClasses[level]
      )}
    >
      <span className="font-bold">{score}</span>
      {showLabel && <span className="opacity-90">• {label}</span>}
    </span>
  );
}

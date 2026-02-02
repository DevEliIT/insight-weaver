import { cn } from '@/lib/utils';
import { getReliabilityLevel } from '@/types/statistics';

interface ReliabilityProgressProps {
  score: number;
  showScale?: boolean;
}

export function ReliabilityProgress({ score, showScale = true }: ReliabilityProgressProps) {
  const level = getReliabilityLevel(score);

  const colorClasses = {
    high: 'bg-reliability-high',
    good: 'bg-reliability-good',
    moderate: 'bg-reliability-moderate',
    low: 'bg-reliability-low',
  };

  return (
    <div className="w-full space-y-2">
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            'h-full transition-all duration-500 ease-out rounded-full',
            colorClasses[level]
          )}
          style={{ width: `${score}%` }}
        />
      </div>
      {showScale && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0</span>
          <span className="text-reliability-low">Baixo</span>
          <span className="text-reliability-moderate">Moderado</span>
          <span className="text-reliability-good">Confiável</span>
          <span className="text-reliability-high">Alto</span>
          <span>100</span>
        </div>
      )}
    </div>
  );
}

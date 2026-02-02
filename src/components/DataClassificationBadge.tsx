import { cn } from '@/lib/utils';
import { DataClassification, CLASSIFICATION_LABELS } from '@/types/statistics';
import { CheckCircle, Building2, Calculator, XCircle } from 'lucide-react';

interface DataClassificationBadgeProps {
  classification: DataClassification;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const icons: Record<DataClassification, typeof CheckCircle> = {
  primary: CheckCircle,
  secondary: Building2,
  estimated: Calculator,
  unavailable: XCircle,
};

export function DataClassificationBadge({ 
  classification, 
  size = 'md',
  showIcon = true 
}: DataClassificationBadgeProps) {
  const Icon = icons[classification];
  const label = CLASSIFICATION_LABELS[classification];

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-3 py-1 gap-1.5',
    lg: 'text-base px-4 py-1.5 gap-2',
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const colorClasses = {
    primary: 'bg-datatype-primary text-datatype-primary-foreground',
    secondary: 'bg-datatype-secondary text-datatype-secondary-foreground',
    estimated: 'bg-datatype-estimated text-datatype-estimated-foreground',
    unavailable: 'bg-datatype-unavailable text-datatype-unavailable-foreground',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-semibold',
        sizeClasses[size],
        colorClasses[classification]
      )}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      <span>{label}</span>
    </span>
  );
}

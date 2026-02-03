import { CheckCircle2, AlertTriangle, XCircle, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CrossValidation } from '@/types/statistics';

interface CrossValidationCardProps {
  validation: CrossValidation;
}

function getConsistencyInfo(score: number): {
  icon: typeof CheckCircle2;
  color: string;
  bgColor: string;
  label: string;
} {
  if (score >= 85) {
    return {
      icon: CheckCircle2,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-500',
      label: 'Alta Consistência',
    };
  }
  if (score >= 60) {
    return {
      icon: BarChart3,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-500',
      label: 'Consistência Moderada',
    };
  }
  if (score >= 40) {
    return {
      icon: AlertTriangle,
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-500',
      label: 'Baixa Consistência',
    };
  }
  return {
    icon: XCircle,
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-500',
    label: 'Dados Inconsistentes',
  };
}

export function CrossValidationCard({ validation }: CrossValidationCardProps) {
  const consistencyInfo = getConsistencyInfo(validation.consistencyScore);
  const Icon = consistencyInfo.icon;

  return (
    <Card className="border-2">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          Validação Cruzada de Fontes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status */}
        <div className="flex items-center gap-3">
          <Icon className={`h-6 w-6 ${consistencyInfo.color}`} />
          <div className="flex-1">
            <p className={`font-semibold ${consistencyInfo.color}`}>
              {consistencyInfo.label}
            </p>
            <p className="text-sm text-muted-foreground">
              {validation.sourcesCompared} fonte(s) comparada(s)
            </p>
          </div>
        </div>

        {/* Consistency Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Índice de Consistência</span>
            <span className={`font-semibold ${consistencyInfo.color}`}>
              {validation.consistencyScore}%
            </span>
          </div>
          <Progress 
            value={validation.consistencyScore} 
            className="h-2"
            style={{
              '--progress-foreground': consistencyInfo.bgColor,
            } as React.CSSProperties}
          />
        </div>

        {/* Agreement */}
        {validation.agreement && (
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium mb-1">Consenso entre fontes:</p>
            <p className="text-sm text-muted-foreground">{validation.agreement}</p>
          </div>
        )}

        {/* Discrepancies */}
        {validation.discrepancies && validation.discrepancies.length > 0 && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm font-medium mb-2 flex items-center gap-2 text-yellow-800 dark:text-yellow-300">
              <AlertTriangle className="h-4 w-4" />
              Discrepâncias encontradas:
            </p>
            <ul className="space-y-1">
              {validation.discrepancies.map((discrepancy, index) => (
                <li 
                  key={index} 
                  className="text-sm text-yellow-700 dark:text-yellow-400 flex items-start gap-2"
                >
                  <span className="mt-1">•</span>
                  <span>{discrepancy}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

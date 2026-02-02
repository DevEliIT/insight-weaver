import { CheckCircle, Building2, Calculator, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CLASSIFICATION_LABELS, CLASSIFICATION_DESCRIPTIONS, DataClassification } from '@/types/statistics';

const classifications: DataClassification[] = ['primary', 'secondary', 'estimated', 'unavailable'];

const icons = {
  primary: CheckCircle,
  secondary: Building2,
  estimated: Calculator,
  unavailable: XCircle,
};

const colorClasses = {
  primary: 'text-datatype-primary bg-datatype-primary/10',
  secondary: 'text-datatype-secondary bg-datatype-secondary/10',
  estimated: 'text-datatype-estimated bg-datatype-estimated/10',
  unavailable: 'text-datatype-unavailable bg-datatype-unavailable/10',
};

export function ClassificationExplanation() {
  return (
    <Card className="border-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Como Funciona a Classificação</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {classifications.map((classification) => {
            const Icon = icons[classification];
            return (
              <div key={classification} className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${colorClasses[classification]}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm">
                    {CLASSIFICATION_LABELS[classification]}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {CLASSIFICATION_DESCRIPTIONS[classification]}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

import { History, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QueryHistoryItem } from '@/types/statistics';
import { DataClassificationBadge } from './DataClassificationBadge';
import { ReliabilityBadge } from './ReliabilityBadge';

interface QueryHistoryProps {
  history: QueryHistoryItem[];
  onSelect: (question: string) => void;
  onClear: () => void;
}

export function QueryHistory({ history, onSelect, onClear }: QueryHistoryProps) {
  if (!history.length) {
    return null;
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <History className="h-5 w-5" />
            Consultas Recentes
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClear} className="text-muted-foreground">
            <Trash2 className="h-4 w-4 mr-1" />
            Limpar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {history.slice(0, 5).map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors"
              onClick={() => onSelect(item.question)}
            >
              <p className="font-medium text-sm line-clamp-1">{item.question}</p>
              <div className="flex items-center gap-2 mt-2">
                <DataClassificationBadge classification={item.classification} size="sm" />
                <ReliabilityBadge score={item.reliabilityScore} size="sm" showLabel={false} />
                <span className="text-xs text-muted-foreground ml-auto">
                  {formatDate(item.timestamp)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

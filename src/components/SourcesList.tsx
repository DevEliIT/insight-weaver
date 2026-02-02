import { ExternalLink, Building2, GraduationCap, Landmark, Briefcase } from 'lucide-react';
import { Source } from '@/types/statistics';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SourcesListProps {
  sources: Source[];
}

const sourceTypeIcons = {
  governmental: Landmark,
  academic: GraduationCap,
  institutional: Building2,
  private: Briefcase,
};

const sourceTypeLabels = {
  governmental: 'Governamental',
  academic: 'Acadêmico',
  institutional: 'Institucional',
  private: 'Privado',
};

export function SourcesList({ sources }: SourcesListProps) {
  if (!sources.length) {
    return (
      <p className="text-muted-foreground text-sm">
        Nenhuma fonte disponível para esta consulta.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {sources.map((source, index) => {
        const Icon = sourceTypeIcons[source.type];
        return (
          <Card key={index} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{source.name}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="outline" className="text-xs">
                    {sourceTypeLabels[source.type]}
                  </Badge>
                  <span>•</span>
                  <span>{source.date}</span>
                  <span>•</span>
                  <span>Confiabilidade: {source.reliability}%</span>
                </div>
              </div>
              {source.url && (
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  Acessar <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

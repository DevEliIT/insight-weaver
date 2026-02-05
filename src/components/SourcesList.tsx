import { useState } from 'react';
import { 
  ExternalLink, 
  Building2, 
  GraduationCap, 
  Landmark, 
  Briefcase,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  Calendar,
  MapPin,
  FileText,
   Link2,
   AlertTriangle
} from 'lucide-react';
import { Source } from '@/types/statistics';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

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

const sourceTypeColors = {
  governmental: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  academic: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  institutional: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  private: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
};

// Known real domains for statistical sources
const KNOWN_VALID_DOMAINS = [
  'ibge.gov.br',
  'datasus.gov.br',
  'gov.br',
  'who.int',
  'worldbank.org',
  'un.org',
  'oecd.org',
  'imf.org',
  'unicef.org',
  'paho.org',
  'scielo.br',
  'pubmed.ncbi.nlm.nih.gov',
  'nature.com',
  'thelancet.com',
  'bmj.com',
  'jamanetwork.com',
  'cdc.gov',
  'nih.gov',
  'europa.eu',
  'ipea.gov.br',
  'fgv.br',
  'usp.br',
  'unicamp.br',
  'ufrj.br',
];

function isLikelyValidUrl(url: string | undefined): { valid: boolean; reason?: string } {
  if (!url) return { valid: false, reason: 'URL não fornecida' };
  
  try {
    const parsed = new URL(url);
    
    // Check if it's a known valid domain
    const isKnownDomain = KNOWN_VALID_DOMAINS.some(domain => 
      parsed.hostname.endsWith(domain) || parsed.hostname === domain
    );
    
    if (isKnownDomain) {
      return { valid: true };
    }
    
    // Check for suspicious patterns that indicate AI-generated fake URLs
    const suspiciousPatterns = [
      /example\.com/i,
      /placeholder/i,
      /fake/i,
      /test\.com/i,
      /sample/i,
      /lorem/i,
      /dummy/i,
    ];
    
    const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(url));
    if (isSuspicious) {
      return { valid: false, reason: 'URL parece ser um placeholder' };
    }
    
    // Check if it has a reasonable structure
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { valid: false, reason: 'Protocolo inválido' };
    }
    
    // URLs with very generic paths might be fake
    if (parsed.pathname === '/' && !isKnownDomain) {
      return { valid: false, reason: 'URL pode não ser verificável' };
    }
    
    return { valid: true, reason: 'URL não verificada - use com cautela' };
  } catch {
    return { valid: false, reason: 'URL inválida' };
  }
}

function getReliabilityColor(reliability: number): string {
  if (reliability >= 90) return 'text-green-600 dark:text-green-400';
  if (reliability >= 70) return 'text-blue-600 dark:text-blue-400';
  if (reliability >= 40) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
}

function getReliabilityBgColor(reliability: number): string {
  if (reliability >= 90) return 'bg-green-500';
  if (reliability >= 70) return 'bg-blue-500';
  if (reliability >= 40) return 'bg-yellow-500';
  return 'bg-red-500';
}

export function SourcesList({ sources }: SourcesListProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (!sources.length) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground text-sm">
          Nenhuma fonte disponível para esta consulta.
        </p>
        <p className="text-muted-foreground text-xs mt-1">
          Isso pode indicar que os dados são estimados ou indisponíveis.
        </p>
      </div>
    );
  }

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex flex-wrap gap-3 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2 text-sm">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{sources.length}</span>
          <span className="text-muted-foreground">fonte(s) consultada(s)</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <span className="text-muted-foreground">
            {sources.filter(s => s.crossValidated).length} validada(s) cruzadamente
          </span>
        </div>
      </div>

      {/* Sources List */}
      {sources.map((source, index) => {
        const Icon = sourceTypeIcons[source.type];
        const isExpanded = expandedIndex === index;
        const hasDetails = source.description || source.methodology || source.coverage;

        return (
          <Card 
            key={index} 
            className="overflow-hidden transition-all hover:shadow-md"
          >
            <Collapsible open={isExpanded} onOpenChange={() => toggleExpand(index)}>
              <div className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    {/* Header */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <Icon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      <span className="font-semibold text-lg">{source.name}</span>
                      {source.crossValidated && (
                        <Badge variant="outline" className="gap-1 text-green-600 border-green-300 dark:text-green-400 dark:border-green-700">
                          <CheckCircle2 className="h-3 w-3" />
                          Validado
                        </Badge>
                      )}
                    </div>

                    {/* Meta info */}
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <Badge 
                        variant="secondary" 
                        className={`${sourceTypeColors[source.type]} border-0`}
                      >
                        {sourceTypeLabels[source.type]}
                      </Badge>
                      
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{source.date}</span>
                      </div>

                      {source.coverage && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{source.coverage}</span>
                        </div>
                      )}
                    </div>

                    {/* Reliability bar */}
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">Confiabilidade:</span>
                      <div className="flex-1 max-w-[200px]">
                        <Progress 
                          value={source.reliability} 
                          className="h-2"
                          style={{
                            '--progress-foreground': getReliabilityBgColor(source.reliability),
                          } as React.CSSProperties}
                        />
                      </div>
                      <span className={`text-sm font-semibold ${getReliabilityColor(source.reliability)}`}>
                        {source.reliability}%
                      </span>
                    </div>

                    {/* Description preview */}
                    {source.description && !isExpanded && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {source.description}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col items-end gap-2">
                     {source.url && (() => {
                       const urlCheck = isLikelyValidUrl(source.url);
                       if (urlCheck.valid && !urlCheck.reason?.includes('cautela')) {
                         return (
                           <a
                             href={source.url}
                             target="_blank"
                             rel="noopener noreferrer"
                             className="flex items-center gap-1.5 text-sm text-primary hover:underline font-medium"
                           >
                             <Link2 className="h-4 w-4" />
                             Acessar fonte
                             <ExternalLink className="h-3 w-3" />
                           </a>
                         );
                       } else if (urlCheck.valid) {
                         return (
                           <div className="flex flex-col items-end gap-1">
                             <a
                               href={source.url}
                               target="_blank"
                               rel="noopener noreferrer"
                               className="flex items-center gap-1.5 text-sm text-muted-foreground hover:underline"
                             >
                               <Link2 className="h-4 w-4" />
                               Acessar fonte
                               <ExternalLink className="h-3 w-3" />
                             </a>
                             <span className="text-xs text-yellow-600 dark:text-yellow-400 flex items-center gap-1">
                               <AlertTriangle className="h-3 w-3" />
                               Não verificado
                             </span>
                           </div>
                         );
                       } else {
                         return (
                           <span className="text-xs text-muted-foreground flex items-center gap-1">
                             <AlertCircle className="h-3 w-3" />
                             Link indisponível
                           </span>
                         );
                       }
                     })()}
                    {hasDetails && (
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="gap-1 text-xs">
                          {isExpanded ? (
                            <>
                              Menos detalhes
                              <ChevronUp className="h-3 w-3" />
                            </>
                          ) : (
                            <>
                              Mais detalhes
                              <ChevronDown className="h-3 w-3" />
                            </>
                          )}
                        </Button>
                      </CollapsibleTrigger>
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded content */}
              <CollapsibleContent>
                <div className="px-4 pb-4 pt-0 space-y-4 border-t">
                  <div className="pt-4 grid gap-4 md:grid-cols-2">
                    {source.description && (
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          Descrição
                        </h4>
                        <p className="text-sm text-muted-foreground pl-6">
                          {source.description}
                        </p>
                      </div>
                    )}

                    {source.methodology && (
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-muted-foreground" />
                          Metodologia
                        </h4>
                        <p className="text-sm text-muted-foreground pl-6">
                          {source.methodology}
                        </p>
                      </div>
                    )}

                    {source.lastUpdated && (
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          Última Atualização
                        </h4>
                        <p className="text-sm text-muted-foreground pl-6">
                          {source.lastUpdated}
                        </p>
                      </div>
                    )}

                    {source.crossValidationSources && source.crossValidationSources.length > 0 && (
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          Validado com
                        </h4>
                        <ul className="text-sm text-muted-foreground pl-6 space-y-0.5">
                          {source.crossValidationSources.map((s, i) => (
                            <li key={i}>• {s}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        );
      })}
    </div>
  );
}

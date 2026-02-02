import { useState, useRef } from 'react';
import { ArrowLeft, Download, FileText, AlertTriangle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { StatisticalResponse } from '@/types/statistics';
import { DataClassificationBadge } from '@/components/DataClassificationBadge';
import { ReliabilityBadge } from '@/components/ReliabilityBadge';
import { ReliabilityProgress } from '@/components/ReliabilityProgress';
import { SourcesList } from '@/components/SourcesList';
import { StatisticsChart } from '@/components/StatisticsChart';
import { RelatedQuestions } from '@/components/RelatedQuestions';
import { exportToPDF } from '@/lib/pdf';
import { useToast } from '@/hooks/use-toast';

interface ResultViewProps {
  result: StatisticalResponse;
  onBack: () => void;
  onNewQuery: (question: string) => void;
}

export function ResultView({ result, onBack, onNewQuery }: ResultViewProps) {
  const [isSourcesOpen, setIsSourcesOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await exportToPDF(result, chartRef.current);
      toast({
        title: 'PDF exportado com sucesso',
        description: 'O relatório foi salvo no seu dispositivo.',
      });
    } catch (error) {
      toast({
        title: 'Erro ao exportar',
        description: 'Não foi possível gerar o PDF.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const isUnavailable = result.classification === 'unavailable';

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={onBack} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Nova Consulta
            </Button>
            <Button 
              onClick={handleExportPDF} 
              disabled={isExporting}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              {isExporting ? 'Exportando...' : 'Exportar PDF'}
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Question */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Sua pergunta:</p>
            <h1 className="text-2xl font-bold">{result.question}</h1>
          </div>

          {/* Classification & Reliability */}
          <div className="flex flex-wrap items-center gap-4">
            <DataClassificationBadge classification={result.classification} size="lg" />
            <ReliabilityBadge score={result.reliabilityScore} size="lg" />
          </div>

          {/* Unavailable Warning */}
          {isUnavailable && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Não foi possível encontrar dados estatísticos suficientes para responder esta pergunta com confiabilidade.
              </AlertDescription>
            </Alert>
          )}

          {/* Main Response Card */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Resumo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg leading-relaxed">{result.summary}</p>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Índice de Confiabilidade
                </p>
                <ReliabilityProgress score={result.reliabilityScore} />
              </div>

              {result.methodology && (
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Metodologia</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {result.methodology}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {result.limitations && result.limitations.length > 0 && (
                <div className="p-4 bg-reliability-moderate/10 rounded-lg border border-reliability-moderate/20">
                  <p className="font-medium text-sm mb-2">Limitações</p>
                  <ul className="space-y-1">
                    {result.limitations.map((limitation, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-reliability-moderate">•</span>
                        {limitation}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Raw Data */}
          {result.rawData && result.rawData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Dados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 font-medium">Item</th>
                        <th className="text-right py-2 font-medium">Valor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.rawData.map((item, index) => (
                        <tr key={index} className="border-b last:border-0">
                          <td className="py-2">{item.label}</td>
                          <td className="py-2 text-right font-mono">
                            {item.value}
                            {item.unit && <span className="text-muted-foreground ml-1">{item.unit}</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Charts */}
          {result.charts && result.charts.length > 0 && (
            <div ref={chartRef} className="space-y-6">
              {result.charts.map((chart, index) => (
                <StatisticsChart 
                  key={index} 
                  chart={chart} 
                  reliabilityScore={result.reliabilityScore}
                />
              ))}
            </div>
          )}

          {/* Sources Section */}
          <Collapsible open={isSourcesOpen} onOpenChange={setIsSourcesOpen}>
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardTitle className="flex items-center justify-between">
                    <span>Fontes, Metodologia e Limitações</span>
                    <span className="text-sm font-normal text-muted-foreground">
                      {result.sources?.length || 0} fonte(s) • Clique para {isSourcesOpen ? 'recolher' : 'expandir'}
                    </span>
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <SourcesList sources={result.sources || []} />
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Related Questions */}
          {result.relatedQuestions && result.relatedQuestions.length > 0 && (
            <RelatedQuestions 
              questions={result.relatedQuestions} 
              onSelect={onNewQuery}
            />
          )}
        </div>
      </main>
    </div>
  );
}

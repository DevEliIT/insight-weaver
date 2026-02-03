import { useState, useEffect, useCallback } from 'react';
import { BarChart3 } from 'lucide-react';
import { SearchBar } from '@/components/SearchBar';
import { ExampleQuestions } from '@/components/ExampleQuestions';
import { ClassificationExplanation } from '@/components/ClassificationExplanation';
import { QueryHistory } from '@/components/QueryHistory';
import { ResultView } from '@/components/ResultView';
import { Header } from '@/components/Header';
import { queryStatistics } from '@/lib/api';
import { getQueryHistory, addToHistory, clearHistory } from '@/lib/history';
import { StatisticalResponse, QueryHistoryItem } from '@/types/statistics';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<StatisticalResponse | null>(null);
  const [history, setHistory] = useState<QueryHistoryItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setHistory(getQueryHistory());
  }, []);

  const handleSearch = useCallback(async (question: string) => {
    setIsLoading(true);
    try {
      const response = await queryStatistics(question);
      setResult(response);
      
      // Add to history
      addToHistory({
        question: response.question,
        classification: response.classification,
        reliabilityScore: response.reliabilityScore,
      });
      setHistory(getQueryHistory());
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: 'Erro na consulta',
        description: error instanceof Error ? error.message : 'Não foi possível processar sua pergunta.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const handleBack = useCallback(() => {
    setResult(null);
  }, []);

  const handleClearHistory = useCallback(() => {
    clearHistory();
    setHistory([]);
    toast({
      title: 'Histórico limpo',
      description: 'Todas as consultas anteriores foram removidas.',
    });
  }, [toast]);

  // Show result view if we have a result
  if (result) {
    return (
      <ResultView 
        result={result} 
        onBack={handleBack}
        onNewQuery={(question) => {
          setResult(null);
          handleSearch(question);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-12">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto mb-16">
          {/* <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <BarChart3 className="h-4 w-4" />
            Inteligência Artificial para Estatísticas
          </div> */}
          {/* <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Pergunte qualquer coisa sobre{' '}
            <span className="text-primary">estatísticas</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Transformamos perguntas em respostas estatísticas confiáveis, com classificação de dados, índice de confiabilidade e fontes rastreáveis.
          </p> */}
          
          <SearchBar 
            onSearch={handleSearch} 
            isLoading={isLoading}
            placeholder="Ex: Qual a proporção de homens e mulheres no Brasil?"
          />
        </section>

        {/* History Section */}
        {history.length > 0 && (
          <section className="max-w-3xl mx-auto mb-12">
            <QueryHistory 
              history={history}
              onSelect={handleSearch}
              onClear={handleClearHistory}
            />
          </section>
        )}

        {/* Example Questions */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold mb-6 text-center">
            Exemplos de Perguntas
          </h2>
          <ExampleQuestions onSelect={handleSearch} />
        </section>

        {/* How it Works */}
        <section className="max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold mb-6 text-center">
            Como Funciona
          </h2>
          <ClassificationExplanation />
        </section>
      </main>

      {/* Footer */}
      {/* <footer className="border-t py-8 mt-16">
        <div className="container text-center text-sm text-muted-foreground">
          <p>
            <strong>StatIA</strong> prioriza transparência e rigor estatístico.
          </p>
          <p className="mt-1">
            Todas as respostas incluem classificação de dados, índice de confiabilidade e fontes rastreáveis.
          </p>
        </div>
      </footer> */}
    </div>
  );
};

export default Index;

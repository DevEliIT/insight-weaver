export type DataClassification = 
  | 'primary'      // Dado Oficial Primário
  | 'secondary'    // Dado Institucional Secundário
  | 'estimated'    // Dado Estimado
  | 'unavailable'; // Dado Inexistente

export type ChartType = 
  | 'pie'          // Proporções
  | 'bar'          // Comparações
  | 'line'         // Evolução temporal
  | 'histogram';   // Distribuições

export interface Source {
  name: string;
  url?: string;
  type: 'governmental' | 'academic' | 'institutional' | 'private';
  date: string;
  reliability: number; // 0-100
  description?: string; // Descrição da fonte
  methodology?: string; // Metodologia usada pela fonte
  coverage?: string; // Abrangência geográfica/temporal
  lastUpdated?: string; // Última atualização dos dados
  crossValidated?: boolean; // Se foi validada com outras fontes
  crossValidationSources?: string[]; // Fontes usadas para validação cruzada
}

export interface CrossValidation {
  isValidated: boolean;
  consistencyScore: number; // 0-100
  sourcesCompared: number;
  discrepancies?: string[];
  agreement?: string;
}

export interface ChartData {
  type: ChartType;
  title: string;
  unit: string;
  data: Array<{
    label: string;
    value: number;
    color?: string;
  }>;
}

export interface StatisticalResponse {
  question: string;
  classification: DataClassification;
  reliabilityScore: number; // 0-100
  summary: string;
  methodology?: string;
  limitations?: string[];
  sources: Source[];
  charts?: ChartData[];
  relatedQuestions?: string[];
  rawData?: Array<{
    label: string;
    value: string | number;
    unit?: string;
  }>;
  crossValidation?: CrossValidation;
  dataCollectionMethod?: string;
  sampleSize?: string;
  confidenceInterval?: string;
}

export interface QueryHistoryItem {
  id: string;
  question: string;
  timestamp: number;
  classification: DataClassification;
  reliabilityScore: number;
}

export interface CachedQuery {
  question: string;
  response: StatisticalResponse;
  cachedAt: number;
  expiresAt: number;
}

export const CLASSIFICATION_LABELS: Record<DataClassification, string> = {
  primary: 'Dado Oficial Primário',
  secondary: 'Dado Institucional Secundário',
  estimated: 'Dado Estimado',
  unavailable: 'Dado Inexistente',
};

export const CLASSIFICATION_DESCRIPTIONS: Record<DataClassification, string> = {
  primary: 'Censos, órgãos governamentais, estatísticas oficiais',
  secondary: 'Relatórios de ONGs, organismos internacionais, associações setoriais',
  estimated: 'Inferência estatística baseada em múltiplas fontes confiáveis',
  unavailable: 'Dados não encontrados ou insuficientes para análise',
};

export function getReliabilityLevel(score: number): 'high' | 'good' | 'moderate' | 'low' {
  if (score >= 90) return 'high';
  if (score >= 70) return 'good';
  if (score >= 40) return 'moderate';
  return 'low';
}

export function getReliabilityLabel(score: number): string {
  const level = getReliabilityLevel(score);
  const labels: Record<typeof level, string> = {
    high: 'Altamente Confiável',
    good: 'Confiável',
    moderate: 'Moderado',
    low: 'Baixa Confiabilidade',
  };
  return labels[level];
}

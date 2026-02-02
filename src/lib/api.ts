import { supabase } from '@/integrations/supabase/client';
import { StatisticalResponse } from '@/types/statistics';

export async function queryStatistics(question: string): Promise<StatisticalResponse> {
  const { data, error } = await supabase.functions.invoke('statistics-query', {
    body: { question },
  });

  if (error) {
    console.error('Error querying statistics:', error);
    throw new Error(error.message || 'Erro ao processar consulta');
  }

  if (data.error) {
    throw new Error(data.error);
  }

  return data as StatisticalResponse;
}

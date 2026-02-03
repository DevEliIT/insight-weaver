import { supabase } from '@/integrations/supabase/client';
import { StatisticalResponse } from '@/types/statistics';
import { getCachedResponse, cacheResponse } from '@/lib/sourceCache';

export async function queryStatistics(question: string): Promise<StatisticalResponse> {
  // Check cache first
  const cachedResult = getCachedResponse(question);
  if (cachedResult) {
    console.log('Returning cached response for:', question);
    return cachedResult;
  }

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

  const response = data as StatisticalResponse;

  // Cache the response
  cacheResponse(question, response);

  return response;
}

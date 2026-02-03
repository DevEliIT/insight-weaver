import { CachedQuery, StatisticalResponse } from '@/types/statistics';

const CACHE_KEY = 'statia_source_cache';
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours
const MAX_CACHE_ITEMS = 50;

function normalizeQuestion(question: string): string {
  return question.toLowerCase().trim().replace(/\s+/g, ' ').replace(/[?!.,;:]+$/, '');
}

export function getCachedResponse(question: string): StatisticalResponse | null {
  try {
    const cacheRaw = localStorage.getItem(CACHE_KEY);
    if (!cacheRaw) return null;

    const cache: CachedQuery[] = JSON.parse(cacheRaw);
    const normalizedQuestion = normalizeQuestion(question);
    
    const cached = cache.find(
      item => normalizeQuestion(item.question) === normalizedQuestion
    );

    if (!cached) return null;

    // Check if expired
    if (Date.now() > cached.expiresAt) {
      // Remove expired item
      removeCachedItem(normalizedQuestion);
      return null;
    }

    console.log('Cache hit for question:', question);
    return cached.response;
  } catch (error) {
    console.error('Error reading cache:', error);
    return null;
  }
}

export function cacheResponse(question: string, response: StatisticalResponse): void {
  try {
    const cacheRaw = localStorage.getItem(CACHE_KEY);
    let cache: CachedQuery[] = cacheRaw ? JSON.parse(cacheRaw) : [];

    // Remove old entry if exists
    const normalizedQuestion = normalizeQuestion(question);
    cache = cache.filter(
      item => normalizeQuestion(item.question) !== normalizedQuestion
    );

    // Add new entry
    const newEntry: CachedQuery = {
      question,
      response,
      cachedAt: Date.now(),
      expiresAt: Date.now() + CACHE_DURATION_MS,
    };

    cache.unshift(newEntry);

    // Limit cache size
    if (cache.length > MAX_CACHE_ITEMS) {
      cache = cache.slice(0, MAX_CACHE_ITEMS);
    }

    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    console.log('Cached response for question:', question);
  } catch (error) {
    console.error('Error caching response:', error);
  }
}

function removeCachedItem(normalizedQuestion: string): void {
  try {
    const cacheRaw = localStorage.getItem(CACHE_KEY);
    if (!cacheRaw) return;

    let cache: CachedQuery[] = JSON.parse(cacheRaw);
    cache = cache.filter(
      item => normalizeQuestion(item.question) !== normalizedQuestion
    );

    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.error('Error removing cached item:', error);
  }
}

export function clearSourceCache(): void {
  try {
    localStorage.removeItem(CACHE_KEY);
    console.log('Source cache cleared');
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
}

export function getCacheStats(): { itemCount: number; oldestItem: Date | null } {
  try {
    const cacheRaw = localStorage.getItem(CACHE_KEY);
    if (!cacheRaw) return { itemCount: 0, oldestItem: null };

    const cache: CachedQuery[] = JSON.parse(cacheRaw);
    const oldestTimestamp = cache.length > 0 
      ? Math.min(...cache.map(item => item.cachedAt))
      : null;

    return {
      itemCount: cache.length,
      oldestItem: oldestTimestamp ? new Date(oldestTimestamp) : null,
    };
  } catch (error) {
    console.error('Error getting cache stats:', error);
    return { itemCount: 0, oldestItem: null };
  }
}

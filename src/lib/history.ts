import { QueryHistoryItem } from '@/types/statistics';

const STORAGE_KEY = 'statia_query_history';
const MAX_HISTORY_ITEMS = 20;

export function getQueryHistory(): QueryHistoryItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addToHistory(item: Omit<QueryHistoryItem, 'id' | 'timestamp'>): void {
  try {
    const history = getQueryHistory();
    const newItem: QueryHistoryItem = {
      ...item,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    
    // Remove duplicate questions
    const filtered = history.filter((h) => h.question !== item.question);
    
    // Add new item at the beginning
    const updated = [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save to history:', e);
  }
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear history:', e);
  }
}

import { apiClient } from './apiClient';
import type { SearchResult } from '@/types';

export const searchService = {
  async search(query: string): Promise<SearchResult[]> {
    if (!query || query.length < 2) return [];
    return apiClient.get<SearchResult[]>(`/search?q=${encodeURIComponent(query)}`);
  }
};

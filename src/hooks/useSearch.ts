import { useState, useRef, useCallback, useEffect } from 'react';
import type { Product } from '../types/product';
import type { ApiOptions } from '../types/api';
import { searchProducts } from '../services/mockApi/searchApi';

export interface UseSearchResult {
  results: Product[];
  isLoading: boolean;
  error: string | null;
  search: (query: string, categoryId?: string, options?: ApiOptions) => Promise<void>;
  clearResults: () => void;
}

/**
 * Hook for asynchronous product search with protection against stale / out-of-order responses.
 */
export function useSearch(initialQuery = '', initialCategoryId?: string): UseSearchResult {
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Tracks the sequence ID of the latest search request to reject stale/out-of-order responses
  const activeRequestIdRef = useRef<number>(0);

  const search = useCallback(
    async (query: string, categoryId?: string, options?: ApiOptions): Promise<void> => {
      // Increment request ID to invalidate any prior in-flight searches
      const currentRequestId = ++activeRequestIdRef.current;

      const trimmed = query.trim();
      if (!trimmed && !categoryId) {
        setResults([]);
        setIsLoading(false);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await searchProducts(query, categoryId, options);

        // Discard stale response if a newer search request was triggered in the meantime
        if (currentRequestId === activeRequestIdRef.current) {
          setResults(data);
          setIsLoading(false);
        }
      } catch (err: unknown) {
        // Discard stale error if a newer request was triggered
        if (currentRequestId === activeRequestIdRef.current) {
          const errorMessage =
            err instanceof Error ? err.message : 'An unexpected error occurred while searching products.';
          setError(errorMessage);
          setResults([]);
          setIsLoading(false);
        }
      }
    },
    []
  );

  const clearResults = useCallback(() => {
    // Invalidate active searches and clear state
    activeRequestIdRef.current++;
    setResults([]);
    setIsLoading(false);
    setError(null);
  }, []);

  useEffect(() => {
    if (initialQuery.trim() || initialCategoryId) {
      void search(initialQuery, initialCategoryId);
    }
  }, [initialQuery, initialCategoryId, search]);

  return {
    results,
    isLoading,
    error,
    search,
    clearResults,
  };
}

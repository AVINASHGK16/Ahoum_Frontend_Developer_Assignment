import { useState, useEffect, useCallback } from 'react';
import type { Category } from '../types/product';
import type { ApiOptions } from '../types/api';
import { getCategories, getCategoryById } from '../services/mockApi/categoriesApi';

export interface UseCategoriesResult {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseCategoryDetailResult {
  category: Category | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch all categories.
 */
export function useCategories(options?: ApiOptions): UseCategoriesResult {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getCategories(options);
      setCategories(data);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unexpected error occurred while fetching categories.';
      setError(errorMessage);
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  }, [options?.shouldFail, options?.minLatencyMs, options?.maxLatencyMs]);

  useEffect(() => {
    let isCancelled = false;
    const execute = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getCategories(options);
        if (!isCancelled) {
          setCategories(data);
        }
      } catch (err: unknown) {
        if (!isCancelled) {
          const errorMessage =
            err instanceof Error ? err.message : 'An unexpected error occurred while fetching categories.';
          setError(errorMessage);
          setCategories([]);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    void execute();
    return () => {
      isCancelled = true;
    };
  }, [options?.shouldFail, options?.minLatencyMs, options?.maxLatencyMs]);

  return {
    categories,
    isLoading,
    error,
    refetch: fetchCategories,
  };
}

/**
 * Hook to fetch a single category by ID.
 */
export function useCategoryDetail(categoryId?: string, options?: ApiOptions): UseCategoryDetailResult {
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(Boolean(categoryId));
  const [error, setError] = useState<string | null>(null);

  const fetchCategory = useCallback(async () => {
    if (!categoryId) {
      setCategory(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await getCategoryById(categoryId, options);
      setCategory(data);
      if (!data) {
        setError(`Category with ID "${categoryId}" was not found.`);
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unexpected error occurred while fetching category.';
      setError(errorMessage);
      setCategory(null);
    } finally {
      setIsLoading(false);
    }
  }, [categoryId, options?.shouldFail, options?.minLatencyMs, options?.maxLatencyMs]);

  useEffect(() => {
    let isCancelled = false;
    const execute = async () => {
      if (!categoryId) {
        setCategory(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const data = await getCategoryById(categoryId, options);
        if (!isCancelled) {
          setCategory(data);
          if (!data) {
            setError(`Category with ID "${categoryId}" was not found.`);
          }
        }
      } catch (err: unknown) {
        if (!isCancelled) {
          const errorMessage =
            err instanceof Error ? err.message : 'An unexpected error occurred while fetching category.';
          setError(errorMessage);
          setCategory(null);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    void execute();
    return () => {
      isCancelled = true;
    };
  }, [categoryId, options?.shouldFail, options?.minLatencyMs, options?.maxLatencyMs]);

  return {
    category,
    isLoading,
    error,
    refetch: fetchCategory,
  };
}

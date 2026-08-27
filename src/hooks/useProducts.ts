import { useState, useEffect, useCallback } from 'react';
import type { Product } from '../types/product';
import type { ApiOptions } from '../types/api';
import { getProducts, getProductsByCategory, getProductById } from '../services/mockApi/productsApi';

export interface UseProductsResult {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseProductDetailResult {
  product: Product | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch a list of products (all products or filtered by category)
 * with loading, error, and retry capabilities.
 */
export function useProducts(categoryId?: string, options?: ApiOptions): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = categoryId
        ? await getProductsByCategory(categoryId, options)
        : await getProducts(options);
      setProducts(data);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unexpected error occurred while fetching products.';
      setError(errorMessage);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [categoryId, options?.shouldFail, options?.minLatencyMs, options?.maxLatencyMs]);

  useEffect(() => {
    let isCancelled = false;

    const executeFetch = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = categoryId
          ? await getProductsByCategory(categoryId, options)
          : await getProducts(options);
        if (!isCancelled) {
          setProducts(data);
        }
      } catch (err: unknown) {
        if (!isCancelled) {
          const errorMessage =
            err instanceof Error ? err.message : 'An unexpected error occurred while fetching products.';
          setError(errorMessage);
          setProducts([]);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    void executeFetch();

    return () => {
      isCancelled = true;
    };
  }, [categoryId, options?.shouldFail, options?.minLatencyMs, options?.maxLatencyMs]);

  return {
    products,
    isLoading,
    error,
    refetch: fetchProducts,
  };
}

/**
 * Hook to fetch a single product by ID with loading, error, and retry capabilities.
 */
export function useProductDetail(productId?: string, options?: ApiOptions): UseProductDetailResult {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(Boolean(productId));
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!productId) {
      setProduct(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await getProductById(productId, options);
      setProduct(data);
      if (!data) {
        setError(`Product with ID "${productId}" was not found.`);
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unexpected error occurred while fetching product details.';
      setError(errorMessage);
      setProduct(null);
    } finally {
      setIsLoading(false);
    }
  }, [productId, options?.shouldFail, options?.minLatencyMs, options?.maxLatencyMs]);

  useEffect(() => {
    let isCancelled = false;

    const executeFetch = async () => {
      if (!productId) {
        setProduct(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await getProductById(productId, options);
        if (!isCancelled) {
          setProduct(data);
          if (!data) {
            setError(`Product with ID "${productId}" was not found.`);
          }
        }
      } catch (err: unknown) {
        if (!isCancelled) {
          const errorMessage =
            err instanceof Error ? err.message : 'An unexpected error occurred while fetching product details.';
          setError(errorMessage);
          setProduct(null);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    void executeFetch();

    return () => {
      isCancelled = true;
    };
  }, [productId, options?.shouldFail, options?.minLatencyMs, options?.maxLatencyMs]);

  return {
    product,
    isLoading,
    error,
    refetch: fetchProduct,
  };
}

import productsData from '../../data/products.json';
import type { Product } from '../../types/product';
import type { ApiOptions } from '../../types/api';

const products: Product[] = productsData;

function simulateDelay<T>(data: T, options?: ApiOptions): Promise<T> {
  const min = options?.minLatencyMs ?? 200;
  const max = options?.maxLatencyMs ?? 1200;
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;

  return new Promise<T>((resolve, reject) => {
    setTimeout(() => {
      if (options?.shouldFail) {
        reject(new Error('Simulated network failure during product search.'));
      } else {
        resolve(data);
      }
    }, delay);
  });
}

/**
 * Searches products by matching query against title, description, or tags,
 * with optional category filtering.
 */
export async function searchProducts(
  query: string,
  categoryId?: string,
  options?: ApiOptions
): Promise<Product[]> {
  const normalizedQuery = query.trim().toLowerCase();

  let results = [...products];

  if (categoryId && categoryId.trim().length > 0) {
    results = results.filter((product) => product.categoryId === categoryId);
  }

  if (normalizedQuery.length > 0) {
    results = results.filter((product) => {
      const matchName = product.name.toLowerCase().includes(normalizedQuery);
      const matchDescription = product.description.toLowerCase().includes(normalizedQuery);
      const matchTags = product.tags?.some((tag) => tag.toLowerCase().includes(normalizedQuery)) ?? false;
      return matchName || matchDescription || matchTags;
    });
  }

  return simulateDelay<Product[]>(results, options);
}

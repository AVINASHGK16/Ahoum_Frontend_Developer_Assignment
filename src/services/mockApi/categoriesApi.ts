import categoriesData from '../../data/categories.json';
import type { Category } from '../../types/product';
import type { ApiOptions } from '../../types/api';

const categories: Category[] = categoriesData;

function simulateDelay<T>(data: T, options?: ApiOptions): Promise<T> {
  const min = options?.minLatencyMs ?? 200;
  const max = options?.maxLatencyMs ?? 1200;
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;

  return new Promise<T>((resolve, reject) => {
    setTimeout(() => {
      if (options?.shouldFail) {
        reject(new Error('Simulated network failure while fetching categories.'));
      } else {
        resolve(data);
      }
    }, delay);
  });
}

/**
 * Retrieves all categories from the mock dataset.
 */
export async function getCategories(options?: ApiOptions): Promise<Category[]> {
  return simulateDelay<Category[]>([...categories], options);
}

/**
 * Retrieves a single category by its unique ID.
 */
export async function getCategoryById(id: string, options?: ApiOptions): Promise<Category | null> {
  const category = categories.find((c) => c.id === id) ?? null;
  return simulateDelay<Category | null>(category, options);
}

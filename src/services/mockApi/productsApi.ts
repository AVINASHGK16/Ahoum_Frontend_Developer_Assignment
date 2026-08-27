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
        reject(new Error('Simulated network failure while fetching products.'));
      } else {
        resolve(data);
      }
    }, delay);
  });
}

/**
 * Retrieves all products from the mock dataset.
 */
export async function getProducts(options?: ApiOptions): Promise<Product[]> {
  return simulateDelay<Product[]>([...products], options);
}

/**
 * Retrieves a single product by its unique ID.
 */
export async function getProductById(id: string, options?: ApiOptions): Promise<Product | null> {
  const product = products.find((p) => p.id === id) ?? null;
  return simulateDelay<Product | null>(product, options);
}

/**
 * Retrieves products belonging to a specific category.
 */
export async function getProductsByCategory(
  categoryId: string,
  options?: ApiOptions
): Promise<Product[]> {
  const filtered = products.filter((p) => p.categoryId === categoryId);
  return simulateDelay<Product[]>([...filtered], options);
}

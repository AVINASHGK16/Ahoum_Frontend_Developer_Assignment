import type { Product } from '../types/product';

export interface FilterCriteria {
  category?: string; // categoryId or 'all'
  selectedCategories?: string[];
  selectedBrands?: string[];
  maxPrice?: number;
  inStockOnly?: boolean;
  organicOnly?: boolean;
  minRating?: number;
  searchQuery?: string;
}

/**
 * Checks if a product matches a given category filter option or category ID.
 */
export const matchesCategory = (product: Product, category: string): boolean => {
  const normCat = category.trim().toLowerCase();
  if (normCat === 'all' || !normCat) return true;

  // Direct categoryId match
  if (product.categoryId.toLowerCase() === normCat) return true;

  if (normCat === 'eggs') {
    return (
      product.categoryId === 'dairy-eggs' ||
      (product.tags?.some((t) => ['egg', 'eggs', 'chicken'].includes(t.toLowerCase())) ?? false) ||
      product.name.toLowerCase().includes('egg')
    );
  }

  if (normCat === 'noodles & pasta') {
    return (
      (product.tags?.some((t) => ['noodles', 'pasta', 'noodles & pasta'].includes(t.toLowerCase())) ?? false) ||
      product.name.toLowerCase().includes('noodles') ||
      product.name.toLowerCase().includes('pasta')
    );
  }

  if (normCat === 'chips & crisps') {
    return (
      product.categoryId === 'bakery-snacks' ||
      (product.tags?.some((t) => ['chips', 'crisps', 'snacks', 'chips & crisps'].includes(t.toLowerCase())) ?? false)
    );
  }

  if (normCat === 'fast food') {
    return (
      product.categoryId === 'beverages' ||
      product.categoryId === 'meat-fish' ||
      (product.tags?.some((t) => ['fast food', 'fast-food', 'soda', 'coke', 'pepsi', 'sprite', 'meat'].includes(t.toLowerCase())) ?? false)
    );
  }

  // Fallback match on categoryId, name, or tags
  return (
    product.categoryId.toLowerCase().includes(normCat) ||
    product.name.toLowerCase().includes(normCat) ||
    (product.tags?.some((t) => t.toLowerCase().includes(normCat)) ?? false)
  );
};

/**
 * Checks if a product matches a given brand filter option.
 */
export const matchesBrand = (product: Product, brand: string): boolean => {
  if (!product.brand) return false;
  const prodBrand = product.brand.trim().toLowerCase();
  const targetBrand = brand.trim().toLowerCase();

  // Handle "Individual Callection" / "Individual Collection" variations
  if (targetBrand.includes('individual') && prodBrand.includes('individual')) {
    return true;
  }

  return prodBrand === targetBrand;
};

/**
 * Filters a list of products based on comprehensive filter criteria.
 */
export const filterProducts = (
  products: Product[],
  criteria: FilterCriteria
): Product[] => {
  const {
    category,
    selectedCategories = [],
    selectedBrands = [],
    maxPrice,
    inStockOnly,
    organicOnly,
    minRating,
    searchQuery,
  } = criteria;

  return products.filter((product) => {
    // 1. Text Search filtering
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const nameMatch = product.name.toLowerCase().includes(q);
      const descMatch = product.description.toLowerCase().includes(q);
      const tagMatch = product.tags?.some((t) => t.toLowerCase().includes(q)) ?? false;
      const brandMatch = product.brand?.toLowerCase().includes(q) ?? false;
      if (!nameMatch && !descMatch && !tagMatch && !brandMatch) {
        return false;
      }
    }

    // 2. Single Category selection (from sidebar e.g. "vegetables", "dairy-eggs", or "all")
    if (category && category !== 'all') {
      if (!matchesCategory(product, category)) {
        return false;
      }
    }

    // 3. Multi-Category selection (backwards compatibility)
    if (selectedCategories.length > 0) {
      const matchesAnyCategory = selectedCategories.some((cat) => matchesCategory(product, cat));
      if (!matchesAnyCategory) return false;
    }

    // 4. Brand selection
    if (selectedBrands.length > 0) {
      const matchesAnyBrand = selectedBrands.some((brand) => matchesBrand(product, brand));
      if (!matchesAnyBrand) return false;
    }

    // 5. Max Price filtering
    if (maxPrice !== undefined && maxPrice > 0) {
      if (product.price > maxPrice) return false;
    }

    // 6. In Stock Only
    if (inStockOnly) {
      if (!product.inStock) return false;
    }

    // 7. Organic Only
    if (organicOnly) {
      const isOrganic = product.tags?.some((t) =>
        ['organic', 'fresh', 'natural', 'farm'].includes(t.toLowerCase())
      );
      const nameHasOrganic = product.name.toLowerCase().includes('organic');
      if (!isOrganic && !nameHasOrganic) return false;
    }

    // 8. Minimum Rating
    if (minRating !== undefined && minRating > 0) {
      if ((product.rating ?? 0) < minRating) return false;
    }

    return true;
  });
};

/**
 * Backward compatibility helper for legacy signatures.
 */
export const applyProductFilters = (
  products: Product[],
  selectedCategories: string[],
  selectedBrands: string[]
): Product[] => {
  return filterProducts(products, {
    selectedCategories,
    selectedBrands,
  });
};

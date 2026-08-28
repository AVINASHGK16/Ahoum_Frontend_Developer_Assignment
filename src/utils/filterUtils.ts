import type { Product } from '../types/product';

/**
 * Checks if a product matches a given category filter option.
 */
export const matchesCategory = (product: Product, category: string): boolean => {
  const normCat = category.trim().toLowerCase();

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

  // Fallback match on categoryId or name
  return (
    product.categoryId.toLowerCase().includes(normCat) ||
    product.name.toLowerCase().includes(normCat)
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
 * Filters a list of products based on selected categories (OR within group),
 * selected brands (OR within group), and group intersection (AND between groups).
 */
export const applyProductFilters = (
  products: Product[],
  selectedCategories: string[],
  selectedBrands: string[]
): Product[] => {
  if (selectedCategories.length === 0 && selectedBrands.length === 0) {
    return products;
  }

  return products.filter((product) => {
    // Within Categories -> OR
    const matchesAnyCategory =
      selectedCategories.length === 0 ||
      selectedCategories.some((cat) => matchesCategory(product, cat));

    // Within Brands -> OR
    const matchesAnyBrand =
      selectedBrands.length === 0 ||
      selectedBrands.some((brand) => matchesBrand(product, brand));

    // Between Categories and Brands -> AND
    return matchesAnyCategory && matchesAnyBrand;
  });
};

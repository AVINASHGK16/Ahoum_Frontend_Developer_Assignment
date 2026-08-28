/**
 * Shared presentation-level formatters for product metadata.
 * These do NOT modify source data — they normalize display strings
 * so the same product renders identically across all surfaces.
 */

/**
 * Normalizes raw unit/weight copy from product data.
 *
 * Examples:
 *   "7pcs, Priceg"      → "7 pcs"
 *   "1kg, Priceg"        → "1 kg"
 *   "250gm, Priceg"      → "250 g"
 *   "355ml, Price"        → "355 ml"
 *   "2L, Price"           → "2 L"
 *   "4pcs, Price"         → "4 pcs"
 *   "180g, Price"         → "180 g"
 *   "30gm, Price"         → "30 g"
 *   "500 ml glass bottle" → "500 ml glass bottle"  (already clean)
 *   "Pack of 4"           → "Pack of 4"            (already clean)
 */
export const formatProductUnit = (rawUnit?: string): string => {
  if (!rawUnit) return '';

  let cleaned = rawUnit
    // Remove trailing ", Priceg" / ", Price" / "Priceg" noise
    .replace(/,\s*priceg?\b/gi, '')
    .replace(/\bpriceg?\b/gi, '')
    .trim();

  // Normalize number+unit patterns
  cleaned = cleaned
    .replace(/(\d+)\s*pcs/gi, '$1 pcs')
    .replace(/(\d+)\s*gm\b/gi, '$1 g')
    .replace(/(\d+)\s*g\b/gi, '$1 g')
    .replace(/(\d+)\s*kg\b/gi, '$1 kg')
    .replace(/(\d+)\s*ml\b/gi, '$1 ml')
    .replace(/(\d+)\s*L\b/g, '$1 L')       // case-sensitive: capital L for liters
    .replace(/(\d+)\s*l\b/gi, '$1 L')       // normalize lowercase l → L
    .trim();

  return cleaned || 'Standard unit';
};

/**
 * Normalizes brand name copy from product data.
 *
 * Fixes known typos:
 *   "Individual Callection" → "Individual Collection"
 */
export const formatBrandName = (rawBrand?: string): string => {
  if (!rawBrand) return '';
  return rawBrand.replace(/Callection/gi, 'Collection');
};

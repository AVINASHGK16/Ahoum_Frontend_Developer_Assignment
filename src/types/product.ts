export interface Category {
  id: string;
  name: string;
  description: string;
  itemCount: number;
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  price: number;
  originalPrice?: number;
  unit: string;
  description: string;
  inStock: boolean;
  rating?: number;
  tags?: string[];
  image?: string;
}

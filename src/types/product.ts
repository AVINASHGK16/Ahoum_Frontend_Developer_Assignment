export interface Category {
  id: string;
  name: string;
  description: string;
  itemCount: number;
  image?: string;
  bgColor?: string;
  borderColor?: string;
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
  brand?: string;
}

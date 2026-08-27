import { createBrowserRouter } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { CategoryPage } from '../pages/CategoryPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { SearchPage } from '../pages/SearchPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutResultPage } from '../pages/CheckoutResultPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/category/:categoryId',
    element: <CategoryPage />,
  },
  {
    path: '/product/:productId',
    element: <ProductDetailPage />,
  },
  {
    path: '/search',
    element: <SearchPage />,
  },
  {
    path: '/cart',
    element: <CartPage />,
  },
  {
    path: '/checkout/result',
    element: <CheckoutResultPage />,
  },
]);

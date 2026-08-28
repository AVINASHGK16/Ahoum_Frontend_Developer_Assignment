import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { SplashScreen } from '../pages/SplashScreen';
import { WelcomeScreen } from '../pages/WelcomeScreen';
import { AuthScreen } from '../pages/AuthScreen';
import { PhoneNumberScreen } from '../pages/PhoneNumberScreen';
import { VerificationScreen } from '../pages/VerificationScreen';
import { LocationScreen } from '../pages/LocationScreen';
import { LoginScreen } from '../pages/LoginScreen';
import { SignupScreen } from '../pages/SignupScreen';
import { HomePage } from '../pages/HomePage';
import { CategoryPage } from '../pages/CategoryPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { SearchPage } from '../pages/SearchPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutResultPage } from '../pages/CheckoutResultPage';

export const router = createBrowserRouter([
  {
    path: '/splash',
    element: <SplashScreen />,
  },
  {
    path: '/welcome',
    element: <WelcomeScreen />,
  },
  {
    path: '/auth',
    element: <AuthScreen />,
  },
  {
    path: '/phone',
    element: <PhoneNumberScreen />,
  },
  {
    path: '/verification',
    element: <VerificationScreen />,
  },
  {
    path: '/location',
    element: <LocationScreen />,
  },
  {
    path: '/login',
    element: <LoginScreen />,
  },
  {
    path: '/signup',
    element: <SignupScreen />,
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'category/:categoryId',
        element: <CategoryPage />,
      },
      {
        path: 'product/:productId',
        element: <ProductDetailPage />,
      },
      {
        path: 'search',
        element: <SearchPage />,
      },
      {
        path: 'cart',
        element: <CartPage />,
      },
      {
        path: 'checkout/result',
        element: <CheckoutResultPage />,
      },
    ],
  },
]);

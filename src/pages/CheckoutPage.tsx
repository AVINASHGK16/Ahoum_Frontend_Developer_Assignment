import React from 'react';
import { CartPage } from './CartPage';

export const CheckoutPage: React.FC = () => {
  return <CartPage initialCheckoutOpen={true} />;
};

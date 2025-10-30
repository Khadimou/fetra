'use client';

import { useEffect } from 'react';
import { clearCart } from '@/lib/cart';

/**
 * Component that clears the cart when mounted on the success page
 * This ensures the cart is emptied after a successful purchase
 */
export default function ClearCartOnSuccess() {
  useEffect(() => {
    // Clear cart on mount (when user arrives on success page)
    clearCart();
    console.log('✅ Cart cleared after successful purchase');
  }, []);

  return null; // This component doesn't render anything
}


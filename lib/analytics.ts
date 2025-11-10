/**
 * Analytics Module
 *
 * Centralized analytics tracking for e-commerce events.
 * Sends events to Google Analytics via dataLayer (GTM).
 */

interface ProductData {
  sku: string;
  name: string;
  price: number;
  category?: string;
  variant?: string;
}

export function pushEvent(eventName: string, eventData?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && (window as any).dataLayer) {
    (window as any).dataLayer.push({
      event: eventName,
      ...eventData,
    });
    console.log('[Analytics] Event tracked:', eventName);
  }
}

export function beginCheckout(sku: string, quantity: number, price?: number) {
  pushEvent('begin_checkout', {
    sku,
    quantity,
    price,
  });
}

/**
 * Track product page view
 */
export function trackProductView(product: ProductData): void {
  pushEvent('view_item', {
    ecommerce: {
      items: [
        {
          item_id: product.sku,
          item_name: product.name,
          item_category: product.category,
          item_variant: product.variant,
          price: product.price,
        },
      ],
    },
  });
}

/**
 * Track variant selection
 */
export function trackVariantSelect(
  product: ProductData,
  variantName: string
): void {
  pushEvent('select_item_variant', {
    ecommerce: {
      items: [
        {
          item_id: product.sku,
          item_name: product.name,
          item_variant: variantName,
          price: product.price,
        },
      ],
    },
  });
}

/**
 * Track add to cart attempt (before validation)
 */
export function trackAddToCartAttempt(
  product: ProductData,
  quantity: number
): void {
  pushEvent('add_to_cart_attempt', {
    ecommerce: {
      items: [
        {
          item_id: product.sku,
          item_name: product.name,
          item_category: product.category,
          item_variant: product.variant,
          price: product.price,
          quantity,
        },
      ],
    },
  });
}

/**
 * Track successful add to cart (after validation)
 */
export function trackAddToCartSuccess(
  product: ProductData,
  quantity: number
): void {
  pushEvent('add_to_cart', {
    ecommerce: {
      currency: 'EUR',
      value: product.price * quantity,
      items: [
        {
          item_id: product.sku,
          item_name: product.name,
          item_category: product.category,
          item_variant: product.variant,
          price: product.price,
          quantity,
        },
      ],
    },
  });
}

/**
 * Track add to cart failure (validation error)
 */
export function trackAddToCartFailure(
  product: ProductData,
  reason: 'stock_insufficient' | 'price_changed' | 'network_error',
  details?: Record<string, any>
): void {
  pushEvent('add_to_cart_failure', {
    failure_reason: reason,
    product_sku: product.sku,
    product_name: product.name,
    ...details,
  });
}

/**
 * Track price change modal interaction
 */
export function trackPriceChangeModal(
  action: 'shown' | 'confirmed' | 'cancelled',
  oldPrice: number,
  newPrice: number
): void {
  pushEvent('price_change_modal', {
    action,
    old_price: oldPrice,
    new_price: newPrice,
    price_diff: newPrice - oldPrice,
  });
}

/**
 * Track stock adjustment
 */
export function trackStockAdjustment(
  product: ProductData,
  requestedQuantity: number,
  adjustedQuantity: number
): void {
  pushEvent('stock_adjustment', {
    product_sku: product.sku,
    requested_quantity: requestedQuantity,
    adjusted_quantity: adjustedQuantity,
  });
}


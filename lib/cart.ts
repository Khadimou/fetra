// Client-side cart management with localStorage

export type CartItem = {
  sku: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  // CJ Dropshipping metadata
  cjProductId?: string;
  cjVariantId?: string;
  maxQuantity?: number; // Stock limit
  variantName?: string;
};

export type Cart = {
  items: CartItem[];
  total: number;
  itemCount: number;
  promoCode?: string;
  discount?: number;
};

const CART_STORAGE_KEY = 'fetra_cart';
const PROMO_STORAGE_KEY = 'fetra_promo';

export function getCart(): Cart {
  if (typeof window === 'undefined') {
    return { items: [], total: 0, itemCount: 0, promoCode: undefined, discount: undefined };
  }

  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return { items: [], total: 0, itemCount: 0, promoCode: undefined, discount: undefined };

    const cart: Cart = JSON.parse(stored);
    return cart;
  } catch {
    return { items: [], total: 0, itemCount: 0, promoCode: undefined, discount: undefined };
  }
}

export function saveCart(cart: Cart): void {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  
  // Dispatch custom event for cart updates
  window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }));
}

export function addToCart(item: Omit<CartItem, 'quantity'>, quantity: number = 1): Cart {
  const cart = getCart();
  
  // Check if item already exists (match by SKU and variant ID for CJ products)
  const existingIndex = cart.items.findIndex(i => {
    if (item.cjVariantId) {
      // For CJ products, match by variant ID
      return i.cjVariantId === item.cjVariantId;
    }
    // For regular products, match by SKU
    return i.sku === item.sku;
  });
  
  if (existingIndex >= 0) {
    // Update quantity, respecting max quantity if set
    const newQuantity = cart.items[existingIndex].quantity + quantity;
    const maxQty = cart.items[existingIndex].maxQuantity;
    cart.items[existingIndex].quantity = maxQty ? Math.min(newQuantity, maxQty) : newQuantity;
  } else {
    // Add new item, respecting max quantity
    const maxQty = item.maxQuantity;
    const finalQuantity = maxQty ? Math.min(quantity, maxQty) : quantity;
    cart.items.push({ ...item, quantity: finalQuantity });
  }
  
  // Recalculate totals
  updateCartTotals(cart);
  saveCart(cart);
  
  return cart;
}

export function removeFromCart(sku: string): Cart {
  const cart = getCart();
  cart.items = cart.items.filter(item => item.sku !== sku);
  updateCartTotals(cart);
  saveCart(cart);
  return cart;
}

export function updateQuantity(sku: string, quantity: number): Cart {
  const cart = getCart();
  const item = cart.items.find(i => i.sku === sku);
  
  if (item) {
    if (quantity <= 0) {
      return removeFromCart(sku);
    }
    item.quantity = quantity;
    updateCartTotals(cart);
    saveCart(cart);
  }
  
  return cart;
}

export function clearCart(): Cart {
  const emptyCart = { items: [], total: 0, itemCount: 0, promoCode: undefined, discount: undefined };
  saveCart(emptyCart);
  // Also clear promo code
  if (typeof window !== 'undefined') {
    localStorage.removeItem(PROMO_STORAGE_KEY);
  }
  return emptyCart;
}

export function applyPromoCode(code: string): { success: boolean; discount?: number; message?: string } {
  const upperCode = code.toUpperCase();

  // Validate promo code
  if (upperCode === 'BIENVENUE10') {
    const cart = getCart();
    cart.promoCode = upperCode;
    cart.discount = 0.1; // 10%
    saveCart(cart);

    // Also save to separate storage for checkout
    if (typeof window !== 'undefined') {
      localStorage.setItem(PROMO_STORAGE_KEY, upperCode);
    }

    return { success: true, discount: 0.1, message: '10% de réduction appliquée !' };
  }

  return { success: false, message: 'Code promo invalide' };
}

export function removePromoCode(): Cart {
  const cart = getCart();
  cart.promoCode = undefined;
  cart.discount = undefined;
  saveCart(cart);

  if (typeof window !== 'undefined') {
    localStorage.removeItem(PROMO_STORAGE_KEY);
  }

  return cart;
}

export function getPromoCode(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(PROMO_STORAGE_KEY);
}

function updateCartTotals(cart: Cart): void {
  cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  cart.itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
}


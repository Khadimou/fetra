// Client-side cart management with localStorage

export type CartItem = {
  sku: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
};

export type Cart = {
  items: CartItem[];
  total: number;
  itemCount: number;
};

const CART_STORAGE_KEY = 'fetra_cart';

export function getCart(): Cart {
  if (typeof window === 'undefined') {
    return { items: [], total: 0, itemCount: 0 };
  }

  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return { items: [], total: 0, itemCount: 0 };
    
    const cart: Cart = JSON.parse(stored);
    return cart;
  } catch {
    return { items: [], total: 0, itemCount: 0 };
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
  
  // Check if item already exists
  const existingIndex = cart.items.findIndex(i => i.sku === item.sku);
  
  if (existingIndex >= 0) {
    // Update quantity
    cart.items[existingIndex].quantity += quantity;
  } else {
    // Add new item
    cart.items.push({ ...item, quantity });
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
  const emptyCart = { items: [], total: 0, itemCount: 0 };
  saveCart(emptyCart);
  return emptyCart;
}

function updateCartTotals(cart: Cart): void {
  cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  cart.itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
}


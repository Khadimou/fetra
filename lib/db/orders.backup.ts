/**
 * Simple file-based order persistence
 * Stores orders in a JSON file for reference and debugging
 * For production, consider using a proper database (Prisma, MongoDB, etc.)
 */

import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

export interface ShippingInfo {
  trackingNumber?: string;
  carrier?: 'colissimo' | 'chronopost' | 'other';
  shippedAt?: string; // ISO date when order was shipped
  deliveredAt?: string; // ISO date when order was delivered
  recipientName?: string;
  recipientAddress?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

export interface Order {
  id: string;
  email: string;
  customerName?: string;
  amount: number;
  currency: string;
  status: string; // 'paid', 'shipped', 'delivered', 'cancelled'
  items?: any[];
  createdAt: string;
  metadata?: Record<string, any>;
  shipping?: ShippingInfo; // Shipping and tracking information
}

/**
 * Save an order to the JSON file
 */
export function saveOrder(order: Order): boolean {
  try {
    // Ensure data directory exists
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    // Read existing orders
    let orders: Order[] = [];
    if (fs.existsSync(ORDERS_FILE)) {
      const content = fs.readFileSync(ORDERS_FILE, 'utf8');
      orders = JSON.parse(content);
    }

    // Add new order
    orders.push({
      ...order,
      createdAt: order.createdAt || new Date().toISOString()
    });

    // Write back to file
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8');

    console.log('Order saved:', order.id);
    return true;
  } catch (error: any) {
    console.error('Error saving order:', error);
    return false;
  }
}

/**
 * Get an order by ID
 */
export function getOrder(orderId: string): Order | null {
  try {
    if (!fs.existsSync(ORDERS_FILE)) {
      return null;
    }

    const content = fs.readFileSync(ORDERS_FILE, 'utf8');
    const orders: Order[] = JSON.parse(content);

    return orders.find(order => order.id === orderId) || null;
  } catch (error: any) {
    console.error('Error reading order:', error);
    return null;
  }
}

/**
 * Get all orders for a customer email
 */
export function getOrdersByEmail(email: string): Order[] {
  try {
    if (!fs.existsSync(ORDERS_FILE)) {
      return [];
    }

    const content = fs.readFileSync(ORDERS_FILE, 'utf8');
    const orders: Order[] = JSON.parse(content);

    return orders.filter(order => order.email === email);
  } catch (error: any) {
    console.error('Error reading orders:', error);
    return [];
  }
}

/**
 * Get recent orders (last N orders)
 */
export function getRecentOrders(limit: number = 10): Order[] {
  try {
    if (!fs.existsSync(ORDERS_FILE)) {
      return [];
    }

    const content = fs.readFileSync(ORDERS_FILE, 'utf8');
    const orders: Order[] = JSON.parse(content);

    // Sort by date descending and return last N
    return orders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  } catch (error: any) {
    console.error('Error reading orders:', error);
    return [];
  }
}

/**
 * Get all orders (for admin dashboard)
 */
export function getAllOrders(): Order[] {
  try {
    if (!fs.existsSync(ORDERS_FILE)) {
      return [];
    }

    const content = fs.readFileSync(ORDERS_FILE, 'utf8');
    const orders: Order[] = JSON.parse(content);

    // Sort by date descending
    return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error: any) {
    console.error('Error reading orders:', error);
    return [];
  }
}

/**
 * Update an order (for adding shipping info, changing status, etc.)
 */
export function updateOrder(orderId: string, updates: Partial<Order>): boolean {
  try {
    if (!fs.existsSync(ORDERS_FILE)) {
      return false;
    }

    const content = fs.readFileSync(ORDERS_FILE, 'utf8');
    const orders: Order[] = JSON.parse(content);

    const index = orders.findIndex(order => order.id === orderId);
    if (index === -1) {
      console.error('Order not found:', orderId);
      return false;
    }

    // Update the order
    orders[index] = {
      ...orders[index],
      ...updates,
      id: orderId // Ensure ID doesn't change
    };

    // Write back to file
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8');

    console.log('Order updated:', orderId);
    return true;
  } catch (error: any) {
    console.error('Error updating order:', error);
    return false;
  }
}

/**
 * Mark an order as shipped with tracking info
 */
export function markAsShipped(
  orderId: string,
  trackingNumber: string,
  carrier: 'colissimo' | 'chronopost' | 'other' = 'colissimo'
): boolean {
  const shipping: ShippingInfo = {
    trackingNumber,
    carrier,
    shippedAt: new Date().toISOString()
  };

  return updateOrder(orderId, {
    status: 'shipped',
    shipping
  });
}

/**
 * Mark an order as delivered
 */
export function markAsDelivered(orderId: string): boolean {
  const order = getOrder(orderId);
  if (!order) {
    return false;
  }

  const shipping: ShippingInfo = {
    ...order.shipping,
    deliveredAt: new Date().toISOString()
  };

  return updateOrder(orderId, {
    status: 'delivered',
    shipping
  });
}


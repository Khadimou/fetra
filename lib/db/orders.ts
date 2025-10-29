/**
 * Simple file-based order persistence
 * Stores orders in a JSON file for reference and debugging
 * For production, consider using a proper database (Prisma, MongoDB, etc.)
 */

import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

export interface Order {
  id: string;
  email: string;
  customerName?: string;
  amount: number;
  currency: string;
  status: string;
  items?: any[];
  createdAt: string;
  metadata?: Record<string, any>;
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


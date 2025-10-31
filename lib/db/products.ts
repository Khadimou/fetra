/**
 * Product Management with Prisma
 * Handles stock management and product CRUD operations
 */

import prisma from './prisma';
import { Product } from '@prisma/client';

/**
 * Get all products
 */
export async function getAllProducts(): Promise<Product[]> {
  return prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

/**
 * Get active products only (for customer view)
 */
export async function getActiveProducts(): Promise<Product[]> {
  return prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' }
  });
}

/**
 * Get product by ID
 */
export async function getProduct(id: string): Promise<Product | null> {
  return prisma.product.findUnique({
    where: { id }
  });
}

/**
 * Get product by SKU
 */
export async function getProductBySku(sku: string): Promise<Product | null> {
  return prisma.product.findUnique({
    where: { sku }
  });
}

/**
 * Create a new product
 */
export async function createProduct(data: {
  sku: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  lowStockThreshold?: number;
  imageUrl?: string;
  isActive?: boolean;
}): Promise<Product> {
  return prisma.product.create({
    data: {
      sku: data.sku,
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock,
      lowStockThreshold: data.lowStockThreshold ?? 10,
      imageUrl: data.imageUrl,
      isActive: data.isActive ?? true
    }
  });
}

/**
 * Update product
 */
export async function updateProduct(
  id: string,
  data: {
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    lowStockThreshold?: number;
    imageUrl?: string;
    isActive?: boolean;
  }
): Promise<Product> {
  return prisma.product.update({
    where: { id },
    data
  });
}

/**
 * Update stock quantity
 */
export async function updateStock(
  id: string,
  quantity: number
): Promise<Product> {
  return prisma.product.update({
    where: { id },
    data: { stock: quantity }
  });
}

/**
 * Increment stock (e.g., for returns)
 */
export async function incrementStock(
  id: string,
  quantity: number
): Promise<Product> {
  return prisma.product.update({
    where: { id },
    data: {
      stock: {
        increment: quantity
      }
    }
  });
}

/**
 * Decrement stock (e.g., for new orders)
 * Returns null if insufficient stock
 */
export async function decrementStock(
  id: string,
  quantity: number
): Promise<Product | null> {
  // First check if stock is sufficient
  const product = await prisma.product.findUnique({
    where: { id }
  });

  if (!product || product.stock < quantity) {
    return null;
  }

  return prisma.product.update({
    where: { id },
    data: {
      stock: {
        decrement: quantity
      }
    }
  });
}

/**
 * Check if product is in stock
 */
export async function isInStock(id: string, quantity: number = 1): Promise<boolean> {
  const product = await prisma.product.findUnique({
    where: { id },
    select: { stock: true }
  });

  return product ? product.stock >= quantity : false;
}

/**
 * Get stock status for display
 */
export function getStockStatus(stock: number, lowStockThreshold: number = 10): {
  status: 'out_of_stock' | 'low_stock' | 'in_stock';
  message: string;
  showWarning: boolean;
} {
  if (stock === 0) {
    return {
      status: 'out_of_stock',
      message: 'Stock épuisé',
      showWarning: true
    };
  }

  if (stock <= lowStockThreshold) {
    return {
      status: 'low_stock',
      message: `Il ne reste que ${stock} produit${stock > 1 ? 's' : ''}`,
      showWarning: true
    };
  }

  return {
    status: 'in_stock',
    message: 'En stock',
    showWarning: false
  };
}

/**
 * Get low stock products (for admin alerts)
 */
export async function getLowStockProducts(): Promise<Product[]> {
  return prisma.product.findMany({
    where: {
      isActive: true,
      stock: {
        lte: prisma.product.fields.lowStockThreshold
      }
    },
    orderBy: { stock: 'asc' }
  });
}

/**
 * Delete product (soft delete by marking as inactive)
 */
export async function deleteProduct(id: string): Promise<Product> {
  return prisma.product.update({
    where: { id },
    data: { isActive: false }
  });
}

/**
 * Hard delete product (permanent)
 */
export async function hardDeleteProduct(id: string): Promise<Product> {
  return prisma.product.delete({
    where: { id }
  });
}

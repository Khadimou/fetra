/**
 * Types for CJ Dropshipping API Integration
 * Used in Next.js frontend and API routes
 */

// Product Types
export interface CJProduct {
  id: string;
  pid: string;
  productNameEn: string;
  productSku: string;
  productImage: string;
  productImageList?: string[];
  productVideoUrl?: string;
  sellPrice: number;
  categoryId: string;
  categoryName?: string;
  productDescEn?: string;
  variants?: CJVariant[];
  warehouseInventoryNum?: number;
}

export interface CJVariant {
  vid: string;
  variantNameEn: string;
  variantSku: string;
  variantImage?: string;
  variantSellPrice: number;
  variantInventory?: number;
  variantWeight?: number;
  variantLength?: number;
  variantWidth?: number;
  variantHeight?: number;
}

export interface CJProductListResponse {
  list: CJProduct[];
  total: number;
  pageNum: number;
  pageSize: number;
}

// Order Types
export interface CJOrderRequest {
  orderNumber: string; // Your internal order ID
  shippingCustomerName: string;
  shippingAddress: string;
  shippingAddress2?: string;
  shippingCity: string;
  shippingProvince?: string;
  shippingCountry: string;
  shippingCountryCode: string; // ISO 2-letter code
  shippingZip: string;
  shippingPhone: string;
  email: string;
  remark?: string;
  products: CJOrderProduct[];
  logisticName?: string;
  shopAmount?: number;
}

export interface CJOrderProduct {
  vid: string; // CJ variant ID
  quantity: number;
  storeLineItemId?: string;
}

export interface CJOrderResponse {
  orderId: string; // CJ internal order ID
  orderNum: string; // Your order number
}

// Tracking Types
export interface CJTrackingInfo {
  orderId: string;
  orderNum: string;
  orderStatus: CJOrderStatus;
  trackingNumber?: string;
  logisticName?: string;
  createTime: string;
  shippingTime?: string;
  deliveredTime?: string;
  trackingEvents?: CJTrackingEvent[];
}

export interface CJTrackingEvent {
  time: string;
  status: string;
  description: string;
  location?: string;
}

export type CJOrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

// Sync Log Types
export interface CJSyncLog {
  id: string;
  syncType: 'products' | 'orders';
  status: 'started' | 'success' | 'partial' | 'failed';
  itemsProcessed: number;
  itemsCreated: number;
  itemsUpdated: number;
  itemsFailed: number;
  errorMessage?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  completedAt?: string;
  durationMs?: number;
}

// API Response Types for frontend
export interface CJSyncProductsResponse {
  success: boolean;
  message?: string;
  stats: {
    processed: number;
    created: number;
    updated: number;
    failed: number;
    errors: string[];
  };
  syncId?: string;
  duration?: string;
}

export interface CJProductSearchParams {
  keyWord?: string;
  categoryId?: string;
  page?: number;
  pageSize?: number;
  maxPages?: number;
}

export interface CJStatsResponse {
  totalProducts: number;
  totalOrders: number;
  lastSync?: string;
  orderSuccessRate: number;
}

/**
 * Types for CJ Dropshipping API Integration
 */

// Authentication Types
export interface CJAuthTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number; // seconds
  scope?: string;
}

export interface CJTokenCache {
  accessToken: string;
  expiresAt: number; // timestamp in ms
}

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
  code: number;
  result: boolean;
  message: string;
  data: {
    list: CJProduct[];
    total: number;
    pageNum: number;
    pageSize: number;
  };
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
  code: number;
  result: boolean;
  message: string;
  data: {
    orderId: string; // CJ internal order ID
    orderNum: string; // Your order number
  };
}

// Tracking Types
export interface CJTrackingInfo {
  code: number;
  result: boolean;
  message: string;
  data: {
    orderId: string;
    orderNum: string;
    orderStatus: string; // pending, processing, shipped, delivered, cancelled
    trackingNumber?: string;
    logisticName?: string;
    createTime: string;
    shippingTime?: string;
    deliveredTime?: string;
    trackingEvents?: CJTrackingEvent[];
  };
}

export interface CJTrackingEvent {
  time: string;
  status: string;
  description: string;
  location?: string;
}

// API Response Wrapper
export interface CJApiResponse<T = any> {
  code: number;
  result: boolean;
  message: string;
  data: T;
  requestId?: string;
}

/**
 * CJ Dropshipping API Client
 * Centralized API client with retry logic and error handling
 */

import { getCjAccessToken } from './auth.ts';
import {
  CJApiResponse,
  CJProductListResponse,
  CJProduct,
  CJOrderRequest,
  CJOrderResponse,
  CJTrackingInfo,
} from './types.ts';

const API_BASE_URL = 'https://developers.cjdropshipping.com/api2.0/v1';

interface RetryOptions {
  maxRetries?: number;
  backoffMs?: number;
}

/**
 * Make an authenticated API call to CJ Dropshipping
 */
async function cjApiCall<T>(
  endpoint: string,
  options: RequestInit = {},
  retryOptions: RetryOptions = {}
): Promise<CJApiResponse<T>> {
  const { maxRetries = 3, backoffMs = 1000 } = retryOptions;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const accessToken = await getCjAccessToken();
      const url = `${API_BASE_URL}${endpoint}`;

      console.log(`CJ API call: ${options.method || 'GET'} ${endpoint} (attempt ${attempt}/${maxRetries})`);

      const response = await fetch(url, {
        ...options,
        headers: {
          'CJ-Access-Token': accessToken,
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`CJ API error: ${response.status} ${errorText}`);
      }

      const data: CJApiResponse<T> = await response.json();

      // Check if the API returned an error
      if (!data.result || data.code !== 200) {
        throw new Error(`CJ API returned error: ${data.message} (code: ${data.code})`);
      }

      console.log(`CJ API call successful: ${endpoint}`);
      return data;
    } catch (error) {
      lastError = error as Error;
      console.error(`CJ API call failed (attempt ${attempt}/${maxRetries}):`, error);

      // If this is not the last attempt, wait before retrying
      if (attempt < maxRetries) {
        const delay = backoffMs * Math.pow(2, attempt - 1); // Exponential backoff
        console.log(`Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error('CJ API call failed after all retries');
}

/**
 * Get product list with filters
 */
export async function getProductList(params: {
  keyWord?: string;
  categoryId?: string;
  page?: number;
  pageSize?: number;
  startSellPrice?: number;
  endSellPrice?: number;
  countryCode?: string;
}): Promise<CJProductListResponse['data']> {
  const queryParams = new URLSearchParams();

  if (params.keyWord) queryParams.append('keyWord', params.keyWord);
  if (params.categoryId) queryParams.append('categoryId', params.categoryId);
  if (params.page) queryParams.append('page', String(params.page));
  if (params.pageSize) queryParams.append('size', String(params.pageSize));
  if (params.startSellPrice) queryParams.append('startSellPrice', String(params.startSellPrice));
  if (params.endSellPrice) queryParams.append('endSellPrice', String(params.endSellPrice));
  if (params.countryCode) queryParams.append('countryCode', params.countryCode);

  const endpoint = `/product/listV2?${queryParams.toString()}`;
  const response = await cjApiCall<CJProductListResponse['data']>(endpoint, { method: 'GET' });

  return response.data;
}

/**
 * Get detailed product information by PID or SKU
 */
export async function getProductDetails(params: {
  pid?: string;
  productSku?: string;
}): Promise<CJProduct> {
  const queryParams = new URLSearchParams();

  if (params.pid) queryParams.append('pid', params.pid);
  if (params.productSku) queryParams.append('productSku', params.productSku);

  if (!params.pid && !params.productSku) {
    throw new Error('Either pid or productSku must be provided');
  }

  const endpoint = `/product/query?${queryParams.toString()}`;
  const response = await cjApiCall<CJProduct>(endpoint, { method: 'GET' });

  return response.data;
}

/**
 * Create an order in CJ Dropshipping
 */
export async function createOrder(orderData: CJOrderRequest): Promise<CJOrderResponse['data']> {
  const endpoint = '/shopping/order/createOrderV3';
  const response = await cjApiCall<CJOrderResponse['data']>(endpoint, {
    method: 'POST',
    body: JSON.stringify(orderData),
  });

  return response.data;
}

/**
 * Query order status and tracking information
 */
export async function getOrderTracking(orderNum: string): Promise<CJTrackingInfo['data']> {
  const queryParams = new URLSearchParams({
    orderNum,
  });

  const endpoint = `/shopping/order/query?${queryParams.toString()}`;
  const response = await cjApiCall<CJTrackingInfo['data']>(endpoint, { method: 'GET' });

  return response.data;
}

/**
 * Get product inventory by PID
 */
export async function getProductInventory(pid: string): Promise<any> {
  const queryParams = new URLSearchParams({ pid });
  const endpoint = `/product/stock/getInventoryByPid?${queryParams.toString()}`;
  const response = await cjApiCall<any>(endpoint, { method: 'GET' });

  return response.data;
}

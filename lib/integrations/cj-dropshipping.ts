/**
 * CJ Dropshipping Integration for Next.js
 * Calls Supabase Edge Functions to interact with CJ API
 */

import type {
  CJProduct,
  CJProductListResponse,
  CJOrderRequest,
  CJOrderResponse,
  CJTrackingInfo,
  CJSyncProductsResponse,
  CJProductSearchParams,
} from '@/lib/types/cj';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('CJ Dropshipping: Supabase credentials not configured');
}

/**
 * Helper to call Supabase Edge Functions
 */
async function callEdgeFunction<T>(
  functionName: string,
  body?: Record<string, any>
): Promise<T> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('CJ Dropshipping integration not configured');
  }

  const url = `${SUPABASE_URL}/functions/v1/${functionName}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'apikey': SUPABASE_ANON_KEY,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Edge Function error: ${response.status} ${errorText}`);
  }

  const data = await response.json();

  if (!data.success && data.error) {
    throw new Error(data.error);
  }

  return data;
}

/**
 * Sync products from CJ Dropshipping to Supabase
 */
export async function syncCjProducts(
  params: CJProductSearchParams
): Promise<CJSyncProductsResponse> {
  return callEdgeFunction<CJSyncProductsResponse>('sync-cj-products', params);
}

/**
 * Create an order in CJ Dropshipping
 */
export async function createCjOrder(
  orderData: CJOrderRequest
): Promise<CJOrderResponse> {
  const response = await callEdgeFunction<{ success: boolean; data: CJOrderResponse }>(
    'create-cj-order',
    orderData
  );
  return response.data;
}

/**
 * Get order tracking information from CJ
 */
export async function getCjOrderTracking(
  orderNum: string
): Promise<CJTrackingInfo> {
  const response = await callEdgeFunction<{ success: boolean; data: CJTrackingInfo }>(
    'get-cj-tracking',
    { orderNum }
  );
  return response.data;
}

/**
 * Search CJ products (for mapping UI)
 * Note: This uses the sync function but doesn't save to DB
 */
export async function searchCjProducts(
  params: CJProductSearchParams
): Promise<CJProductListResponse> {
  // We'll create a dedicated search endpoint later
  // For now, we can use the sync function with a small pageSize
  const result = await syncCjProducts({
    ...params,
    maxPages: 1, // Only fetch 1 page for search
  });

  // Return empty list if sync failed
  return {
    list: [],
    total: 0,
    pageNum: params.page || 1,
    pageSize: params.pageSize || 20,
  };
}

/**
 * Check if CJ integration is configured
 */
export function isCjConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

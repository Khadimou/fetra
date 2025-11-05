/**
 * Supabase Edge Function: sync-cj-products
 * Synchronizes products from CJ Dropshipping to Supabase
 *
 * Usage:
 *   POST /sync-cj-products
 *   Body: { keyWord?: string, categoryId?: string, page?: number, pageSize?: number }
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { getProductList, getProductDetails } from '../_shared/cj-api/index.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SyncRequest {
  keyWord?: string;
  categoryId?: string;
  page?: number;
  pageSize?: number;
  maxPages?: number; // Limit how many pages to sync
}

interface SyncStats {
  processed: number;
  created: number;
  updated: number;
  failed: number;
  errors: string[];
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request
    const body: SyncRequest = await req.json();
    const {
      keyWord = 'K-Beauty', // Default search for K-Beauty products
      categoryId,
      page = 1,
      pageSize = 20,
      maxPages = 5, // Limit to 5 pages by default
    } = body;

    console.log('Starting CJ product sync:', { keyWord, categoryId, page, pageSize, maxPages });

    // Create sync log
    const { data: syncLog } = await supabase
      .from('cj_sync_logs')
      .insert({
        sync_type: 'products',
        status: 'started',
        metadata: { keyWord, categoryId, page, pageSize, maxPages },
      })
      .select()
      .single();

    const syncId = syncLog?.id;
    const startTime = Date.now();
    const stats: SyncStats = {
      processed: 0,
      created: 0,
      updated: 0,
      failed: 0,
      errors: [],
    };

    try {
      // Fetch products from CJ API (with pagination)
      let currentPage = page;
      let hasMorePages = true;

      while (hasMorePages && currentPage <= page + maxPages - 1) {
        console.log(`Fetching page ${currentPage}...`);

        const productData = await getProductList({
          keyWord,
          categoryId,
          page: currentPage,
          pageSize,
        });

        const { list: products, total } = productData;

        console.log(`Found ${products.length} products (total: ${total})`);

        // Process each product
        for (const cjProduct of products) {
          stats.processed++;

          try {
            // Map CJ product to our schema
            const productData = {
              cj_product_id: cjProduct.pid || cjProduct.id,
              name: cjProduct.productNameEn,
              description: cjProduct.productDescEn || '',
              price: cjProduct.sellPrice,
              stock: cjProduct.warehouseInventoryNum || 0,
              images: cjProduct.productImageList || [cjProduct.productImage],
              variants: cjProduct.variants || [],
              category: cjProduct.categoryName || '',
              category_id: cjProduct.categoryId || '',
              sku: cjProduct.productSku,
              updated_at: new Date().toISOString(),
            };

            // Upsert product (insert or update if exists)
            const { error } = await supabase
              .from('products')
              .upsert(productData, {
                onConflict: 'cj_product_id',
                ignoreDuplicates: false,
              });

            if (error) {
              throw error;
            }

            // Check if it was an insert or update
            const { data: existing } = await supabase
              .from('products')
              .select('created_at')
              .eq('cj_product_id', productData.cj_product_id)
              .single();

            const isNew = existing && new Date(existing.created_at).getTime() > startTime - 1000;
            if (isNew) {
              stats.created++;
            } else {
              stats.updated++;
            }

            console.log(`✓ Synced product: ${cjProduct.productNameEn} (${cjProduct.pid})`);
          } catch (error) {
            stats.failed++;
            const errorMsg = `Failed to sync product ${cjProduct.pid}: ${error.message}`;
            console.error(errorMsg);
            stats.errors.push(errorMsg);
          }
        }

        // Check if there are more pages
        const totalPages = Math.ceil(total / pageSize);
        hasMorePages = currentPage < totalPages && currentPage < page + maxPages - 1;
        currentPage++;
      }

      // Update sync log with success
      const duration = Date.now() - startTime;
      await supabase
        .from('cj_sync_logs')
        .update({
          status: stats.failed > 0 ? 'partial' : 'success',
          items_processed: stats.processed,
          items_created: stats.created,
          items_updated: stats.updated,
          items_failed: stats.failed,
          error_message: stats.errors.length > 0 ? stats.errors.join('; ') : null,
          completed_at: new Date().toISOString(),
          duration_ms: duration,
        })
        .eq('id', syncId);

      console.log('Sync completed:', stats);

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Product sync completed',
          stats,
          syncId,
          duration: `${duration}ms`,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    } catch (error) {
      // Update sync log with failure
      await supabase
        .from('cj_sync_logs')
        .update({
          status: 'failed',
          error_message: error.message,
          completed_at: new Date().toISOString(),
          duration_ms: Date.now() - startTime,
        })
        .eq('id', syncId);

      throw error;
    }
  } catch (error) {
    console.error('Error syncing products:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

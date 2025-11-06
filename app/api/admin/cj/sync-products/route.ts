/**
 * API Route: Sync products from CJ Dropshipping
 * POST /api/admin/cj/sync-products
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';
import { syncCjProducts } from '@/lib/integrations/cj-dropshipping';
import type { CJProductSearchParams } from '@/lib/types/cj';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if Supabase is configured
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.error('CJ Dropshipping: Supabase credentials not configured');
      return NextResponse.json(
        {
          success: false,
          error: 'CJ Dropshipping integration not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment variables.',
        },
        { status: 503 }
      );
    }

    // Parse request body
    const body: CJProductSearchParams = await request.json();

    // Validate params
    const {
      keyWord = 'K-Beauty',
      categoryId,
      page = 1,
      pageSize = 20,
      maxPages = 5,
    } = body;

    console.log('Syncing CJ products with params:', { keyWord, categoryId, page, pageSize, maxPages });

    // Call edge function to sync products
    const result = await syncCjProducts({
      keyWord,
      categoryId,
      page,
      pageSize,
      maxPages,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error syncing CJ products:', error);
    console.error('Error stack:', error.stack);
    
    // Provide more detailed error message
    let errorMessage = error.message || 'Failed to sync products';
    
    if (error.message?.includes('not configured')) {
      errorMessage = 'CJ Dropshipping integration not configured. Please check your environment variables.';
    } else if (error.message?.includes('Edge Function error')) {
      errorMessage = `Supabase Edge Function error: ${error.message}`;
    } else if (error.message?.includes('fetch')) {
      errorMessage = 'Failed to connect to Supabase Edge Functions. Please check your Supabase configuration.';
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

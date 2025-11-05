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
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
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
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to sync products',
      },
      { status: 500 }
    );
  }
}

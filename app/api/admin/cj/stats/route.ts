/**
 * API Route: CJ Stats
 * GET /api/admin/cj/stats - Get CJ integration statistics
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if Supabase is configured
    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      return NextResponse.json(
        { error: 'CJ integration not configured' },
        { status: 503 }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Get total products
    const { count: totalProducts } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    // Get total orders
    const { count: totalOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });

    // Get last sync log
    const { data: lastSyncLog } = await supabase
      .from('cj_sync_logs')
      .select('*')
      .eq('sync_type', 'products')
      .eq('status', 'success')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // Get recent sync logs
    const { data: recentLogs } = await supabase
      .from('cj_sync_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    // Calculate success rate for orders
    const { count: successfulOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .in('cj_order_status', ['shipped', 'delivered']);

    const orderSuccessRate = totalOrders
      ? ((successfulOrders || 0) / totalOrders) * 100
      : 0;

    return NextResponse.json({
      success: true,
      stats: {
        totalProducts: totalProducts || 0,
        totalOrders: totalOrders || 0,
        lastSync: lastSyncLog?.created_at || null,
        orderSuccessRate: Math.round(orderSuccessRate),
        recentLogs: recentLogs || [],
      },
    });
  } catch (error: any) {
    console.error('Error fetching CJ stats:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch stats',
      },
      { status: 500 }
    );
  }
}

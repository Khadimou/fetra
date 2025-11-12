import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';
import { prisma } from '@/lib/db/prisma';

/**
 * GET /api/admin/reviews
 * Get all reviews (admin only)
 */
export async function GET(request: Request) {
  // Check admin authentication
  const session = await getServerSession(authOptions);

  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json(
      { error: 'Non autorisé' },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // 'pending' | 'approved' | 'all'

    const whereClause: any = {};

    if (status === 'pending') {
      whereClause.isApproved = false;
    } else if (status === 'approved') {
      whereClause.isApproved = true;
    }

    const reviews = await prisma.review.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        customer: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    // Get stats
    const stats = {
      total: await prisma.review.count(),
      pending: await prisma.review.count({ where: { isApproved: false } }),
      approved: await prisma.review.count({ where: { isApproved: true } }),
      verified: await prisma.review.count({ where: { isVerifiedBuyer: true } })
    };

    return NextResponse.json({
      reviews,
      stats
    });
  } catch (error: any) {
    console.error('Get admin reviews error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

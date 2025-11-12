import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';

/**
 * GET /api/reviews?productSku=xxx
 * Get approved reviews for a product
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productSku = searchParams.get('productSku');

    if (!productSku) {
      return NextResponse.json(
        { error: 'Product SKU is required' },
        { status: 400 }
      );
    }

    // Get only approved reviews
    const reviews = await prisma.review.findMany({
      where: {
        productSku,
        isApproved: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        customer: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });

    // Calculate average rating
    const averageRating = reviews.length > 0
      ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
      : 0;

    return NextResponse.json({
      reviews,
      averageRating: Number(averageRating.toFixed(1)),
      totalCount: reviews.length
    });
  } catch (error: any) {
    console.error('Get reviews error:', error);
    return NextResponse.json(
      { error: 'Error fetching reviews' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/reviews
 * Create a new review
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productSku, authorName, authorEmail, rating, comment } = body;

    // Validation
    if (!productSku || !authorName || !authorEmail || !rating || !comment) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Check if user is logged in
    const session = await getServerSession(authOptions);
    let customerId: string | undefined;
    let isVerifiedBuyer = false;

    if (session?.user?.email) {
      // Find customer by email
      const customer = await prisma.customer.findUnique({
        where: { email: session.user.email },
        include: {
          orders: {
            where: {
              status: 'DELIVERED'
            },
            include: {
              items: true
            }
          }
        }
      });

      if (customer) {
        customerId = customer.id;

        // Check if customer has purchased this product
        const hasPurchased = customer.orders.some(order =>
          order.items.some(item => item.productSku === productSku)
        );

        isVerifiedBuyer = hasPurchased;
      }
    }

    // Create review (pending approval)
    const review = await prisma.review.create({
      data: {
        productSku,
        authorName,
        authorEmail: authorEmail.toLowerCase(),
        rating,
        comment,
        customerId,
        isVerifiedBuyer,
        isApproved: false // Requires admin approval
      }
    });

    return NextResponse.json({
      success: true,
      review,
      message: 'Merci pour votre avis ! Il sera publié après modération.'
    });
  } catch (error: any) {
    console.error('Create review error:', error);
    return NextResponse.json(
      { error: 'Error creating review' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/db/db';
import { verifyToken } from '@/utils/auth';

// GET handler for fetching user orders
export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    // Extract the token from the Authorization header
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the token and check if the decoded user ID matches the requested user ID
    const decodedUserId = await verifyToken(token);
    if (!decodedUserId || decodedUserId.toString() !== params.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse the user ID from the request parameters
    const userId = parseInt(params.userId);

    // Fetch orders for the user from the database
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        // Include related order items with product and variation details
        orderItems: {
          include: {
            product: true,
            variation: true,
          },
        },
        // Include shipping address and payment information
        shippingAddress: true,
        payment: true,
      },
      // Sort orders by creation date in descending order (newest first)
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Return the fetched orders as JSON response
    return NextResponse.json(orders);
  } catch (error) {
    // Log and handle any errors that occur during the process
    console.error('Failed to fetch user orders:', error);
    return NextResponse.json({ error: 'Failed to fetch user orders' }, { status: 500 });
  }
}
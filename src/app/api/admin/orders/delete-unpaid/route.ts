// /api/admin/orders/delete-unpaid/
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/db/db';
import { verifyToken } from '@/utils/auth';

// API route to delete unpaid and pending orders (Admin only)
export async function DELETE(req: NextRequest) {
  try {
    // Extract the JWT token from the Authorization header
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the token and get the userId
    const userId = await verifyToken(token);
    if (!userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Check if the user is an Administrator
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { role: true },
    });

    if (!user || user.role.name !== 'Administrator') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Delete orders that are either:
    // 1. In 'Pending' status, or
    // 2. In 'Processing' status with an unpaid payment
    const deletedOrders = await prisma.order.deleteMany({
      where: {
        OR: [
          { status: 'Pending' },
          {
            AND: [
              { status: 'Processing' },
              { payment: { status: 'unpaid' } },
            ],
          },
        ],
      },
    });

    // Return success message with the count of deleted orders
    return NextResponse.json({ message: `Deleted ${deletedOrders.count} unpaid and pending orders` });
  } catch (error) {
    // Log the error and return a 500 status code
    console.error('Failed to delete unpaid and pending orders:', error);
    return NextResponse.json({ error: 'Failed to delete unpaid and pending orders' }, { status: 500 });
  }
}
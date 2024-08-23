// /api/orders/[userId]/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/db/db';
import { verifyToken } from '@/utils/auth';

// GET method to fetch a specific order for a user
export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string; id: string } }
) {
  try {
    // Extract and verify the JWT token from the Authorization header
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the token and check if the user is authorized to access this order
    const decodedUserId = await verifyToken(token);
    if (!decodedUserId || decodedUserId.toString() !== params.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch the order from the database, including related order items
    const order = await prisma.order.findUnique({
      where: {
        id: parseInt(params.id),
        userId: parseInt(params.userId)
      },
      include: { orderItems: {
        include: {
          product: true,
          variation: true,
        }
      } }
    });

    // If the order doesn't exist, return a 404 error
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Return the order data
    return NextResponse.json(order);
  } catch (error) {
    // Log and return a generic error message if an exception occurs
    console.error('Failed to fetch order:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

// PATCH method to update the status of a specific order
export async function PATCH(
  req: NextRequest,
  { params }: { params: { userId: string; id: string } }
) {
  try {
    // Extract and verify the JWT token from the Authorization header
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the token and check if the user is authorized to update this order
    const decodedUserId = await verifyToken(token);
    if (!decodedUserId || decodedUserId.toString() !== params.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Extract the new status from the request body
    const { status } = await req.json();

    // Update the order status in the database
    const updatedOrder = await prisma.order.update({
      where: {
        id: parseInt(params.id),
        userId: parseInt(params.userId)
      },
      data: { status },
      include: { orderItems: true }
    });

    // Return the updated order data
    return NextResponse.json(updatedOrder);
  } catch (error) {
    // Log and return a generic error message if an exception occurs
    console.error('Failed to update order status:', error);
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
  }
}
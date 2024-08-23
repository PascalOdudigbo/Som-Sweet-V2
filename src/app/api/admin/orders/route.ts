// /api/admin/orders/
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/db/db';
import { verifyToken } from '@/utils/auth';

// A function to handle fetching all orders 
export async function GET(req: NextRequest) {
  try {
    // Accessing the auth tokens from the request headers
    const token = req.headers.get('Authorization')?.split(' ')[1];
    // If the token isn't found
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // Getting the user id from the token
    const userId = await verifyToken(token);
    if (!userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    // Getting the user data and role from the database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { role: true },
    });
    // If the user data isn't found or the user isn't an administrator
    if (!user || user.role.name !== 'Administrator') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Getting the orders data
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            username: true,
            email: true,
          },
        },
        orderItems: {
          include: {
            product: true,
            variation: true,
          },
        },
        shippingAddress: true,
        payment: true,
      },
    });

    // Sending the data back in JSON format
    return NextResponse.json(orders);
  } catch (error) {
    // In the eventuality of an error occuring
    console.error('Failed to fetch orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
    try {
       // Accessing the auth tokens from the request headers
      const token = req.headers.get('Authorization')?.split(' ')[1];
      if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      // Getting the user id from the token
      const decodedUserId = await verifyToken(token);
      if (!decodedUserId) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }
  
      // Getting the user data and role from the database
      const user = await prisma.user.findUnique({
        where: { id: decodedUserId },
        include: { role: true },
      });
      
      // If the user data isn't found or the user isn't an administrator
      if (!user || user.role.name !== 'Administrator') {
        return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
      }
      
      // Getting the update data from the requet 
      const { orderId, status } = await req.json();
      
      // Updating the order status
      const updatedOrder = await prisma.order.update({
        where: {
          id: orderId,
        },
        data: { status },
        include: { 
          orderItems: {
            include: {
              product: true,
              variation: true,
            }
          },
          user: {
            select: {
              username: true,
              email: true,
            }
          },
          shippingAddress: true,
          payment: true,
        }
      });
      
      // Returning the updated data as JSON
      return NextResponse.json(updatedOrder);
    } catch (error) {
      // In the eventuality of an error occuring
      console.error('Failed to update order status:', error);
      return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
    }
  }
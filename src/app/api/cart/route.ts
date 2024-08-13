// /api/cart/
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/db/db';
import { verifyToken } from '@/utils/auth';

export async function GET(req: NextRequest) {
  try {
    // Getting the access token from the request header
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      // If there's no access token 
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // Getting the User ID from the token
    const userId = await verifyToken(token);
    if (!userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    // Getting the users cart
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
            variation: true,
          },
        },
      },
    });

    // If the user is new create a cart 
    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: true,
              variation: true,
            },
          },
        },
      });
    }
    // Send the cart data back
    return NextResponse.json(cart);
  } catch (error) {
    console.error('Failed to fetch cart:', error);
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/db/db';
import { verifyToken } from '@/utils/auth';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
   // Getting the access token from the request header
   const token = req.headers.get('Authorization')?.split(' ')[1];
   if (!token) {
     // If there's no access token 
     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
   }
   // Getting the User ID from the token
   const decodedUserId = await verifyToken(token);
   if (!decodedUserId) {
     return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
   }
   // Getting the userID from the router params
    const userId = parseInt(params.userId);
    // validating the ID against the token
    if (decodedUserId !== userId){
      return NextResponse.json({ error: 'Invalid token or route' }, { status: 401 });
    }

    // Getting the user's cart
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
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
              product: {
                include: {
                  images: true,
                },
              },
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decodedUserId = await verifyToken(token);
    if (!decodedUserId || decodedUserId.toString() !== params.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = parseInt(params.userId);
    const itemId = parseInt(req.nextUrl.searchParams.get('itemId') || '');

    if (isNaN(itemId)) {
      return NextResponse.json({ error: 'Invalid item ID' }, { status: 400 });
    }

    await prisma.cartItem.delete({
      where: {
        id: itemId,
        cart: { userId: userId }
      }
    });

    const updatedCart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
            variation: true,
          },
        },
      },
    });

    return NextResponse.json(updatedCart);
  } catch (error) {
    console.error('Failed to remove item from cart:', error);
    return NextResponse.json({ error: 'Failed to remove item from cart' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decodedUserId = await verifyToken(token);
    if (!decodedUserId || decodedUserId.toString() !== params.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = parseInt(params.userId);
    const itemId = parseInt(req.nextUrl.searchParams.get('itemId') || '');
    const { quantity } = await req.json();

    if (isNaN(itemId) || isNaN(quantity) || quantity < 1) {
      return NextResponse.json({ error: 'Invalid item ID or quantity' }, { status: 400 });
    }

    await prisma.cartItem.update({
      where: {
        id: itemId,
        cart: { userId: userId }
      },
      data: { quantity }
    });

    const updatedCart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
            variation: true,
          },
        },
      },
    });

    return NextResponse.json(updatedCart);
  } catch (error) {
    console.error('Failed to update cart item quantity:', error);
    return NextResponse.json({ error: 'Failed to update cart item quantity' }, { status: 500 });
  }
}
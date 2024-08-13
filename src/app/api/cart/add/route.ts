import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/db/db';
import { verifyToken } from '@/utils/auth';

export async function POST(req: NextRequest) {
  try {
    // Verify that the user is authenticated
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // Get the user ID from the backend
    const decodedUserId = await verifyToken(token);
    const { product, variation, quantity, customText, userId } = await req.json();
    // If the user isn't logged in 
    if (!decodedUserId || decodedUserId.toString() !== userId.toString()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // get the cart from the backend
    let cart = await prisma.cart.findUnique({ where: { userId } });
    // If te cart isn't existing
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId } });
    }
    // VErifying that the item exists in the cartItem
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: product.id,
        variationId: variation?.id || null,
        customText: customText || null,
      },
    });
    // If the item exists increment the quantity
    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      // If the item doesn't exist then add it to the cartItems
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: product.id,
          variationId: variation?.id || null,
          quantity,
          customText: customText || null,
        },
      });
    }
    // Get the updated cart data 
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: true,
            variation: true,
          },
        },
      },
    });
    // Return the updated cart data
    return NextResponse.json(updatedCart);
  } catch (error) {
    console.error('Failed to add item to cart:', error);
    return NextResponse.json({ error: 'Failed to add item to cart' }, { status: 500 });
  }
}
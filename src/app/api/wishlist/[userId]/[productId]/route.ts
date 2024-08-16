// /api/wishlist/[userId]/[productId]
import { NextRequest, NextResponse } from "next/server";
import prisma from '@/db/db'
import { verifyToken } from '@/utils/auth'

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest, {params}: {params: {userId: string, productId: string }}) {
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
      // GEtting the productID frim the router params
      const productId = parseInt(params.productId)
      // validating the ID against the token
      if (decodedUserId !== userId) {
          return NextResponse.json({ error: 'Invalid token or route' }, { status: 401 });
      }
      const wishlistItem = await prisma.userWishlist.create({
        data: {
          userId,
          productId,
        },
      });
  
      return NextResponse.json(wishlistItem);
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
      return NextResponse.json({ error: 'Failed to add to wishlist' }, { status: 500 });
    }
  }

export async function DELETE( req: NextRequest, {params}: {params: {userId: string, productId: string }}) {
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
        // GEtting the productID frim the router params
        const productId = parseInt(params.productId)
        // validating the ID against the token
        if (decodedUserId !== userId) {
            return NextResponse.json({ error: 'Invalid token or route' }, { status: 401 });
        }

        await prisma.userWishlist.delete({
            where: {
              userId_productId: {
                userId: userId,
                productId: productId
              }
            }
          });
          return NextResponse.json({ message: 'Item removed from wishlist' });
    }catch (error) {
        console.error('Failed to removed item from wishlist:', error);
        return NextResponse.json({ error: 'Failed to removed item from wishlist' }, { status: 500 });
      }

}
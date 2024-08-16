import { NextRequest, NextResponse } from "next/server";
import prisma from '@/db/db'
import { verifyToken } from '@/utils/auth'

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { userId: string} }) {
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
        if (decodedUserId !== userId) {
            return NextResponse.json({ error: 'Invalid token or route' }, { status: 401 });
        }
        // Get the wishlist data
        const wishlist = await prisma.userWishlist.findMany({
            where: { userId: userId },
            include: {
                product: {
                    include: {
                        category: true,
                        images: true,
                        discounts: {
                            include: {
                                discount: true
                            }
                        },
                    }

                }
            }
        });

        // Send the wishlist data back
        return NextResponse.json(wishlist);

    } catch (error) {
        console.error('Failed to fetch wishlist:', error);
        return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 });
    }

}

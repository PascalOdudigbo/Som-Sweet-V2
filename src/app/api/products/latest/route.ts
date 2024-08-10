import { NextResponse } from 'next/server';
import db from '@/db/db';

export async function GET() {
  try {
    const limit = 6; // Set a default limit

    const latestProducts = await db.product.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        category: true,
        images: true,
        variations: true,
      }
    });

    return NextResponse.json(latestProducts);
  } catch (error) {
    console.error('Failed to fetch latest products:', error);
    return NextResponse.json({ error: 'Failed to fetch latest products' }, { status: 500 });
  }
}
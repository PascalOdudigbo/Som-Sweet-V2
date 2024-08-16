// /api/admin/dashboard/product
import { NextResponse } from 'next/server';
import { getProductStats } from '@/utils/adminDashboard';

export async function GET() {
  try {
     // Calling the getProductStats util function
    const productData = await getProductStats();
    // Returning the product data
    return NextResponse.json(productData);
  } catch (error) {
    console.error('Failed to fetch product statistics:', error);
    return NextResponse.json({ error: 'Failed to fetch product statistics' }, { status: 500 });
  }
}
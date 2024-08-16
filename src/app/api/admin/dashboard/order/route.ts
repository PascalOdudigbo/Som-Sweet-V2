// /api/admin/dashboard/order
import { NextResponse } from 'next/server';
import { getOrderStats } from '@/utils/adminDashboard';

export async function GET() {
  try {
    // Calling the getOrderStats util function
    const orderData = await getOrderStats();
    // Returning the order data 
    return NextResponse.json(orderData);
  } catch (error) {
    console.error('Failed to fetch order statistics:', error);
    return NextResponse.json({ error: 'Failed to fetch order statistics' }, { status: 500 });
  }
}
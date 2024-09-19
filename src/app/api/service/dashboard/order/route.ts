import { NextResponse } from 'next/server';
import { verifyToken } from '@/utils/auth';
import { getOrderStats } from '@/utils/serviceProviderDashboard';

export async function GET(req: Request) {
  try {
    // Fetch order statistics
    const orderData = await getOrderStats();
    return NextResponse.json(orderData);
  } catch (error) {
    console.error('Failed to fetch order statistics:', error);
    return NextResponse.json({ error: 'Failed to fetch order statistics' }, { status: 500 });
  }
}
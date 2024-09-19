import { NextResponse } from 'next/server';
import { getRefundStats } from '@/utils/serviceProviderDashboard';

export async function GET(req: Request) {
  try {
    // Fetch refund statistics
    const refundData = await getRefundStats();
    return NextResponse.json(refundData);
  } catch (error) {
    console.error('Failed to fetch refund statistics:', error);
    return NextResponse.json({ error: 'Failed to fetch refund statistics' }, { status: 500 });
  }
}
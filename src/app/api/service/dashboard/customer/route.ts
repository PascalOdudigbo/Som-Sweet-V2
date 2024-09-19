import { NextResponse } from 'next/server';
import { verifyToken } from '@/utils/auth';
import { getCustomerStats } from '@/utils/serviceProviderDashboard';

export async function GET(req: Request) {
  try {
    // Fetch customer statistics
    const customerData = await getCustomerStats();
    return NextResponse.json(customerData);
  } catch (error) {
    console.error('Failed to fetch customer statistics:', error);
    return NextResponse.json({ error: 'Failed to fetch customer statistics' }, { status: 500 });
  }
}
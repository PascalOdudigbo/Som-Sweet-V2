// /api/admin/dashboard/salesOverview
import { NextResponse } from 'next/server';
import { getSalesOverview } from '@/utils/adminDashboard';

export async function GET() {
  try {
     // Calling the getSalesOverview util function
    const salesOverview = await getSalesOverview();
     // Returning the sales data 
    return NextResponse.json(salesOverview);
  } catch (error) {
    console.error('Failed to fetch sales overview data:', error);
    return NextResponse.json({ error: 'Failed to fetch sales overview data' }, { status: 500 });
  }
}
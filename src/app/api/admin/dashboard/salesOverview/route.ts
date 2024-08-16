// /api/admin/dashboard/salesOverview
import { NextResponse } from 'next/server';
import { getSalesOverview } from '@/utils/adminDashboard';

export async function GET() {
  try {
    const salesOverview = await getSalesOverview();
    return NextResponse.json(salesOverview);
  } catch (error) {
    console.error('Failed to fetch sales overview data:', error);
    // Return fallback data with a 200 status, but include an error flag
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const fallbackData = Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      return {
        month: `${monthNames[d.getMonth()]} ${d.getFullYear()}`,
        sales: 0
      };
    }).reverse();
    return NextResponse.json({ data: fallbackData, error: true });
  }
}
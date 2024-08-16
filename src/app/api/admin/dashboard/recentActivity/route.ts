// api/admin/dashboard/recentActivity
import { NextResponse } from 'next/server';
import { getRecentActivity } from '@/utils/adminDashboard';

export async function GET() {
  try {
     // Calling the getStaffStats util function
    const recentActivity = await getRecentActivity();
    // Returning the recent activity data 
    return NextResponse.json(recentActivity);
  } catch (error) {
    console.error('Failed to fetch recent activity data:', error);
    return NextResponse.json({ error: 'Failed to fetch recent activity data' }, { status: 500 });
  }
}
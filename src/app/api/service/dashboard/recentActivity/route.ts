import { NextResponse } from 'next/server';
import { verifyToken } from '@/utils/auth';
import { getRecentActivity } from '@/utils/serviceProviderDashboard';

export async function GET(req: Request) {
  try {
    // Fetch recent activity data
    const recentActivityData = await getRecentActivity();
    return NextResponse.json(recentActivityData);
  } catch (error) {
    console.error('Failed to fetch recent activity data:', error);
    return NextResponse.json({ error: 'Failed to fetch recent activity data' }, { status: 500 });
  }
}
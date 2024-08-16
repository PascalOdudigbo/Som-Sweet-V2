// /api/admin/dashboard/offer

import { NextResponse } from 'next/server';
import { getOfferStats } from '@/utils/adminDashboard';

export async function GET() {
  try {
    // Calling the getOfferStats util function 
    const offerData = await getOfferStats();
    // Returning the offer data 
    return NextResponse.json(offerData);
  } catch (error) {
    console.error('Failed to fetch offers statistics:', error);
    return NextResponse.json({ error: 'Failed to fetch offers statistics' }, { status: 500 });
  }
}

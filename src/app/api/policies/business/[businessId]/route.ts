// /api/policies/business/[businessId]

import { NextResponse } from 'next/server';
import db from '@/db/db';

export async function GET(request: Request, { params }: { params: { businessId: string } }) {
  try {
    const policies = await db.policy.findMany({
      where: { businessId: parseInt(params.businessId) },
      orderBy: { id: 'asc' }
    });
    
    return NextResponse.json(policies);
  } catch (error) {
    console.error('Failed to fetch business policies:', error);
    return NextResponse.json({ error: 'Failed to fetch business policies' }, { status: 500 });
  }
}
// /api/policies/

import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/db/db';
import { verifyToken } from '@/utils/auth';

export async function GET() {
  try {
    const policies = await prisma.policy.findMany({
      orderBy: { id: 'asc' }
    });
    return NextResponse.json(policies);
  } catch (error) {
    console.error('Failed to fetch policies:', error);
    return NextResponse.json({ error: 'Failed to fetch policies' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = await verifyToken(token);
    if (!userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Verify admin role
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { role: true }
    });

    if (!user || user.role.name !== 'Administrator') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Get the business ID (assuming one business per system)
    const business = await prisma.business.findFirst();
    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    const data = await req.json();
    const newPolicy = await prisma.policy.create({
      data: {
        ...data,
        businessId: business.id
      }
    });
    
    return NextResponse.json(newPolicy, { status: 201 });
  } catch (error) {
    console.error('Failed to create policy:', error);
    return NextResponse.json({ error: 'Failed to create policy' }, { status: 500 });
  }
}

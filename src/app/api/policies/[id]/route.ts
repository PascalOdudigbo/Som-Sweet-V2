// /api/policies/[id]/

import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/db/db';
import { verifyToken } from '@/utils/auth';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const policy = await prisma.policy.findUnique({
      where: { id: parseInt(params.id) }
    });
    
    if (policy) {
      return NextResponse.json(policy);
    } else {
      return NextResponse.json({ error: 'Policy not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Failed to fetch policy:', error);
    return NextResponse.json({ error: 'Failed to fetch policy' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
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

    // Check if policy exists
    const existingPolicy = await prisma.policy.findUnique({
      where: { id: parseInt(params.id) }
    });

    if (!existingPolicy) {
      return NextResponse.json({ error: 'Policy not found' }, { status: 404 });
    }

    const data = await req.json();
    const updatedPolicy = await prisma.policy.update({
      where: { id: parseInt(params.id) },
      data
    });
    
    return NextResponse.json(updatedPolicy);
  } catch (error) {
    console.error('Failed to update policy:', error);
    return NextResponse.json({ error: 'Failed to update policy' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
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

    // Check if it's a system policy
    const policy = await prisma.policy.findUnique({
      where: { id: parseInt(params.id) }
    });

    if (!policy) {
      return NextResponse.json({ error: 'Policy not found' }, { status: 404 });
    }

    if (['Refund Policy', 'Shipping Policy', 'Privacy Policy'].includes(policy.title)) {
      return NextResponse.json({ error: 'Cannot delete system policies' }, { status: 403 });
    }

    await prisma.policy.delete({
      where: { id: parseInt(params.id) }
    });
    
    return NextResponse.json({ message: 'Policy deleted successfully' });
  } catch (error) {
    console.error('Failed to delete policy:', error);
    return NextResponse.json({ error: 'Failed to delete policy' }, { status: 500 });
  }
}

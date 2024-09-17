// /api/refunds/[refundId]/approve/

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/db/db';
import { verifyToken } from '@/utils/auth';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(req: NextRequest, { params }: { params: { refundId: string } }) {
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decodedUserId = await verifyToken(token);
    if (!decodedUserId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const refundId = parseInt(params.refundId);
    const refund = await prisma.refund.findUnique({
      where: { id: refundId },
      include: { 
        order: { 
          include: { 
            payment: true 
          } 
        } 
      },
    });

    if (!refund) {
      return NextResponse.json({ error: 'Refund not found' }, { status: 404 });
    }

    if (refund.status !== 'Pending') {
      return NextResponse.json({ error: 'Refund is not in a pending state' }, { status: 400 });
    }

    if (!refund.order.payment || !refund.order.payment.stripePaymentId) {
      return NextResponse.json({ error: 'No associated payment found' }, { status: 400 });
    }

    // Process refund in Stripe
    const stripeRefund = await stripe.refunds.create({
      payment_intent: refund.order.payment.stripePaymentId,
      amount: Math.round(refund.amount * 100), // Convert to cents
    });

    // Update refund status in database
    const updatedRefund = await prisma.refund.update({
      where: { id: refundId },
      data: {
        status: 'Approved',
        stripeRefundId: stripeRefund.id,
        approvedBy: decodedUserId,
        approvedAt: new Date(),
      },
    });

    return NextResponse.json(updatedRefund);
  } catch (error) {
    console.error('Failed to approve refund:', error);
    return NextResponse.json({ error: 'Failed to approve refund', details: (error as Error).message }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { verifyToken } from '@/utils/auth';
import prisma from '@/db/db';

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(req: NextRequest) {
  try {
    // Extract and verify the authorization token
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = await verifyToken(token);
    const { cart } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user from database
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate total amount from cart items
    const amount = cart.items.reduce((total: number, item: any) =>
      total + item.quantity * (item.variation?.price || item.product.basePrice), 0
    );

    let stripeCustomerId = user.stripeCustomerId;
    // Check for existing Stripe customer with the user's email
    const existingCustomers = await stripe.customers.list({
      email: user.email,
      limit: 1,
    });

    if (!stripeCustomerId) {
      if (existingCustomers.data.length > 0) {
        // Use existing Stripe customer if found
        stripeCustomerId = existingCustomers.data[0].id;
      } else {
        // Create new Stripe customer if not found
        const newCustomer = await stripe.customers.create({
          email: user.email,
          metadata: { userId: user.id.toString() },
        });
        stripeCustomerId = newCustomer.id;
      }

      // Update user in database with Stripe customer ID
      if (user.stripeCustomerId !== stripeCustomerId) {
        await prisma.user.update({
          where: { id: userId },
          data: { stripeCustomerId },
        });
      }
    }

    // Create a new payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'gbp',
      customer: stripeCustomerId,
      metadata: { userId: userId.toString() },
    });

    // Return the client secret and payment intent ID
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Failed to create payment intent:', error);
    return NextResponse.json({ error: 'Failed to create payment intent' }, { status: 500 });
  }
}
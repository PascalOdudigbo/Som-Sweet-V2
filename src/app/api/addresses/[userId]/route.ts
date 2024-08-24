import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/db/db';
import { verifyToken } from '@/utils/auth';

// GET handler to fetch addresses for a specific user
export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    // Extract the token from the Authorization header
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the token and check if it matches the requested userId
    const decodedUserId = await verifyToken(token);
    if (!decodedUserId || decodedUserId.toString() !== params.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Convert userId to number
    const userId = parseInt(params.userId);

    // Fetch addresses for the user from the database
    const addresses = await prisma.address.findMany({
      where: { userId },
      include:{
        orders: true
      }
    });

    // Return the addresses as JSON response
    return NextResponse.json(addresses);
  } catch (error) {
    // Log and return error if fetching addresses fails
    console.error('Failed to fetch addresses:', error);
    return NextResponse.json({ error: 'Failed to fetch addresses' }, { status: 500 });
  }
}

// POST handler to create a new address for a user
export async function POST(req: NextRequest) {
  try {
    // Extract the token from the Authorization header
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the token
    const decodedUserId = await verifyToken(token);
    // Parse the address data from the request body
    const addressData = await req.json();

    // Check if the decoded user ID matches the user ID in the address data
    if (!decodedUserId || decodedUserId.toString() !== addressData.userId.toString()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Create a new address in the database
    const newAddress = await prisma.address.create({
      data: addressData,
    });

    // Return the newly created address as JSON response
    return NextResponse.json(newAddress);
  } catch (error) {
    // Log and return error if creating address fails
    console.error('Failed to create address:', error);
    return NextResponse.json({ error: 'Failed to create address' }, { status: 500 });
  }
}
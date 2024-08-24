import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/db/db';
import { verifyToken } from '@/utils/auth';

// GET handler for fetching a specific address
export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string; id: string } }
) {
  try {
    // Extract the JWT token from the Authorization header
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the token and get the userId
    const decodedUserId = await verifyToken(token);
    if (!decodedUserId || decodedUserId.toString() !== params.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse the userId and addressId from the route parameters
    const userId = parseInt(params.userId);
    const addressId = parseInt(params.id);

    // Fetch the address from the database
    const address = await prisma.address.findUnique({
      where: {
        id: addressId,
        userId: userId,
      },
    });

    // If the address is not found, return a 404 error
    if (!address) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    // Return the address data
    return NextResponse.json(address);
  } catch (error) {
    // Log the error and return a 500 error response
    console.error('Failed to fetch address:', error);
    return NextResponse.json({ error: 'Failed to fetch address' }, { status: 500 });
  }
}

// PATCH handler to update an existing address
export async function PATCH(
    req: NextRequest,
    { params }: { params: { userId: string; id: string } }
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
  
      // Parse the updated address data from the request body
      const addressData = await req.json();
  
      // Convert userId and addressId to numbers
      const userId = parseInt(params.userId);
      const addressId = parseInt(params.id);
  
      // Update the address in the database
      const updatedAddress = await prisma.address.update({
        where: { id: addressId, userId: userId },
        data: addressData,
      });
  
      // Return the updated address as JSON response
      return NextResponse.json(updatedAddress);
    } catch (error) {
      // Log and return error if updating address fails
      console.error('Failed to update address:', error);
      return NextResponse.json({ error: 'Failed to update address' }, { status: 500 });
    }
  }
  
  // DELETE handler to remove an address
  export async function DELETE(
    req: NextRequest,
    { params }: { params: { userId: string; id: string } }
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
  
      // Convert userId and addressId to numbers
      const userId = parseInt(params.userId);
      const addressId = parseInt(params.id);
  
      // Delete the address from the database
      await prisma.address.delete({
        where: { id: addressId, userId: userId },
      });
  
      // Return a success message
      return NextResponse.json({ message: 'Address deleted successfully' });
    } catch (error) {
      // Log and return error if deleting address fails
      console.error('Failed to delete address:', error);
      return NextResponse.json({ error: 'Failed to delete address' }, { status: 500 });
    }
  }
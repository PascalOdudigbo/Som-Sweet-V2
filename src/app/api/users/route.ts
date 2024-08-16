// /api/users/
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/db/db';
import { verifyToken } from '@/utils/auth';
import bcrypt from 'bcryptjs';

export async function GET(req: NextRequest) {
  try {
    // Get the auth token from the request header
    const token = req.headers.get('Authorization')?.split(' ')[1];
    // If the user isn't authenticated
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // Getting the user ID
    const decodedUserId = await verifyToken(token);
    // If the user ID isn't in the token
    if (!decodedUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // Getting all the user data
    const user = await prisma.user.findUnique({
      where: { id: decodedUserId },
      include: {
        role: true,
        addresses: true,
        orders: {
          include: {
            orderItems: {
              include: {
                product: {
                  include: {
                    images: true,
                  },
                },
                variation: true,
              },
            },
            shippingAddress: true,
            payment: true,
          },
        },
        reviews: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
          },
        },
        wishlist: true,
        cart: {
          include: {
            items: {
              include: {
                product: {
                  include: {
                    images: true,
                  },
                },
                variation: true,
              },
            },
          },
        },
      },
    });

    // If the user data couldn't be obtained
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Remove sensitive information
    const { password, ...userWithoutPassword } = user;
    // returning the user data 
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

// A function for creating a new user
export async function POST(req: NextRequest) {
  try {
    // getting the relevant data from the request body
    const { username, email, password, roleId } = await req.json();

    // checking the database for an exixting similar user
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] },
    });
    // If the user exists
    if (existingUser) {
      return NextResponse.json({ error: 'Username or email already exists' }, { status: 400 });
    }
    // hashing the user password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Creating the new user
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        roleId,
        active: true,
      },
      include: {
        role: true,
      },
    });

    // Remove sensitive information
    const { password: _, ...newUserWithoutPassword } = newUser;
    // returning the user data 
    return NextResponse.json(newUserWithoutPassword);
  } catch (error) {
    console.error('Failed to create user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
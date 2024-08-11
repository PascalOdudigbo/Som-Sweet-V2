// /api/users/[id]/reset-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/db/db';
import bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Getting the user id and password
    const userId = parseInt(params.id);
    const { password } = await req.json();
    // If the password isn't in the request body
    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }
    // If the userID 
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user id' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
      select: {
        id: true,
        username: true,
        email: true,
        roleId: true,
        active: true,
        createdAt: true,
        updatedAt: true,
        role: {
          select: {
            name: true
          }
        }
      },
    });

    return NextResponse.json({ updatedUser });
  } catch (error) {
    console.error('Failed to update user:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
    }
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
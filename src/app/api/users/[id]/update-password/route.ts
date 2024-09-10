// /api/users/[id]/update-password/route.ts
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
    const { password, newPassword } = await req.json();
    // If the password isn't in the request body
    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }
    // If the userID 
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user id' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    const user = await prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        id: true,
        username: true,
        email: true,
        password: true
      }
    })
    if (user && await bcrypt.compare(password, user.password)) {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { password: newPasswordHash },
        select: {
          id: true,
          username: true,
          email: true,
        },
      });

      return NextResponse.json({ updatedUser });
    }
    else {
      return NextResponse.json({ error: 'Invalid password, update failed!' }, { status: 400 });
    }

  
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
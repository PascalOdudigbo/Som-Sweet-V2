// /api/users/recover
import { NextResponse } from 'next/server';
import db from '@/db/db';

export async function POST(request: Request) {
    try {
        // Get the email from the request body
        const { email } = await request.json()

        // Check if the email is valid
        const user = await db.user.findUnique({
            where: { email },
        });

        if (!user) {
            // If user doesn't exist
            return NextResponse.json({ error: "Account not found!" }, { status: 404 })
        }

        // Return the user data without the password 
        const { password: _, ...userWithoutPassword } = user
        return NextResponse.json({
            user: userWithoutPassword
        }, { status: 200 })
    }
    catch (error) {
        // In the case of an error
        console.error("Account recovery failed", error);
        return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
    }
}
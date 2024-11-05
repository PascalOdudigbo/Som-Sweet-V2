// /api/admin/business
import { NextRequest, NextResponse } from "next/server";
import prisma from '@/db/db'
import { verifyToken } from "@/utils/auth";

export async function GET(req: NextRequest) {
    try {
        // Getting the business data
        const business = await prisma.business.findFirst({
            include: {
                policies: true,
                socialLinks: true,
            },
            orderBy: {
                id: 'desc'
            },
        });

        // Sending the business data back in JSON format
        return NextResponse.json(business)
    } catch (error) {
        // In the eventuality of an error occuring
        console.error('Failed to fetch business data')
        return NextResponse.error()
    }
}

export async function PATCH(req: NextRequest) {
    try {
        // Accessing the auth tokens from the request headers
        const token = req.headers.get('Authorization')?.split(' ')[1]
        // If theres no access token deny access
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        // Getting the user id from the token
        const decodedUserId = await verifyToken(token);
        if (!decodedUserId) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        // Getting the user data and role from the database
        const user = await prisma.user.findUnique({
            where: { id: decodedUserId },
            include: { role: true },
        });

        // If the user data isn't found or the user isn't an administrator
        if (!user || user.role.name !== 'Administrator') {
            return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
        }

        // Get the request body data
        const data = await req.json();

        // Getting the business data
        const business = await prisma.business.findFirst({
            orderBy: {
                id: 'desc'
            }
        });

        // If there is no business data, create one
        if (!business) {
            const newBusiness = await prisma.business.create({
                data: {
                    name: data.name,
                    description: data.description,
                    phone: data.phone,
                    email: data.email,
                    address: data.address,
                },
                include: {
                    socialLinks: true,
                    policies: true
                }
            });

            return NextResponse.json(newBusiness);
        }

        // If business data exists, update it
        const updatedBusiness = await prisma.business.update({
            where: {
                id: business.id
            },
            data: {
                name: data.name,
                description: data.description,
                phone: data.phone,
                email: data.email,
                address: data.address,
            },
            include: {
                socialLinks: true,
                policies: true
            }
        });

        return NextResponse.json(updatedBusiness);

    } catch (error) {
        // In the eventuality of an error occurring
        console.error('Failed to update business data:', error);
        return NextResponse.json(
            { error: 'Failed to update business data' }, 
            { status: 500 }
        );
    }
}
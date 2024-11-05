// /api/admin/socials
import { NextRequest, NextResponse } from "next/server"
import prisma from "@/db/db"
import { verifyToken } from "@/utils/auth"
import { SocialMediaType } from "@/utils/allModelTypes";



export async function GET(req: NextRequest) {
    try {
        // Getting the socials data
        const socials = await prisma.socialMedia.findMany()
        return NextResponse.json(socials)
    } catch (error) {
        console.error("Failed to fetch socials")
        return NextResponse.json({ error: "Failed to fetch socials" })
    }
}

export async function PATCH(req: NextRequest) {
    try {
        // Accessing the auth tokens from the request headers
        const token = req.headers.get('Authorization')?.split(' ')[1];
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

        // Getting the update data from the request 
        const { socialsData } = await req.json();

        // Getting the business data
        const business = await prisma.business.findFirst({
            orderBy: {
                id: 'desc'
            },
            include: {
                socialLinks: true
            }
        });

        // If there's no business return an error message
        if (!business) {
            return NextResponse.json({ error: 'No business data exists, Socials not updated!' }, { status: 403 });
        }

        // If no existing social links
        if (!business.socialLinks.length) {
            // Create all social links at once using createMany
            const newSocials = await prisma.socialMedia.createMany({
                data: socialsData.map((socialLink: SocialMediaType) => ({
                    businessId: business.id,
                    name: socialLink.name,
                    url: socialLink.url
                }))
            });

            // Fetch and return the newly created socials
            const createdSocials = await prisma.socialMedia.findMany({
                where: {
                    businessId: business.id
                }
            });

            return NextResponse.json(createdSocials);
        } else {
            // Update existing social links
            const updatePromises = socialsData.map((socialLink: SocialMediaType) => {
                const existingSocial = business.socialLinks.find(
                    social => social.name.toLowerCase() === socialLink.name.toLowerCase()
                );

                if (existingSocial) {
                    // Update existing social link
                    return prisma.socialMedia.update({
                        where: {
                            id: existingSocial.id
                        },
                        data: {
                            url: socialLink.url
                        }
                    });
                } else {
                    // Create new social link if it doesn't exist
                    return prisma.socialMedia.create({
                        data: {
                            businessId: business.id,
                            name: socialLink.name,
                            url: socialLink.url
                        }
                    });
                }
            });

            // Execute all updates in parallel
            const updatedSocials = await Promise.all(updatePromises);

            return NextResponse.json(updatedSocials);
        }

    } catch (error) {
        // In the eventuality of an error occurring
        console.error('Failed to update social links:', error);
        return NextResponse.json({ error: 'Failed to update social links' }, { status: 500 });
    }
}
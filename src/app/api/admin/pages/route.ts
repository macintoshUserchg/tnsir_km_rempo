import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth'; // Assuming auth options are exported

export async function POST(req: NextRequest) {
    // TODO: Add authentication check
    // const session = await getServerSession(authOptions);
    // if (!session) {
    //     return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    // }

    try {
        const body = await req.json();
        const { titleHi, titleEn, slug, seoTitle, seoDesc, isPublished, typography } = body;

        // Basic validation
        if (!titleHi || !slug) {
            return NextResponse.json(
                { message: 'Title (Hindi) and Slug are required' },
                { status: 400 }
            );
        }

        // Check if slug exists
        const existingPage = await prisma.page.findUnique({
            where: { slug }
        });

        if (existingPage) {
            return NextResponse.json(
                { message: 'Slug already exists' },
                { status: 409 }
            );
        }

        const page = await prisma.page.create({
            data: {
                titleHi,
                titleEn,
                slug,
                seoTitle,
                seoDesc,
                isPublished,
                typography,
            }
        });

        return NextResponse.json(page, { status: 201 });
    } catch (error) {
        console.error('Error creating page:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

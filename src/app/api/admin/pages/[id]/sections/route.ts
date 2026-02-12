import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idStr } = await params;
        const pageId = parseInt(idStr);
        if (isNaN(pageId)) {
            return NextResponse.json({ message: 'Invalid Page ID' }, { status: 400 });
        }

        const body = await req.json();
        const { type } = body;

        if (!type) {
            return NextResponse.json({ message: 'Type is required' }, { status: 400 });
        }

        // Get max order
        const lastSection = await prisma.pageSection.findFirst({
            where: { pageId },
            orderBy: { order: 'desc' }
        });

        const newOrder = (lastSection?.order ?? -1) + 1;

        // Default content based on type
        let defaultContent = {};
        if (type === 'HERO') defaultContent = { titleHi: 'New Hero', titleEn: 'New Hero', imageUrl: '' };
        if (type === 'RICHTEXT') defaultContent = { htmlHi: '<p>Content...</p>', htmlEn: '<p>Content...</p>' };

        const section = await prisma.pageSection.create({
            data: {
                pageId,
                type,
                order: newOrder,
                content: defaultContent,
                isVisible: true
            }
        });

        return NextResponse.json(section, { status: 201 });
    } catch (error) {
        console.error('Error creating section:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

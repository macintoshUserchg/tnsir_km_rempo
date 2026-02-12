import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idStr } = await params;
        const id = parseInt(idStr); // Section ID to move
        if (isNaN(id)) {
            return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
        }

        const body = await req.json();
        const { direction } = body; // 'UP' or 'DOWN'

        const section = await prisma.pageSection.findUnique({
            where: { id }
        });

        if (!section) {
            return NextResponse.json({ message: 'Section not found' }, { status: 404 });
        }

        // Find adjacent section
        const adjacentSection = await prisma.pageSection.findFirst({
            where: {
                pageId: section.pageId,
                order: direction === 'UP'
                    ? { lt: section.order }
                    : { gt: section.order }
            },
            orderBy: {
                order: direction === 'UP' ? 'desc' : 'asc'
            }
        });

        if (adjacentSection) {
            // Swap orders
            // Use transaction to ensure consistency
            await prisma.$transaction([
                prisma.pageSection.update({
                    where: { id: section.id },
                    data: { order: adjacentSection.order }
                }),
                prisma.pageSection.update({
                    where: { id: adjacentSection.id },
                    data: { order: section.order }
                })
            ]);
        }

        return NextResponse.json({ message: 'Moved successfully' });
    } catch (error) {
        console.error('Error moving section:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idStr } = await params;
        const id = parseInt(idStr);
        if (isNaN(id)) {
            return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
        }

        const body = await req.json();
        const { content, isVisible } = body;

        const section = await prisma.pageSection.update({
            where: { id },
            data: {
                content,
                isVisible // Optional update
            }
        });

        return NextResponse.json(section);
    } catch (error) {
        console.error('Error updating section:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idStr } = await params;
        const id = parseInt(idStr);
        if (isNaN(id)) {
            return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
        }

        await prisma.pageSection.delete({
            where: { id }
        });

        return NextResponse.json({ message: 'Section deleted' });
    } catch (error) {
        console.error('Error deleting section:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

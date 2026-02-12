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
        // Extract fields to update
        const { labelHi, labelEn, url, position, parentId, isVisible, order } = body;

        const menu = await prisma.menu.update({
            where: { id },
            data: {
                labelHi,
                labelEn,
                url,
                position,
                parentId,
                isVisible,
                order
            }
        });

        return NextResponse.json(menu);
    } catch (error) {
        console.error('Error updating menu:', error);
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

        // Prisma handles cascading delete if configured, or we might need to delete children manually.
        // Schema says: parent Menu? @relation("MenuHierarchy", fields: [parentId], references: [id])
        // It does NOT have onDelete: Cascade. 
        // So we should delete children first or update schema.
        // For now, let's delete children recursively or fail safely.

        // Actually best is to delete children manually or update schema.
        // Let's check for children.
        const children = await prisma.menu.findMany({ where: { parentId: id } });
        if (children.length > 0) {
            // Delete children first
            await prisma.menu.deleteMany({ where: { parentId: id } });
        }

        await prisma.menu.delete({
            where: { id }
        });

        return NextResponse.json({ message: 'Menu deleted successfully' });
    } catch (error) {
        console.error('Error deleting menu:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

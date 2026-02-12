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
        const { titleHi, titleEn, slug, seoTitle, seoDesc, isPublished, typography } = body;

        // Check availability of slug if changed
        if (slug) {
            const existingPage = await prisma.page.findFirst({
                where: {
                    slug,
                    id: { not: id }
                }
            });

            if (existingPage) {
                return NextResponse.json(
                    { message: 'Slug already exists' },
                    { status: 409 }
                );
            }
        }

        const page = await prisma.page.update({
            where: { id },
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

        return NextResponse.json(page);
    } catch (error) {
        console.error('Error updating page:', error);
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

        await prisma.page.delete({
            where: { id }
        });

        return NextResponse.json({ message: 'Page deleted successfully' });
    } catch (error) {
        console.error('Error deleting page:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

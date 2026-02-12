import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

interface RouteProps {
    params: Promise<{
        id: string;
    }>;
}

export async function PUT(req: NextRequest, props: RouteProps) {
    const params = await props.params;
    try {
        const id = parseInt(params.id);
        const body = await req.json();
        const { captionHi, captionEn } = body;

        const photo = await prisma.galleryPhoto.update({
            where: { id },
            data: {
                captionHi,
                captionEn,
            }
        });

        return NextResponse.json(photo);
    } catch (error) {
        console.error('Error updating photo:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest, props: RouteProps) {
    const params = await props.params;
    try {
        const id = parseInt(params.id);
        await prisma.galleryPhoto.delete({
            where: { id }
        });

        return NextResponse.json(
            { message: 'Photo deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting photo:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

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
        const { titleHi, titleEn, description, coverImage } = body;

        const album = await prisma.galleryAlbum.update({
            where: { id },
            data: {
                titleHi,
                titleEn,
                description,
                coverImage,
            }
        });

        return NextResponse.json(album);
    } catch (error) {
        console.error('Error updating album:', error);
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
        await prisma.galleryAlbum.delete({
            where: { id }
        });

        return NextResponse.json(
            { message: 'Album deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting album:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

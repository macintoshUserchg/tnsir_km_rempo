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
        const { titleHi, titleEn, videoUrl, thumbnailUrl, isFeatured } = body;

        const video = await prisma.video.update({
            where: { id },
            data: {
                titleHi,
                titleEn,
                videoUrl,
                thumbnailUrl,
                isFeatured,
            }
        });

        return NextResponse.json(video);
    } catch (error) {
        console.error('Error updating video:', error);
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
        await prisma.video.delete({
            where: { id }
        });

        return NextResponse.json(
            { message: 'Video deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting video:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

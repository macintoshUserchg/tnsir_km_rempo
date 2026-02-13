import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const video = await prisma.video.findUnique({
            where: { id: parseInt(id) },
        });

        if (!video) {
            return NextResponse.json(
                { message: 'Video not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(video);
    } catch (error) {
        console.error('Error fetching video:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { titleHi, titleEn, videoUrl, thumbnailUrl, isFeatured, order } = body;

        const video = await prisma.video.update({
            where: { id: parseInt(id) },
            data: {
                titleHi,
                titleEn,
                videoUrl,
                thumbnailUrl,
                isFeatured,
                order,
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

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.video.delete({
            where: { id: parseInt(id) },
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

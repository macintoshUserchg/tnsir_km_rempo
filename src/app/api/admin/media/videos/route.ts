import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
    try {
        const videos = await prisma.video.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(videos);
    } catch (error) {
        console.error('Error fetching videos:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { titleHi, titleEn, videoUrl, thumbnailUrl, isFeatured } = body;

        if (!titleHi || !videoUrl) {
            return NextResponse.json(
                { message: 'Title (Hindi) and Video URL are required' },
                { status: 400 }
            );
        }

        const video = await prisma.video.create({
            data: {
                titleHi,
                titleEn,
                videoUrl,
                thumbnailUrl,
                isFeatured: isFeatured || false,
            }
        });

        return NextResponse.json(video, { status: 201 });
    } catch (error) {
        console.error('Error creating video:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

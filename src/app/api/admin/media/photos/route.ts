import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { albumId, imageUrl, captionHi, captionEn } = body;

        if (!albumId || !imageUrl) {
            return NextResponse.json(
                { message: 'Album ID and Image URL are required' },
                { status: 400 }
            );
        }

        const photo = await prisma.galleryPhoto.create({
            data: {
                albumId: parseInt(albumId),
                imageUrl,
                captionHi,
                captionEn,
            }
        });

        return NextResponse.json(photo, { status: 201 });
    } catch (error) {
        console.error('Error creating photo:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
    try {
        const albums = await prisma.galleryAlbum.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { photos: true }
                }
            }
        });
        return NextResponse.json(albums);
    } catch (error) {
        console.error('Error fetching albums:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { titleHi, titleEn, description, coverImage } = body;

        if (!titleHi) {
            return NextResponse.json(
                { message: 'Title (Hindi) is required' },
                { status: 400 }
            );
        }

        const album = await prisma.galleryAlbum.create({
            data: {
                titleHi,
                titleEn,
                description,
                coverImage,
            }
        });

        return NextResponse.json(album, { status: 201 });
    } catch (error) {
        console.error('Error creating album:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

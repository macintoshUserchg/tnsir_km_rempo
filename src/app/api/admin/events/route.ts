import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            titleHi,
            titleEn,
            descriptionHi,
            descriptionEn,
            locationHi,
            locationEn,
            date,
            category,
            images,
            isUpcoming
        } = body;

        // Basic validation
        if (!titleHi || !date || !category) {
            return NextResponse.json(
                { message: 'Title (Hindi), Date, and Category are required' },
                { status: 400 }
            );
        }

        const event = await prisma.event.create({
            data: {
                titleHi,
                titleEn,
                descriptionHi,
                descriptionEn,
                locationHi,
                locationEn,
                date: new Date(date),
                category,
                images: images || [],
                isUpcoming: isUpcoming ?? true,
            }
        });

        return NextResponse.json(event, { status: 201 });
    } catch (error) {
        console.error('Error creating event:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

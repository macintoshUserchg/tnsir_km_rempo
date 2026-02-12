import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
    try {
        const testimonials = await prisma.testimonial.findMany({
            orderBy: { order: 'asc' },
        });
        return NextResponse.json(testimonials);
    } catch (error) {
        console.error('Error fetching testimonials:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, role, messageHi, messageEn, imageUrl, isVisible } = body;

        if (!name || !messageHi) {
            return NextResponse.json(
                { message: 'Name and Message (Hindi) are required' },
                { status: 400 }
            );
        }

        const testimonial = await prisma.testimonial.create({
            data: {
                name,
                role,
                messageHi,
                messageEn,
                imageUrl,
                isVisible: isVisible ?? true,
            }
        });

        return NextResponse.json(testimonial, { status: 201 });
    } catch (error) {
        console.error('Error creating testimonial:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

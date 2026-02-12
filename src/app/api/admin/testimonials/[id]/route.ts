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
        const { name, role, messageHi, messageEn, imageUrl, isVisible } = body;

        const testimonial = await prisma.testimonial.update({
            where: { id },
            data: {
                name,
                role,
                messageHi,
                messageEn,
                imageUrl,
                isVisible,
            }
        });

        return NextResponse.json(testimonial);
    } catch (error) {
        console.error('Error updating testimonial:', error);
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
        await prisma.testimonial.delete({
            where: { id }
        });

        return NextResponse.json(
            { message: 'Testimonial deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting testimonial:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

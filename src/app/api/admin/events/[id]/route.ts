import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

interface RouteProps {
    params: Promise<{
        id: string;
    }>;
}

export async function GET(req: NextRequest, props: RouteProps) {
    const params = await props.params;
    try {
        const id = parseInt(params.id);
        const event = await prisma.event.findUnique({
            where: { id }
        });

        if (!event) {
            return NextResponse.json(
                { message: 'Event not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(event);
    } catch (error) {
        console.error('Error fetching event:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest, props: RouteProps) {
    const params = await props.params;
    try {
        const id = parseInt(params.id);
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

        const event = await prisma.event.update({
            where: { id },
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
                isUpcoming,
            }
        });

        return NextResponse.json(event);
    } catch (error) {
        console.error('Error updating event:', error);
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
        await prisma.event.delete({
            where: { id }
        });

        return NextResponse.json(
            { message: 'Event deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting event:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

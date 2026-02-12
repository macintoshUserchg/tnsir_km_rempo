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
        const { status } = body;

        const query = await prisma.contactQuery.update({
            where: { id },
            data: { status }
        });

        return NextResponse.json(query);
    } catch (error) {
        console.error('Error updating query status:', error);
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
        await prisma.contactQuery.delete({
            where: { id }
        });

        return NextResponse.json(
            { message: 'Query deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting query:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

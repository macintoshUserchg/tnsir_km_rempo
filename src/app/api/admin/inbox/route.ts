import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
    try {
        const queries = await prisma.contactQuery.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(queries);
    } catch (error) {
        console.error('Error fetching queries:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

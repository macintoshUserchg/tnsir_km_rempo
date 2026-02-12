import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { labelHi, labelEn, url, position, parentId, isVisible } = body;

        // Basic validation
        if (!labelHi || !url) {
            return NextResponse.json(
                { message: 'Label (Hindi) and URL are required' },
                { status: 400 }
            );
        }

        // Get max order for this position/parent
        const lastItem = await prisma.menu.findFirst({
            where: {
                position,
                parentId: parentId || null
            },
            orderBy: { order: 'desc' }
        });

        const newOrder = (lastItem?.order ?? -1) + 1;

        const menu = await prisma.menu.create({
            data: {
                labelHi,
                labelEn,
                url,
                position,
                parentId: parentId || null,
                order: newOrder,
                isVisible
            }
        });

        return NextResponse.json(menu, { status: 201 });
    } catch (error) {
        console.error('Error creating menu:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        const menus = await prisma.menu.findMany({
            orderBy: [
                { position: 'asc' },
                { order: 'asc' }
            ]
        });
        return NextResponse.json(menus);
    } catch (error) {
        return NextResponse.json({ message: 'Error' }, { status: 500 });
    }
}

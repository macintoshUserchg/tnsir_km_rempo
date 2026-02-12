import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
    try {
        const settings = await prisma.siteSetting.findMany();

        // Convert to key-value object for easier frontend consumption
        const formattedSettings = settings.reduce((acc, setting) => {
            acc[setting.key] = setting.value;
            return acc;
        }, {} as Record<string, string>);

        return NextResponse.json(formattedSettings);
    } catch (error) {
        console.error('Error fetching settings:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        // body is expected to be { key: value, key2: value2 }

        const updates = Object.entries(body).map(([key, value]) => {
            return prisma.siteSetting.upsert({
                where: { key },
                update: { value: String(value) },
                create: {
                    key,
                    value: String(value),
                    type: 'TEXT', // Default type
                    group: 'GENERAL' // Default group, can be refined if we pass more data
                }
            });
        });

        await prisma.$transaction(updates);

        return NextResponse.json(
            { message: 'Settings updated successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error updating settings:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

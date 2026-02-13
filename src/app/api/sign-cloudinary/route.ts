import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function POST(request: Request) {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { paramsToSign } = body;

    console.log('Signing parameters:', paramsToSign);

    // Filter out undefined/null values but keep zero
    const cleanParams = Object.fromEntries(
        Object.entries(paramsToSign).filter(([_, v]) => v !== undefined && v !== null)
    );

    const signature = cloudinary.utils.api_sign_request(
        cleanParams,
        process.env.CLOUDINARY_API_SECRET as string
    );

    return NextResponse.json({
        signature,
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY
    });
}

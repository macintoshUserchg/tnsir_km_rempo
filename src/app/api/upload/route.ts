import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const MAX_PDF_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB

const ALLOWED_PDF_TYPES = ['application/pdf'];
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

function generateFilename(originalName: string): string {
    const ext = path.extname(originalName);
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${timestamp}-${random}${ext}`;
}

export async function POST(req: NextRequest) {
    try {
        // Check authentication
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get('file') as File | null;
        const type = formData.get('type') as string | null; // 'pdf' or 'image'

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Validate file type
        const isPdf = ALLOWED_PDF_TYPES.includes(file.type);
        const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);

        if (!isPdf && !isImage) {
            return NextResponse.json({
                error: 'Invalid file type. Allowed: PDF, JPG, PNG, WEBP'
            }, { status: 400 });
        }

        // Validate file size
        if (isPdf && file.size > MAX_PDF_SIZE) {
            return NextResponse.json({
                error: 'PDF size exceeds 5MB limit'
            }, { status: 400 });
        }

        if (isImage && file.size > MAX_IMAGE_SIZE) {
            return NextResponse.json({
                error: 'Image size exceeds 2MB limit'
            }, { status: 400 });
        }

        // Ensure uploads directory exists
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        if (!existsSync(uploadsDir)) {
            await mkdir(uploadsDir, { recursive: true });
        }

        // Generate unique filename
        const filename = generateFilename(file.name);
        const filepath = path.join(uploadsDir, filename);

        // Convert to buffer and save
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filepath, buffer);

        // Return file info
        return NextResponse.json({
            success: true,
            file: {
                filename,
                originalName: file.name,
                mimeType: file.type,
                size: file.size,
                url: `/uploads/${filename}`,
                type: isPdf ? 'PDF' : 'IMAGE',
            }
        });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}

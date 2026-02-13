import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET() {
    try {
        const blogs = await prisma.blogPost.findMany({
            include: {
                attachments: true
            },
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(blogs);
    } catch (error) {
        console.error('Error fetching blogs:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { titleHi, titleEn, slug, contentHi, contentEn, excerptHi, excerptEn, imageUrl, published, attachments } = body;

        if (!titleHi || !slug || !contentHi) {
            return NextResponse.json(
                { message: 'Title (Hindi), Slug, and Content (Hindi) are required' },
                { status: 400 }
            );
        }

        const blog = await prisma.blogPost.create({
            data: {
                titleHi,
                titleEn,
                slug,
                contentHi,
                contentEn,
                excerptHi,
                excerptEn,
                imageUrl,
                published: published || false,
                publishedAt: published ? new Date() : null,
                attachments: {
                    create: attachments?.map((a: any) => ({
                        url: a.url,
                        type: a.type,
                        titleHi: a.titleHi,
                        titleEn: a.titleEn
                    })) || []
                }
            },
            include: {
                attachments: true
            }
        });

        return NextResponse.json(blog, { status: 201 });
    } catch (error: any) {
        console.error('Error creating blog:', error);
        if (error.code === 'P2002') {
            return NextResponse.json(
                { message: 'Slug already exists' },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

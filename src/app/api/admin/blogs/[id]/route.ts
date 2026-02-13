import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const blog = await prisma.blogPost.findUnique({
            where: { id: parseInt(id) },
            include: {
                attachments: true
            }
        });

        if (!blog) {
            return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
        }

        return NextResponse.json(blog);
    } catch (error) {
        console.error('Error fetching blog:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();
        const { titleHi, titleEn, slug, contentHi, contentEn, excerptHi, excerptEn, imageUrl, published, attachments } = body;

        // First, delete old attachments if we're replacing them
        // For simplicity in this implementation, we replace all attachments
        await prisma.blogAttachment.deleteMany({
            where: { blogPostId: parseInt(id) }
        });

        const blog = await prisma.blogPost.update({
            where: { id: parseInt(id) },
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

        return NextResponse.json(blog);
    } catch (error: any) {
        console.error('Error updating blog:', error);
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

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        await prisma.blogPost.delete({
            where: { id: parseInt(id) }
        });

        return NextResponse.json({ message: 'Blog deleted successfully' });
    } catch (error) {
        console.error('Error deleting blog:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

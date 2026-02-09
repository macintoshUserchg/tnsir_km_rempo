'use server';

import prisma from '@/lib/db';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const pressReleaseSchema = z.object({
    titleHi: z.string().min(5),
    titleEn: z.string().optional(),
    contentHi: z.string().min(20),
    contentEn: z.string().optional(),
    pdfUrl: z.string().optional(),
    published: z.boolean(),
});

const blogSchema = z.object({
    titleHi: z.string().min(5),
    titleEn: z.string().optional(),
    contentHi: z.string().min(50),
    contentEn: z.string().optional(),
    imageUrl: z.string().optional(),
    author: z.string(),
    published: z.boolean(),
});

function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\u0900-\u097F]+/g, '-')
        .replace(/^-|-$/g, '')
        .substring(0, 100) + '-' + Date.now().toString(36);
}

export async function createPressRelease(data: z.infer<typeof pressReleaseSchema>) {
    const session = await auth();
    if (!session?.user) throw new Error('Unauthorized');

    const validated = pressReleaseSchema.parse(data);
    const slug = generateSlug(validated.titleHi);

    await prisma.pressRelease.create({
        data: {
            titleHi: validated.titleHi,
            titleEn: validated.titleEn,
            contentHi: validated.contentHi,
            contentEn: validated.contentEn,
            pdfUrl: validated.pdfUrl,
            published: validated.published,
            slug,
            date: new Date(),
        },
    });

    revalidatePath('/press-release');
    revalidatePath('/admin/press-releases');
    return { success: true };
}

export async function updatePressRelease(id: number, data: z.infer<typeof pressReleaseSchema>) {
    const session = await auth();
    if (!session?.user) throw new Error('Unauthorized');

    const validated = pressReleaseSchema.parse(data);

    await prisma.pressRelease.update({
        where: { id },
        data: {
            titleHi: validated.titleHi,
            titleEn: validated.titleEn,
            contentHi: validated.contentHi,
            contentEn: validated.contentEn,
            pdfUrl: validated.pdfUrl,
            published: validated.published,
        },
    });

    revalidatePath('/press-release');
    revalidatePath('/admin/press-releases');
    return { success: true };
}

export async function deletePressRelease(id: number) {
    const session = await auth();
    if (!session?.user) throw new Error('Unauthorized');

    await prisma.pressRelease.delete({ where: { id } });

    revalidatePath('/press-release');
    revalidatePath('/admin/press-releases');
    return { success: true };
}

export async function createBlogPost(data: z.infer<typeof blogSchema>) {
    const session = await auth();
    if (!session?.user) throw new Error('Unauthorized');

    const validated = blogSchema.parse(data);
    const slug = generateSlug(validated.titleHi);

    await prisma.blogPost.create({
        data: {
            titleHi: validated.titleHi,
            titleEn: validated.titleEn,
            contentHi: validated.contentHi,
            contentEn: validated.contentEn,
            imageUrl: validated.imageUrl,
            author: validated.author,
            published: validated.published,
            slug,
        },
    });

    revalidatePath('/blog');
    revalidatePath('/admin/blogs');
    return { success: true };
}

export async function updateBlogPost(id: number, data: z.infer<typeof blogSchema>) {
    const session = await auth();
    if (!session?.user) throw new Error('Unauthorized');

    const validated = blogSchema.parse(data);

    await prisma.blogPost.update({
        where: { id },
        data: {
            titleHi: validated.titleHi,
            titleEn: validated.titleEn,
            contentHi: validated.contentHi,
            contentEn: validated.contentEn,
            imageUrl: validated.imageUrl,
            author: validated.author,
            published: validated.published,
        },
    });

    revalidatePath('/blog');
    revalidatePath('/admin/blogs');
    return { success: true };
}

export async function deleteBlogPost(id: number) {
    const session = await auth();
    if (!session?.user) throw new Error('Unauthorized');

    await prisma.blogPost.delete({ where: { id } });

    revalidatePath('/blog');
    revalidatePath('/admin/blogs');
    return { success: true };
}

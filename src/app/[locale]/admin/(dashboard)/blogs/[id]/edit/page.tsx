import { setRequestLocale } from 'next-intl/server';
import BlogForm from '@/components/admin/BlogForm';
import prisma from '@/lib/db';
import { notFound } from 'next/navigation';

type Props = {
    params: Promise<{ locale: string; id: string }>;
};

export default async function EditBlogPage({ params }: Props) {
    const { locale, id } = await params;
    setRequestLocale(locale);

    const blog = await prisma.blogPost.findUnique({
        where: { id: parseInt(id) },
        include: {
            attachments: true
        }
    });

    if (!blog) {
        notFound();
    }

    // Convert decimal/date to plain object for client component
    const blogData = {
        ...blog,
        titleEn: blog.titleEn || '',
        excerptHi: blog.excerptHi || '',
        excerptEn: blog.excerptEn || '',
        contentEn: blog.contentEn || '',
        imageUrl: blog.imageUrl || '',
        attachments: blog.attachments.map(a => ({
            ...a,
            titleHi: a.titleHi || '',
            titleEn: a.titleEn || ''
        }))
    };

    return (
        <div className="py-6">
            <BlogForm initialData={blogData} locale={locale} />
        </div>
    );
}

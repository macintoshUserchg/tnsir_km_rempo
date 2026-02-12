import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db'; // Assuming lib/db exists, or I need to check where prisma is exported
import { SectionRenderer } from '@/components/cms/SectionRenderer';
import { Metadata } from 'next';
import TypographySync from '@/components/layout/TypographySync';

// This is a server component
interface PageProps {
    params: Promise<{
        locale: string;
        slug: string[];
    }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale, slug } = await params;
    const slugString = slug.join('/');

    const page = await prisma.page.findUnique({
        where: { slug: slugString },
    });

    if (!page) return {};

    return {
        title: page.seoTitle || (locale === 'hi' ? page.titleHi : page.titleEn),
        description: page.seoDesc,
    };
}

export default async function DynamicPage({ params }: PageProps) {
    const { locale, slug } = await params;
    const slugString = slug.join('/');

    const page = await prisma.page.findUnique({
        where: {
            slug: slugString,
            isPublished: true
        },
        include: {
            sections: {
                where: { isVisible: true },
                orderBy: { order: 'asc' },
            },
        },
    });

    if (!page) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-white dark:bg-black">
            <TypographySync slug={slugString} locale={locale} />
            {page.sections.map((section) => (
                <SectionRenderer
                    key={section.id}
                    section={section}
                    locale={locale}
                />
            ))}
        </main>
    );
}

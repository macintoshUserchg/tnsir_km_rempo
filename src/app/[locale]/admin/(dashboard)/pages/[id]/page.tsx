import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import PageEditorClient from './PageEditorClient';

export default async function PageEditor({
    params: { id, locale }
}: {
    params: { id: string; locale: string }
}) {
    if (id === 'new') {
        return <PageEditorClient locale={locale} isNew={true} />;
    }

    const pageId = parseInt(id);
    if (isNaN(pageId)) {
        notFound();
    }

    const page = await prisma.page.findUnique({
        where: { id: pageId },
        include: {
            sections: {
                orderBy: { order: 'asc' }
            }
        }
    });

    if (!page) {
        notFound();
    }

    return <PageEditorClient locale={locale} page={page} />;
}

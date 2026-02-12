import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import AlbumManager from '@/components/admin/AlbumManager';
import { setRequestLocale } from 'next-intl/server';

interface PageProps {
    params: Promise<{
        id: string;
        locale: string;
    }>;
}

export default async function AlbumDetailsPage({ params }: PageProps) {
    const { id, locale } = await params;
    setRequestLocale(locale);
    const albumId = parseInt(id);

    if (isNaN(albumId)) {
        notFound();
    }

    const album = await prisma.galleryAlbum.findUnique({
        where: { id: albumId },
        include: {
            photos: {
                orderBy: { createdAt: 'desc' }
            }
        }
    });

    if (!album) {
        notFound();
    }

    return <AlbumManager album={album} locale={locale} />;
}

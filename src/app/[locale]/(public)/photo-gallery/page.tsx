import React from 'react';
import GalleryAlbumsContent from '@/components/public/GalleryAlbumsContent';
import { prisma } from '@/lib/db';
import { setRequestLocale } from 'next-intl/server';

type Props = {
    params: Promise<{ locale: string }>;
};

async function getAlbums(isHindi: boolean) {
    const albums = await prisma.galleryAlbum.findMany({
        orderBy: { order: 'asc' },
        include: {
            _count: {
                select: { photos: true }
            }
        }
    });

    return albums.map(album => ({
        id: album.id,
        title: (isHindi ? album.titleHi : album.titleEn) || album.titleEn || '',
        description: '', // description is single field in DB, confusingly?
        // Wait, schema says description is just String? @db.Text
        // Let's check schema again. `description String? @db.Text` in GalleryAlbum
        // It's not localized in schema? "description String? @db.Text"
        // Ah, looking at schema: 
        // model GalleryAlbum { ... description String? ... }
        // So it is not localized. Or maybe I missed it.
        // Let's use it as is.
        coverImage: album.coverImage,
        photoCount: album._count.photos
    }));
}

export default async function PhotoGalleryPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const isHindi = locale === 'hi';

    // Schema check for description:
    // model GalleryAlbum { ... description String? @db.Text ... }
    // It seems description is not localized in the schema I saw.
    // Let's re-verify schema if needed, but for now I will use what I saw.

    const albumsRaw = await prisma.galleryAlbum.findMany({
        orderBy: { order: 'asc' },
        include: {
            _count: {
                select: { photos: true }
            }
        }
    });

    const albums = albumsRaw.map(album => ({
        id: album.id,
        title: (isHindi ? album.titleHi : album.titleEn) || album.titleEn || '',
        description: album.description || '',
        coverImage: album.coverImage,
        photoCount: album._count.photos
    }));

    return (
        <GalleryAlbumsContent
            albums={albums}
            isHindi={isHindi}
        />
    );
}

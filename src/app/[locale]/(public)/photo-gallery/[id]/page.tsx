import React from 'react';
import GalleryPhotosContent from '@/components/public/GalleryPhotosContent';
import { prisma } from '@/lib/db';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

type Props = {
    params: Promise<{ locale: string; id: string }>;
};

export default async function AlbumPage({ params }: Props) {
    const { locale, id } = await params;
    setRequestLocale(locale);
    const isHindi = locale === 'hi';
    const albumId = parseInt(id);

    if (isNaN(albumId)) {
        return notFound();
    }

    const album = await prisma.galleryAlbum.findUnique({
        where: { id: albumId },
        include: {
            photos: {
                orderBy: { order: 'asc' }
            }
        }
    });

    if (!album) {
        return notFound();
    }

    const formattedAlbum = {
        title: (isHindi ? album.titleHi : album.titleEn) || album.titleEn || '',
        description: album.description || ''
    };

    const formattedPhotos = album.photos.map(photo => ({
        id: photo.id,
        url: photo.imageUrl,
        caption: (isHindi ? photo.captionHi : photo.captionEn) || ''
    }));

    return (
        <GalleryPhotosContent
            album={formattedAlbum}
            photos={formattedPhotos}
            isHindi={isHindi}
        />
    );
}

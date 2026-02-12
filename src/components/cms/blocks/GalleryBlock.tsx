import React from 'react';
import { prisma } from '@/lib/db';
import GalleryAlbumsContent from '@/components/public/GalleryAlbumsContent';
import { Container } from '@/components/common/Container';
import { SectionHeading } from '@/components/common/SectionHeading';

interface GalleryBlockProps {
    content: {
        titleHi?: string;
        titleEn?: string;
        subtitleHi?: string;
        subtitleEn?: string;
        count?: number;
    };
    locale: string;
}

export const GalleryBlock = async ({ content, locale }: GalleryBlockProps) => {
    const isHindi = locale === 'hi';
    const albumsRaw = await prisma.galleryAlbum.findMany({
        orderBy: { order: 'asc' },
        take: content.count || 6,
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

    const title = (isHindi ? content.titleHi : content.titleEn) || (isHindi ? 'फोटो गैलरी' : 'Photo Gallery');
    const subtitle = isHindi ? content.subtitleHi : content.subtitleEn;

    return (
        <section className="section-padding bg-white">
            <Container>
                <SectionHeading
                    title={title}
                    subtitle={subtitle}
                    centered
                />
                <div className="mt-8">
                    <GalleryAlbumsContent
                        albums={albums}
                        isHindi={isHindi}
                        showHero={false}
                    />
                </div>
            </Container>
        </section>
    );
};

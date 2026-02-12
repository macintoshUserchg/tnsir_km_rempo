import React from 'react';
import { prisma } from '@/lib/db';
import VideoGalleryContent from '@/components/public/VideoGalleryContent';
import { Container } from '@/components/common/Container';
import { SectionHeading } from '@/components/common/SectionHeading';

interface VideosBlockProps {
    content: {
        titleHi?: string;
        titleEn?: string;
        subtitleHi?: string;
        subtitleEn?: string;
        count?: number;
    };
    locale: string;
}

export const VideosBlock = async ({ content, locale }: VideosBlockProps) => {
    const isHindi = locale === 'hi';
    const videosRaw = await prisma.video.findMany({
        orderBy: { order: 'asc' },
        take: content.count || 4,
    });

    const videos = videosRaw.map(video => ({
        id: video.id,
        title: (isHindi ? video.titleHi : video.titleEn) || video.titleEn || '',
        description: '',
        date: video.createdAt.toISOString(),
        url: video.videoUrl,
        youtubeId: video.videoUrl.split('v=')[1] || '',
        category: '',
        source: 'YouTube',
        sourceUrl: video.videoUrl
    }));

    const title = (isHindi ? content.titleHi : content.titleEn) || (isHindi ? 'वीडियो गैलरी' : 'Video Gallery');
    const subtitle = isHindi ? content.subtitleHi : content.subtitleEn;

    return (
        <section className="section-padding bg-gray-50/30">
            <Container>
                <SectionHeading
                    title={title}
                    subtitle={subtitle}
                    centered
                />
                <div className="mt-8">
                    <VideoGalleryContent
                        videos={videos}
                        isHindi={isHindi}
                        showHero={false}
                    />
                </div>
            </Container>
        </section>
    );
};

import React from 'react';
import VideoGalleryContent from '@/components/public/VideoGalleryContent';
import { prisma } from '@/lib/db';
import { setRequestLocale } from 'next-intl/server';

type Props = {
    params: Promise<{ locale: string }>;
};

function getYoutubeId(url: string): string {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
}

async function getVideos(isHindi: boolean) {
    const videos = await prisma.video.findMany({
        orderBy: [
            { order: 'asc' },
            { createdAt: 'desc' }
        ]
    });

    return videos.map(video => ({
        id: video.id,
        title: (isHindi ? video.titleHi : video.titleEn) || video.titleEn || '',
        description: '', // Video model does not have description
        date: video.createdAt.toISOString(),
        url: video.videoUrl,
        thumbnailUrl: video.thumbnailUrl,
        youtubeId: getYoutubeId(video.videoUrl),
        // DB doesn't have category/source yet, using defaults or optional
        category: 'Speeches', // Default category for now
    }));
}

export default async function VideoGalleryPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const isHindi = locale === 'hi';
    const videos = await getVideos(isHindi);

    return (
        <VideoGalleryContent
            videos={videos}
            isHindi={isHindi}
        />
    );
}

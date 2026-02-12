'use client';

import React from 'react';
import { Container } from '@/components/common/Container';
import { PageHero } from '@/components/common/PageHero';
import { StaggerContainer, StaggerItem } from '@/components/common/AnimatedSection';
import { ExternalLink } from 'lucide-react';

interface Video {
    id: number;
    title: string;
    description: string;
    date: string;
    url: string;
    youtubeId: string;
    category?: string;
    source?: string;
    sourceUrl?: string;
}

interface VideoGalleryContentProps {
    videos: Video[];
    isHindi: boolean;
    title?: string;
    subtitle?: string;
    showHero?: boolean;
}

export default function VideoGalleryContent({
    videos,
    isHindi,
    title,
    subtitle,
    showHero = true
}: VideoGalleryContentProps) {
    const formatDate = (value: string) =>
        new Date(value).toLocaleDateString(isHindi ? 'hi-IN' : 'en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

    const formatCategory = (value: string) => value ? value.replace(/-/g, ' ') : '';
    const displayTitle = title || (isHindi ? 'वीडियो गैलरी' : 'Video Gallery');
    const displaySubtitle = subtitle || (isHindi ? 'महत्वपूर्ण क्षण और भाषण देखें' : 'Watch important moments and speeches');

    return (
        <>
            {showHero && (
                <PageHero
                    title={displayTitle}
                    subtitle={displaySubtitle}
                />
            )}

            <section className="py-12 md:py-16">
                <Container>
                    {!showHero && title && (
                        <div className="text-center mb-10">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-heading">
                                {displayTitle}
                            </h2>
                            {subtitle && <p className="text-gray-600 max-w-2xl mx-auto">{displaySubtitle}</p>}
                        </div>
                    )}
                    <StaggerContainer className="grid gap-8 lg:grid-cols-2">
                        {videos.map((video) => (
                            <StaggerItem key={video.id}>
                                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
                                    <div className="aspect-video bg-gray-100 relative group">
                                        <iframe
                                            src={`https://www.youtube.com/embed/${video.youtubeId}`}
                                            title={video.title}
                                            className="w-full h-full"
                                            loading="lazy"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    </div>
                                    <div className="p-6">
                                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-3">
                                            {video.category && (
                                                <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-700 font-medium capitalize">
                                                    {formatCategory(video.category)}
                                                </span>
                                            )}
                                            <span>{formatDate(video.date)}</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                                            {video.title}
                                        </h3>
                                        {video.description && (
                                            <p className="text-gray-600 line-clamp-2">
                                                {video.description}
                                            </p>
                                        )}
                                        {video.source && video.sourceUrl && (
                                            <a
                                                href={video.sourceUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="mt-4 inline-flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700 font-medium"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                                {video.source}
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </StaggerItem>
                        ))}
                    </StaggerContainer>
                </Container>
            </section>
        </>
    );
}

'use client';

import React from 'react';
import { Container } from '@/components/common/Container';
import { PageHero } from '@/components/common/PageHero';
import { StaggerContainer, StaggerItem } from '@/components/common/AnimatedSection';
import { videoGallery } from '@/data/videos';
import { useTranslations, useLocale } from 'next-intl';
import { Play, ExternalLink } from 'lucide-react';

export default function VideoGalleryPage() {
    const t = useTranslations('videoGalleryPage');
    const locale = useLocale();
    const isHindi = locale === 'hi';

    const formatDate = (value: string) =>
        new Date(value).toLocaleDateString(isHindi ? 'hi-IN' : 'en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

    const formatCategory = (value: string) => value.replace(/-/g, ' ');

    return (
        <>
            <PageHero
                title={isHindi ? 'वीडियो गैलरी' : 'Video Gallery'}
                subtitle={isHindi ? 'महत्वपूर्ण क्षण और भाषण देखें' : 'Watch important moments and speeches'}
            />

            <section className="py-12 md:py-16">
                <Container>
                    <StaggerContainer className="grid gap-8 lg:grid-cols-2">
                        {videoGallery.map((video) => (
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
                                            <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-700 font-medium capitalize">
                                                {formatCategory(video.category)}
                                            </span>
                                            <span>{formatDate(video.date)}</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                                            {isHindi ? video.titleHi || video.title : video.title}
                                        </h3>
                                        <p className="text-gray-600 line-clamp-2">
                                            {isHindi ? video.descriptionHi || video.description : video.description}
                                        </p>
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

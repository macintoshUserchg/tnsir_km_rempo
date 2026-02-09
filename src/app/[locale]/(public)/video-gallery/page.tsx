import React from 'react';
import { Container } from '@/components/common/Container';
import { SectionHeading } from '@/components/common/SectionHeading';
import { videoGallery } from '@/data/videos';
import { setRequestLocale } from 'next-intl/server';

type Props = {
    params: Promise<{ locale: string }>;
};

export default async function VideoGalleryPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    const formatDate = (value: string) =>
        new Date(value).toLocaleDateString(locale === 'hi' ? 'hi-IN' : 'en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

    const formatCategory = (value: string) => value.replace(/-/g, ' ');

    // const buildSrcDoc = (title: string, youtubeId: string, thumbnail: string) => `
    //     <style>
    //         * { padding: 0; margin: 0; }
    //         html, body { height: 100%; }
    //         body { display: grid; place-items: center; background: #000; }
    //         a { position: relative; display: block; width: 100%; height: 100%; }
    //         img { width: 100%; height: 100%; object-fit: cover; }
    //         span {
    //             position: absolute;
    //             inset: 0;
    //             display: grid;
    //             place-items: center;
    //             color: white;
    //             font-size: 64px;
    //             text-shadow: 0 2px 12px rgba(0,0,0,0.6);
    //         }
    //     </style>
    //     <a href="https://www.youtube.com/embed/${youtubeId}?autoplay=1">
    //         <img src="${thumbnail}" alt="${title}" />
    //         <span>▶</span>
    //     </a>
    // `;

    return (
        <div className="section-padding">
            <Container>
                <SectionHeading
                    title="Video Gallery"
                    subtitle="Watch important moments and speeches"
                    centered
                />
                {/* Note: srcDoc optimization handled by simple iframe for now to avoid hydration issues with dangerouslySetInnerHTML, can be optimized later */}
                <div className="grid gap-8 lg:grid-cols-2">
                    {videoGallery.map((video) => (
                        <div
                            key={video.id}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
                        >
                            <div className="aspect-video bg-gray-100">
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
                                    <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-700 font-medium">
                                        {formatCategory(video.category)}
                                    </span>
                                    <span>{formatDate(video.date)}</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    {locale === 'hi' ? video.titleHi || video.title : video.title}
                                </h3>
                                <p className="text-gray-600">
                                    {locale === 'hi' ? video.descriptionHi || video.description : video.description}
                                </p>
                                {video.source && video.sourceUrl && (
                                    <p className="mt-4 text-sm text-gray-500">
                                        Source:{' '}
                                        <a
                                            href={video.sourceUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-orange-600 hover:text-orange-700 underline-offset-2 hover:underline"
                                        >
                                            {video.source}
                                        </a>
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    );
};

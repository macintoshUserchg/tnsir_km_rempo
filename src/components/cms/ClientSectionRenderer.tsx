'use client';

import React from 'react';
import { HeroBlock } from './blocks/HeroBlock';
import { RichTextBlock } from './blocks/RichTextBlock';
import { BiographyBlock } from './blocks/BiographyBlock';
import { StatsBlock } from './blocks/StatsBlock';
import { NewsletterBlock } from './blocks/NewsletterBlock';
import FAQBlock from './blocks/FAQBlock';

// Client components for preview (replacing server blocks)
import TimelineComponent from '@/components/public/TimelineComponent';
import GalleryAlbumsContent from '@/components/public/GalleryAlbumsContent';
import VideoGalleryContent from '@/components/public/VideoGalleryContent';
import TestimonialsCarousel from '@/components/public/TestimonialsCarousel';
import { Container } from '@/components/common/Container';
import { SectionHeading } from '@/components/common/SectionHeading';

interface ClientSectionRendererProps {
    type: string;
    content: any;
    locale: string;
}

export default function ClientSectionRenderer({ type, content, locale }: ClientSectionRendererProps) {
    const isHindi = locale === 'hi';

    switch (type) {
        case 'HERO':
            return <HeroBlock content={content} locale={locale} />;
        case 'RICHTEXT':
            return <RichTextBlock content={content} locale={locale} />;
        case 'BIOGRAPHY':
            return <BiographyBlock content={content} locale={locale} />;
        case 'STATS':
            return <StatsBlock content={content} locale={locale} />;
        case 'NEWSLETTER':
            return <NewsletterBlock content={content} locale={locale} />;
        case 'FAQ':
            return <FAQBlock content={content} locale={locale} />;

        // Server blocks mocked for client preview
        case 'TIMELINE':
            return (
                <section className="section-padding bg-gray-50/50">
                    <Container>
                        <SectionHeading
                            title={(isHindi ? content.titleHi : content.titleEn) || 'Timeline Preview'}
                            subtitle={isHindi ? content.subtitleHi : content.subtitleEn}
                            centered
                        />
                        <div className="mt-8">
                            <TimelineComponent
                                title=""
                                events={[
                                    {
                                        id: 1,
                                        year: 2024,
                                        title: isHindi ? 'उदाहरण घटना' : 'Sample Event',
                                        description: isHindi ? 'यह एक पूर्वावलोकन है।' : 'This is a preview event.',
                                        imageUrl: null
                                    },
                                    {
                                        id: 2,
                                        year: 2023,
                                        title: isHindi ? 'पिछली घटना' : 'Previous Event',
                                        description: isHindi ? 'समयरेखा पूर्वावलोकन।' : 'Timeline preview item.',
                                        imageUrl: null
                                    }
                                ]}
                            />
                        </div>
                    </Container>
                </section>
            );
        case 'GALLERY':
            return (
                <section className="section-padding bg-white">
                    <Container>
                        <SectionHeading
                            title={(isHindi ? content.titleHi : content.titleEn) || 'Gallery Preview'}
                            subtitle={isHindi ? content.subtitleHi : content.subtitleEn}
                            centered
                        />
                        <div className="mt-8">
                            <GalleryAlbumsContent
                                albums={[
                                    {
                                        id: 1,
                                        title: isHindi ? 'नमूना एल्बम' : 'Sample Album',
                                        description: 'Preview album',
                                        coverImage: null,
                                        photoCount: 5
                                    },
                                    {
                                        id: 2,
                                        title: isHindi ? 'दूसरा एल्बम' : 'Another Album',
                                        description: 'Preview album',
                                        coverImage: null,
                                        photoCount: 3
                                    }
                                ]}
                                isHindi={isHindi}
                                showHero={false}
                            />
                        </div>
                    </Container>
                </section>
            );
        case 'VIDEOS':
            return (
                <section className="section-padding bg-gray-50/30">
                    <Container>
                        <SectionHeading
                            title={(isHindi ? content.titleHi : content.titleEn) || 'Video Gallery Preview'}
                            subtitle={isHindi ? content.subtitleHi : content.subtitleEn}
                            centered
                        />
                        <div className="mt-8">
                            <VideoGalleryContent
                                videos={[
                                    {
                                        id: 1,
                                        title: isHindi ? 'नमूना वीडियो' : 'Sample Video',
                                        description: 'Video preview',
                                        date: new Date().toISOString(),
                                        url: '',
                                        youtubeId: 'dQw4w9WgXcQ'
                                    }
                                ]}
                                isHindi={isHindi}
                                showHero={false}
                            />
                        </div>
                    </Container>
                </section>
            );
        case 'TESTIMONIALS':
            return (
                <section className="section-padding bg-orange-50/30">
                    <Container>
                        <SectionHeading
                            title={(isHindi ? content.titleHi : content.titleEn) || 'Testimonials Preview'}
                            subtitle={isHindi ? content.subtitleHi : content.subtitleEn}
                            centered
                        />
                        <div className="mt-8">
                            <TestimonialsCarousel
                                testimonials={[
                                    {
                                        id: 1,
                                        name: 'John Doe',
                                        role: 'Supporter',
                                        message: isHindi ? 'यह एक नमूना प्रशंसापत्र है।' : 'This is a sample testimonial for preview.',
                                        imageUrl: null
                                    }
                                ]}
                            />
                        </div>
                    </Container>
                </section>
            );

        default:
            return (
                <div className="p-8 border-2 border-dashed rounded-xl text-center text-muted-foreground">
                    Preview not available for {type}
                </div>
            );
    }
}

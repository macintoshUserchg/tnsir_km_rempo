import React from 'react';
import { PageSection } from '@prisma/client';
import { HeroBlock } from './blocks/HeroBlock';
import { RichTextBlock } from './blocks/RichTextBlock';
import { TimelineBlock } from './blocks/TimelineBlock';
import { GalleryBlock } from './blocks/GalleryBlock';
import { VideosBlock } from './blocks/VideosBlock';
import { TestimonialsBlock } from './blocks/TestimonialsBlock';

interface SectionRendererProps {
    section: PageSection;
    locale: string;
}

export const SectionRenderer = async ({ section, locale }: SectionRendererProps) => {
    if (!section.isVisible) return null;

    switch (section.type) {
        case 'HERO':
            return <HeroBlock content={section.content as any} locale={locale} />;
        case 'RICHTEXT':
            return <RichTextBlock content={section.content as any} locale={locale} />;
        case 'TIMELINE':
            return <TimelineBlock content={section.content as any} locale={locale} />;
        case 'GALLERY':
            return <GalleryBlock content={section.content as any} locale={locale} />;
        case 'VIDEOS':
            return <VideosBlock content={section.content as any} locale={locale} />;
        case 'TESTIMONIALS':
            return <TestimonialsBlock content={section.content as any} locale={locale} />;
        default:
            console.warn(`Unknown section type: ${section.type}`);
            return null;
    }
};

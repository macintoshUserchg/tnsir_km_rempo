import React from 'react';
import { prisma } from '@/lib/db';
import Timeline from '@/components/public/TimelineComponent';
import { Container } from '@/components/common/Container';
import { SectionHeading } from '@/components/common/SectionHeading';

interface TimelineBlockProps {
    content: {
        titleHi?: string;
        titleEn?: string;
        subtitleHi?: string;
        subtitleEn?: string;
        show?: boolean;
        count?: number;
    };
    locale: string;
}

export const TimelineBlock = async ({ content, locale }: TimelineBlockProps) => {
    const isHindi = locale === 'hi';
    const events = await prisma.timelineEvent.findMany({
        take: content.count || 6,
        orderBy: {
            year: 'asc',
        },
    });

    const eventsMapped = events.map(event => ({
        id: event.id,
        year: event.year,
        title: (isHindi ? event.titleHi : event.titleEn) || event.titleEn || '',
        description: (isHindi ? event.descHi : event.descEn) || event.descEn || '',
        imageUrl: event.imageUrl
    }));

    const title = (isHindi ? content.titleHi : content.titleEn) || (isHindi ? 'जीवन यात्रा' : 'My Life Journey');
    const subtitle = isHindi ? content.subtitleHi : content.subtitleEn;

    return (
        <section className="section-padding bg-gray-50/50">
            <Container>
                <SectionHeading
                    title={title}
                    subtitle={subtitle}
                    centered
                />
                <div className="mt-8">
                    <Timeline
                        events={eventsMapped}
                        title="" // title is already rendered by SectionHeading
                    />
                </div>
            </Container>
        </section>
    );
};

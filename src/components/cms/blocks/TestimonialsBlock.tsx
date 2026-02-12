import React from 'react';
import { prisma } from '@/lib/db';
import TestimonialsCarousel from '@/components/public/TestimonialsCarousel';
import { Container } from '@/components/common/Container';
import { SectionHeading } from '@/components/common/SectionHeading';

interface TestimonialsBlockProps {
    content: {
        titleHi?: string;
        titleEn?: string;
        subtitleHi?: string;
        subtitleEn?: string;
        count?: number;
    };
    locale: string;
}

export const TestimonialsBlock = async ({ content, locale }: TestimonialsBlockProps) => {
    const isHindi = locale === 'hi';
    const testimonialsRaw = await prisma.testimonial.findMany({
        where: { isVisible: true },
        orderBy: { order: 'asc' },
        take: content.count || 6,
    });

    const testimonials = testimonialsRaw.map(t => ({
        id: t.id,
        name: t.name,
        role: t.role,
        message: (isHindi ? t.messageHi : t.messageEn) || t.messageEn || '',
        imageUrl: t.imageUrl
    }));

    const title = (isHindi ? content.titleHi : content.titleEn) || (isHindi ? 'प्रशंसापत्र' : 'Testimonials');
    const subtitle = isHindi ? content.subtitleHi : content.subtitleEn;

    return (
        <section className="section-padding bg-orange-50/30">
            <Container>
                <SectionHeading
                    title={title}
                    subtitle={subtitle}
                    centered
                />
                <div className="mt-8">
                    <TestimonialsCarousel
                        testimonials={testimonials}
                    />
                </div>
            </Container>
        </section>
    );
};

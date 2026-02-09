import React from 'react';
import { Container } from '@/components/common/Container';
import { SectionHeading } from '@/components/common/SectionHeading';
import { galleryImages } from '@/data/gallery';
import { setRequestLocale, getTranslations } from 'next-intl/server';

type Props = {
    params: Promise<{ locale: string }>;
};

export default async function PhotoGalleryPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations('photoGalleryPage');

    return (
        <div className="section-padding">
            <Container>
                <SectionHeading
                    title={t('title')}
                    subtitle={t('subtitle')}
                    centered
                />
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {galleryImages.map((image) => (
                        <div
                            key={image.id}
                            className="relative overflow-hidden rounded-2xl shadow-lg bg-gray-100 aspect-[4/3] group"
                        >
                            <img
                                src={image.url}
                                alt={locale === 'hi' ? image.titleHi || image.title : image.title}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                <p className="text-white font-medium">
                                    {locale === 'hi' ? image.titleHi || image.title : image.title}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    );
};

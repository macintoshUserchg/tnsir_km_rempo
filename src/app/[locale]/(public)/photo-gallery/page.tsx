'use client';

import React from 'react';
import { Container } from '@/components/common/Container';
import { PageHero } from '@/components/common/PageHero';
import { StaggerContainer, StaggerItem } from '@/components/common/AnimatedSection';
import { galleryImages } from '@/data/gallery';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';

export default function PhotoGalleryPage() {
    const t = useTranslations('photoGalleryPage');
    const locale = useLocale();
    const isHindi = locale === 'hi';

    return (
        <>
            <PageHero
                title={t('title')}
                subtitle={t('subtitle')}
            />

            <section className="py-12 md:py-16">
                <Container>
                    <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {galleryImages.map((image, index) => (
                            <StaggerItem key={image.id}>
                                <motion.div
                                    className="relative overflow-hidden rounded-2xl shadow-lg bg-gray-100 aspect-[4/3] group cursor-pointer"
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <img
                                        src={image.url}
                                        alt={isHindi ? image.titleHi || image.title : image.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                                        <p className="text-white font-semibold text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                            {isHindi ? image.titleHi || image.title : image.title}
                                        </p>
                                        {image.date && (
                                            <p className="text-white/80 text-sm mt-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                                                {new Date(image.date).toLocaleDateString(isHindi ? 'hi-IN' : 'en-IN', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </p>
                                        )}
                                    </div>
                                    {/* Corner Badge */}
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        {index + 1}
                                    </div>
                                </motion.div>
                            </StaggerItem>
                        ))}
                    </StaggerContainer>
                </Container>
            </section>
        </>
    );
}

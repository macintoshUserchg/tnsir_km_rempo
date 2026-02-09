'use client';

import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/common/Container';
import { galleryImages } from '@/data/gallery';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowRight, Images } from 'lucide-react';

export function GalleryPreview() {
    const locale = useLocale();
    const isHindi = locale === 'hi';

    // Show all images, first 6 visible, rest scrollable
    const allImages = galleryImages;

    return (
        <section className="py-4 md:py-6 bg-gray-50">
            <Container>
                {/* Card Container */}
                <div className="bg-white rounded-xl md:rounded-2xl shadow-lg md:shadow-xl overflow-hidden border border-gray-100">
                    {/* Card Header */}
                    <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 bg-gray-50 border-b border-gray-100">
                        <div className="flex items-center gap-2 md:gap-3">
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                <Images className="w-4 h-4 md:w-5 md:h-5 text-orange-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-sm md:text-lg">
                                    {isHindi ? 'फोटो गैलरी' : 'Photo Gallery'}
                                </h3>
                                <p className="text-gray-500 text-xs md:text-sm hidden sm:block">
                                    {isHindi ? `${allImages.length} तस्वीरें` : `${allImages.length} photos`}
                                </p>
                            </div>
                        </div>
                        <Link
                            href={`/${locale}/photo-gallery`}
                            className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-orange-600 text-white font-semibold rounded-full hover:bg-orange-700 transition-colors text-xs md:text-sm shadow-md"
                        >
                            {isHindi ? 'सभी देखें' : 'View All'}
                            <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                        </Link>
                    </div>

                    {/* Gallery Grid - 5 columns, 3 rows (15 images) */}
                    <div className="relative p-3 md:p-4">
                        <div className="grid grid-cols-3 md:grid-cols-5 gap-2 md:gap-3">
                            {allImages.slice(0, 10).map((image, index) => (
                                <motion.div
                                    key={image.id}
                                    className="relative overflow-hidden rounded-lg md:rounded-xl bg-gray-100 aspect-square group cursor-pointer shadow-sm hover:shadow-lg transition-all"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.5) }}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <img
                                        src={image.url}
                                        alt={isHindi ? image.titleHi || image.title : image.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-1.5 md:p-2">
                                        <p className="text-white font-medium text-[10px] md:text-xs line-clamp-1">
                                            {isHindi ? image.titleHi || image.title : image.title}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                </div>
            </Container>
        </section>
    );
}
